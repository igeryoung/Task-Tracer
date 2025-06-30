import './TaskCard.css'

export default function TaskCard({ task, onToggleComplete }) {
  return (
    <div className="task-card">
      <div
        className="task-checkbox"
        onClick={() => onToggleComplete(task.id)}
        role="button"
        aria-pressed="false"
        tabIndex="0"
      >
        {/* This div acts as our clickable checkbox */}
      </div>
      <p className="task-text">{task.text}</p>
    </div>
  )
}
