import React, { useState, useEffect } from 'react'

const SessionWarning = ({ minutesRemaining, onExtend, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(minutesRemaining)

  useEffect(() => {
    setTimeLeft(minutesRemaining)
  }, [minutesRemaining])

  useEffect(() => {
    if (timeLeft <= 0) {
      onLogout()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onLogout()
          return 0
        }
        return prev - 1
      })
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [timeLeft, onLogout])

  const handleExtend = () => {
    onExtend()
  }

  const handleLogoutNow = () => {
    onLogout()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Warning Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">⏰</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Session Expiring Soon
          </h3>

          {/* Warning Message */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-3">
              Your session will expire in{' '}
              <span className="font-bold text-red-600">
                {timeLeft} minute{timeLeft !== 1 ? 's' : ''}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              For your security, you will be automatically logged out if no action is taken.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.max(0, (timeLeft / 15) * 100)}%` // Assuming 15 minutes total warning time
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Session ending</span>
              <span>{timeLeft} min left</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleExtend}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Continue Session
            </button>
            <button
              onClick={handleLogoutNow}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Logout Now
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-sm">🔒</span>
              <p className="text-xs text-blue-700">
                <strong>Security Note:</strong> We automatically log you out to protect your health information. 
                Click "Continue Session" to stay logged in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionWarning