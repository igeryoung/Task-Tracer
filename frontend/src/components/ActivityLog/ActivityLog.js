import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ComponentHeader from '../shared/ComponentHeader'
import LogItem from './LogItem'
import EditLogModal from './EditLogModal'
import '../DailyTasks/DailyTasks.css'

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLog, setEditingLog] = useState(null)

  const handleAddClick = () => {
    setEditingLog(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (log) => {
    setEditingLog(log)
    setIsModalOpen(true)
  }

  // The save handler is updated to work with the new data fields
  const handleSaveLog = (logData) => {
    if (logData.id) {
      // Editing an existing log
      setLogs(
        logs.map((log) =>
          log.id === logData.id
            ? { ...log, ...logData } // Replace existing log with new data
            : log,
        ),
      )
    } else {
      // Adding a new log
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        title: logData.title,
        description: logData.description,
        timeCost: logData.timeCost,
        status: logData.status,
      }
      // Add new logs to the top (reverse timestamp order)
      setLogs([newLog, ...logs])
    }
  }

  return (
    <div className="daily-tasks-container">
      <ComponentHeader
        title="Today's Activity"
        buttonIcon={faPlus}
        buttonText="Add Log"
        onButtonClick={handleAddClick}
      />

      <div className="task-list">
        {logs.length > 0 ? (
          logs.map((log) => <LogItem key={log.id} log={log} onEditClick={handleEditClick} />)
        ) : (
          <div className="no-tasks-message">
            <h2>No activities logged yet.</h2>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Click "Add Log" to record what you've done.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <EditLogModal
          logToEdit={editingLog}
          onSave={handleSaveLog}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
