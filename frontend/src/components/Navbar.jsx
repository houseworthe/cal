import { Link, useLocation } from 'react-router-dom'

function Navbar({ activityStreak = 0 }) {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Brand and Streak */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center">
              <Link to="/" className="text-2xl font-bold text-wellness-400 leading-tight">
                Cal
              </Link>
              <span className="text-xs text-gray-400 mt-1">
                Your wellness AI agent
              </span>
            </div>
            
            {/* Activity Streak */}
            {activityStreak > 1 && (
              <div 
                className="group relative flex items-center space-x-1 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-200"
                title={`${activityStreak} day streak!`}
              >
                <span className="text-lg">🔥</span>
                <span className="text-sm font-medium text-orange-700">{activityStreak}</span>
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {activityStreak} day activity streak! Keep it up!
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Center - Home Icon */}
          <div className="flex-1 flex justify-center">
            <Link
              to="/"
              className={`p-3 rounded-xl transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-wellness-400 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title="Home"
            >
              <svg 
                className="w-6 h-6" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
          </div>
          
          {/* Right side - Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <Link
              to="/data"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/data'
                  ? 'bg-wellness-400 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">View Data</span>
              <span className="sm:hidden">Data</span>
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/settings'
                  ? 'bg-wellness-400 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar