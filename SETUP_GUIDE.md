# Smart Waste Management System - Setup & Deployment Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Quick Setup](#quick-setup)
3. [Manual Setup](#manual-setup)
4. [Database Setup](#database-setup)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [API Testing](#api-testing)
8. [Troubleshooting](#troubleshooting)
9. [Deployment](#deployment)

---

## System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 10GB
- **OS**: Windows, macOS, or Linux

### Software Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **MySQL**: v8.0 or higher
- **Git**: v2.0 or higher (optional)

### Installation Links
- Node.js: https://nodejs.org/
- MySQL: https://www.mysql.com/
- Git: https://git-scm.com/

---

## Quick Setup

### For Windows Users
1. Double-click `setup.bat` in the project root
2. Wait for installation to complete
3. Update `backend/.env` with your database credentials
4. Run database setup script in MySQL

### For macOS/Linux Users
```bash
# Make script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

---

## Manual Setup

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy and configure environment file
cp .env.example .env

# Edit .env file with your credentials
# Edit with your preferred editor (nano, vim, or IDE)
nano .env
```

**Environment Variables to Configure:**
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=waste_management_system
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api/v1" > .env
```

---

## Database Setup

### Option 1: Using SQL Script

```bash
# From project root directory
mysql -u root -p < database_schema.sql
```

### Option 2: Manual Setup

```bash
# Connect to MySQL
mysql -u root -p

# In MySQL prompt
CREATE DATABASE waste_management_system;
USE waste_management_system;

# Copy and paste entire content of database_schema.sql
# Then exit
EXIT;
```

### Option 3: Using MySQL Workbench
1. Open MySQL Workbench
2. Go to File → Open SQL Script
3. Select `database_schema.sql`
4. Execute the script

---

## Configuration

### Backend Configuration (backend/.env)

```ini
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=waste_management_system

# JWT
JWT_SECRET=change_this_to_random_string_in_production
JWT_EXPIRE=24h

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS
CORS_ORIGIN=http://localhost:3000

# Optional: Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Optional: Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Frontend Configuration

Create `.env` file in `frontend/` directory:
```
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENVIRONMENT=development
```

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will start on: http://localhost:3000

### Production Mode

**Build Backend:**
```bash
cd backend
npm start
```

**Build Frontend:**
```bash
cd frontend
npm run build
npm install -g serve
serve -s build -l 3000
```

---

## API Testing

### Using cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

#### Get All Bins
```bash
curl -X GET http://localhost:5000/api/v1/bins \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Create Complaint
```bash
curl -X POST http://localhost:5000/api/v1/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Overflowing bin",
    "description": "Bin at main street is full",
    "category": "garbage_overflow",
    "location_latitude": 40.7128,
    "location_longitude": -74.0060
  }'
```

### Using Postman

1. Import API collection (if provided)
2. Set base URL: `http://localhost:5000/api/v1`
3. Add Authorization header with Bearer token
4. Test endpoints

---

## Troubleshooting

### Common Issues

#### 1. **Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:**
- Ensure MySQL server is running
- Check database credentials in `.env`
- Verify database name matches

#### 2. **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=5001
```

#### 3. **CORS Errors**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches exactly
- Clear browser cache

#### 4. **JWT Token Errors**
```
Error: Invalid token
```
**Solution:**
- Clear localStorage in browser
- Login again
- Check token expiration in `.env`

#### 5. **Module Not Found**
```
Cannot find module 'express'
```
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

#### 6. **MySQL Permission Denied**
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:**
- Check MySQL password in `.env`
- Ensure MySQL user has required privileges
- Reset MySQL root password if forgotten

---

## Deployment

### Deploying to Heroku

#### Backend Deployment
```bash
# Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# Login
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set DB_HOST=your_db_host
heroku config:set DB_USER=your_db_user
heroku config:set DB_PASSWORD=your_db_password
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Deploying to AWS EC2

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install nodejs

# Install MySQL client
sudo yum install mysql

# Clone repository
git clone your-repo-url
cd your-repo

# Setup environment
cd backend
cp .env.example .env
# Edit .env with production values

# Install and start
npm install
npm start
```

### Deploying Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
REACT_APP_API_URL=https://your-backend-url/api/v1
```

### Deploying Frontend to Netlify

```bash
# Build
cd frontend
npm run build

# Using Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=build

# Or drag and drop build folder to Netlify
```

---

## Performance Optimization

### Backend Optimization
- Enable database connection pooling
- Add caching layer (Redis)
- Implement request compression
- Use load balancing

### Frontend Optimization
- Code splitting
- Image optimization
- Minification
- CDN for static files

---

## Security Checklist

- [ ] Change default passwords
- [ ] Update JWT_SECRET with strong value
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Use environment variables for secrets
- [ ] Regularly update dependencies
- [ ] Enable database backups
- [ ] Use strong database passwords
- [ ] Implement input validation

---

## Monitoring & Maintenance

### Logs
- Backend logs: Check console output or use Winston
- Frontend errors: Check browser console
- Database logs: MySQL error log

### Backups
```bash
# MySQL backup
mysqldump -u root -p waste_management_system > backup.sql

# Restore from backup
mysql -u root -p waste_management_system < backup.sql
```

### Database Maintenance
```bash
# Optimize tables
OPTIMIZE TABLE table_name;

# Analyze tables
ANALYZE TABLE table_name;

# Check table integrity
CHECK TABLE table_name;
```

---

## Support

For issues or questions:
1. Check Troubleshooting section
2. Review logs and error messages
3. Check documentation
4. Consult community forums
5. Contact support team

---

**Last Updated:** 2024
**Version:** 1.0.0
