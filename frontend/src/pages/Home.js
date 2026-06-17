// Home Page
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Smart Waste Management System</h1>
          <p>AI & IoT-Based Solution for Efficient Waste Collection</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Monitoring</h3>
            <p>Track waste bin status in real-time with IoT sensors</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Predictions</h3>
            <p>Predict when bins will be full using machine learning</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Route Optimization</h3>
            <p>Optimize collection routes for efficient waste management</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Responsive</h3>
            <p>Access from any device, anytime, anywhere</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Analytics & Reports</h3>
            <p>Detailed insights and analytics dashboards</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Smart Alerts</h3>
            <p>Get notifications for critical bin issues</p>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="roles">
        <h2>User Roles</h2>
        <div className="roles-grid">
          <div className="role-card">
            <h3>👨‍💼 Admin</h3>
            <ul>
              <li>Manage users and workers</li>
              <li>Manage smart bins</li>
              <li>View real-time status</li>
              <li>Assign routes</li>
              <li>Generate reports</li>
            </ul>
          </div>

          <div className="role-card">
            <h3>👷 Worker</h3>
            <ul>
              <li>View assigned routes</li>
              <li>Update bin status</li>
              <li>Mark tasks complete</li>
              <li>View schedule</li>
              <li>Track performance</li>
            </ul>
          </div>

          <div className="role-card">
            <h3>👤 Citizen</h3>
            <ul>
              <li>Report issues</li>
              <li>Track complaints</li>
              <li>View nearby bins</li>
              <li>Upload images</li>
              <li>Get notifications</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Smart Waste Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
