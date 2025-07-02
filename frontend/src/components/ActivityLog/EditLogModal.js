// src/components/ActivityLog/EditLogModal.js
import React, { useState, useEffect } from 'react'
import { LOG_STATUSES } from './logConstants'
import './EditLogModal.css' // <-- UPDATED: Using its own CSS file now
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default function EditLogModal({ logToEdit, onSave, onClose, onDelete }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeCost, setTimeCost] = useState({ hours: '', minutes: '' })
  const [status, setStatus] = useState(Object.keys(LOG_STATUSES)[0])
  const [warning, setWarning] = useState('')

  useEffect(() => {
    if (logToEdit) {
      setTitle(logToEdit.title)
      setDescription(logToEdit.description || '')
      setStatus(logToEdit.status)

      if (logToEdit.time_cost_minutes != null) {
        const total = logToEdit.time_cost_minutes
        setTimeCost({
          hours: Math.floor(total / 60),
          minutes: total % 60,
        })
      } else {
        setTimeCost({ hours: '', minutes: '' })
      }
    } else {
      setTitle('')
      setDescription('')
      setTimeCost({ hours: '', minutes: '' })
      setStatus(Object.keys(LOG_STATUSES)[0])
    }
    setWarning('')
  }, [logToEdit])

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    if (warning) setWarning('')
  }

  const handleTimeCostChange = (e) => {
    const { name, value } = e.target
    const intValue = Math.max(0, parseInt(value, 10) || 0)
    setTimeCost((prev) => ({ ...prev, [name]: intValue }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setWarning('The "Title" field cannot be empty.')
      return
    }

    const totalMinutes =
      parseInt(timeCost.hours || 0, 10) * 60 + parseInt(timeCost.minutes || 0, 10)

    onSave({
      id: logToEdit ? logToEdit.id : null,
      title,
      description,
      time_cost_minutes: totalMinutes > 0 ? totalMinutes : null,
      status,
    })
    onClose()
  }

  const handleDeleteClick = () => {
    if (logToEdit && onDelete) {
      onDelete(logToEdit.id)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{logToEdit ? 'Edit Log Entry' : 'Add Log Entry'}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="log-title">Title</label>
            <input
              type="text"
              id="log-title"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g., Deployed version 1.2 to production"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="log-desc">Description</label>
            <textarea
              id="log-desc"
              className="fixed-height-textarea"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any extra details here..."
            />
          </div>

          <div className="form-group">
            <label>Time Cost</label>
            <div className="time-cost-inputs">
              <input
                type="number"
                name="hours"
                className="time-input"
                value={timeCost.hours}
                onChange={handleTimeCostChange}
                min="0"
                max="23"
              />
              <span className="time-label">hour(s)</span>
              <input
                type="number"
                name="minutes"
                className="time-input"
                value={timeCost.minutes}
                onChange={handleTimeCostChange}
                min="0"
                max="59"
              />
              <span className="time-label">min(s)</span>
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <div className="category-selector">
              {Object.entries(LOG_STATUSES).map(([key, { name, color }]) => (
                <label
                  key={key}
                  className="category-option"
                  style={{ backgroundColor: status === key ? color : '#f3f4f6' }}
                >
                  <input
                    type="radio"
                    name="status"
                    value={key}
                    checked={status === key}
                    onChange={() => setStatus(key)}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>

          {warning && <div className="warning-message">{warning}</div>}

          <div className="modal-footer">
            <button type="submit" className="submit-task-button">
              {logToEdit ? 'Save Changes' : 'Add Log'}
            </button>
            {logToEdit && (
              <button type="button" className="delete-button-modal" onClick={handleDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
