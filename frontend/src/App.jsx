import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ViewData from './pages/ViewData'
import Settings from './pages/Settings'

const API_URL = 'http://localhost:8000'

function App() {
  const [logs, setLogs] = useState([])
  const [recentActivity, setRecentActivity] = useState({ recent_messages: [], today_log: null, daily_logs: [] })
  const [loading, setLoading] = useState(false)
  const [lastLoadedDate, setLastLoadedDate] = useState(new Date().toDateString())

  const loadLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/view?format=json`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error loading logs:', error)
    }
  }

  const loadRecentActivity = async () => {
    try {
      const response = await fetch(`${API_URL}/recent`)
      if (response.ok) {
        const data = await response.json()
        setRecentActivity(data)
      }
    } catch (error) {
      console.error('Error loading recent activity:', error)
    }
  }

  useEffect(() => {
    loadLogs()
    loadRecentActivity()
    
    // Check for date changes every minute
    const checkDateChange = () => {
      const currentDate = new Date().toDateString()
      if (currentDate !== lastLoadedDate) {
        console.log('New day detected, refreshing data...')
        setLastLoadedDate(currentDate)
        loadLogs()
        loadRecentActivity()
      }
    }
    
    // Check immediately and then every minute
    const intervalId = setInterval(checkDateChange, 60000) // Check every minute
    
    return () => clearInterval(intervalId)
  }, [lastLoadedDate])

  const handleLogSubmit = async (input) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        throw new Error('Failed to log entry')
      }

      const result = await response.json()
      await loadLogs()
      await loadRecentActivity()
      setLastLoadedDate(new Date().toDateString()) // Update last loaded date
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const downloadLogs = () => {
    window.open(`${API_URL}/view?format=download`, '_blank')
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar activityStreak={recentActivity.activity_streak || 0} />
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                logs={logs}
                recentActivity={recentActivity}
                onLogSubmit={handleLogSubmit}
                loading={loading}
              />
            } 
          />
          <Route 
            path="/data" 
            element={
              <ViewData 
                logs={logs}
                onDownload={downloadLogs}
              />
            } 
          />
          <Route 
            path="/settings" 
            element={<Settings />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App