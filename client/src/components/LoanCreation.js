import React, { useState } from 'react';
import { apiService } from '../services/api';

const LoanCreation = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert string values to numbers
      const loanData = {
        customer_id: formData.customer_id,
        loan_amount: parseFloat(formData.loan_amount),
        loan_period_years: parseInt(formData.loan_period_years),
        interest_rate_yearly: parseFloat(formData.interest_rate_yearly)
      };

      const response = await apiService.createLoan(loanData);
      setResult(response);
      
      // Reset form
      setFormData({
        customer_id: '',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
    } catch (err) {
      setError(err.error || 'Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Loan</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customer_id">Customer ID:</label>
          <select
            id="customer_id"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Customer</option>
            <option value="CUST001">CUST001 - John Doe</option>
            <option value="CUST002">CUST002 - Jane Smith</option>
            <option value="CUST003">CUST003 - Bob Johnson</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="loan_amount">Loan Amount ($):</label>
          <input
            type="number"
            id="loan_amount"
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleInputChange}
            min="1"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="loan_period_years">Loan Period (Years):</label>
          <input
            type="number"
            id="loan_period_years"
            name="loan_period_years"
            value={formData.loan_period_years}
            onChange={handleInputChange}
            min="1"
            max="30"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="interest_rate_yearly">Interest Rate (% per year):</label>
          <input
            type="number"
            id="interest_rate_yearly"
            name="interest_rate_yearly"
            value={formData.interest_rate_yearly}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating Loan...' : 'Create Loan'}
        </button>
      </form>

      {error && (
        <div className="error-container">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="result-container">
          <h3>Loan Created Successfully!</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Loan ID:</span>
              <span className="info-value">{result.loan_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Customer ID:</span>
              <span className="info-value">{result.customer_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Amount Payable:</span>
              <span className="info-value">${result.total_amount_payable.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Monthly EMI:</span>
              <span className="info-value">${result.monthly_emi.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCreation;