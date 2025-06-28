import React from 'react'
import './HomeDashBoard.css'
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index'
import Calendar from '../../../components/calendar/Calender'

function HomeDashBoard() {
  return (
    <div className="main-layout-container">
      {/* 1. Left Calendar (70% width) */}
      <div className="calendar-container">
        <Calendar />
      </div>

      {/* 2. Right Item Container (30% width) */}
      <div className="right-item-container">
        {/* Top Card (50% height of the right container) */}
        <div className="card-container">
          <div className="placeholder-content">
            <h2>Top Card</h2>
            <p>(50% Height)</p>
            {/* You can map over items here later */}
          </div>
        </div>

        {/* Bottom Card (50% height of the right container) */}
        <div className="card-container">
          <div className="placeholder-content">
            <h2>Bottom Card</h2>
            <p>(50% Height)</p>
            {/* You can map over other items here */}
          </div>
        </div>
      </div>
    </div>
  )
}

const HomeDashBoardLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <HomeDashBoard />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default HomeDashBoardLayout
