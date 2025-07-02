import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginRegisterPage.css' // Import the corresponding CSS file
import domain from '../../../config'

// Import the FontAwesomeIcon component and the specific icons you need
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faListUl,
  faChartLine,
  faUsers,
  faEnvelope,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

const HighlightItem = ({ icon, title, description }) => (
  <div className="highlight-item">
    <div className="highlight-icon">
      <FontAwesomeIcon icon={icon} />
    </div>
    <div>
      <h3 className="highlight-title">{title}</h3>
      <p className="highlight-description">{description}</p>
    </div>
  </div>
)

export default function LoginRegisterPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState(null)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      [name]: value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      if (mode === 'register' && form.password !== form.confirm) {
        throw new Error('Passwords do not match')
      }

      const endpoint = mode === 'login' ? `${domain}/auth/login` : `${domain}/auth/register`
      const body =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : {
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              password: form.password,
            }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || (mode === 'login' ? 'Login failed' : 'Registration failed'))
      }

      if (mode === 'login') {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('userId', data.id)
        navigate('/homeDashBoard')
      } else {
        alert(data.message || 'Registration successful! Please sign in.')
        setMode('login') // Switch to login mode after successful registration
        // Clear form fields for security and usability
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirm: '',
        })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const switchMode = (newMode) => {
    setError(null)
    setForm({
      // Reset form when switching modes
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
    })
    setMode(newMode)
  }

  return (
    <div className="login-register-container">
      {/* Brand Panel */}
      <div className="brand-panel">
        <h1 className="brand-title">Task Tracer</h1>
        <p className="brand-subtitle">
          Streamline your workflow, track progress, and achieve your goals with our intuitive task
          management system.
        </p>
        <div className="highlights">
          {/* Pass the imported icon objects as props */}
          <HighlightItem
            icon={faListUl}
            title="Organized Tasks"
            description="Categorize and prioritize effortlessly"
          />
          <HighlightItem
            icon={faChartLine}
            title="Progress Tracking"
            description="Visualize your accomplishments"
          />
          <HighlightItem
            icon={faUsers}
            title="Team Collaboration"
            description="Work together seamlessly"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="form-card">
          <div className="tab-navigation">
            <button
              className={`tab-button ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Sign In
            </button>
            <button
              className={`tab-button ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={onSubmit} className="form-content">
            {mode === 'register' && (
              <div className="name-fields">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="confirm">Confirm Password</label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faLock} />
                  <input
                    type="password"
                    id="confirm"
                    name="confirm"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="form-footer">© 2025 Task Tracer. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
