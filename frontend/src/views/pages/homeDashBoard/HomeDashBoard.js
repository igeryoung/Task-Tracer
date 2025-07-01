import './HomeDashBoard.css'
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index'
import Calendar from '../../../components/calendar/Calender'
import { RequireAuth } from '../../../components/auth/RequireAuth'
import DailyTasks from '../../../components/DailyTasks/DailyTasks'
import { useState } from 'react'
import ActivityLog from '../../../components/ActivityLog/ActivityLog'

function HomeDashBoard() {
  const [isTopCardShrunk, setIsTopCardShrunk] = useState(false)
  return (
    <div className="main-layout-container">
      <Calendar />

      <div className="right-item-container">
        <div className={`card-container top-card ${isTopCardShrunk ? 'shrunk' : ''}`}>
          <DailyTasks onCompletionStateChange={setIsTopCardShrunk} />
        </div>

        <div className="card-container bottom-card">
          {/* Replace the placeholder with the new ActivityLog component */}
          <ActivityLog />
        </div>
      </div>
    </div>
  )
}

const HomeDashBoardLayout = () => {
  return (
    <div>
      <RequireAuth>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <HomeDashBoard />
          </div>
          <AppFooter />
        </div>
      </RequireAuth>
    </div>
  )
}

export default HomeDashBoardLayout
