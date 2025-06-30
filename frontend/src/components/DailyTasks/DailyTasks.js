import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'
import './DailyTasks.css'

const initialTasks = [
  { id: 1, text: 'Review the Q2 financial report', completed: false },
  { id: 2, text: 'Prepare presentation for the Monday meeting', completed: false },
  { id: 3, text: 'Send follow-up email to the design team', completed: false },
  { id: 4, text: 'Review the Q2 financial report', completed: false },
  { id: 5, text: 'Prepare presentation for the Monday meeting', completed: false },
  { id: 6, text: 'Send follow-up email to the design team', completed: false },
]

// The component now accepts a prop to communicate its state
export default function DailyTasks({ onCompletionStateChange }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const visibleTasks = tasks.filter((task) => !task.completed)
  const allTasksDone = visibleTasks.length === 0 // Create a boolean for convenience

  // --- THIS IS THE NEW LOGIC ---
  // This effect hook will call the parent function whenever the
  // number of visible tasks changes, informing it of the completion state.
  useEffect(() => {
    if (onCompletionStateChange) {
      onCompletionStateChange(visibleTasks.length === 0)
    }
  }, [visibleTasks.length, onCompletionStateChange])
  // --- END OF NEW LOGIC ---

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))
  }

  const handleAddTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    }
    setTasks([newTask, ...tasks])
  }

  return (
    <div className="daily-tasks-container">
      <div className="tasks-header">
        <h2 className="header-title">Daily Tasks</h2>
        <button className="add-task-button" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <span>Add Task</span>
        </button>
      </div>

      <div className={`task-list ${allTasksDone ? 'is-complete' : ''}`}>
        {allTasksDone ? (
          <div className="no-tasks-message">
            {/* The message is simplified and uses an h2 tag for styling */}
            <h2>All tasks completed! 🎉</h2>
          </div>
        ) : (
          visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggleComplete={handleToggleComplete} />
          ))
        )}
      </div>

      {isModalOpen && (
        <AddTaskModal onAddTask={handleAddTask} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
