import React from 'react'
import './TaskCard.css'
import { TASK_CATEGORIES } from './taskConstants'

export default function TaskCard({ task, onToggleComplete, isExiting }) {
  if (!task) return null

  const categoryColor = TASK_CATEGORIES[task.category]?.color || '#e5e7eb'
  const cardClassName = `task-card ${isExiting ? 'is-exiting' : ''}`

  return (
    <div className={cardClassName}>
      <div className="color-bar" style={{ backgroundColor: categoryColor }}></div>
      <div className="task-content">
        <div
          className="task-checkbox"
          onClick={onToggleComplete ? () => onToggleComplete(task.id) : undefined}
          role="button"
          tabIndex="0"
        ></div>
        {/* The structure is now just the text paragraph again */}
        <p className="task-text">{task.text}</p>
      </div>
    </div>
  )
}
