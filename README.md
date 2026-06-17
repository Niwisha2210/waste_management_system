# Waste Management System - Complete Project

A full-stack AI & IoT-Based Smart Waste Management System built with React.js, Node.js/Express, and MySQL.

## 🌟 Features

### Smart Bin Monitoring
- Real-time bin status tracking
- Fill level monitoring (0-100%)
- IoT sensor integration
- Automatic status updates

### AI-Based Predictions
- Machine learning predictions for bin capacity
- Predictive collection scheduling
- Alert system for overflowing bins
- Historical trend analysis

### User Roles & Modules

#### Admin Dashboard
- Complete system management
- User and worker management
- Bin configuration and monitoring
- Route assignment and optimization
- Complaint resolution and tracking
- Analytics and reporting

#### Collection Worker Portal
- View assigned routes
- Update bin status
- Log collection data
- Track daily performance
- Access route maps

#### Citizen Portal
- Report waste management issues
- Upload photos with complaints
- Track complaint status
- Find nearby waste bins
- Receive notifications

### Advanced Features
- Real-time analytics dashboard
- Performance metrics and KPIs
- Waste collection trends
- Worker efficiency tracking
- Complaint resolution metrics
- Monthly and custom reports

## 📦 Tech Stack

**Frontend:**
- React.js 18
- React Router v6
- Axios for API calls
- Recharts for data visualization
- React Icons
- React Leaflet for mapping
- React Toastify for notifications
- CSS3 for styling

**Backend:**
- Node.js
- Express.js
- MySQL 2 with Promise support
- JWT for authentication
- Bcryptjs for password hashing
- Multer for file uploads
- Express Validator for input validation
- Helmet for security

**Database:**
- MySQL 8.0+
- 8 main tables with relationships
- Optimized indexes for performance

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Create database:**
```bash
mysql -u root -p < ../database_schema.sql
```

5. **Start the server:**
```bash
npm run dev
```

Server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
REACT_APP_API_URL=http://localhost:5000/api/v1
```

4. **Start the application:**
```bash
npm start
```

Application will run on http://localhost:3000

## 📁 Project Structure

```
waste-management-system/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Business logic
│   ├── middlewares/      # Express middlewares
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── uploads/         # File uploads
│   ├── server.js        # Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── context/    # React context
│   │   ├── utils/      # Utility functions
│   │   ├── styles/     # Global styles
│   │   ├── App.js      # Main app component
│   │   └── index.js    # Entry point
│   ├── public/
│   └── package.json
│
├── database_schema.sql   # Database schema
└── README.md            # This file
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update profile
- `POST /api/v1/auth/change-password` - Change password

### Smart Bins Endpoints
- `GET /api/v1/bins` - Get all bins with pagination
- `GET /api/v1/bins/:binId` - Get specific bin
- `POST /api/v1/bins` - Create new bin (Admin only)
- `PUT /api/v1/bins/:binId/fill-level` - Update bin fill level
- `GET /api/v1/bins/status/:status` - Get bins by status
- `GET /api/v1/bins/nearby/list` - Get nearby bins

### Complaints Endpoints
- `POST /api/v1/complaints` - Create complaint
- `GET /api/v1/complaints/my-complaints` - Get user complaints
- `GET /api/v1/complaints` - Get all complaints (Admin)
- `PUT /api/v1/complaints/:complaintId/status` - Update status
- `PUT /api/v1/complaints/:complaintId/assign` - Assign to worker

### Routes Endpoints
- `POST /api/v1/routes` - Create route (Admin)
- `GET /api/v1/routes` - Get all routes (Admin)
- `GET /api/v1/routes/worker/:workerId` - Get worker routes
- `PUT /api/v1/routes/:routeId/status` - Update route status
- `PUT /api/v1/routes/:routeId/bins/:binId/collect` - Mark bin collected

### Analytics Endpoints
- `GET /api/v1/analytics/dashboard` - Dashboard analytics
- `GET /api/v1/analytics/waste-trends` - Waste trends (7 days)
- `GET /api/v1/analytics/complaints` - Complaint analytics
- `GET /api/v1/analytics/worker-metrics` - Worker performance
- `GET /api/v1/analytics/report/monthly` - Monthly report

### Predictions Endpoints
- `POST /api/v1/predictions/:binId` - Generate prediction
- `GET /api/v1/predictions/critical` - Get critical predictions
- `POST /api/v1/predictions` - Generate all predictions

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:
1. User logs in with email and password
2. Server returns JWT token
3. Token is stored in localStorage
4. Token is sent with every API request in Authorization header

## 📊 Database Schema

### Key Tables
- **users**: User account information
- **workers**: Worker-specific data
- **smart_bins**: Bin details and status
- **complaints**: Complaint reports
- **routes**: Collection routes
- **route_bins**: Route-Bin relationship
- **collection_logs**: Collection history
- **predictions**: AI predictions
- **analytics**: Aggregated analytics
- **notifications**: User notifications

## 🧪 Testing with Demo Accounts

```
Admin Account:
Email: admin@test.com
Password: password123

Worker Account:
Email: worker@test.com
Password: password123

Citizen Account:
Email: citizen@test.com
Password: password123
```

## 🔧 Configuration

### Environment Variables (.env)

```
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=waste_management_system

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📈 Key Metrics Tracked

- Total bins in system
- Bins status distribution
- Waste collected (kg/day)
- Collection efficiency
- Average resolution time (complaints)
- Worker performance metrics
- Complaint trends
- System utilization

## 🎯 AI Prediction Algorithm

The system uses a simple linear regression model based on:
1. Historical fill level data
2. Collection patterns
3. Seasonal trends
4. Confidence scoring

Can be enhanced with:
- Neural networks
- Time series analysis
- Deep learning models

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting
- SQL injection prevention
- XSS protection with Helmet

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Optimized for tablets and desktops

## 🐛 Common Issues & Solutions

### Database Connection Error
- Ensure MySQL server is running
- Check credentials in .env file
- Verify database exists

### Port Already in Use
- Change PORT in .env file
- Or kill process using the port

### CORS Errors
- Check CORS_ORIGIN in backend .env
- Ensure frontend URL matches

### Login Issues
- Clear browser localStorage
- Check database has user records
- Verify JWT secret matches

## 🚀 Deployment

### Backend Deployment (Heroku/AWS)
1. Update environment variables
2. Push to git repository
3. Configure MySQL database
4. Deploy using platform-specific tools

### Frontend Deployment (Vercel/Netlify)
1. Run `npm run build`
2. Deploy build folder
3. Configure API URL for production

## 📝 Future Enhancements

- [ ] Real-time bin tracking with GPS
- [ ] Mobile app (React Native)
- [ ] SMS/Email notifications
- [ ] Advanced ML models
- [ ] Blockchain for waste tracking
- [ ] IoT sensor integration
- [ ] Real-time chat support
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Dark mode theme

## 👥 Support & Contributing

For issues, questions, or contributions, please refer to the main project repository.

## 📄 License

This project is open source and available under the MIT License.

---

**Built for Smart City Management | Waste Management System v1.0.0**
