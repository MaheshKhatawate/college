import React from 'react'

function DietChartModal({ chart, index, onClose, onDownload }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleDownload = (format) => {
    onDownload(index, format)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Diet Chart #{index + 1}</h3>
              <p className="text-green-100 text-sm">{new Date(chart.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload('pdf')}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors text-sm font-medium"
              >
                📄 Download PDF
              </button>
              <button
                onClick={() => handleDownload('image')}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-sm font-medium"
              >
                🖼️ Download Image
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-xl font-bold p-2"
                title="Close"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Meal Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Breakfast */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                🌅 Breakfast
              </h4>
              <ul className="space-y-2">
                {chart.diet.breakfast.map((item, i) => (
                  <li key={i} className="text-orange-700 flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lunch */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                ☀️ Lunch
              </h4>
              <ul className="space-y-2">
                {chart.diet.lunch.map((item, i) => (
                  <li key={i} className="text-blue-700 flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dinner */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                🌙 Dinner
              </h4>
              <ul className="space-y-2">
                {chart.diet.dinner.map((item, i) => (
                  <li key={i} className="text-purple-700 flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Snacks */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                🍎 Snacks
              </h4>
              <ul className="space-y-2">
                {chart.diet.snacks.map((item, i) => (
                  <li key={i} className="text-green-700 flex items-start gap-2">
                    <span className="text-green-400 font-bold">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Restrictions and Recommendations */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                🚫 Restrictions
              </h4>
              <ul className="space-y-2">
                {chart.diet.restrictions.map((item, i) => (
                  <li key={i} className="text-red-700 flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-l-4 border-emerald-400">
              <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                ✅ Recommendations
              </h4>
              <ul className="space-y-2">
                {chart.diet.recommendations.map((item, i) => (
                  <li key={i} className="text-emerald-700 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Notes */}
          {chart.notes && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                📝 Additional Notes
              </h4>
              <p className="text-yellow-700 text-sm leading-relaxed">{chart.notes}</p>
            </div>
          )}

          {/* Ayurvedic Information */}
          <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
              🕉️ Ayurvedic Guidelines
            </h4>
            <div className="text-indigo-700 text-sm space-y-2">
              <p>• Follow meal timings as suggested for optimal digestion</p>
              <p>• Drink warm water throughout the day</p>
              <p>• Avoid eating when stressed or in a hurry</p>
              <p>• Chew food thoroughly and eat mindfully</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <p className="text-center text-sm text-gray-600">
            This diet chart is based on Ayurvedic principles and your individual constitution (Prakriti).
            Please consult with your healthcare provider for any specific dietary concerns.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DietChartModal