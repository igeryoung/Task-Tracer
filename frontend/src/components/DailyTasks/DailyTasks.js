import React, { useState, useEffect, useCallback } from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SortableTaskCard from './SortableTaskCard'
import TaskCard from './TaskCard'
import EditTaskModal from './EditTaskModal'
import ComponentHeader from '../shared/ComponentHeader'
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
import apiClient from '../../api/axios'

const ANIMATION_DURATION = 500

export default function DailyTasks({ onCompletionStateChange }) {
  // tasks from backend
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // track exiting animations
  const [exitingTaskIds, setExitingTaskIds] = useState(new Set())

  // modal state for add/edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // drag state
  const [activeTask, setActiveTask] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get('/tasks')

      const today = new Date()
      const dayIndex = (today.getDay() + 6) % 7

      const tasksForToday = response.data.filter((task) => {
        if (task.task_type === 'single') {
          return !task.is_completed
        }
        // Include recurring tasks if today's bit is '1'.
        if (task.task_type === 'recurring') {
          return task.repeat_day?.[dayIndex] === '1'
        }
        return false
      })

      const fetchedTasks = tasksForToday.map((t) => ({
        ...t,
        completed: t.is_completed,
      }))
      setTasks(fetchedTasks)
    } catch (err) {
      console.error(err)
      setError('Failed to load tasks. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // derived
  const visibleTasks = tasks.filter((t) => !t.completed && !exitingTaskIds.has(t.id))
  const allTasksDone = !isLoading && visibleTasks.length === 0 && exitingTaskIds.size === 0

  useEffect(() => {
    if (onCompletionStateChange) {
      onCompletionStateChange(allTasksDone)
    }
  }, [allTasksDone, onCompletionStateChange])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragStart(event) {
    setActiveTask(tasks.find((t) => t.id === event.active.id))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id)
      const newIndex = tasks.findIndex((t) => t.id === over.id)
      setTasks(arrayMove(tasks, oldIndex, newIndex))
      // optionally PATCH /tasks/reorder here
    }
    setActiveTask(null)
  }

  // complete with animation + API
  const handleToggleComplete = (taskId) => {
    setExitingTaskIds((prev) => new Set(prev).add(taskId))
    setTimeout(async () => {
      try {
        await apiClient.patch(`/tasks/${taskId}`, { is_completed: true })
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)))
      } catch (err) {
        console.error(err)
      } finally {
        setExitingTaskIds((prev) => {
          const s = new Set(prev)
          s.delete(taskId)
          return s
        })
      }
    }, ANIMATION_DURATION)
  }

  // open modal for add or edit
  const handleOpenModal = (taskId = null) => {
    if (taskId != null) {
      const taskToEdit = tasks.find((t) => t.id === taskId)
      setEditingTask(taskToEdit)
    } else {
      setEditingTask(null)
    }
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  // create or update
  const handleSaveTask = async (data) => {
    if (data.id) {
      // update
      try {
        const res = await apiClient.patch(`/tasks/${data.id}`, data)
        setTasks((curr) => curr.map((t) => (t.id === data.id ? { ...t, ...res.data } : t)))
      } catch (err) {
        console.error('Failed to update task:', err)
      }
    } else {
      // create
      try {
        const res = await apiClient.post('/tasks', data)
        setTasks((curr) => [{ ...res.data, completed: res.data.is_completed }, ...curr])
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }
    handleCloseModal()
  }

  // render body
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="no-tasks-message">
          <h2>Loading tasks...</h2>
        </div>
      )
    }
    if (error) {
      return (
        <div className="no-tasks-message error-message">
          <h2>{error}</h2>
        </div>
      )
    }
    if (allTasksDone) {
      return (
        <div className="no-tasks-message">
          <h2>All tasks completed! 🎉</h2>
        </div>
      )
    }
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => {
            if (task.completed) return null
            return (
              <SortableTaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEditClick={() => handleOpenModal(task.id)}
                isExiting={exitingTaskIds.has(task.id)}
              />
            )
          })}
        </SortableContext>
        <DragOverlay>{activeTask && <TaskCard task={activeTask} isExiting={false} />}</DragOverlay>
      </DndContext>
    )
  }

  return (
    <div className="daily-tasks-container">
      <ComponentHeader
        title="Daily Tasks"
        buttonIcon={faPlus}
        buttonText="Add Task"
        onButtonClick={() => handleOpenModal()}
      />
      <div className={`task-list ${allTasksDone ? 'is-complete' : ''}`}>{renderContent()}</div>
      {isModalOpen && (
        <EditTaskModal
          taskToEdit={editingTask}
          onSave={handleSaveTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
