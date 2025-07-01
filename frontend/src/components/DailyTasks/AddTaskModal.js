import React, { useState } from 'react'
import './AddTaskModal.css'
// --- THIS IS THE FIX ---
// Import from the new constants file.
import { TASK_CATEGORIES } from './taskConstants'

// The rest of this file is correct and does not need to be changed.
export default function AddTaskModal({ onAddTask, onClose }) {
  const [taskText, setTaskText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(TASK_CATEGORIES)[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskText.trim()) {
      onAddTask(taskText, selectedCategory)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add a New Task</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="task-text">Task Description</label>
            <input
              type="text"
              id="task-text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="e.g., Finish the project report"
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
                  style={{ backgroundColor: selectedCategory === key ? color : '#f3f4f6' }}
                >
                  <input
                    type="radio"
                    name="category"
                    value={key}
                    checked={selectedCategory === key}
                    onChange={() => setSelectedCategory(key)}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-task-button">
            Add Task
          </button>
        </form>
      </div>
    </div>
  )
}
