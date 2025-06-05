import { useState, useEffect, useCallback, useMemo } from 'react'

const SETTINGS_KEY = 'cal.settings'

const defaultSettings = {
  name: '',
  height_cm: '',
  weight_kg: '',
  anthropic_key: ''
}

export function useSettings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Helper functions for unit conversions (memoized)
  const cmToFeetInches = useCallback((cm) => {
    if (!cm || isNaN(cm)) return { feet: '', inches: '' }
    const totalInches = cm / 2.54
    const feet = Math.floor(totalInches / 12)
    const inches = Math.round(totalInches % 12)
    return { feet: feet.toString(), inches: inches.toString() }
  }, [])

  const feetInchesToCm = useCallback((feet, inches) => {
    const feetNum = parseInt(feet) || 0
    const inchesNum = parseInt(inches) || 0
    return Math.round((feetNum * 12 + inchesNum) * 2.54)
  }, [])

  const kgToLbs = useCallback((kg) => {
    if (!kg || isNaN(kg)) return ''
    return Math.round(kg * 2.20462).toString()
  }, [])

  const lbsToKg = useCallback((lbs) => {
    if (!lbs || isNaN(lbs)) return ''
    return Math.round((parseFloat(lbs) / 2.20462) * 10) / 10 // Round to 1 decimal
  }, [])

  // Get API key from environment or localStorage
  const getApiKey = () => {
    // In development, try to get from environment variables first
    if (import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_API_KEY) {
      return import.meta.env.VITE_ANTHROPIC_API_KEY
    }
    // Fallback to localStorage
    return settings.anthropic_key
  }

  // Load settings from localStorage
  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings(prev => ({ ...defaultSettings, ...parsed }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoaded(true)
    }
  }

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings) => {
    try {
      const updated = { ...settings, ...newSettings }
      setSettings(updated)
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
      return true
    } catch (error) {
      console.error('Error saving settings:', error)
      return false
    }
  }, [settings])

  // Update individual setting
  const updateSetting = useCallback((key, value) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
      return true
    } catch (error) {
      console.error('Error updating setting:', error)
      return false
    }
  }, [settings])

  // Validate API key format
  const isValidApiKey = (key) => {
    return key && typeof key === 'string' && key.startsWith('sk-ant-')
  }

  // Get effective API key (env or localStorage)
  const getEffectiveApiKey = () => {
    if (import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_API_KEY) {
      return import.meta.env.VITE_ANTHROPIC_API_KEY
    }
    return settings.anthropic_key
  }

  // Check if API key is set
  const hasApiKey = () => {
    const key = getEffectiveApiKey()
    return isValidApiKey(key)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return {
    // Settings state
    settings,
    isLoaded,
    
    // Core functions
    saveSettings,
    updateSetting,
    loadSettings,
    
    // Conversion helpers
    cmToFeetInches,
    feetInchesToCm,
    kgToLbs,
    lbsToKg,
    
    // API key helpers
    getEffectiveApiKey,
    isValidApiKey,
    hasApiKey,
    
    // Computed values
    displayName: settings.name || 'friend',
    heightInFeetInches: cmToFeetInches(settings.height_cm),
    weightInLbs: kgToLbs(settings.weight_kg)
  }
}