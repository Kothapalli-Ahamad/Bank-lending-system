import React, { useState } from 'react';
import { apiService } from '../services/api';

const PaymentRecording = () => {
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_type: 'EMI'
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
      const paymentData = {
        amount: parseFloat(formData.amount),
        payment_type: formData.payment_type
      };

      const response = await apiService.recordPayment(formData.loan_id, paymentData);
      setResult(response);
      
      // Reset form
      setFormData({
        loan_id: '',
        amount: '',
        payment_type: 'EMI'
      });
    } catch (err) {
      setError(err.error || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Record Payment</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loan_id">Loan ID:</label>
          <input
            type="text"
            id="loan_id"
            name="loan_id"
            value={formData.loan_id}
            onChange={handleInputChange}
            placeholder="Enter loan ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Payment Amount ($):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            placeholder="Enter payment amount"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="payment_type">Payment Type:</label>
          <select
            id="payment_type"
            name="payment_type"
            value={formData.payment_type}
            onChange={handleInputChange}
            required
          >
            <option value="EMI">EMI Payment</option>
            <option value="LUMP_SUM">Lump Sum Payment</option>
          </select>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Recording Payment...' : 'Record Payment'}
        </button>
      </form>

      {error && (
        <div className="error-container">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="result-container">
          <h3>Payment Recorded Successfully!</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Payment ID:</span>
              <span className="info-value">{result.payment_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Loan ID:</span>
              <span className="info-value">{result.loan_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Remaining Balance:</span>
              <span className="info-value">${result.remaining_balance.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">EMIs Left:</span>
              <span className="info-value">{result.emis_left}</span>
            </div>
          </div>
          <p><strong>Message:</strong> {result.message}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentRecording;