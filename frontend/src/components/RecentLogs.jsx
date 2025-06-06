import { useState } from 'react'
import { Link } from 'react-router-dom'

function RecentLogs({ recentActivity }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const { recent_messages = [], today_log, daily_logs = [] } = recentActivity || {}
  
  if (!recent_messages.length && !today_log) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Start your wellness journey</h3>
        <p className="text-gray-500">Your logged entries will appear here once you start tracking.</p>
      </div>
    )
  }

  // Helper function to validate messages
  const isValidMessage = (msg) => {
    return msg && msg.message && msg.message.trim() && msg.timestamp
  }

  // Get today's date for filtering messages
  const today = new Date().toISOString().split('T')[0]
  const todayMessages = recent_messages.filter(msg => {
    if (!isValidMessage(msg)) return false
    
    const ts = new Date(msg.timestamp)
    if (isNaN(ts.getTime())) return false
    
    const msgDate = ts.toISOString().split('T')[0]
    return msgDate === today
  })

  const getMoodEmoji = (moodMorning, moodAfternoon, moodNight) => {
    // Combine all mood entries to pick best emoji
    const allMoods = [moodMorning, moodAfternoon, moodNight].filter(Boolean).join(' ').toLowerCase()
    if (!allMoods) return '😐'
    
    if (allMoods.includes('happy') || allMoods.includes('great') || allMoods.includes('good')) return '😊'
    if (allMoods.includes('sad') || allMoods.includes('down')) return '😔'
    if (allMoods.includes('tired') || allMoods.includes('exhausted')) return '😴'
    if (allMoods.includes('energetic') || allMoods.includes('excited')) return '⚡'
    if (allMoods.includes('calm') || allMoods.includes('peaceful')) return '😌'
    if (allMoods.includes('stressed') || allMoods.includes('anxious')) return '😰'
    if (allMoods.includes('fuzzy') || allMoods.includes('foggy')) return '😵‍💫'
    return '😐'
  }

  const getSleepEmoji = (sleep) => {
    if (!sleep) return '💤'
    if (sleep.includes('8') || sleep.includes('good') || sleep.includes('well')) return '😴'
    if (sleep.includes('5') || sleep.includes('6') || sleep.includes('poor') || sleep.includes('bad')) return '😵'
    return '💤'
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return "Invalid time"
    
    const ts = new Date(timestamp)
    if (isNaN(ts.getTime())) {
      console.warn(`Invalid timestamp: ${timestamp}`)
      return "Invalid time"
    }
    
    return ts.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Invalid date"
    
    const ts = new Date(timestamp)
    if (isNaN(ts.getTime())) {
      console.warn(`Invalid timestamp: ${timestamp}`)
      return "Invalid date"
    }
    
    return ts.toLocaleDateString('en-US')
  }

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      {(today_log || todayMessages.length > 0) && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Today's Activity</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {todayMessages.length} messages today
                  {today_log && ' • Wellness data logged'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {(today_log?.mood_morning || today_log?.mood_afternoon || today_log?.mood_night) && (
                    <span className="text-xl">{getMoodEmoji(today_log.mood_morning, today_log.mood_afternoon, today_log.mood_night)}</span>
                  )}
                  {today_log?.sleep && (
                    <span className="text-lg">{getSleepEmoji(today_log.sleep)}</span>
                  )}
                  {today_log?.activity && <span className="text-lg">🏃</span>}
                  {today_log?.hydration && <span className="text-lg">💧</span>}
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>
          
          {isExpanded && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="space-y-4 mt-4">
                {/* Today's Wellness Summary */}
                {today_log && (
                  <div className="p-4 bg-wellness-50 rounded-xl border border-wellness-100">
                    <h4 className="font-medium text-wellness-800 mb-2">Today's Wellness Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-wellness-700">
                      {today_log.breakfast_description && (
                        <p><span className="font-medium">🍳 Breakfast:</span> {today_log.breakfast_description}</p>
                      )}
                      {today_log.lunch_description && (
                        <p><span className="font-medium">🥗 Lunch:</span> {today_log.lunch_description}</p>
                      )}
                      {today_log.dinner_description && (
                        <p><span className="font-medium">🍽️ Dinner:</span> {today_log.dinner_description}</p>
                      )}
                      {today_log.snack_description && (
                        <p><span className="font-medium">🍿 Snacks:</span> {today_log.snack_description}</p>
                      )}
                      {(today_log.mood_morning || today_log.mood_afternoon || today_log.mood_night) && (
                        <div>
                          <span className="font-medium">💭 Mood:</span>
                          <div className="ml-4 text-xs">
                            {today_log.mood_morning && <p>🌅 Morning: {today_log.mood_morning}</p>}
                            {today_log.mood_afternoon && <p>☀️ Afternoon: {today_log.mood_afternoon}</p>}
                            {today_log.mood_night && <p>🌙 Night: {today_log.mood_night}</p>}
                          </div>
                        </div>
                      )}
                      {today_log.hydration && (
                        <p><span className="font-medium">💧 Hydration:</span> {today_log.hydration}</p>
                      )}
                      {today_log.sleep && (
                        <p><span className="font-medium">😴 Sleep:</span> {today_log.sleep}</p>
                      )}
                      {today_log.activity && (
                        <p><span className="font-medium">🏃 Activity:</span> {today_log.activity}</p>
                      )}
                      {today_log.exercise_type && (
                        <p><span className="font-medium">💪 Exercise:</span> {today_log.exercise_type}</p>
                      )}
                      {today_log.caffeine && (
                        <p><span className="font-medium">☕ Caffeine:</span> {today_log.caffeine}mg</p>
                      )}
                      {today_log.alcohol === true && (
                        <p><span className="font-medium">🍷 Alcohol:</span> Yes</p>
                      )}
                      {today_log.alcohol === false && (
                        <p><span className="font-medium">🚫 Alcohol:</span> No</p>
                      )}
                      {today_log.marijuana && (
                        <p><span className="font-medium">🌿 Cannabis:</span> {today_log.marijuana}</p>
                      )}
                      {today_log.supplements && (() => {
                        try {
                          const supps = typeof today_log.supplements === 'string' 
                            ? (today_log.supplements.startsWith('[') 
                                ? JSON.parse(today_log.supplements) 
                                : today_log.supplements.split(', '))
                            : today_log.supplements;
                          return supps.length > 0 ? (
                            <p><span className="font-medium">💊 Supplements:</span> {Array.isArray(supps) ? supps.join(', ') : supps}</p>
                          ) : null;
                        } catch {
                          return today_log.supplements ? (
                            <p><span className="font-medium">💊 Supplements:</span> {today_log.supplements}</p>
                          ) : null;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Today's Messages */}
                {todayMessages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Today's Messages</h4>
                    <div className="space-y-2">
                      {[...todayMessages].reverse().map((msg, index) => {
                        if (!isValidMessage(msg)) return null
                        
                        return (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500 mt-1 flex-shrink-0">
                              {formatTime(msg.timestamp)}
                            </span>
                            <p className="text-sm text-gray-700 flex-1">
                              {msg.message.trim() || "Message missing"}
                            </p>
                          </div>
                        )
                      }).filter(Boolean)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Messages Feed */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Recent Messages</h3>
          <Link 
            to="/data"
            className="text-wellness-400 hover:text-wellness-500 font-medium text-sm transition-colors duration-200"
          >
            View all data →
          </Link>
        </div>
        
        <div className="space-y-4">
          {recent_messages
            .filter(isValidMessage)
            .slice(-5)
            .reverse()
            .map((msg, index) => {
              const ts = new Date(msg.timestamp)
              if (isNaN(ts.getTime())) return null
              
              const msgDate = formatDate(msg.timestamp)
              const msgTime = formatTime(msg.timestamp)
              const isToday = ts.toISOString().split('T')[0] === today
              
              return (
                <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                  <div className="flex-shrink-0">
                    <div className="text-xs text-gray-500">
                      {isToday ? msgTime : `${msgDate} ${msgTime}`}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      {msg.message.trim() || "Message missing"}
                    </p>
                  </div>
                </div>
              )
            })
            .filter(Boolean)}
          
          {recent_messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No messages yet. Start logging to see your activity here!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecentLogs