import { ScheduleComponent, 
  Day, 
  Week, 
  WorkWeek, 
  Month, 
  Agenda, 
  Inject, 
  ViewsDirective, 
  ViewDirective 
} from '@syncfusion/ej2-react-schedule';
import './Calender.css';
import { createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { useState } from 'react';

function getColorContainer(args: any) {
  let colorContainer = createElement('div', { className: 'color-field-container' });
  let colorInputEle = createElement('input', {
      className: 'e-field', attrs: { name: 'Color' }
  });
  colorContainer.appendChild(colorInputEle);
  let colorDropDownList = new DropDownList({
      dataSource: [
          { text: 'Red', value: 'red' },
          { text: 'Green', value: 'green' },
          { text: 'Blue', value: 'blue' },
          { text: 'Yellow', value: 'yellow' }
      ],
      fields: { text: 'text', value: 'value' },
      value: args.data.Color,
      floatLabelType: 'Always', placeholder: 'Color'
  });
  colorDropDownList.appendTo(colorInputEle);
  colorInputEle.setAttribute('name', 'Color');
  return colorContainer;
}

function getClassContainer(args: any) {
  let classContainer = createElement('div', { className: 'class-field-container' });
  let classInputEle = createElement('input', {
      className: 'e-field', attrs: { name: 'ClassType' }
  });
  classContainer.appendChild(classInputEle);
  let classDropDownList = new DropDownList({
      dataSource: [
          { text: 'Work', value: 'work' },
          { text: 'Personal', value: 'personal' },
          { text: 'Meeting', value: 'meeting' },
          { text: 'Travel', value: 'travel' }
      ],
      fields: { text: 'text', value: 'value' },
      value: args.data.ClassType,
      floatLabelType: 'Always', placeholder: 'Class Type'
  });
  classDropDownList.appendTo(classInputEle);
  classInputEle.setAttribute('name', 'ClassType');
  return classContainer;
}

export default function Calendar() {
  const [userId] = useState<string>(() => {
    return localStorage.getItem('userId') || '';
  });

  const onActionBegin = (args: any) => {
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
      const payload = { ...args.data[0], userId };
      console.log('Preview payload:', payload);
      args.data[0] = payload;
    }
  };
  
  const dataManager = new DataManager({
    url:      'http://localhost:8000/appointments',     // GET list
    crudUrl:  'http://localhost:8000/appointments',     // POST/PUT/DELETE
    adaptor:  new UrlAdaptor(),
    crossDomain: true
  });
  const onPopupOpen = (args: any) => {
    if (args.type === 'Editor') {
      if (!args.element.querySelector('.custom-field-row')) {
        let row = createElement('div', { className: 'custom-field-row' });
        let formElement = args.element.querySelector('.e-schedule-form');
        formElement.firstChild.firstChild.after(row);

        // rewrite original setting
        let location = formElement.getElementsByClassName('e-location-container')[0];
        if (location) {
          location.remove();
        }
        let title = formElement.getElementsByClassName('e-subject-container')[0];
        title.style.width = '100%';

        // add custom field
        row.appendChild(getClassContainer(args));
        row.appendChild(getColorContainer(args));
      }
    }
  }
  return (<ScheduleComponent 
    width='100%' 
    height='100%' 
    eventSettings={{
      dataSource: dataManager,
      fields: {
        id:   'Id',
        subject: { name: 'Subject' },
        startTime: { name: 'StartTime' },
        endTime:   { name: 'EndTime' },
        Color:     { name: 'Color' },
        ClassType: { name: 'ClassType' }
      }
    }}
    popupOpen={onPopupOpen}
    actionBegin={onActionBegin}
    >
      <ViewsDirective>
        <ViewDirective option='Day' />
        <ViewDirective option='Week' />
        <ViewDirective option='WorkWeek' />
        <ViewDirective option='Month' />
        <ViewDirective option='Agenda' />
      </ViewsDirective>
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
  </ScheduleComponent>);
}