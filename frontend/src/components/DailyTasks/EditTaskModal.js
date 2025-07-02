import React, { useState, useEffect } from 'react'
import { TASK_CATEGORIES } from './taskConstants'
import './EditTaskModal.css'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function EditTaskModal({ taskToEdit, onSave, onClose }) {
  const [text, setText] = useState('')
  const [category, setCategory] = useState(Object.keys(TASK_CATEGORIES)[0])
  const [repeatDays, setRepeatDays] = useState(new Array(7).fill(true))

  useEffect(() => {
    if (taskToEdit) {
      setText(taskToEdit.text)
      setCategory(taskToEdit.category)
      if (taskToEdit.repeat_day) {
        setRepeatDays(taskToEdit.repeat_day.split('').map((day) => day === '1'))
      } else {
        setRepeatDays(new Array(7).fill(false))
      }
    } else {
      setText('')
      setCategory(Object.keys(TASK_CATEGORIES)[0])
      setRepeatDays(new Array(7).fill(true))
    }
  }, [taskToEdit])

  const handleWeekdayClick = (index) => {
    const newRepeatDays = [...repeatDays]
    newRepeatDays[index] = !newRepeatDays[index]
    setRepeatDays(newRepeatDays)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      const repeatDayString = repeatDays.map((day) => (day ? '1' : '0')).join('')
      const isRecurring = repeatDays.some((day) => day === true)

      onSave({
        id: taskToEdit ? taskToEdit.id : null,
        text,
        category, // This now correctly reads the updated category state
        task_type: isRecurring ? 'recurring' : 'single',
        repeat_day: isRecurring ? repeatDayString : null,
      })
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Review the Q2 report"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="category-selector">
              {Object.entries(TASK_CATEGORIES).map(([key, { name, color }]) => (
                <label
                  key={key}
                  className="category-option"
                  style={{ backgroundColor: category === key ? color : '#f3f4f6' }}
                >
                  <input
                    type="radio"
                    name="category"
                    value={key}
                    checked={category === key}
                    // --- THIS IS THE FIX ---
                    // This onChange handler correctly calls setCategory,
                    // which updates the component's state with the new selection.
                    onChange={() => setCategory(key)}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Repeat on</label>
            <div className="weekday-selector">
              {weekdays.map((day, index) => (
                <div
                  key={day}
                  className={`weekday-box ${repeatDays[index] ? 'active' : ''}`}
                  onClick={() => handleWeekdayClick(index)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-task-button">
            {taskToEdit ? 'Save Changes' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  )
}
