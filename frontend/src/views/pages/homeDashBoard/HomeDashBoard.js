import './HomeDashBoard.css'
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index'
import Calendar from '../../../components/calendar/Calender'
import { RequireAuth } from '../../../components/auth/RequireAuth'

function HomeDashBoard() {
  return (
    <div className="main-layout-container">
      <div className="calendar-container">
        <Calendar />
      </div>

      <div className="right-item-container">
        <div className="card-container">
          <div className="placeholder-content">
            <h2>Top Card</h2>
            <p>(50% Height)</p>
          </div>
        </div>

        <div className="card-container">
          <div className="placeholder-content">
            <h2>Bottom Card</h2>
            <p>(50% Height)</p>
          </div>
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
