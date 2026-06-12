import React from 'react';

const StatCard = ({ icon: Icon, title, value, colorClass = 'blue', label }) => {
  // Map color class to glow variables defined in CSS
  const styleMap = {
    blue: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: 'var(--color-primary)',
      border: '1px solid rgba(59, 130, 246, 0.2)'
    },
    purple: {
      background: 'rgba(139, 92, 246, 0.1)',
      color: 'var(--color-secondary)',
      border: '1px solid rgba(139, 92, 246, 0.2)'
    },
    green: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: 'var(--color-success)',
      border: '1px solid rgba(16, 185, 129, 0.2)'
    },
    orange: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: 'var(--color-warning)',
      border: '1px solid rgba(245, 158, 11, 0.2)'
    }
  };

  const currentStyle = styleMap[colorClass] || styleMap.blue;

  return (
    <div className="glass-card stat-card">
      <div className="stat-card-inner">
        <div>
          <span className="stat-label">{title}</span>
          <h3 className="stat-value">{value}</h3>
          {label && <p style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{label}</p>}
        </div>
        <div 
          className="stat-icon-container" 
          style={currentStyle}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
