// Dashboard Page
import React, { useState, useEffect, useContext } from 'react';
import { FiActivity, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuthContext from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDashboardAnalytics, getWasteTrends, getComplaintAnalytics } from '../services/analyticsService';
import './Dashboard.css';
import { toast } from 'react-toastify';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [complaints, setComplaints] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, trendsRes, complaintRes] = await Promise.all([
          getDashboardAnalytics(),
          getWasteTrends(),
          getComplaintAnalytics()
        ]);

        setAnalytics(analyticsRes.data);
        setTrends(trendsRes.data);
        setComplaints(complaintRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          title="Total Bins"
          value={analytics?.total_bins || 0}
          icon={<FiActivity />}
          color="primary"
        />
        <StatsCard
          title="Full Bins"
          value={analytics?.full_bins || 0}
          icon={<FiAlertCircle />}
          color="danger"
        />
        <StatsCard
          title="Today's Collections"
          value={analytics?.collection_stats?.today_collections || 0}
          icon={<FiCheckCircle />}
          color="success"
        />
        <StatsCard
          title="Total Waste (kg)"
          value={(analytics?.collection_stats?.today_waste_kg || 0).toFixed(2)}
          icon={<FiTrendingUp />}
          color="warning"
        />
      </div>

      {/* Charts */}
      {user?.role === 'admin' && (
        <div className="charts-container">
          <div className="chart-card">
            <h3>Waste Collection Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends?.trends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_waste" fill="#667eea" />
                <Bar dataKey="collections" fill="#764ba2" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Complaint Analytics</h3>
            <div className="complaint-stats">
              <div className="stat-item">
                <span>This Month:</span>
                <strong>{complaints?.this_month || 0}</strong>
              </div>
              <div className="stat-item">
                <span>Avg Resolution Time:</span>
                <strong>{(complaints?.avg_resolution_hours || 0).toFixed(1)}h</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'citizen' && (
        <div className="citizen-dashboard">
          <div className="dashboard-card">
            <h3>Report an Issue</h3>
            <p>Help us keep your area clean. Report garbage issues with photos.</p>
            <a href="/complaints" className="btn btn-primary">
              Report Now
            </a>
          </div>

          <div className="dashboard-card">
            <h3>Find Nearby Bins</h3>
            <p>Locate the nearest waste bins in your area.</p>
            <a href="/bins" className="btn btn-primary">
              Find Bins
            </a>
          </div>
        </div>
      )}

      {user?.role === 'worker' && (
        <div className="worker-dashboard">
          <div className="dashboard-card">
            <h3>My Routes</h3>
            <p>Check your assigned collection routes for today.</p>
            <a href="/routes" className="btn btn-primary">
              View Routes
            </a>
          </div>

          <div className="dashboard-card">
            <h3>Bin Status</h3>
            <p>Monitor and update the status of bins in your area.</p>
            <a href="/bins" className="btn btn-primary">
              Check Bins
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
