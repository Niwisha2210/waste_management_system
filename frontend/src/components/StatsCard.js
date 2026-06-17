// Stats Card Component
import React from 'react';
import './StatsCard.css';

function StatsCard({ title, value, icon, color = 'primary', trend = null }) {
  return (
    <div className={`stats-card ${color}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        {trend && <p className="stats-trend">{trend}</p>}
      </div>
    </div>
  );
}

export default StatsCard;
