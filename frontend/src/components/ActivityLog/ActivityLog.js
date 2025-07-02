// src/components/ActivityLog/ActivityLog.js
import React, { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ComponentHeader from '../shared/ComponentHeader'
import LogItem from './LogItem'
import EditLogModal from './EditLogModal'
import '../DailyTasks/DailyTasks.css'
import apiClient from '../../api/axios'

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLog, setEditingLog] = useState(null)

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('/activity-logs')
      setLogs(response.data)
    } catch (err) {
      setError('Failed to load activity log.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleOpenModal = (log = null) => {
    setEditingLog(log)
    setIsModalOpen(true)
  }

  const handleSaveLog = async (logData) => {
    try {
      if (logData.id) {
        // UPDATE case: separate id from payload
        const { id, ...updatePayload } = logData
        const response = await apiClient.patch(`/activity-logs/${id}`, updatePayload)
        setLogs(logs.map((log) => (log.id === id ? response.data : log)))
      } else {
        // CREATE case: strip out id before sending
        const { id, ...createPayload } = logData
        const response = await apiClient.post('/activity-logs', createPayload)
        setLogs([response.data, ...logs])
      }
    } catch (err) {
      console.error('Failed to save log:', err)
    }
  }

  const handleDeleteLog = async (logId) => {
    const originalLogs = [...logs]
    setLogs(logs.filter((log) => log.id !== logId))
    try {
      await apiClient.delete(`/activity-logs/${logId}`)
    } catch (err) {
      console.error('Failed to delete log:', err)
      setLogs(originalLogs)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="no-tasks-message">
          <h2>Loading Log...</h2>
        </div>
      )
    }
    if (error) {
      return (
        <div className="no-tasks-message error-message">
          <h2>{error}</h2>
        </div>
      )
    }
    if (logs.length === 0) {
      return (
        <div className="no-tasks-message">
          <h2>No activities logged yet.</h2>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Click "Add Log" to record what you've done.
          </p>
        </div>
      )
    }
    return logs.map((log) => <LogItem key={log.id} log={log} onEditClick={handleOpenModal} />)
  }

  return (
    <div className="daily-tasks-container">
      <ComponentHeader
        title="Today's Activity"
        buttonIcon={faPlus}
        buttonText="Add Log"
        onButtonClick={() => handleOpenModal()}
      />
      <div className="task-list">{renderContent()}</div>
      {isModalOpen && (
        <EditLogModal
          logToEdit={editingLog}
          onSave={handleSaveLog}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDeleteLog}
        />
      )}
    </div>
  )
}
