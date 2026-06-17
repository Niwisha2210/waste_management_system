// Bin Monitoring Page
import React, { useState, useEffect, useContext } from 'react';
import { FiMapPin, FiWifi } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllBins, getNearbyBins } from '../services/binService';
import './BinMonitoring.css';
import { toast } from 'react-toastify';

function BinMonitoring() {
  const { user } = useContext(AuthContext);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchBins = async () => {
      try {
        setLoading(true);
        const response = await getAllBins(page);
        setBins(response.data.bins);
      } catch (error) {
        toast.error('Failed to load bins');
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, [page]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'empty':
        return 'green';
      case 'half_full':
        return 'orange';
      case 'full':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getFillPercentage = (level) => {
    return Math.round(level);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const filteredBins = filterStatus === 'all' 
    ? bins 
    : bins.filter(bin => bin.status === filterStatus);

  return (
    <div className="bin-monitoring">
      <div className="page-header">
        <h1>Smart Bin Monitoring</h1>
        <p>Real-time status of all waste management bins</p>
      </div>

      <div className="filters">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Bins</option>
          <option value="empty">Empty</option>
          <option value="half_full">Half Full</option>
          <option value="full">Full</option>
          <option value="needs_maintenance">Needs Maintenance</option>
        </select>
      </div>

      <div className="bins-grid">
        {filteredBins.length === 0 ? (
          <p className="no-data">No bins found</p>
        ) : (
          filteredBins.map(bin => (
            <div key={bin.id} className={`bin-card status-${bin.status}`}>
              <div className="bin-header">
                <h3>{bin.bin_id}</h3>
                <span className={`status-badge ${bin.status}`}>
                  {bin.status.replace('_', ' ')}
                </span>
              </div>

              <div className="bin-content">
                <div className="bin-location">
                  <FiMapPin size={16} />
                  <span>{bin.location_name}</span>
                </div>

                <div className="fill-level">
                  <label>Fill Level</label>
                  <div className="progress-bar">
                    <div className="progress" style={{ 
                      width: `${bin.fill_level}%`,
                      backgroundColor: getStatusColor(bin.status)
                    }}></div>
                  </div>
                  <span className="percentage">{getFillPercentage(bin.fill_level)}%</span>
                </div>

                <div className="bin-details">
                  <div className="detail-item">
                    <span>Capacity</span>
                    <strong>{bin.capacity_liters}L</strong>
                  </div>
                  <div className="detail-item">
                    <span>Type</span>
                    <strong>{bin.bin_type}</strong>
                  </div>
                </div>

                {bin.last_collection_time && (
                  <div className="last-collection">
                    <small>Last collected: {new Date(bin.last_collection_time).toLocaleDateString()}</small>
                  </div>
                )}
              </div>

              <div className="bin-status-indicator">
                <FiWifi size={14} color="green" />
                <span>Connected</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default BinMonitoring;
