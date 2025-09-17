import React, { useEffect, useRef } from "react"

const Chart = ({ data, type = "bar", title, className = "" }) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const container = containerRef.current
    const width = container?.clientWidth || 300
    const height = 200
    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    if (data.length === 0) {
      ctx.font = '14px sans-serif'
      ctx.fillStyle = '#666'
      ctx.textAlign = 'center'
      ctx.fillText('No data available', width / 2, height / 2)
      return
    }

    if (type === "bar") {
      // Draw bar chart
      const maxValue = Math.max(...data.map(d => d.value), 1)
      const barWidth = (chartWidth / data.length) * 0.6
      const barSpacing = (chartWidth / data.length) * 0.4

      data.forEach((item, index) => {
        const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
        const barHeight = (item.value / maxValue) * chartHeight
        const y = height - padding - barHeight

        // Draw bar
        ctx.fillStyle = item.color || '#3b82f6'
        ctx.fillRect(x, y, barWidth, barHeight)

        // Draw label
        ctx.font = '10px sans-serif'
        ctx.fillStyle = '#374151'
        ctx.textAlign = 'center'
        ctx.fillText(item.label, x + barWidth / 2, height - padding + 15)

        // Draw value
        ctx.fillStyle = '#1f2937'
        ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5)
      })
    } else if (type === "pie") {
      // Draw pie chart
      const total = data.reduce((sum, item) => sum + item.value, 0)
      let startAngle = 0
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(chartWidth, chartHeight) / 2 - 10

      data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI
        const endAngle = startAngle + sliceAngle

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = item.color || ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][index % 4]
        ctx.fill()

        // Draw label
        const labelAngle = startAngle + sliceAngle / 2
        const labelX = centerX + (radius + 20) * Math.cos(labelAngle)
        const labelY = centerY + (radius + 20) * Math.sin(labelAngle)
        
        ctx.font = '10px sans-serif'
        ctx.fillStyle = '#374151'
        ctx.textAlign = Math.abs(Math.cos(labelAngle)) > 0.5 ? 'center' : (labelX > centerX ? 'left' : 'right')
        ctx.fillText(`${item.label} (${Math.round((item.value / total) * 100)}%)`, labelX, labelY)

        startAngle = endAngle
      })
    }
  }, [data, type])

  return (
    <div ref={containerRef} className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>}
      <canvas ref={canvasRef} className="w-full" style={{ height: '200px' }} />
    </div>
  )
}

export default Chart