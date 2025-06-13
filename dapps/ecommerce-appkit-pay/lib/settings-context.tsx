'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AppKitSettings } from './types'

interface SettingsContextType {
  settings: AppKitSettings
  updateSettings: (updates: Partial<AppKitSettings>) => void
  resetSettings: () => void
}

const defaultSettings: AppKitSettings = {
  recipientAddress: '',
  defaultPaymentAsset: 'baseUSDC',
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '',
  enableTestnet: true,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const SETTINGS_STORAGE_KEY = 'appkit-pay-settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppKitSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsedSettings = JSON.parse(stored) as AppKitSettings
        setSettings(prev => ({ ...defaultSettings, ...parsedSettings }))
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return // Don't save during initial load
    
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
    }
  }, [settings, isLoaded])

  const updateSettings = (updates: Partial<AppKitSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
} 