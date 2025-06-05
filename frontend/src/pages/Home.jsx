import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import LogInput from '../components/LogInput'
import RecentLogs from '../components/RecentLogs'

function Home({ logs, recentActivity, onLogSubmit, loading }) {
  const { displayName } = useSettings()
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-wellness-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Welcome back, {displayName}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Log how you feel, what you ate, and how your day is going.
          </p>
        </div>

        {/* Log Input */}
        <div className="mb-12">
          <LogInput onSubmit={onLogSubmit} loading={loading} />
        </div>

        {/* Recent Logs */}
        <RecentLogs recentActivity={recentActivity} />
      </div>
    </div>
  )
}

export default Home