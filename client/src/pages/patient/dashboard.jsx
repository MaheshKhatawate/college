import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { useGetPatientDietChartsQuery } from "../../store/apiSlice"
import { TokenManager } from '../../lib/auth'
import DietChartModal from './diet-chart-modal'

function PatientDashboard({ patient, onLogout }) {
  const [selectedChart, setSelectedChart] = useState(null)
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  const { data: dietChartsData, isLoading, error } = useGetPatientDietChartsQuery(undefined, {
    skip: !isReady // Skip query until ready
  })
  const dietCharts = dietChartsData?.patient?.dietCharts || []

  async function downloadChart(index, format) {
    try {
      const authHeaders = TokenManager.getAuthHeader()
      const endpoint = format === 'pdf' ? 'download-pdf' : 'download-image'
      
      const response = await fetch(`http://localhost:5000/api/download/${endpoint}/${index}`, {
        headers: authHeaders
      })

      if (response.status === 401) {
        // Token expired
        TokenManager.clearAll()
        onLogout()
        return
      }

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `diet-chart-${patient.name.replace(/\s+/g, '-')}-${index + 1}.${format === 'pdf' ? 'pdf' : 'jpg'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error(`Download failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error downloading chart:', error)
      alert('Failed to download chart. Please try again.')
    }
  }

  // Check if token is about to expire
  const shouldShowTokenWarning = TokenManager.shouldRefreshToken()
  const tokenExpiry = TokenManager.getTokenExpiry()

  if (error) {
    // Don't show error immediately if we're still setting up
    if (!isReady) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
              <p className="text-gray-700">Setting up your dashboard...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">
              {error?.status === 401 
                ? 'Authentication error. Please try logging in again.' 
                : error?.data?.message || 'Failed to load your information. Please try again.'}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              {error?.status === 401 && (
                <button
                  onClick={onLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Login Again
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {patient.name}!</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Patient ID: {patient.loginId}</span>
                {tokenExpiry && (
                  <>
                    <span>•</span>
                    <span className={`${shouldShowTokenWarning ? 'text-yellow-600 font-medium' : ''}`}>
                      Session expires: {tokenExpiry.toLocaleTimeString()}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Token Warning Banner */}
      {shouldShowTokenWarning && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">⏰</span>
                <span className="text-yellow-800 text-sm font-medium">
                  Your session will expire soon. Activity will extend your session automatically.
                </span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-yellow-800 text-sm underline hover:no-underline"
              >
                Refresh Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Patient Info Card */}
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Health Profile</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-green-100 text-sm">Last Login</p>
                  <p className="font-medium">{patient.lastLogin ? new Date(patient.lastLogin).toLocaleDateString() : 'First time'}</p>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Total Diet Charts</p>
                  <p className="font-medium">{dietCharts.length}</p>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Latest Update</p>
                  <p className="font-medium">{dietCharts.length > 0 ? new Date(dietCharts[dietCharts.length - 1].date).toLocaleDateString() : 'None'}</p>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Status</p>
                  <p className="font-medium flex items-center justify-center gap-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                    Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diet Charts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🍽️ Your Diet Charts
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">{dietCharts.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your diet charts...</p>
                </div>
              ) : dietCharts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-600">No diet charts available yet.</p>
                  <p className="text-sm text-gray-500 mt-2">Contact your doctor to get your personalized diet plan.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dietCharts.map((chart, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Diet Chart #{index + 1}</h3>
                          <p className="text-xs text-gray-500">{new Date(chart.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div>
                          <span className="font-medium text-orange-600">Breakfast:</span>
                          <span className="text-gray-600 ml-1">{chart.diet.breakfast.slice(0, 1).join(', ')}{chart.diet.breakfast.length > 1 ? '...' : ''}</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">Lunch:</span>
                          <span className="text-gray-600 ml-1">{chart.diet.lunch.slice(0, 1).join(', ')}{chart.diet.lunch.length > 1 ? '...' : ''}</span>
                        </div>
                        <div>
                          <span className="font-medium text-purple-600">Dinner:</span>
                          <span className="text-gray-600 ml-1">{chart.diet.dinner.slice(0, 1).join(', ')}{chart.diet.dinner.length > 1 ? '...' : ''}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedChart({ chart, index })}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => downloadChart(index, 'pdf')}
                          className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors font-medium"
                          title="Download as PDF"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => downloadChart(index, 'image')}
                          className="bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors font-medium"
                          title="Download as Image"
                        >
                          IMG
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl mb-2">📞</div>
                  <h3 className="font-medium">Contact Doctor</h3>
                  <p className="text-sm text-gray-600">Get in touch with your healthcare provider</p>
                </button>
                <button className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-medium">Health Progress</h3>
                  <p className="text-sm text-gray-600">Track your health improvements</p>
                </button>
                <button className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl mb-2">💡</div>
                  <h3 className="font-medium">Tips & Guidelines</h3>
                  <p className="text-sm text-gray-600">Learn about healthy eating</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diet Chart Detail Modal */}
      {selectedChart && (
        <DietChartModal
          chart={selectedChart.chart}
          index={selectedChart.index}
          onClose={() => setSelectedChart(null)}
          onDownload={downloadChart}
        />
      )}
    </div>
  )
}

export default PatientDashboard