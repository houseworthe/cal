import { useState } from 'react'
import Toast from './Toast'

function LogInput({ onSubmit, loading }) {
  const [input, setInput] = useState('')
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const result = await onSubmit(input)
    
    if (result.success) {
      // Show different messages based on what was logged
      let message = 'Message saved! ✨'
      if (result.data?.daily_log_updated) {
        message = 'Wellness data logged successfully! ✨'
      } else if (result.data?.raw_message_saved && !result.data?.daily_log_updated) {
        message = 'Message saved! No wellness data detected. 💬'
      }
      
      setToast({
        type: 'success',
        message: message
      })
      setInput('')
      setTimeout(() => setToast(null), 3000)
    } else {
      setToast({
        type: 'error',
        message: result.error || 'Failed to log entry'
      })
      setTimeout(() => setToast(null), 5000)
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: Had oatmeal for breakfast, took a walk, feeling calm. Slept well last night."
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wellness-400 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 text-lg leading-relaxed"
              rows="4"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full sm:w-auto px-8 py-4 bg-wellness-400 text-white rounded-pill font-medium text-lg hover:bg-wellness-500 focus:outline-none focus:ring-2 focus:ring-wellness-400 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Log Entry'
            )}
          </button>
        </form>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default LogInput