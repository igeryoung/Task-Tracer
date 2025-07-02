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

  // fetch tasks and today's completions
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // fetch task templates and today's completions in parallel
      const todayString = new Date().toISOString().split('T')[0]
      const [tasksRes, completionsRes] = await Promise.all([
        apiClient.get('/tasks'),
        apiClient.get(`/task-completions?date=${todayString}`),
      ])
      const completedTodayIds = new Set(completionsRes.data)

      // determine today's index (Mon=0…Sun=6)
      const dayIndex = (new Date().getDay() + 6) % 7

      // filter for today's tasks
      const tasksForToday = tasksRes.data.filter((task) => {
        if (task.task_type === 'single') {
          return !task.is_completed
        }
        if (task.task_type === 'recurring') {
          const scheduled = task.repeat_day?.[dayIndex] === '1'
          const alreadyDone = completedTodayIds.has(task.id)
          return scheduled && !alreadyDone
        }
        return false
      })

      setTasks(tasksForToday)
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

  // complete with animation + API
  const handleToggleComplete = (taskId) => {
    setExitingTaskIds((prev) => new Set(prev).add(taskId))

    setTimeout(async () => {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return
      try {
        if (task.task_type === 'single') {
          await apiClient.patch(`/tasks/${taskId}`, { is_completed: true })
        } else {
          await apiClient.post('/task-completions', { task_id: taskId })
        }
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
      } catch (err) {
        console.error('Failed to complete task:', err)
        // revert animation on failure
        setExitingTaskIds((prev) => {
          const s = new Set(prev)
          s.delete(taskId)
          return s
        })
      }
    }, ANIMATION_DURATION)
  }

  // modal controls
  const handleOpenModal = (taskId = null) => {
    setEditingTask(taskId != null ? tasks.find((t) => t.id === taskId) : null)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  // save new or updated task
  const handleSaveTask = async (data) => {
    try {
      if (data.id) {
        const res = await apiClient.patch(`/tasks/${data.id}`, data)
        setTasks((curr) => curr.map((t) => (t.id === data.id ? { ...t, ...res.data } : t)))
      } else {
        const res = await apiClient.post('/tasks', data)
        setTasks((curr) => [{ ...res.data, completed: res.data.is_completed }, ...curr])
      }
    } catch (err) {
      console.error('Failed to save task:', err)
    }
    handleCloseModal()
  }

  // delete handler to pass into modal
  const handleDeleteTask = async (taskId) => {
    const original = [...tasks]
    setTasks(tasks.filter((t) => t.id !== taskId))
    try {
      await apiClient.delete(`/tasks/${taskId}`)
    } catch (err) {
      console.error('Failed to delete task:', err)
      setTasks(original)
    }
  }

  // drag-and-drop
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const handleDragStart = (event) => {
    setActiveTask(tasks.find((t) => t.id === event.active.id))
  }
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id)
      const newIndex = tasks.findIndex((t) => t.id === over.id)
      setTasks(arrayMove(tasks, oldIndex, newIndex))
      // optionally save order via API
    }
    setActiveTask(null)
  }

  // compute visible tasks
  const visibleTasks = tasks.filter((t) => !exitingTaskIds.has(t.id))
  const allTasksDone = !isLoading && visibleTasks.length === 0

  useEffect(() => {
    if (onCompletionStateChange) onCompletionStateChange(allTasksDone)
  }, [allTasksDone, onCompletionStateChange])

  // render content
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
        <SortableContext
          items={visibleTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {visibleTasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEditClick={() => handleOpenModal(task.id)}
              isExiting={exitingTaskIds.has(task.id)}
            />
          ))}
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
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  )
}
