#!/bin/bash

# Smart Waste Management System - Quick Setup Script
# This script sets up the entire project

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Smart Waste Management System - Setup Script             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠ MySQL is not installed or not in PATH${NC}"
    echo "Please install MySQL from https://www.mysql.com/"
fi

echo ""
echo "Setting up Backend..."
cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo -e "${GREEN}✓ Creating .env file${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please update .env with your database credentials${NC}"
fi

cd ..
echo -e "${GREEN}✓ Backend setup complete${NC}"

echo ""
echo "Setting up Frontend..."
cd frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${GREEN}✓ Creating .env file${NC}"
    echo "REACT_APP_API_URL=http://localhost:5000/api/v1" > .env
fi

cd ..
echo -e "${GREEN}✓ Frontend setup complete${NC}"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Setup Complete!                                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MySQL credentials"
echo "2. Create MySQL database: mysql -u root -p < database_schema.sql"
echo "3. Start backend: cd backend && npm run dev"
echo "4. In another terminal, start frontend: cd frontend && npm start"
echo ""
