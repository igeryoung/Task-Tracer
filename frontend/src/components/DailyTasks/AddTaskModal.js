import React, { useState } from 'react'
import './AddTaskModal.css'

export default function AddTaskModal({ onAddTask, onClose }) {
  const [taskText, setTaskText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskText.trim()) {
      onAddTask(taskText)
      onClose() // Close the modal after adding the task
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
          <div className="form-group">
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
          <button type="submit" className="submit-task-button">
            Add Task
          </button>
        </form>
      </div>
    </div>
  )
}
