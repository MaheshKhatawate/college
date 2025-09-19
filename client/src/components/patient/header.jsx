import React, { useState, useEffect } from 'react'
import AyurvedaChat from '../../pages/patient/AyurvedaChat'

const PatientHeader = ({ patient }) => {
  const [patientData, setPatientData] = useState(patient || null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    // Use prop if available, otherwise get from localStorage
    if (patient) {
      setPatientData(patient)
    } else {
      const patientInfo = localStorage.getItem('patientInfo')
      if (patientInfo) {
        try {
          setPatientData(JSON.parse(patientInfo))
        } catch (error) {
          console.error('Error parsing patient data:', error)
        }
      }
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [patient])

  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem('patientToken')
    localStorage.removeItem('patientInfo')
    window.location.href = '/patient' // Redirect to patient login
  }

  const toggleChatbot = (e) => {
    e.preventDefault()
    setShowChatbot(!showChatbot)
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
            {/* Chatbot Button - Even when patient data is not loaded */}
            <button
              onClick={toggleChatbot}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              title="Open Ayurveda Chatbot"
            >
              <span>🤖</span>
              <span className="hidden sm:inline">Ayurveda Chat</span>
            </button>
          </div>
        </div>
        
        {/* Chatbot Modal */}
        {showChatbot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-green-600 text-white">
                <h2 className="text-xl font-bold">Ayurveda Chatbot</h2>
                <button
                  onClick={toggleChatbot}
                  className="text-white hover:text-green-200 text-2xl cursor-pointer"
                  title="Close Chatbot"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <AyurvedaChat />
              </div>
            </div>
          </div>
        )}
      </header>
    )
  }

  return (
    <>
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
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">🕐 {formatTime(currentTime)}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline">📅 {formatDate(currentTime)}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Chatbot Button */}
              <button
                onClick={toggleChatbot}
                className="bg-green-700 hover:bg-green-800 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer shadow-md"
                title="Open Ayurveda Chatbot"
              >
                <span>🤖</span>
                <span className="hidden sm:inline">Ayurveda Chat</span>
              </button>

              {/* Quick Info - Desktop */}
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
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer shadow-md"
                title="Logout"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Quick Info - Mobile */}
          <div className="md:hidden mt-4 pt-4 border-t border-green-400 flex justify-around text-sm">
            <div className="text-center">
              <div className="text-green-100">Last Login</div>
              <div className="font-medium">
                {patientData.lastLogin 
                  ? new Date(patientData.lastLogin).toLocaleDateString() 
                  : 'First time'
                }
              </div>
            </div>
            <div className="text-center">
              <div className="text-green-100">Status</div>
              <div className="font-medium flex items-center gap-1 justify-center">
                <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                Active
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 bg-green-600 text-white">
              <h2 className="text-xl font-bold">Ayurveda Chatbot</h2>
              <button
                onClick={toggleChatbot}
                className="text-white hover:text-green-200 text-2xl cursor-pointer transition-colors"
                title="Close Chatbot"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <AyurvedaChat />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PatientHeader