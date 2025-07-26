import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoanCreation from './components/LoanCreation';
import PaymentRecording from './components/PaymentRecording';
import LoanLedger from './components/LoanLedger';
import CustomerOverview from './components/CustomerOverview';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Bank Lending System</h1>
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Create Loan</Link>
            <Link to="/payment" className="nav-link">Record Payment</Link>
            <Link to="/ledger" className="nav-link">View Ledger</Link>
            <Link to="/overview" className="nav-link">Customer Overview</Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LoanCreation />} />
            <Route path="/payment" element={<PaymentRecording />} />
            <Route path="/ledger" element={<LoanLedger />} />
            <Route path="/overview" element={<CustomerOverview />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>&copy; 2024 Bank Lending System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;