import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"

function PatientLogin({ onLoginSuccess }) {
  const [form, setForm] = useState({
    loginId: "",
    password: ""
  })
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)
    
    if (!form.loginId || !form.password) {
      setErrors(['Please enter both Login ID and Password'])
      setIsLoading(false)
      return
    }

    if (form.loginId.length < 6) {
      setErrors(['Login ID must be at least 6 characters long'])
      setIsLoading(false)
      return
    }

    try {
      console.log('Attempting login with:', { loginId: form.loginId })
      
      // Use direct fetch to avoid any RTK Query interference
      const response = await fetch('http://localhost:5000/api/patient/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: form.loginId,
          password: form.password
        })
      })

      const result = await response.json()
      console.log('Login response:', result)
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`)
      }
      
      if (result.success && result.token && result.patient) {
        console.log('Login successful, calling onLoginSuccess')
        // Call the success callback
        onLoginSuccess(result.token, result.patient)
        
        // Clear form
        setForm({ loginId: "", password: "" })
      } else {
        setErrors(['Invalid response from server. Please try again.'])
        console.error('Invalid login response:', result)
      }
    } catch (error) {
      console.error('Login error details:', error)
      
      let errorMessages = []
      
      // Check for network errors
      if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        errorMessages.push('Cannot connect to server. Please ensure the server is running on http://localhost:5000')
      }
      // Check for specific error messages
      else if (error.message.includes('Invalid login credentials')) {
        errorMessages.push('Invalid login credentials. Please check your Login ID and password.')
      }
      else if (error.message.includes('Login ID and password are required')) {
        errorMessages.push('Please enter both Login ID and Password.')
      }
      // Generic server error
      else if (error.message.includes('HTTP 500')) {
        errorMessages.push('Server error. Please try again later or contact support.')
      }
      // Generic fallback
      else {
        errorMessages.push(error.message || 'Login failed. Please check your credentials and try again.')
      }
      
      setErrors(errorMessages)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <div className="mb-4">
              <div className="text-4xl">🏥</div>
            </div>
            <CardTitle className="text-2xl font-bold">Patient Portal</CardTitle>
            <p className="text-green-100">Access Your Personalized Diet Chart</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login ID *
                </label>
                <Input
                  name="loginId"
                  value={form.loginId}
                  onChange={handleChange}
                  placeholder="Enter your Login ID (e.g., PAT123456789)"
                  className="text-center text-lg tracking-wider border-2 focus:border-green-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="text-center text-lg tracking-wider border-2 focus:border-green-500 transition-colors"
                  disabled={isLoading}
                />
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="text-sm text-red-600 space-y-1">
                    {errors.map((error, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-red-500">⚠️</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !form.loginId || !form.password}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Authenticating...
                  </span>
                ) : (
                  'Login to Your Account'
                )}
              </button>
            </form>

            <div className="mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = '/main/home'
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 cursor-pointer"
              >
                🏠 Back to Home
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <span className="font-medium">Need Help?</span>
                </div>
                <p>Your login credentials were provided by your doctor</p>
                <p className="mt-2">Having trouble? Contact your healthcare provider</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">What you can do:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• View your personalized diet charts</li>
                  <li>• Download charts as PDF or image</li>
                  <li>• Track your health progress</li>
                  <li>• Access Ayurvedic recommendations</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Troubleshooting:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>1. Ensure your Login ID starts with "PAT" and has 12 characters total</li>
                  <li>2. Password is exactly 8 characters (case-sensitive alphanumeric)</li>
                  <li>3. Contact your doctor if credentials don't work</li>
                  <li>4. Make sure the server is running if you get connection errors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
              <p className="text-gray-700">Authenticating your credentials...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientLogin