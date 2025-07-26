const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
const db = new Database();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utility functions for loan calculations
const calculateLoanDetails = (principal, years, interestRate) => {
  const totalInterest = principal * years * (interestRate / 100);
  const totalAmount = principal + totalInterest;
  const monthlyEMI = totalAmount / (years * 12);
  
  return {
    totalInterest,
    totalAmount,
    monthlyEMI
  };
};

// API Routes

// 1. LEND: Create a new loan
app.post('/api/v1/loans', async (req, res) => {
  try {
    const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

    // Validate input
    if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (loan_amount <= 0 || loan_period_years <= 0 || interest_rate_yearly < 0) {
      return res.status(400).json({ error: 'Invalid loan parameters' });
    }

    // Check if customer exists
    const customer = await db.get('SELECT * FROM customers WHERE customer_id = ?', [customer_id]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Calculate loan details
    const { totalAmount, monthlyEMI } = calculateLoanDetails(
      loan_amount, 
      loan_period_years, 
      interest_rate_yearly
    );

    const loanId = uuidv4();

    // Insert loan into database
    await db.run(`
      INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, 
                        interest_rate, loan_period_years, monthly_emi)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [loanId, customer_id, loan_amount, totalAmount, interest_rate_yearly, loan_period_years, monthlyEMI]);

    res.status(201).json({
      loan_id: loanId,
      customer_id: customer_id,
      total_amount_payable: totalAmount,
      monthly_emi: monthlyEMI
    });

  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. PAYMENT: Record a payment for a loan
app.post('/api/v1/loans/:loan_id/payments', async (req, res) => {
  try {
    const { loan_id } = req.params;
    const { amount, payment_type } = req.body;

    // Validate input
    if (!amount || !payment_type) {
      return res.status(400).json({ error: 'Amount and payment_type are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Payment amount must be positive' });
    }

    if (!['EMI', 'LUMP_SUM'].includes(payment_type)) {
      return res.status(400).json({ error: 'Invalid payment_type. Must be EMI or LUMP_SUM' });
    }

    // Check if loan exists
    const loan = await db.get('SELECT * FROM loans WHERE loan_id = ?', [loan_id]);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Calculate current balance
    const payments = await db.all('SELECT SUM(amount) as total_paid FROM payments WHERE loan_id = ?', [loan_id]);
    const totalPaid = payments[0].total_paid || 0;
    const remainingBalance = loan.total_amount - totalPaid;

    if (amount > remainingBalance) {
      return res.status(400).json({ error: 'Payment amount exceeds remaining balance' });
    }

    const paymentId = uuidv4();

    // Record payment
    await db.run(`
      INSERT INTO payments (payment_id, loan_id, amount, payment_type)
      VALUES (?, ?, ?, ?)
    `, [paymentId, loan_id, amount, payment_type]);

    // Calculate new remaining balance and EMIs left
    const newRemainingBalance = remainingBalance - amount;
    const emisLeft = newRemainingBalance > 0 ? Math.ceil(newRemainingBalance / loan.monthly_emi) : 0;

    // Update loan status if fully paid
    if (newRemainingBalance <= 0) {
      await db.run('UPDATE loans SET status = ? WHERE loan_id = ?', ['PAID_OFF', loan_id]);
    }

    res.status(200).json({
      payment_id: paymentId,
      loan_id: loan_id,
      message: 'Payment recorded successfully.',
      remaining_balance: newRemainingBalance,
      emis_left: emisLeft
    });

  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. LEDGER: View loan details and transaction history
app.get('/api/v1/loans/:loan_id/ledger', async (req, res) => {
  try {
    const { loan_id } = req.params;

    // Get loan details
    const loan = await db.get('SELECT * FROM loans WHERE loan_id = ?', [loan_id]);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Get all payments for this loan
    const payments = await db.all(`
      SELECT payment_id as transaction_id, payment_date as date, amount, payment_type as type
      FROM payments 
      WHERE loan_id = ? 
      ORDER BY payment_date DESC
    `, [loan_id]);

    // Calculate totals
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const balanceAmount = loan.total_amount - totalPaid;
    const emisLeft = balanceAmount > 0 ? Math.ceil(balanceAmount / loan.monthly_emi) : 0;

    res.status(200).json({
      loan_id: loan.loan_id,
      customer_id: loan.customer_id,
      principal: loan.principal_amount,
      total_amount: loan.total_amount,
      monthly_emi: loan.monthly_emi,
      amount_paid: totalPaid,
      balance_amount: balanceAmount,
      emis_left: emisLeft,
      transactions: payments
    });

  } catch (error) {
    console.error('Error fetching ledger:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. ACCOUNT OVERVIEW: View all loans for a customer
app.get('/api/v1/customers/:customer_id/overview', async (req, res) => {
  try {
    const { customer_id } = req.params;

    // Check if customer exists
    const customer = await db.get('SELECT * FROM customers WHERE customer_id = ?', [customer_id]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get all loans for this customer
    const loans = await db.all('SELECT * FROM loans WHERE customer_id = ?', [customer_id]);

    if (loans.length === 0) {
      return res.status(404).json({ error: 'No loans found for this customer' });
    }

    // Calculate details for each loan
    const loanDetails = await Promise.all(loans.map(async (loan) => {
      const payments = await db.all('SELECT SUM(amount) as total_paid FROM payments WHERE loan_id = ?', [loan.loan_id]);
      const totalPaid = payments[0].total_paid || 0;
      const balanceAmount = loan.total_amount - totalPaid;
      const emisLeft = balanceAmount > 0 ? Math.ceil(balanceAmount / loan.monthly_emi) : 0;
      const totalInterest = loan.total_amount - loan.principal_amount;

      return {
        loan_id: loan.loan_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        total_interest: totalInterest,
        emi_amount: loan.monthly_emi,
        amount_paid: totalPaid,
        emis_left: emisLeft
      };
    }));

    res.status(200).json({
      customer_id: customer_id,
      total_loans: loans.length,
      loans: loanDetails
    });

  } catch (error) {
    console.error('Error fetching customer overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Bank Lending API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Bank Lending API server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await db.close();
  process.exit(0);
});