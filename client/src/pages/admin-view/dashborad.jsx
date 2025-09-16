import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import Chart from "../../components/ui/chart"
import { cn } from "../../lib/utils"

function Dashboard() {
  const emptyForm = useMemo(() => ({
    name: "",
    age: "",
    gender: "",
    dominantPrakriti: "",
    dosha: "",
    lifestyle: "",
    existingDisease: "",
    bp: "",
    weight: "",
    agni: "",
    dietCharts: [] // Array to store diet chart history
  }), [])

  const [patients, setPatients] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState("name")
  const [sortDir, setSortDir] = useState("asc")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const stored = localStorage.getItem("patients")
    if (stored) {
      try { 
        setPatients(JSON.parse(stored)) 
      } catch {} 
    }
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients))
  }, [patients])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setErrors([])
  }

  function generateDietChart(patient) {
    const date = new Date().toISOString()
    const baseDiet = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
      restrictions: [],
      recommendations: []
    }

    // Generate diet recommendations based on prakriti
    switch (patient.dominantPrakriti) {
      case "Vata":
        baseDiet.breakfast = ["Warm oatmeal with nuts", "Hot milk with turmeric", "Stewed fruits"]
        baseDiet.lunch = ["Warm rice", "Yellow dal", "Cooked vegetables", "Ghee"]
        baseDiet.dinner = ["Vegetable soup", "Whole grain bread", "Light curry"]
        baseDiet.snacks = ["Soaked almonds", "Warm herbal tea", "Dates"]
        baseDiet.restrictions = ["Cold foods", "Raw vegetables", "Carbonated drinks"]
        baseDiet.recommendations = ["Eat warm foods", "Regular meal times", "Include healthy fats"]
        break
      case "Pitta":
        baseDiet.breakfast = ["Sweet fruits", "Coconut water", "Wheat porridge"]
        baseDiet.lunch = ["Basmati rice", "Green vegetables", "Cucumber salad"]
        baseDiet.dinner = ["Light khichdi", "Cooling vegetables", "Buttermilk"]
        baseDiet.snacks = ["Fresh fruits", "Coconut pieces", "Rose tea"]
        baseDiet.restrictions = ["Spicy foods", "Fermented foods", "Excessive salt"]
        baseDiet.recommendations = ["Cool or room temperature foods", "Light meals", "Avoid skipping meals"]
        break
      case "Kapha":
        baseDiet.breakfast = ["Light fruits", "Dry toast", "Green tea"]
        baseDiet.lunch = ["Quinoa", "Steamed vegetables", "Lentil soup"]
        baseDiet.dinner = ["Millet roti", "Grilled vegetables", "Clear soup"]
        baseDiet.snacks = ["Roasted seeds", "Spiced tea", "Apple"]
        baseDiet.restrictions = ["Heavy dairy", "Fried foods", "Excessive sweets"]
        baseDiet.recommendations = ["Light and dry foods", "Warm foods", "Exercise before meals"]
        break
      default:
        baseDiet.recommendations = ["Please consult for personalized diet plan"]
    }

    // Adjust based on Agni (digestion power)
    if (patient.agni === "Mandya") {
      baseDiet.recommendations.push("Small, frequent meals", "Easy to digest foods", "Avoid heavy foods")
    } else if (patient.agni === "Tikshna") {
      baseDiet.recommendations.push("Regular sized meals", "Include cooling foods", "Avoid excessive spices")
    }

    return {
      date,
      diet: baseDiet,
      notes: `Diet chart generated for ${patient.name} based on ${patient.dominantPrakriti} prakriti and ${patient.agni} agni.`
    }
  }

  function validateForm(current) {
    const newErrors = []
    if (!current.name || current.name.trim().length < 2) { newErrors.push("Name is required (min 2 chars)") }
    if (current.age && isNaN(Number(current.age))) { newErrors.push("Age must be a number") }
    if (current.weight && isNaN(Number(current.weight))) { newErrors.push("Weight must be a number") }
    if (current.bp && !/^\d{2,3}\/\d{2,3}$/.test(current.bp.trim())) { newErrors.push("BP must be like 120/80") }
    if (!current.gender) { newErrors.push("Gender is required") }
    if (!current.dominantPrakriti) { newErrors.push("Dominant Prakriti is required") }
    if (!current.agni) { newErrors.push("Agni is required") }
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const v = validateForm(form)
    setErrors(v)
    if (v.length) { return }
    
    setIsLoading(true)
    setTimeout(() => {
      if (editingId !== null) {
        setPatients(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p))
        setMessage("Patient updated successfully")
        resetForm()
      } else {
        const newPatient = { id: Date.now(), ...form }
        setPatients(prev => [newPatient, ...prev])
        setMessage("Patient added successfully")
        resetForm()
      }
      setIsLoading(false)
    }, 300)
  }

  function handleEdit(id) {
    const patient = patients.find(p => p.id === id)
    if (!patient) return
    setForm({
      name: patient.name ?? "",
      age: patient.age ?? "",
      gender: patient.gender ?? "",
      dominantPrakriti: patient.dominantPrakriti ?? "",
      dosha: patient.dosha ?? "",
      lifestyle: patient.lifestyle ?? "",
      existingDisease: patient.existingDisease ?? "",
      bp: patient.bp ?? "",
      weight: patient.weight ?? "",
      agni: patient.agni ?? ""
    })
    setEditingId(id)
    setActiveTab("add")
  }

  function handleDelete(id) {
    setIsLoading(true)
    setTimeout(() => {
      setPatients(prev => prev.filter(p => p.id !== id))
      if (editingId === id) { resetForm() }
      setMessage("Patient deleted successfully")
      setIsLoading(false)
    }, 300)
  }

  function handleGenerateDietChart(patient) {
    setIsLoading(true)
    setTimeout(() => {
      const newDietChart = generateDietChart(patient)
      setPatients(prev => prev.map(p => {
        if (p.id === patient.id) {
          const updatedDietCharts = [...(p.dietCharts || []), newDietChart]
          return { ...p, dietCharts: updatedDietCharts }
        }
        return p
      }))
      setMessage(`Diet chart generated for ${patient.name}`)
      setIsLoading(false)
    }, 300)
  }

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showDietModal, setShowDietModal] = useState(false)

  const [editingDietChart, setEditingDietChart] = useState(null)

  function handleViewDietCharts(patient) {
    setSelectedPatient(patient)
    setShowDietModal(true)
    setEditingDietChart(null)
  }

  function handleEditDietChart(chart, index) {
    setEditingDietChart({ ...chart, index })
  }

  function handleUpdateDietChart(updatedChart) {
    setIsLoading(true)
    setTimeout(() => {
      setPatients(prev => prev.map(p => {
        if (p.id === selectedPatient.id) {
          const updatedDietCharts = [...p.dietCharts]
          updatedDietCharts[editingDietChart.index] = {
            ...updatedChart,
            date: editingDietChart.date // preserve original date
          }
          return { ...p, dietCharts: updatedDietCharts }
        }
        return p
      }))
      setMessage("Diet chart updated successfully")
      setEditingDietChart(null)
      setIsLoading(false)
    }, 300)
  }

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q ? patients.filter(p => (
      (p.name || "").toLowerCase().includes(q) ||
      (p.gender || "").toLowerCase().includes(q) ||
      (p.dominantPrakriti || "").toLowerCase().includes(q) ||
      (p.dosha || "").toLowerCase().includes(q) ||
      (p.existingDisease || "").toLowerCase().includes(q)
    )) : [...patients]
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const av = (a[sortKey] ?? "").toString().toLowerCase()
      const bv = (b[sortKey] ?? "").toString().toLowerCase()
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return list
  }, [patients, search, sortKey, sortDir])

  const stats = useMemo(() => {
    const total = patients.length
    const avgAge = total ? Math.round((patients.reduce((s, p) => s + (Number(p.age) || 0), 0) / total) * 10) / 10 : 0
    const byPrakriti = patients.reduce((acc, p) => { const k = p.dominantPrakriti || "Unknown"; acc[k] = (acc[k] || 0) + 1; return acc }, {})
    const byGender = patients.reduce((acc, p) => { const k = p.gender || "Unknown"; acc[k] = (acc[k] || 0) + 1; return acc }, {})
    const byAgni = patients.reduce((acc, p) => { const k = p.agni || "Unknown"; acc[k] = (acc[k] || 0) + 1; return acc }, {})
    
    return { total, avgAge, byPrakriti, byGender, byAgni }
  }, [patients])

  const chartData = useMemo(() => {
    return [
      {
        type: "bar",
        title: "Patients by Prakriti",
        data: Object.entries(stats.byPrakriti).map(([key, value]) => ({
          label: key,
          value: value,
          color: key === "Vata" ? "#8b5cf6" : key === "Pitta" ? "#ef4444" : key === "Kapha" ? "#10b981" : "#6b7280"
        }))
      },
      {
        type: "pie",
        title: "Gender Distribution",
        data: Object.entries(stats.byGender).map(([key, value]) => ({
          label: key,
          value: value,
          color: key === "Male" ? "#3b82f6" : key === "Female" ? "#ec4899" : "#6b7280"
        }))
      },
      {
        type: "bar",
        title: "Digestion Power (Agni)",
        data: Object.entries(stats.byAgni).map(([key, value]) => ({
          label: key,
          value: value,
          color: key === "Mandya" ? "#ef4444" : key === "Madhyama" ? "#f59e0b" : key === "Tikshna" ? "#10b981" : "#6b7280"
        }))
      }
    ]
  }, [stats])

  function SortHeader({ label, keyName }) {
    const isActive = sortKey === keyName
    return (
      <button
        onClick={() => { setSortKey(keyName); setSortDir(prev => (isActive ? (prev === "asc" ? "desc" : "asc") : "asc")) }}
        className="bg-transparent border-none cursor-pointer font-medium hover:text-blue-600 transition-colors"
      >
        {label}{isActive ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
      </button>
    )
  }

  const getPrakritiColor = (prakriti) => {
    switch (prakriti) {
      case "Vata": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Pitta": return "bg-red-100 text-red-800 border-red-200"
      case "Kapha": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAgniColor = (agni) => {
    switch (agni) {
      case "Mandya": return "bg-red-100 text-red-800 border-red-200"
      case "Madhyama": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Tikshna": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto p-6">
        <div className="mb-8 transform transition-all duration-500 hover:translate-y-[-4px] hover:scale-[1.02]">
          <div className="relative">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2 animate-gradient-x">
              Doctor Dashboard
            </h1>
            <div className="absolute -inset-x-6 -inset-y-4 bg-white/50 backdrop-blur-lg rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </div>
          <p className="text-gray-600 text-lg">Manage your patients and track health statistics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-8 p-1.5 bg-white/50 backdrop-blur-sm rounded-xl shadow-inner">
          {["overview", "add", "list", "stats"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-lg border transition-all duration-300 font-medium relative overflow-hidden group",
                activeTab === tab
                  ? "border-blue-600 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md scale-105"
                  : "border-transparent bg-white/80 text-gray-700 hover:bg-white hover:-translate-y-0.5 hover:shadow-md"
              )}
            >
              <span className={cn(
                "absolute inset-0 w-full h-full transition-all duration-300 transform",
                activeTab === tab ? "scale-100" : "scale-0"
              )}>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-gradient"></span>
              </span>
              <span className="relative">
                {tab === "overview" ? "Overview" : tab === "add" ? "Add Patient" : tab === "list" ? "Patient List" : "Statistics"}
              </span>
            </button>
          ))}
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 text-emerald-900 flex items-center justify-between shadow-lg transform transition-all duration-500 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="font-medium">{message}</span>
            </div>
            <button 
              onClick={() => setMessage("")} 
              className="text-emerald-700 hover:text-emerald-900 transition-colors p-1 hover:bg-emerald-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 scale-95 animate-in">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-purple-400 border-t-transparent animate-spin-slow"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium text-center animate-pulse">Loading...</p>
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg">
              <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-blue-600">Total Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 transition-all duration-300 transform group-hover:scale-110">{stats.total}</div>
                  <p className="text-sm text-blue-600/70 mt-1">Registered patients</p>
                </CardContent>
              </Card>
            </div>

            <div className="transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg">
              <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-purple-600">Average Age</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">{stats.avgAge}</div>
                  <p className="text-sm text-purple-600/70 mt-1">Years</p>
                </CardContent>
              </Card>
            </div>

            <div className="transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg">
              <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-emerald-600">Most Common Prakriti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-900">
                    {Object.entries(stats.byPrakriti).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
                  </div>
                  <p className="text-sm text-emerald-600/70 mt-1">Dominant type</p>
                </CardContent>
              </Card>
            </div>

            <div className="transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg">
              <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-amber-600">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-amber-900">{patients.length > 0 ? "Active" : "No data"}</div>
                  <p className="text-sm text-amber-600/70 mt-1">Last updated: Today</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId !== null ? "Edit Patient" : "Add New Patient"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-blue-600">Name *</label>
                  <Input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Full name"
                    className="transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-300 bg-white/70 backdrop-blur-sm"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-blue-600">Age</label>
                  <Input 
                    name="age" 
                    value={form.age} 
                    onChange={handleChange} 
                    placeholder="e.g., 35" 
                    type="number"
                    className="transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-300 bg-white/70 backdrop-blur-sm"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-blue-600">Gender *</label>
                  <select 
                    name="gender" 
                    value={form.gender} 
                    onChange={handleChange} 
                    className="w-full rounded-lg border border-gray-200 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dominant Prakriti *</label>
                  <select name="dominantPrakriti" value={form.dominantPrakriti} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select prakriti</option>
                    <option value="Vata">Vata</option>
                    <option value="Pitta">Pitta</option>
                    <option value="Kapha">Kapha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dosha</label>
                  <Input name="dosha" value={form.dosha} onChange={handleChange} placeholder="Primary imbalance" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lifestyle</label>
                  <Input name="lifestyle" value={form.lifestyle} onChange={handleChange} placeholder="Diet, sleep, activity" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Existing Disease</label>
                  <Input name="existingDisease" value={form.existingDisease} onChange={handleChange} placeholder="Comorbidities" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BP</label>
                  <Input name="bp" value={form.bp} onChange={handleChange} placeholder="120/80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <Input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g., 70" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agni (digestion power) *</label>
                  <select name="agni" value={form.agni} onChange={handleChange} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select agni</option>
                    <option value="Mandya">Mandya (low)</option>
                    <option value="Madhyama">Madhyama (moderate)</option>
                    <option value="Tikshna">Tikshna (sharp)</option>
                  </select>
                </div>
                <div className="md:col-span-3 flex items-center gap-4 pt-4">
                  <button type="submit" className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    {editingId !== null ? "Update" : "Add"} Patient
                  </button>
                  {editingId !== null && (
                    <button type="button" onClick={resetForm} className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5">
                      Cancel Edit
                    </button>
                  )}
                  {errors.length > 0 && (
                    <div className="ml-4">
                      <ul className="list-disc text-sm text-red-600">
                        {errors.map((err, idx) => (<li key={idx}>{err}</li>))}
                      </ul>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "list" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, gender, prakriti, dosha..." className="flex-1" />
                  <span className="text-sm text-gray-600">{filteredSorted.length} patients found</span>
                </div>

                {filteredSorted.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-lg">No patients found</p>
                    <p className="text-sm">Try adjusting your search or add a new patient</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:text-gray-700"><SortHeader label="Name" keyName="name" /></th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:text-gray-700"><SortHeader label="Age" keyName="age" /></th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:text-gray-700"><SortHeader label="Gender" keyName="gender" /></th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:text-gray-700"><SortHeader label="Prakriti" keyName="dominantPrakriti" /></th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:text-gray-700"><SortHeader label="Agni" keyName="agni" /></th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors hover:text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSorted.map(p => (
                          <tr key={p.id} className="hover:bg-blue-50/50 transition-all duration-200 hover:shadow-md group">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{p.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 group-hover:text-gray-900 transition-colors">{p.age}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 group-hover:text-gray-900 transition-colors">{p.gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 transform group-hover:scale-105 ${getPrakritiColor(p.dominantPrakriti)}`}>
                                {p.dominantPrakriti}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 transform group-hover:scale-105 ${getAgniColor(p.agni)}`}>
                                {p.agni}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleEdit(p.id)} 
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-3 transition-all duration-200 hover:scale-105"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                Edit
                              </button>
                              <button 
                                onClick={() => handleGenerateDietChart(p)} 
                                className="inline-flex items-center text-emerald-600 hover:text-emerald-800 mr-3 transition-all duration-200 hover:scale-105"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                                Generate Diet
                              </button>
                              <button 
                                onClick={() => handleViewDietCharts(p)} 
                                className="inline-flex items-center text-purple-600 hover:text-purple-800 mr-3 transition-all duration-200 hover:scale-105"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                View History
                                {p.dietCharts?.length > 0 && (
                                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600">
                                    {p.dietCharts.length}
                                  </span>
                                )}
                              </button>
                              <button 
                                onClick={() => handleDelete(p.id)} 
                                className="inline-flex items-center text-red-600 hover:text-red-800 transition-all duration-200 hover:scale-105"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chartData.map((chart, index) => (
                <Chart key={index} data={chart.data} type={chart.type} title={chart.title} />
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Prakriti Distribution</h4>
                    <ul className="space-y-2">
                      {Object.entries(stats.byPrakriti).map(([prakriti, count]) => (
                        <li key={prakriti} className="flex justify-between items-center">
                          <span className="text-sm">{prakriti}</span>
                          <span className="font-medium">{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Agni Distribution</h4>
                    <ul className="space-y-2">
                      {Object.entries(stats.byAgni).map(([agni, count]) => (
                        <li key={agni} className="flex justify-between items-center">
                          <span className="text-sm">{agni}</span>
                          <span className="font-medium">{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Diet Chart Modal */}
        {showDietModal && selectedPatient && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Diet Chart History - {selectedPatient.name}
                </h3>
                <button 
                  onClick={() => setShowDietModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {selectedPatient.dietCharts?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600">No diet charts generated yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedPatient.dietCharts.slice().reverse().map((chart, index) => (
                    <div key={chart.date} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Diet Chart #{selectedPatient.dietCharts.length - index}</h4>
                          <p className="text-sm text-gray-500">{new Date(chart.date).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleEditDietChart(chart, index)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>

                      {editingDietChart?.index === index ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Breakfast</h5>
                              <textarea
                                value={editingDietChart.diet.breakfast.join('\n')}
                                onChange={(e) => setEditingDietChart(prev => ({
                                  ...prev,
                                  diet: {
                                    ...prev.diet,
                                    breakfast: e.target.value.split('\n').filter(Boolean)
                                  }
                                }))}
                                className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter breakfast items (one per line)"
                              />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Lunch</h5>
                              <textarea
                                value={editingDietChart.diet.lunch.join('\n')}
                                onChange={(e) => setEditingDietChart(prev => ({
                                  ...prev,
                                  diet: {
                                    ...prev.diet,
                                    lunch: e.target.value.split('\n').filter(Boolean)
                                  }
                                }))}
                                className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter lunch items (one per line)"
                              />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Dinner</h5>
                              <textarea
                                value={editingDietChart.diet.dinner.join('\n')}
                                onChange={(e) => setEditingDietChart(prev => ({
                                  ...prev,
                                  diet: {
                                    ...prev.diet,
                                    dinner: e.target.value.split('\n').filter(Boolean)
                                  }
                                }))}
                                className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter dinner items (one per line)"
                              />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Snacks</h5>
                              <textarea
                                value={editingDietChart.diet.snacks.join('\n')}
                                onChange={(e) => setEditingDietChart(prev => ({
                                  ...prev,
                                  diet: {
                                    ...prev.diet,
                                    snacks: e.target.value.split('\n').filter(Boolean)
                                  }
                                }))}
                                className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter snacks (one per line)"
                              />
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Restrictions</h5>
                            <textarea
                              value={editingDietChart.diet.restrictions.join('\n')}
                              onChange={(e) => setEditingDietChart(prev => ({
                                ...prev,
                                diet: {
                                  ...prev.diet,
                                  restrictions: e.target.value.split('\n').filter(Boolean)
                                }
                              }))}
                              className="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                              placeholder="Enter restrictions (one per line)"
                            />
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                            <textarea
                              value={editingDietChart.diet.recommendations.join('\n')}
                              onChange={(e) => setEditingDietChart(prev => ({
                                ...prev,
                                diet: {
                                  ...prev.diet,
                                  recommendations: e.target.value.split('\n').filter(Boolean)
                                }
                              }))}
                              className="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                              placeholder="Enter recommendations (one per line)"
                            />
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                            <textarea
                              value={editingDietChart.notes}
                              onChange={(e) => setEditingDietChart(prev => ({
                                ...prev,
                                notes: e.target.value
                              }))}
                              className="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                              placeholder="Enter notes"
                            />
                          </div>

                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setEditingDietChart(null)}
                              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateDietChart(editingDietChart)}
                              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Breakfast</h5>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {chart.diet.breakfast.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Lunch</h5>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {chart.diet.lunch.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Dinner</h5>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {chart.diet.dinner.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Snacks</h5>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {chart.diet.snacks.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h5 className="font-medium text-gray-900 mb-2">Restrictions</h5>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {chart.diet.restrictions.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {chart.diet.recommendations.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600 italic">{chart.notes}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
