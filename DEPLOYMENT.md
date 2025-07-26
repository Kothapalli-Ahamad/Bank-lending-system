# Deployment Guide for Bank Lending System

This guide explains how to deploy the Bank Lending System to various platforms.

## Architecture Overview

The Bank Lending System consists of two parts:
- **Frontend (React.js)**: Can be deployed to Vercel, Netlify, or any static hosting
- **Backend (Node.js + SQLite)**: Needs to be deployed to a platform that supports Node.js and databases

## Option 1: Frontend Only on Vercel (Recommended for Demo)

### Step 1: Deploy Frontend to Vercel
1. The `vercel.json` configuration is already set up
2. Push your changes to GitHub
3. Connect your GitHub repository to Vercel
4. Vercel will automatically build and deploy the React frontend

### Step 2: Backend Deployment Options
Since Vercel doesn't support SQLite databases in production, you have these options:

#### A. Deploy Backend to Railway/Render/Heroku
1. Create a new project on Railway.app, Render.com, or Heroku
2. Connect your GitHub repository
3. Set the root directory to `server/`
4. The backend will be deployed with a public URL

#### B. Use a Cloud Database
1. Replace SQLite with PostgreSQL or MongoDB
2. Use services like:
   - **PostgreSQL**: Supabase, Neon, or Railway
   - **MongoDB**: MongoDB Atlas

### Step 3: Update API Configuration
After deploying the backend, update the API URL in `client/src/services/api.js`:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-deployed-backend-url.com/api/v1' 
  : '/api/v1';
```

## Option 2: Full-Stack Deployment

### Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway will detect both frontend and backend
4. It will deploy both parts automatically

### Render
1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set start command: `npm run server`

## Option 3: Docker Deployment

A `Dockerfile` can be created for containerized deployment:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd server && npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "run", "server"]
```

## Environment Variables

For production deployment, set these environment variables:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_connection_string (if using external DB)
```

## Current Vercel Configuration

The current `vercel.json` is configured to deploy only the React frontend:

```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/build",
  "installCommand": "cd client && npm install",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

This will deploy a static version of the frontend that can be used for demonstration purposes.

## Notes

- **SQLite Limitation**: SQLite doesn't work in serverless environments like Vercel Functions
- **Database Persistence**: For production, use PostgreSQL, MySQL, or MongoDB
- **CORS**: Make sure to configure CORS properly for cross-origin requests
- **Environment Variables**: Use environment variables for API URLs and database connections

## Quick Start for Vercel

1. Push the updated code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect the configuration and deploy
5. The frontend will be live, but you'll need to deploy the backend separately for full functionality