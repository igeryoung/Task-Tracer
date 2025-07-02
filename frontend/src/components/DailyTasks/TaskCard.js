import React from 'react'
import './TaskCard.css'
import { TASK_CATEGORIES } from './taskConstants'

// The onEditClick prop is no longer needed here
export default function TaskCard({ task, onToggleComplete, isExiting }) {
  if (!task) return null

  const categoryColor = TASK_CATEGORIES[task.category]?.color || '#e5e7eb'
  const cardClassName = `task-card ${isExiting ? 'is-exiting' : ''}`

  // This handler for the checkbox is still necessary to stop the click
  // from bubbling up to the parent div's new onClick handler.
  const handleCheckboxClick = (e) => {
    e.stopPropagation()
    if (onToggleComplete) {
      onToggleComplete(task.id)
    }
  }

  return (
    // The onClick handler is removed from this div
    <div className={cardClassName}>
      <div className="color-bar" style={{ backgroundColor: categoryColor }}></div>
      <div className="task-content">
        <div
          className="task-checkbox"
          onClick={handleCheckboxClick}
          role="button"
          tabIndex="0"
        ></div>
        <p className="task-text">{task.text}</p>
      </div>
    </div>
  )
}
