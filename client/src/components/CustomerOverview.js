import React, { useState } from 'react';
import { apiService } from '../services/api';

const CustomerOverview = () => {
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOverviewData(null);

    try {
      const response = await apiService.getCustomerOverview(customerId);
      setOverviewData(response);
    } catch (err) {
      setError(err.error || 'Failed to fetch customer overview');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (loans) => {
    return loans.reduce((totals, loan) => ({
      totalPrincipal: totals.totalPrincipal + loan.principal,
      totalAmount: totals.totalAmount + loan.total_amount,
      totalInterest: totals.totalInterest + loan.total_interest,
      totalPaid: totals.totalPaid + loan.amount_paid,
      totalBalance: totals.totalBalance + (loan.total_amount - loan.amount_paid)
    }), {
      totalPrincipal: 0,
      totalAmount: 0,
      totalInterest: 0,
      totalPaid: 0,
      totalBalance: 0
    });
  };

  return (
    <div className="form-container">
      <h2>Customer Overview</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customer_id">Customer ID:</label>
          <select
            id="customer_id"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select Customer</option>
            <option value="CUST001">CUST001 - John Doe</option>
            <option value="CUST002">CUST002 - Jane Smith</option>
            <option value="CUST003">CUST003 - Bob Johnson</option>
          </select>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Fetching Overview...' : 'Get Overview'}
        </button>
      </form>

      {error && (
        <div className="error-container">
          <strong>Error:</strong> {error}
        </div>
      )}

      {overviewData && (
        <div className="card">
          <h3>Customer: {overviewData.customer_id}</h3>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Total Loans:</span>
              <span className="info-value">{overviewData.total_loans}</span>
            </div>
          </div>

          {overviewData.loans.length > 0 && (
            <>
              <h4>Summary</h4>
              {(() => {
                const totals = calculateTotals(overviewData.loans);
                return (
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Total Principal:</span>
                      <span className="info-value">${totals.totalPrincipal.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Amount:</span>
                      <span className="info-value">${totals.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Interest:</span>
                      <span className="info-value">${totals.totalInterest.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Paid:</span>
                      <span className="info-value">${totals.totalPaid.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Balance:</span>
                      <span className="info-value">${totals.totalBalance.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}

              <h4>Loan Details</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Principal</th>
                    <th>Total Amount</th>
                    <th>Total Interest</th>
                    <th>EMI Amount</th>
                    <th>Amount Paid</th>
                    <th>EMIs Left</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewData.loans.map((loan) => (
                    <tr key={loan.loan_id}>
                      <td>{loan.loan_id}</td>
                      <td>${loan.principal.toFixed(2)}</td>
                      <td>${loan.total_amount.toFixed(2)}</td>
                      <td>${loan.total_interest.toFixed(2)}</td>
                      <td>${loan.emi_amount.toFixed(2)}</td>
                      <td>${loan.amount_paid.toFixed(2)}</td>
                      <td>{loan.emis_left}</td>
                      <td>
                        <span className={`status ${loan.emis_left === 0 ? 'paid-off' : 'active'}`}>
                          {loan.emis_left === 0 ? 'PAID OFF' : 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerOverview;