import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './ComponentHeader.css'

export default function ComponentHeader({ title, buttonIcon, buttonText, onButtonClick }) {
  return (
    <div className="component-header">
      <h2 className="component-header-title">{title}</h2>
      {buttonIcon && buttonText && (
        <button className="component-header-button" onClick={onButtonClick}>
          <FontAwesomeIcon icon={buttonIcon} />
          {buttonText && <span>{buttonText}</span>}
        </button>
      )}
    </div>
  )
}
