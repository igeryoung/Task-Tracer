import React from 'react'
import { LOG_STATUSES } from './logConstants'
import './LogItem.css'

export default function LogItem({ log, onEditClick }) {
  const statusColor = LOG_STATUSES[log.status]?.color || '#e5e7eb'

  const formattedTime = new Date(log.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="log-item-card" onClick={() => onEditClick(log)}>
      <div className="color-bar" style={{ backgroundColor: statusColor }}></div>

      <div className="log-item-content">
        <h3 className="log-item-title">{log.title}</h3>

        {/* --- THIS IS THE NEW PART --- */}
        {/* A new wrapper to group the separator and timestamp together */}
        <div className="log-item-right-section">
          <div className="separator-line"></div>
          <span className="log-timestamp">{formattedTime}</span>
        </div>
        {/* --- END OF NEW PART --- */}
      </div>
    </div>
  )
}
