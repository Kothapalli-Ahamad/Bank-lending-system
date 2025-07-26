import React, { useState } from 'react';
import { apiService } from '../services/api';

const LoanLedger = () => {
  const [loanId, setLoanId] = useState('');
  const [loading, setLoading] = useState(false);
  const [ledgerData, setLedgerData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLedgerData(null);

    try {
      const response = await apiService.getLoanLedger(loanId);
      setLedgerData(response);
    } catch (err) {
      setError(err.error || 'Failed to fetch loan ledger');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="form-container">
      <h2>Loan Ledger</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loan_id">Loan ID:</label>
          <input
            type="text"
            id="loan_id"
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
            placeholder="Enter loan ID"
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Fetching Ledger...' : 'Get Ledger'}
        </button>
      </form>

      {error && (
        <div className="error-container">
          <strong>Error:</strong> {error}
        </div>
      )}

      {ledgerData && (
        <div className="card">
          <h3>Loan Details</h3>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Loan ID:</span>
              <span className="info-value">{ledgerData.loan_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Customer ID:</span>
              <span className="info-value">{ledgerData.customer_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Principal Amount:</span>
              <span className="info-value">${ledgerData.principal.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Amount:</span>
              <span className="info-value">${ledgerData.total_amount.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Monthly EMI:</span>
              <span className="info-value">${ledgerData.monthly_emi.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Amount Paid:</span>
              <span className="info-value">${ledgerData.amount_paid.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Balance Amount:</span>
              <span className="info-value">${ledgerData.balance_amount.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">EMIs Left:</span>
              <span className="info-value">{ledgerData.emis_left}</span>
            </div>
          </div>

          <h3>Transaction History</h3>
          {ledgerData.transactions.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {ledgerData.transactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td>{transaction.transaction_id}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>
                      <span className={`payment-type ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions found for this loan.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanLedger;