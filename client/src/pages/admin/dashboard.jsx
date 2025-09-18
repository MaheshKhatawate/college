import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import Chart from "../../components/ui/chart"
import { useGetPatientsQuery } from "../../store/apiSlice"

function Dashboard() {
  // Fetch patients data from API using RTK Query
  const { data: patientsData, isLoading, error } = useGetPatientsQuery()
  const patients = patientsData?.patients || []

  // Calculate statistics from real API data
  const stats = useMemo(() => {
    if (!patients.length) {
      return { 
        total: 0, 
        avgAge: 0, 
        byPrakriti: {}, 
        byAgni: {},
        withDietCharts: 0,
        recentPatients: 0
      }
    }

    const total = patients.length
    const avgAge = total ? Math.round((patients.reduce((s, p) => s + (Number(p.age) || 0), 0) / total) * 10) / 10 : 0
    
    // Group by Prakriti
    const byPrakriti = patients.reduce((acc, p) => { 
      const k = p.dominantPrakriti || "Unknown"
      acc[k] = (acc[k] || 0) + 1
      return acc 
    }, {})
    
    // Group by Agni
    const byAgni = patients.reduce((acc, p) => { 
      const k = p.agni || "Unknown"
      acc[k] = (acc[k] || 0) + 1
      return acc 
    }, {})

    // Count patients with diet charts
    const withDietCharts = patients.filter(p => p.dietCharts && p.dietCharts.length > 0).length

    // Count patients added in last 7 days
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const recentPatients = patients.filter(p => new Date(p.createdAt) > weekAgo).length

    return { total, avgAge, byPrakriti, byAgni, withDietCharts, recentPatients }
  }, [patients])

  // Generate chart data
  const chartData = useMemo(() => ([
    {
      type: "bar",
      title: "Patients by Prakriti (Constitution)",
      data: Object.entries(stats.byPrakriti).map(([key, value]) => ({
        label: key,
        value,
        color: key === "Vata" ? "#8b5cf6" : key === "Pitta" ? "#ef4444" : key === "Kapha" ? "#10b981" : "#6b7280"
      }))
    },
    {
      type: "bar", 
      title: "Patients by Agni (Digestive Fire)",
      data: Object.entries(stats.byAgni).map(([key, value]) => ({
        label: key,
        value,
        color: key === "Mandya" ? "#ef4444" : key === "Madhyama" ? "#f59e0b" : key === "Tikshna" ? "#10b981" : "#6b7280"
      }))
    }
  ]), [stats])

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader><div className="h-4 bg-gray-200 rounded w-3/4"></div></CardHeader>
              <CardContent><div className="h-8 bg-gray-200 rounded w-1/2"></div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-sm text-red-600">Error loading dashboard data. Please check your connection.</p>
        </div>
      </div>
    )
  }

  return (
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">
            Real-time metrics from your Ayurveda clinic database. Manage patients under Patients section.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-blue-100 mt-1">Registered in system</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">With Diet Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.withDietCharts}</div>
              <p className="text-xs text-green-100 mt-1">
                {stats.total > 0 ? Math.round((stats.withDietCharts / stats.total) * 100) : 0}% coverage
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Average Age</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avgAge}</div>
              <p className="text-xs text-purple-100 mt-1">Years old</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">New This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.recentPatients}</div>
              <p className="text-xs text-orange-100 mt-1">Recent registrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        {stats.total > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartData.map((chart, i) => (
              <Card key={i} className="p-4">
                <Chart data={chart.data} type={chart.type} title={chart.title} />
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">👩‍⚕️</div>
              <h3 className="text-lg font-semibold mb-2">Welcome to Your Ayurveda Clinic Dashboard</h3>
              <p className="text-gray-600 mb-4">
                You haven't added any patients yet. Start by adding your first patient to see dashboard analytics.
              </p>
              <button 
                onClick={() => window.location.href = '/admin/patients'}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Your First Patient
              </button>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/patients'}>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold">Manage Patients</h3>
                <p className="text-sm text-gray-600">Add, edit, and view patient records</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/patients'}>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="font-semibold">Diet Charts</h3>
                <p className="text-sm text-gray-600">Generate personalized diet plans</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-gray-600">View patient statistics and trends</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
  )
}

export default Dashboard