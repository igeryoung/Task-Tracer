import React from 'react'
import './TaskCard.css'
import { TASK_CATEGORIES } from './taskConstants'

export default function TaskCard({ task, onToggleComplete }) {
  // This line looks up the color. If the task has no category, it defaults to gray.
  const categoryColor = task && task.category ? TASK_CATEGORIES[task.category]?.color : '#e5e7eb'

  // If for any reason a task object isn't passed, we can render nothing to prevent errors.
  if (!task) {
    return null
  }

  return (
    <div className="task-card">
      <div className="color-bar" style={{ backgroundColor: categoryColor }}></div>
      <div className="task-content">
        <div
          className="task-checkbox"
          // We check if onToggleComplete exists before using it
          onClick={onToggleComplete ? () => onToggleComplete(task.id) : undefined}
          role="button"
          tabIndex="0"
        ></div>
        <p className="task-text">{task.text}</p>
      </div>
    </div>
  )
}
