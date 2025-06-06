import { useState } from 'react'

function ViewData({ logs, onDownload }) {
  const [showRawLogs, setShowRawLogs] = useState(false)

  const downloadRawLogs = () => {
    window.open('http://localhost:8000/view/raw?format=download', '_blank')
  }
  if (!logs || logs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No data yet</h2>
            <p className="text-gray-500 mb-6">Start logging your wellness journey to see your data here.</p>
            <button
              onClick={onDownload}
              disabled
              className="px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Your Wellness Data</h1>
                <p className="text-gray-500 mt-1">{logs.length} entries logged</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onDownload}
                  className="px-6 py-3 bg-wellness-400 text-white rounded-xl font-medium hover:bg-wellness-500 transition-colors duration-200"
                >
                  Export Daily Logs
                </button>
                <button
                  onClick={downloadRawLogs}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Export Raw Messages
                </button>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meals</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mood</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sleep</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hydration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alcohol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caffeine</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Other</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...logs].reverse().map((log, index) => {
                  // Combine meals into one column
                  const meals = [
                    log.breakfast_description && `Breakfast: ${log.breakfast_description}`,
                    log.lunch_description && `Lunch: ${log.lunch_description}`, 
                    log.dinner_description && `Dinner: ${log.dinner_description}`,
                    log.snack_description && `Snacks: ${log.snack_description}`
                  ].filter(Boolean).join(' • ')

                  // Combine mood times
                  const moods = [
                    log.mood_morning && `Morning: ${log.mood_morning}`,
                    log.mood_afternoon && `Afternoon: ${log.mood_afternoon}`,
                    log.mood_night && `Night: ${log.mood_night}`
                  ].filter(Boolean).join(' • ')

                  // Format supplements
                  const supplements = (() => {
                    try {
                      const supps = typeof log.supplements === 'string' 
                        ? (log.supplements.startsWith('[') ? JSON.parse(log.supplements) : log.supplements.split(', '))
                        : log.supplements;
                      return Array.isArray(supps) && supps.length > 0 ? supps.join(', ') : '';
                    } catch {
                      return log.supplements || '';
                    }
                  })()

                  // Combine other fields
                  const other = [
                    log.marijuana && `Cannabis: ${log.marijuana}`,
                    log.exercise_type && `Exercise: ${log.exercise_type}`,
                    supplements && `Supplements: ${supplements}`,
                    log.notes && `Notes: ${log.notes}`
                  ].filter(Boolean).join(' • ')

                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.date || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-md">
                        <div className="break-words">{meals || '-'}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="break-words">{moods || '-'}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {log.sleep || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {log.hydration || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {log.activity || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {log.alcohol === true ? 'Yes' : log.alcohol === false ? 'No' : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {log.caffeine ? `${log.caffeine}mg` : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="break-words">{other || '-'}</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewData