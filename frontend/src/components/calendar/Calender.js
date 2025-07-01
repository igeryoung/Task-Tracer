/* src/components/Calendar.js */
import React, { useState, useRef, useEffect } from 'react'
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  ViewsDirective,
  ViewDirective,
} from '@syncfusion/ej2-react-schedule'
import './Calender.css'
import { createElement } from '@syncfusion/ej2-base'
import { DropDownList } from '@syncfusion/ej2-dropdowns'
import ComponentHeader from '../shared/ComponentHeader'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function getColorContainer(args) {
  const container = createElement('div', { className: 'color-field-container' })
  const input = createElement('input', { className: 'e-field', attrs: { name: 'Color' } })
  container.appendChild(input)
  new DropDownList({
    dataSource: ['red', 'green', 'blue', 'yellow'],
    floatLabelType: 'Always',
    placeholder: 'Color',
    value: args.data.Color,
  }).appendTo(input)
  return container
}

function getClassContainer(args) {
  const container = createElement('div', { className: 'class-field-container' })
  const input = createElement('input', { className: 'e-field', attrs: { name: 'ClassType' } })
  container.appendChild(input)
  new DropDownList({
    dataSource: ['work', 'personal', 'meeting', 'travel'],
    floatLabelType: 'Always',
    placeholder: 'Class Type',
    value: args.data.ClassType,
  }).appendTo(input)
  return container
}

export default function Calendar() {
  const scheduleRef = useRef(null)
  const [events, setEvents] = useState([])
  const [userId] = useState(() => localStorage.getItem('userId') || '')

  // Fetch events on mount and after CRUD
  const fetchEvents = async () => {
    const res = await fetch('http://localhost:8000/appointments/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    const data = await res.json()
    setEvents(
      data.map((item) => ({
        Id: item.id,
        Subject: item.subject,
        StartTime: new Date(item.startTime),
        EndTime: new Date(item.endTime),
        Color: item.color,
        ClassType: item.classType,
        userId: item.userId,
      })),
    )
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Perform CRUD via fetch
  const onActionComplete = async (args) => {
    try {
      if (args.requestType === 'eventCreated') {
        const raw = args.data[0]
        const body = {
          subject: raw.Subject,
          description: raw.Description || '',
          startTime: raw.StartTime.toISOString(),
          endTime: raw.EndTime.toISOString(),
          color: raw.Color,
          classType: raw.ClassType,
          isAllDay: raw.IsAllDay,
          recurrenceRule: raw.RecurrenceRule,
          startTimezone: raw.StartTimezone,
          endTimezone: raw.EndTimezone,
          userId,
        }
        await fetch('http://localhost:8000/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      if (args.requestType === 'eventChanged') {
        const raw = args.data[0]
        console.log(raw)
        const body = {
          subject: raw.Subject,
          description: raw.Description || '',
          startTime: raw.StartTime,
          endTime: raw.EndTime,
          color: raw.Color,
          classType: raw.ClassType,
          isAllDay: raw.IsAllDay,
          recurrenceRule: raw.RecurrenceRule,
          startTimezone: raw.StartTimezone,
          endTimezone: raw.EndTimezone,
          userId,
        }
        console.log(body)
        await fetch(`http://localhost:8000/appointments/${raw.Id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      if (args.requestType === 'eventRemoved') {
        const raw = args.data[0]
        console.log(raw)
        await fetch(`http://localhost:8000/appointments/${raw.Id}`, {
          method: 'DELETE',
        })
      }
      // Refresh after CRUD
      fetchEvents()
    } catch (err) {
      console.error('CRUD error:', err)
    }
  }

  const onPopupOpen = (args) => {
    if (args.type === 'Editor' && !args.element.querySelector('.custom-field-row')) {
      const row = createElement('div', { className: 'custom-field-row' })
      const form = args.element.querySelector('.e-schedule-form')
      form.firstChild.firstChild.after(row)
      form.getElementsByClassName('e-location-container')[0]?.remove()
      form.getElementsByClassName('e-subject-container')[0].setAttribute('style', 'width:100%')
      row.appendChild(getClassContainer(args))
      row.appendChild(getColorContainer(args))
    }
  }

  return (
    <div className="calendar-container">
      <ComponentHeader
        title="My Calendar"
        buttonIcon={faPlus}
        onButtonClick={() => setIsModalOpen(true)}
      />
      <div className="schedule-container">
        <ScheduleComponent
          cssClass="main-schedule-component"
          ref={scheduleRef}
          height="95%"
          eventSettings={{
            dataSource: events,
            fields: {
              id: 'Id',
              subject: { name: 'Subject' },
              startTime: { name: 'StartTime' },
              endTime: { name: 'EndTime' },
              color: { name: 'Color' },
              classType: { name: 'ClassType' },
              userId: { name: 'userId' },
            },
          }}
          popupOpen={onPopupOpen}
          actionComplete={onActionComplete}
          currentView="Month"
          editsettings={{
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowBatch: false,
          }}
        >
          <ViewsDirective>
            <ViewDirective option="Day" />
            <ViewDirective option="Week" />
            <ViewDirective option="Month" />
            <ViewDirective option="Agenda" />
          </ViewsDirective>
          <Inject services={[Day, Week, Month, Agenda]} />
        </ScheduleComponent>
      </div>
    </div>
  )
}
