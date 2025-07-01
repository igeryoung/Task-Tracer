import React, { useState, useEffect } from 'react'
import { LOG_STATUSES } from './logConstants'
import '../DailyTasks/AddTaskModal.css' // Reusing modal styles

export default function EditLogModal({ logToEdit, onSave, onClose }) {
  // State for form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeCost, setTimeCost] = useState({ hours: '0', minutes: '0' })
  const [status, setStatus] = useState(Object.keys(LOG_STATUSES)[0])
  const [warning, setWarning] = useState('')

  // Populate form when editing, or reset when adding new
  useEffect(() => {
    if (logToEdit) {
      setTitle(logToEdit.title)
      setDescription(logToEdit.description || '')
      setStatus(logToEdit.status)

      if (logToEdit.timeCost) {
        const hoursMatch = logToEdit.timeCost.match(/(\d+)\s*hour/)
        const minsMatch = logToEdit.timeCost.match(/(\d+)\s*min/)
        setTimeCost({
          hours: hoursMatch ? hoursMatch[1] : '',
          minutes: minsMatch ? minsMatch[1] : '',
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

    // Format timeCost back into string
    let formatted = ''
    const { hours, minutes } = timeCost
    if (hours && parseInt(hours) > 0) {
      formatted += `${parseInt(hours)} hour${parseInt(hours) > 1 ? 's' : ''}`
    }
    if (minutes && parseInt(minutes) > 0) {
      formatted += `${formatted ? ' ' : ''}${parseInt(minutes)} min${parseInt(minutes) > 1 ? 's' : ''}`
    }

    onSave({
      id: logToEdit ? logToEdit.id : null,
      title,
      description,
      timeCost: formatted,
      status,
    })
    onClose()
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
            ></textarea>
          </div>

          <div className="form-group">
            <label>Time Cost</label>
            <div className="time-cost-inputs">
              <input
                type="number"
                name="hours"
                className="time-input"
                value={timeCost.hours}
                placeholder="0"
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
                placeholder="0"
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

          <button type="submit" className="submit-task-button">
            {logToEdit ? 'Save Changes' : 'Add Log'}
          </button>
        </form>
      </div>
    </div>
  )
}
