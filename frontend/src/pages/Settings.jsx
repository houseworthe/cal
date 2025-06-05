import { useState, useEffect, useRef } from 'react'
import { useSettings } from '../hooks/useSettings'
import Toast from '../components/Toast'

function Settings() {
  const {
    settings,
    isLoaded,
    updateSetting,
    saveSettings,
    cmToFeetInches,
    feetInchesToCm,
    kgToLbs,
    lbsToKg,
    isValidApiKey,
    hasApiKey,
    getEffectiveApiKey,
    heightInFeetInches,
    weightInLbs
  } = useSettings()

  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    feet: '',
    inches: '',
    weightLbs: ''
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [toast, setToast] = useState(null)
  const isInitialized = useRef(false)

  // Load form data when settings are loaded (only once)
  useEffect(() => {
    if (isLoaded && !isInitialized.current) {
      const height = cmToFeetInches(settings.height_cm)
      const weight = kgToLbs(settings.weight_kg)
      
      setFormData({
        name: settings.name || '',
        apiKey: settings.anthropic_key || '',
        feet: height.feet || '',
        inches: height.inches || '',
        weightLbs: weight || ''
      })
      
      isInitialized.current = true
    }
  }, [isLoaded]) // Simplified dependencies

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = (e) => {
    e.preventDefault()
    
    // Validate API key if provided
    if (formData.apiKey && !isValidApiKey(formData.apiKey)) {
      showToast('error', 'API key must start with sk-ant-')
      return
    }

    // Validate height inputs
    if (formData.feet && isNaN(parseInt(formData.feet))) {
      showToast('error', 'Feet must be a valid number')
      return
    }
    if (formData.inches && isNaN(parseInt(formData.inches))) {
      showToast('error', 'Inches must be a valid number')
      return
    }
    if (formData.inches && (parseInt(formData.inches) < 0 || parseInt(formData.inches) >= 12)) {
      showToast('error', 'Inches must be between 0 and 11')
      return
    }

    // Validate weight
    if (formData.weightLbs && isNaN(parseFloat(formData.weightLbs))) {
      showToast('error', 'Weight must be a valid number')
      return
    }

    // Convert and save
    const newSettings = {
      name: formData.name.trim(),
      anthropic_key: formData.apiKey.trim(),
      height_cm: (formData.feet || formData.inches) ? 
        feetInchesToCm(formData.feet, formData.inches) : '',
      weight_kg: formData.weightLbs ? lbsToKg(formData.weightLbs) : ''
    }

    const success = saveSettings(newSettings)
    if (success) {
      showToast('success', 'Settings saved successfully! ✨')
    } else {
      showToast('error', 'Failed to save settings')
    }
  }

  const getApiKeyStatus = () => {
    const effectiveKey = getEffectiveApiKey()
    const isFromEnv = import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_API_KEY
    
    if (isFromEnv) {
      return { status: 'env', message: '✅ Key set (from .env.local)' }
    } else if (isValidApiKey(effectiveKey)) {
      return { status: 'valid', message: '✅ Key set' }
    } else if (effectiveKey) {
      return { status: 'invalid', message: '❌ Invalid key format' }
    } else {
      return { status: 'missing', message: '❌ Missing' }
    }
  }

  const apiKeyStatus = getApiKeyStatus()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">Settings</h1>
          
          <form onSubmit={handleSave} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                👤 Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wellness-400 focus:border-transparent"
              />
            </div>

            {/* API Key */}
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                🧠 Anthropic API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  id="apiKey"
                  value={formData.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  placeholder={import.meta.env.DEV ? "Set in .env.local or enter here" : "sk-ant-..."}
                  disabled={import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_API_KEY}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wellness-400 focus:border-transparent pr-12 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_API_KEY}
                >
                  {showApiKey ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-sm font-medium ${
                  apiKeyStatus.status === 'valid' || apiKeyStatus.status === 'env' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {apiKeyStatus.message}
                </span>
                <p className="text-xs text-gray-500">
                  {import.meta.env.DEV ? 'Use .env.local for development' : 'Stored locally only'}
                </p>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📏 Height
              </label>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={formData.feet}
                    onChange={(e) => handleChange('feet', e.target.value)}
                    placeholder="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wellness-400 focus:border-transparent"
                  />
                  <label className="block text-xs text-gray-500 mt-1 text-center">feet</label>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={formData.inches}
                    onChange={(e) => handleChange('inches', e.target.value)}
                    placeholder="11"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wellness-400 focus:border-transparent"
                  />
                  <label className="block text-xs text-gray-500 mt-1 text-center">inches</label>
                </div>
              </div>
              {(formData.feet || formData.inches) && (
                <p className="text-xs text-gray-500 mt-2">
                  = {feetInchesToCm(formData.feet, formData.inches)} cm
                </p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                ⚖️ Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  id="weight"
                  value={formData.weightLbs}
                  onChange={(e) => handleChange('weightLbs', e.target.value)}
                  placeholder="154"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wellness-400 focus:border-transparent pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  lbs
                </span>
              </div>
              {formData.weightLbs && (
                <p className="text-xs text-gray-500 mt-2">
                  = {lbsToKg(formData.weightLbs)} kg
                </p>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-6 py-4 bg-wellness-400 text-white rounded-xl font-medium text-lg hover:bg-wellness-500 focus:outline-none focus:ring-2 focus:ring-wellness-400 focus:ring-offset-2 transition-all duration-200"
              >
                Save Settings
              </button>
            </div>
          </form>

          {/* Development Info */}
          {import.meta.env.DEV && (
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Development Mode</h3>
              <p className="text-xs text-blue-600">
                To set your API key permanently, create a <code>.env.local</code> file in the frontend directory with:
              </p>
              <code className="block mt-2 p-2 bg-blue-100 rounded text-xs">
                VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
              </code>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Settings