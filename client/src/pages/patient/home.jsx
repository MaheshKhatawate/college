import React from 'react'
import PatientLogin from './login'
import PatientDashboard from './dashboard'
import SessionWarning from './session-warning'
import { useAuth } from '../../lib/auth'

export const PatientHome = () => {
    const { 
        isAuthenticated, 
        patientData, 
        isLoading, 
        sessionWarning, 
        login, 
        logout, 
        extendSession 
    } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
                        <p className="text-gray-700">Loading your account...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {!isAuthenticated ? (
                <PatientLogin onLoginSuccess={login} />
            ) : (
                <PatientDashboard patient={patientData} onLogout={logout} />
            )}
            
            {/* Session Warning Modal */}
            {sessionWarning && (
                <SessionWarning 
                    minutesRemaining={sessionWarning}
                    onExtend={extendSession}
                    onLogout={logout}
                />
            )}
        </>
    )
}
