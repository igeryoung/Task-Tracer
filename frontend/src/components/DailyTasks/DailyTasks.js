import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import SortableTaskCard from './SortableTaskCard'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'
import './DailyTasks.css'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ComponentHeader from '../shared/ComponentHeader'

const initialTasks = [
  { id: 1, text: 'Review the Q2 financial report', completed: false, category: 'work' },
  {
    id: 2,
    text: 'Prepare presentation for the Monday meeting',
    completed: false,
    category: 'work',
  },
  { id: 3, text: 'Send follow-up email to the design team', completed: false, category: 'urgent' },
  { id: 4, text: 'Book dentist appointment', completed: false, category: 'personal' },
  {
    id: 5,
    text: 'Complete the React course section on hooks',
    completed: false,
    category: 'study',
  },
]

export default function DailyTasks({ onCompletionStateChange }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTask, setActiveTask] = useState(null)

  const visibleTasks = tasks.filter((task) => !task.completed)
  const allTasksDone = visibleTasks.length === 0

  useEffect(() => {
    if (onCompletionStateChange) onCompletionStateChange(allTasksDone)
  }, [allTasksDone, onCompletionStateChange])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragStart(event) {
    setActiveTask(tasks.find((t) => t.id === event.active.id))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTasks((current) => {
        const oldIndex = current.findIndex((t) => t.id === active.id)
        const newIndex = current.findIndex((t) => t.id === over.id)
        return arrayMove(current, oldIndex, newIndex)
      })
    }
    setActiveTask(null)
  }

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t)))
  }

  const handleAddTask = (taskText, category) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      category,
    }
    setTasks([newTask, ...tasks])
  }

  return (
    <div className="daily-tasks-container">
      <ComponentHeader
        title="Daily Tasks"
        buttonIcon={faPlus}
        buttonText="Add Task"
        onButtonClick={() => setIsModalOpen(true)}
      />

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
              items={visibleTasks.map((t) => t.id)}
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

            <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
          </DndContext>
        )}
      </div>

      {isModalOpen && (
        <AddTaskModal onAddTask={handleAddTask} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
