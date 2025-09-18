import React from 'react'

const PatientFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏥</span>
              <h3 className="text-lg font-semibold">Patient Portal</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your personalized Ayurvedic diet management system. 
              Access your custom diet charts and track your wellness journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span>🍽️</span> My Diet Charts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span>📊</span> Health Progress
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span>💡</span> Wellness Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span>📞</span> Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Health Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Health Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span>🕉️</span> Ayurvedic Principles
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span>🥗</span> Nutrition Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span>🧘</span> Wellness Practices
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span>📚</span> Health Library
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-400">Support & Emergency</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Emergency Contact:</p>
                <p className="text-white font-medium">📞 +1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Support Email:</p>
                <p className="text-white font-medium">📧 support@ayurveda.com</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Hours:</p>
                <p className="text-white font-medium">🕒 24/7 Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Important Notes */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
            <span>⚠️</span> Important Health Information
          </h4>
          <div className="text-yellow-100 text-sm space-y-1">
            <p>• Always consult your healthcare provider before making major dietary changes</p>
            <p>• Your diet charts are personalized based on your individual constitution (Prakriti)</p>
            <p>• In case of allergic reactions or adverse effects, contact your doctor immediately</p>
            <p>• Keep your login credentials secure and do not share them with others</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-700">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            <p>© {currentYear} Ayurvedic Diet Management System. All rights reserved.</p>
            <p className="mt-1">Designed with care for your wellness journey.</p>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Help Center
            </a>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
            <span>🔒</span>
            <span>Your health information is encrypted and secure</span>
            <span>•</span>
            <span>Session expires automatically for your protection</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PatientFooter