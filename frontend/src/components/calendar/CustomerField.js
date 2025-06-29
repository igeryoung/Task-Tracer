function getColorContainer(args) {
  const container = createElement('div', { className: 'color-field-container' })
  const input = createElement('input', { className: 'e-field', attrs: { name: 'color' } })
  container.appendChild(input)
  new DropDownList({
    dataSource: ['red', 'green', 'blue', 'yellow'],
    floatLabelType: 'Always',
    placeholder: 'Color',
    value: args.data.color,
  }).appendTo(input)
  return container
}

function getClassContainer(args) {
  const container = createElement('div', { className: 'class-field-container' })
  const input = createElement('input', { className: 'e-field', attrs: { name: 'classType' } })
  container.appendChild(input)
  new DropDownList({
    dataSource: ['work', 'personal', 'meeting', 'travel'],
    floatLabelType: 'Always',
    placeholder: 'Class Type',
    value: args.data.classType,
  }).appendTo(input)
  return container
}