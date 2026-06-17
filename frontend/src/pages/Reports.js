// Reports Page
import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDashboardAnalytics, getWasteTrends, getComplaintAnalytics, getWorkerMetrics } from '../services/analyticsService';
import './Reports.css';
import { toast } from 'react-toastify';

function Reports() {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [complaints, setComplaints] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [getDashboardAnalytics(), getWasteTrends(), getComplaintAnalytics()];
        
        if (user?.role === 'admin') {
          promises.push(getWorkerMetrics());
        }

        const responses = await Promise.all(promises);
        setAnalytics(responses[0].data);
        setTrends(responses[1].data);
        setComplaints(responses[2].data);
        if (responses[3]) {
          setMetrics(responses[3].data);
        }
      } catch (error) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <LoadingSpinner fullScreen />;

  const COLORS = ['#667eea', '#764ba2', '#48bb78', '#f6ad55', '#f56565'];

  const binStatusData = analytics?.bin_stats || [];
  const complaintStatusData = complaints?.by_status || [];

  return (
    <div className="reports">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Detailed insights and performance metrics</p>
      </div>

      <div className="reports-grid">
        {/* Waste Trends Chart */}
        <div className="report-card full-width">
          <h2>Waste Collection Trends (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends?.trends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_waste" fill="#667eea" name="Total Waste (kg)" />
              <Bar dataKey="collections" fill="#764ba2" name="Collections" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bin Status Distribution */}
        <div className="report-card">
          <h2>Bin Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={binStatusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {binStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint Status Distribution */}
        <div className="report-card">
          <h2>Complaint Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complaintStatusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {complaintStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="report-card full-width">
          <h2>Summary Statistics</h2>
          <div className="stats-summary">
            <div className="stat-box">
              <h4>Total Bins</h4>
              <p className="big-number">{analytics?.total_bins || 0}</p>
            </div>
            <div className="stat-box">
              <h4>Full Bins</h4>
              <p className="big-number">{analytics?.full_bins || 0}</p>
            </div>
            <div className="stat-box">
              <h4>Today's Collections</h4>
              <p className="big-number">{analytics?.collection_stats?.today_collections || 0}</p>
            </div>
            <div className="stat-box">
              <h4>Total Waste Collected</h4>
              <p className="big-number">{(analytics?.collection_stats?.today_waste_kg || 0).toFixed(1)} kg</p>
            </div>
            <div className="stat-box">
              <h4>Avg Resolution Time</h4>
              <p className="big-number">{(complaints?.avg_resolution_hours || 0).toFixed(1)}h</p>
            </div>
            <div className="stat-box">
              <h4>This Month Complaints</h4>
              <p className="big-number">{complaints?.this_month || 0}</p>
            </div>
          </div>
        </div>

        {/* Worker Performance */}
        {user?.role === 'admin' && metrics?.worker_metrics && (
          <div className="report-card full-width">
            <h2>Worker Performance Metrics</h2>
            <div className="workers-table">
              <table>
                <thead>
                  <tr>
                    <th>Worker Name</th>
                    <th>Collections</th>
                    <th>Waste Collected (kg)</th>
                    <th>Avg Time/Collection</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.worker_metrics.map((worker, index) => (
                    <tr key={index}>
                      <td>{worker.worker_name}</td>
                      <td>{worker.completed_collections || 0}</td>
                      <td>{(worker.total_waste_collected || 0).toFixed(2)}</td>
                      <td>{(worker.avg_time_per_collection || 0).toFixed(0)} mins</td>
                      <td>⭐ {(worker.rating || 0).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
