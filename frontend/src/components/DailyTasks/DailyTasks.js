import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import SortableTaskCard from './SortableTaskCard'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'
import './DailyTasks.css'

// Imports from dnd-kit for drag and drop functionality
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const initialTasks = [
  { id: 1, text: 'Review the Q2 financial report', completed: false },
  { id: 2, text: 'Prepare presentation for the Monday meeting', completed: false },
  { id: 3, text: 'Send follow-up email to the design team', completed: false },
  { id: 4, text: 'Draft the initial project proposal', completed: false },
  { id: 5, text: 'Book flight for the business trip', completed: false },
  { id: 6, text: 'Finalize the weekly newsletter', completed: false },
]

export default function DailyTasks({ onCompletionStateChange }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTask, setActiveTask] = useState(null)

  const visibleTasks = tasks.filter((task) => !task.completed)
  const allTasksDone = visibleTasks.length === 0

  useEffect(() => {
    if (onCompletionStateChange) {
      onCompletionStateChange(allTasksDone)
    }
  }, [allTasksDone, onCompletionStateChange])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

  function handleDragStart(event) {
    const { active } = event
    setActiveTask(tasks.find((task) => task.id === active.id))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTasks((currentTasks) => {
        const oldIndex = currentTasks.findIndex((item) => item.id === active.id)
        const newIndex = currentTasks.findIndex((item) => item.id === over.id)
        return arrayMove(currentTasks, oldIndex, newIndex)
      })
    }
    setActiveTask(null)
  }

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
            <h2>All tasks completed! 🎉</h2>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {visibleTasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </SortableContext>

            <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
          </DndContext>
        )}
      </div>

      {isModalOpen && (
        <AddTaskModal onAddTask={handleAddTask} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
