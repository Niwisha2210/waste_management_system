// Route Management Page
import React, { useState, useEffect, useContext } from 'react';
import { FiCheck, FiClock } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getWorkerRoutes, getAllRoutes } from '../services/routeService';
import './RouteManagement.css';
import { toast } from 'react-toastify';

function RouteManagement() {
  const { user } = useContext(AuthContext);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        if (user?.role === 'worker') {
          const response = await getWorkerRoutes(user.id);
          setRoutes(response.data.routes);
        } else if (user?.role === 'admin') {
          const response = await getAllRoutes();
          setRoutes(response.data.routes);
        }
      } catch (error) {
        toast.error('Failed to load routes');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [user]);

  if (loading) return <LoadingSpinner fullScreen />;

  const filteredRoutes = user?.role === 'worker' 
    ? routes.filter(route => route.status === filterStatus)
    : routes;

  return (
    <div className="route-management">
      <div className="page-header">
        <h1>Collection Routes</h1>
        <p>Manage and track waste collection routes</p>
      </div>

      {user?.role === 'worker' && (
        <div className="filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      <div className="routes-container">
        {filteredRoutes.length === 0 ? (
          <p className="no-data">No routes found</p>
        ) : (
          filteredRoutes.map(route => (
            <div key={route.id} className={`route-card status-${route.status}`}>
              <div className="route-header">
                <div>
                  <h3>{route.route_name}</h3>
                  <p className="route-id">Route ID: {route.route_id}</p>
                </div>
                <span className={`status-badge ${route.status}`}>
                  {route.status.replace('_', ' ')}
                </span>
              </div>

              <div className="route-details">
                <div className="detail-item">
                  <span className="label">Assigned Date</span>
                  <strong>{new Date(route.assigned_date).toLocaleDateString()}</strong>
                </div>
                <div className="detail-item">
                  <span className="label">Scheduled Time</span>
                  <strong>{route.scheduled_time || 'Not specified'}</strong>
                </div>
                <div className="detail-item">
                  <span className="label">Duration</span>
                  <strong>{route.estimated_duration_minutes} mins</strong>
                </div>
              </div>

              <div className="bins-progress">
                <div className="progress-header">
                  <span>Bins Progress</span>
                  <span className="progress-count">
                    {route.bins_collected}/{route.total_bins_in_route}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress"
                    style={{ 
                      width: `${(route.bins_collected / route.total_bins_in_route) * 100 || 0}%`
                    }}
                  ></div>
                </div>
              </div>

              {route.bins && route.bins.length > 0 && (
                <div className="bins-list">
                  <h4>Bins in Route</h4>
                  <div className="bins-items">
                    {route.bins.slice(0, 3).map((bin, index) => (
                      <div key={bin.id} className="bin-item">
                        <span className="sequence">#{index + 1}</span>
                        <span className="bin-name">{bin.bin_id}</span>
                        <span className={`bin-status ${bin.collection_status}`}>
                          {bin.collection_status === 'completed' ? (
                            <FiCheck size={14} />
                          ) : (
                            <FiClock size={14} />
                          )}
                        </span>
                      </div>
                    ))}
                    {route.bins.length > 3 && (
                      <p className="more-bins">+{route.bins.length - 3} more bins</p>
                    )}
                  </div>
                </div>
              )}

              <div className="route-footer">
                <a href={`/routes/${route.id}`} className="btn-view">
                  View Details
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RouteManagement;
