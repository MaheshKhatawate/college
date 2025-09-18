// JWT Token Management Utilities
export class TokenManager {
  static TOKEN_KEY = 'patientToken'
  static PATIENT_INFO_KEY = 'patientInfo'
  static TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes before expiry

  // Get token from localStorage
  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Get patient info from localStorage
  static getPatientInfo() {
    const patientInfo = localStorage.getItem(this.PATIENT_INFO_KEY)
    if (patientInfo) {
      try {
        return JSON.parse(patientInfo)
      } catch (error) {
        console.error('Error parsing patient info:', error)
        this.clearAll()
        return null
      }
    }
    return null
  }

  // Check if token exists
  static hasToken() {
    return !!this.getToken()
  }

  // Check if token is expired
  static isTokenExpired() {
    const token = this.getToken()
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      console.error('Error parsing token:', error)
      return true
    }
  }

  // Check if token needs refresh (expires within threshold)
  static shouldRefreshToken() {
    const token = this.getToken()
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      const timeUntilExpiry = (payload.exp - currentTime) * 1000
      return timeUntilExpiry < this.TOKEN_REFRESH_THRESHOLD
    } catch (error) {
      console.error('Error parsing token:', error)
      return false
    }
  }

  // Get token expiry time
  static getTokenExpiry() {
    const token = this.getToken()
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return new Date(payload.exp * 1000)
    } catch (error) {
      console.error('Error parsing token:', error)
      return null
    }
  }

  // Save token and patient info
  static saveAuth(token, patientInfo) {
    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.PATIENT_INFO_KEY, JSON.stringify(patientInfo))
  }

  // Clear all auth data
  static clearAll() {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.PATIENT_INFO_KEY)
  }

  // Validate current authentication
  static isAuthenticated() {
    const token = this.getToken()
    const patientInfo = this.getPatientInfo()
    
    // Must have both token and patient info
    if (!token || !patientInfo) {
      return false
    }
    
    // Check if token is expired (with a small buffer for network delays)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      const bufferTime = 30 // 30 seconds buffer
      return payload.exp > (currentTime + bufferTime)
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  }

  // Get authorization header for API requests
  static getAuthHeader() {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Auto-logout when token expires
  static setupAutoLogout(onLogout) {
    const checkToken = () => {
      if (this.hasToken() && this.isTokenExpired()) {
        console.log('Token expired, logging out...')
        this.clearAll()
        onLogout()
      }
    }

    // Check every minute
    const interval = setInterval(checkToken, 60000)
    
    // Check immediately
    checkToken()

    // Return cleanup function
    return () => clearInterval(interval)
  }

  // Session timeout warning
  static setupSessionWarning(onWarning, warningTime = 10 * 60 * 1000) { // 10 minutes before expiry
    const checkForWarning = () => {
      const token = this.getToken()
      if (!token) return

      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000
        const timeUntilExpiry = (payload.exp - currentTime) * 1000
        
        if (timeUntilExpiry <= warningTime && timeUntilExpiry > 0) {
          onWarning(Math.ceil(timeUntilExpiry / 60000)) // minutes remaining
        }
      } catch (error) {
        console.error('Error checking token expiry:', error)
      }
    }

    const interval = setInterval(checkForWarning, 60000) // Check every minute
    checkForWarning() // Check immediately

    return () => clearInterval(interval)
  }
}

// React hook for authentication state
import { useState, useEffect } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [patientData, setPatientData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionWarning, setSessionWarning] = useState(null)

  useEffect(() => {
    const checkAuth = () => {
      const token = TokenManager.getToken()
      const patientInfo = TokenManager.getPatientInfo()
      
      // Only validate if we have complete authentication data
      if (token && patientInfo) {
        // Check if token is still valid
        if (!TokenManager.isTokenExpired()) {
          setIsAuthenticated(true)
          setPatientData(patientInfo)
        } else {
          // Token expired, clear everything
          TokenManager.clearAll()
          setIsAuthenticated(false)
          setPatientData(null)
        }
      } else {
        // No auth data or incomplete
        setIsAuthenticated(false)
        setPatientData(null)
      }
      setIsLoading(false)
    }

    checkAuth()

    // Setup auto-logout and warnings only if we're authenticated
    let cleanupAutoLogout = () => {}
    let cleanupWarning = () => {}
    
    // Only setup monitoring if we have a valid token
    if (TokenManager.hasToken() && !TokenManager.isTokenExpired()) {
      cleanupAutoLogout = TokenManager.setupAutoLogout(() => {
        setIsAuthenticated(false)
        setPatientData(null)
        setSessionWarning(null)
      })

      cleanupWarning = TokenManager.setupSessionWarning((minutesRemaining) => {
        setSessionWarning(minutesRemaining)
      })
    }

    return () => {
      cleanupAutoLogout()
      cleanupWarning()
    }
  }, [])

  const login = (token, patient) => {
    // Save auth data first
    TokenManager.saveAuth(token, patient)
    
    // Update state immediately
    setIsAuthenticated(true)
    setPatientData(patient)
    setSessionWarning(null)
  }

  const logout = () => {
    TokenManager.clearAll()
    setIsAuthenticated(false)
    setPatientData(null)
    setSessionWarning(null)
  }

  const extendSession = () => {
    // In a real app, you would call an API to refresh the token
    setSessionWarning(null)
  }

  return {
    isAuthenticated,
    patientData,
    isLoading,
    sessionWarning,
    login,
    logout,
    extendSession
  }
}