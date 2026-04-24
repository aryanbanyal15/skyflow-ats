import React from 'react';

export default function StatusBadge({ status }) {
  let colorClass = '';
  let bgColor = '';

  switch (status) {
    case 'Scheduled':
      colorClass = '#3b82f6';
      bgColor = 'rgba(59, 130, 246, 0.1)';
      break;
    case 'Optimized':
      colorClass = '#f59e0b';
      bgColor = 'rgba(245, 158, 11, 0.1)';
      break;
    case 'Delayed':
      colorClass = '#ef4444';
      bgColor = 'rgba(239, 68, 68, 0.1)';
      break;
    default:
      colorClass = '#94a3b8';
      bgColor = 'rgba(148, 163, 184, 0.1)';
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      color: colorClass,
      background: bgColor,
      border: `1px solid ${bgColor.replace('0.1', '0.2')}`
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: colorClass
      }}></span>
      {status}
    </span>
  );
}
