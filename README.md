# Bank Lending System

A comprehensive bank lending system built with React.js frontend and Node.js/Express.js backend, using SQLite database for data persistence.

## Features

- **Loan Creation (LEND)**: Create new loans with simple interest calculation
- **Payment Recording (PAYMENT)**: Record EMI and lump sum payments
- **Loan Ledger (LEDGER)**: View complete loan details and transaction history
- **Customer Overview (ACCOUNT OVERVIEW)**: View all loans for a specific customer

## System Architecture

- **Frontend**: React.js single-page application
- **Backend**: Node.js with Express.js REST API
- **Database**: SQLite for data persistence
- **Interest Calculation**: Simple Interest (I = P × N × R/100)
- **EMI Calculation**: (Principal + Total Interest) / Total Months

## Project Structure

```
bank-lending-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── database.js         # Database setup and utilities
│   ├── index.js           # Express server and API routes
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd bank-lending-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for the root project, server, and client.

3. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and frontend client (port 3000) concurrently.

### Manual Setup (Alternative)

If the automated setup doesn't work, you can set up manually:

1. **Install root dependencies**
   ```bash
   npm install
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start backend server**
   ```bash
   cd server
   npm run dev
   ```

5. **Start frontend client (in a new terminal)**
   ```bash
   cd client
   npm start
   ```

## Usage

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1

### Sample Customers
The system comes with pre-loaded sample customers:
- CUST001 - John Doe
- CUST002 - Jane Smith
- CUST003 - Bob Johnson

### API Endpoints

#### 1. Create Loan
- **POST** `/api/v1/loans`
- **Body**: 
  ```json
  {
    "customer_id": "CUST001",
    "loan_amount": 10000,
    "loan_period_years": 2,
    "interest_rate_yearly": 5
  }
  ```

#### 2. Record Payment
- **POST** `/api/v1/loans/{loan_id}/payments`
- **Body**:
  ```json
  {
    "amount": 500,
    "payment_type": "EMI"
  }
  ```

#### 3. Get Loan Ledger
- **GET** `/api/v1/loans/{loan_id}/ledger`

#### 4. Get Customer Overview
- **GET** `/api/v1/customers/{customer_id}/overview`

#### 5. Health Check
- **GET** `/api/v1/health`

## Database Schema

### Customers Table
- `customer_id` (TEXT, Primary Key)
- `name` (TEXT)
- `created_at` (DATETIME)

### Loans Table
- `loan_id` (TEXT, Primary Key, UUID)
- `customer_id` (TEXT, Foreign Key)
- `principal_amount` (DECIMAL)
- `total_amount` (DECIMAL)
- `interest_rate` (DECIMAL)
- `loan_period_years` (INTEGER)
- `monthly_emi` (DECIMAL)
- `status` (TEXT)
- `created_at` (DATETIME)

### Payments Table
- `payment_id` (TEXT, Primary Key, UUID)
- `loan_id` (TEXT, Foreign Key)
- `amount` (DECIMAL)
- `payment_type` (TEXT: 'EMI' or 'LUMP_SUM')
- `payment_date` (DATETIME)

## Loan Calculations

### Simple Interest Formula
```
Total Interest (I) = Principal (P) × Years (N) × Rate (R) / 100
Total Amount (A) = Principal (P) + Interest (I)
Monthly EMI = Total Amount (A) / (Years × 12)
```

### Example
- Principal: $10,000
- Years: 2
- Interest Rate: 5% per year
- Total Interest: $10,000 × 2 × 5/100 = $1,000
- Total Amount: $10,000 + $1,000 = $11,000
- Monthly EMI: $11,000 / (2 × 12) = $458.33

## Features Overview

### 1. Loan Creation
- Select customer from dropdown
- Enter loan amount, period, and interest rate
- System calculates total amount and monthly EMI
- Generates unique loan ID

### 2. Payment Recording
- Enter loan ID and payment amount
- Choose payment type (EMI or Lump Sum)
- System updates remaining balance and EMIs left
- Automatic loan status update when fully paid

### 3. Loan Ledger
- Enter loan ID to view complete loan details
- Shows principal, total amount, EMI, balance
- Displays complete transaction history
- Real-time calculation of remaining EMIs

### 4. Customer Overview
- Select customer to view all their loans
- Summary of total amounts across all loans
- Detailed table showing each loan's status
- Visual indicators for loan status

## Development

### Available Scripts

**Root Level:**
- `npm run dev` - Start both server and client
- `npm run server` - Start only backend server
- `npm run client` - Start only frontend client
- `npm run install-all` - Install all dependencies

**Server:**
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon (development)

**Client:**
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Technology Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Styling**: CSS3 with responsive design
- **Development**: Nodemon, Concurrently

## Error Handling

The system includes comprehensive error handling:
- Input validation on both frontend and backend
- Database constraint validation
- Network error handling
- User-friendly error messages
- Graceful degradation

## Security Considerations

- Input sanitization and validation
- SQL injection prevention through parameterized queries
- CORS configuration for cross-origin requests
- Error message sanitization

## Future Enhancements

- User authentication and authorization
- Compound interest calculation option
- Payment scheduling and reminders
- Loan approval workflow
- Advanced reporting and analytics
- Export functionality (PDF, Excel)
- Email notifications
- Mobile responsive improvements

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change ports in server/index.js (backend) or client/package.json (frontend)

2. **Database connection issues**
   - Ensure SQLite3 is properly installed
   - Check file permissions in server directory

3. **CORS errors**
   - Verify proxy configuration in client/package.json
   - Check CORS middleware in server/index.js

4. **Module not found errors**
   - Run `npm run install-all` to ensure all dependencies are installed
   - Clear node_modules and reinstall if necessary

## License

This project is licensed under the MIT License.