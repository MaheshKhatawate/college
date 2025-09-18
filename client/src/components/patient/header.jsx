import React, { useState, useEffect } from 'react'

const PatientHeader = () => {
  const [patientData, setPatientData] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Get patient data from localStorage
    const patientInfo = localStorage.getItem('patientInfo')
    if (patientInfo) {
      try {
        setPatientData(JSON.parse(patientInfo))
      } catch (error) {
        console.error('Error parsing patient data:', error)
      }
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('patientToken')
    localStorage.removeItem('patientInfo')
    window.location.href = '/patient' // Redirect to patient login
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (!patientData) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏥</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Portal</h1>
                <p className="text-sm text-gray-600">Ayurvedic Diet Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side - Logo and Patient Info */}
          <div className="flex items-center gap-4">
            <div className="text-3xl">🏥</div>
            <div>
              <h1 className="text-xl font-bold">Welcome back, {patientData.name}!</h1>
              <div className="flex items-center gap-4 text-green-100 text-sm">
                <span>ID: {patientData.loginId}</span>
                <span>•</span>
                <span>🕐 {formatTime(currentTime)}</span>
                <span>•</span>
                <span>📅 {formatDate(currentTime)}</span>
              </div>
            </div>
          </div>

          {/* Right Side - User Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Info */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-green-100">Last Login</div>
                <div className="font-medium">
                  {patientData.lastLogin 
                    ? new Date(patientData.lastLogin).toLocaleDateString() 
                    : 'First time'
                  }
                </div>
              </div>
              <div className="w-px h-8 bg-green-300"></div>
              <div className="text-center">
                <div className="text-green-100">Status</div>
                <div className="font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                  Active
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* Quick Navigation (Optional) */}
        <div className="mt-4 pt-4 border-t border-green-400 hidden lg:block">
          <div className="flex items-center gap-6">
            <button className="text-green-100 hover:text-white transition-colors text-sm flex items-center gap-2">
              <span>🍽️</span>
              Diet Charts
            </button>
            <button className="text-green-100 hover:text-white transition-colors text-sm flex items-center gap-2">
              <span>📊</span>
              Progress
            </button>
            <button className="text-green-100 hover:text-white transition-colors text-sm flex items-center gap-2">
              <span>💡</span>
              Tips
            </button>
            <button className="text-green-100 hover:text-white transition-colors text-sm flex items-center gap-2">
              <span>📞</span>
              Contact Doctor
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default PatientHeader