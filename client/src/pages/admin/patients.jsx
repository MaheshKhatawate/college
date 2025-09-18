import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { cn } from "../../lib/utils"
import { 
  useAddPatientMutation,
  useGetPatientsQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useGenerateDietChartMutation,
  useUpdateDietChartMutation,
  useDeleteDietChartMutation,
  useGetPatientCredentialsMutation
} from "../../store/apiSlice"

function Patients() {
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
    addedBy: "admin" // Default doctor identifier
  }), [])

  // RTK Query hooks
  const { data: patientsData, isLoading: isFetchingPatients, refetch } = useGetPatientsQuery()
  const [addPatient, { isLoading: isAddingPatient }] = useAddPatientMutation()
  const [updatePatient, { isLoading: isUpdatingPatient }] = useUpdatePatientMutation()
  const [deletePatient, { isLoading: isDeletingPatient }] = useDeletePatientMutation()
  const [generateDietChart, { isLoading: isGeneratingDiet }] = useGenerateDietChartMutation()
  const [updateDietChart, { isLoading: isUpdatingDiet }] = useUpdateDietChartMutation()
  const [deleteDietChart, { isLoading: isDeletingDiet }] = useDeleteDietChartMutation()
  const [getPatientCredentials, { isLoading: isGettingCredentials }] = useGetPatientCredentialsMutation()

  const patients = patientsData?.patients || []
  const isLoading = isAddingPatient || isUpdatingPatient || isDeletingPatient || isGeneratingDiet || isUpdatingDiet || isDeletingDiet || isGettingCredentials

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState("add")
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState("name")
  const [sortDir, setSortDir] = useState("asc")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState([])
  const [showCredentials, setShowCredentials] = useState(null) // For showing generated credentials

  function handleChange(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  
  function resetForm(){ 
    setForm(emptyForm); 
    setEditingId(null); 
    setErrors([])
    setShowCredentials(null)
  }

  function validateForm(current){
    const newErrors = []
    if (!current.name || current.name.trim().length < 2) newErrors.push("Name is required (min 2 chars)")
    if (current.age && isNaN(Number(current.age))) newErrors.push("Age must be a number")
    if (current.weight && isNaN(Number(current.weight))) newErrors.push("Weight must be a number")
    if (current.bp && !/^\d{2,3}\/\d{2,3}$/.test(current.bp.trim())) newErrors.push("BP must be like 120/80")
    if (!current.gender) newErrors.push("Gender is required")
    if (!current.dominantPrakriti) newErrors.push("Dominant Prakriti is required")
    if (!current.agni) newErrors.push("Agni is required")
    return newErrors
  }

  async function handleSubmit(e){
    e.preventDefault()
    const v = validateForm(form)
    setErrors(v)
    if (v.length) return
    
    try {
      if (editingId !== null) {
        // Update existing patient
        const result = await updatePatient({ id: editingId, ...form }).unwrap()
        setMessage("Patient updated successfully")
        refetch() // Refresh patient list
        resetForm()
      } else {
        // Add new patient
        const result = await addPatient(form).unwrap()
        console.log('Add patient result:', result) // Debug log
        setMessage("Patient added successfully")
        // Password is actually inside result.patient, not at top level
        setShowCredentials({ 
          ...result.patient,
          _debug: `LoginID: ${result.patient?.loginId}, Password: ${result.patient?.password}` // Debug info
        }) // Show generated credentials with password
        refetch() // Refresh patient list
        resetForm()
      }
    } catch (error) {
      setErrors([error?.data?.message || 'Failed to save patient. Please try again.'])
    }
  }

  function handleEdit(patient){
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
      agni: patient.agni ?? "",
      addedBy: patient.addedBy ?? "admin"
    })
    setEditingId(patient._id)
    setActiveTab("add")
  }

  async function handleDelete(id){
    if (!window.confirm("Are you sure you want to delete this patient?")) return
    
    try {
      await deletePatient(id).unwrap()
      setMessage("Patient deleted successfully")
      if (editingId === id) resetForm()
    } catch (error) {
      setMessage("Failed to delete patient")
    }
  }

  async function handleGenerateDietChart(patient){
    try {
      await generateDietChart(patient._id).unwrap()
      setMessage(`Diet chart generated for ${patient.name}`)
    } catch (error) {
      setMessage("Failed to generate diet chart")
    }
  }

  async function handleGetCredentials(patient){
    try {
      const result = await getPatientCredentials(patient._id).unwrap()
      console.log('Credentials result:', result) // Debug log
      setShowCredentials({
        ...patient,
        password: result.credentials.password,
        isNewPassword: result.credentials.isNewPassword,
        _debug: `Fresh password generated: ${result.credentials.password}`
      })
      setMessage(result.credentials.isNewPassword ? 
        `New password generated for ${patient.name}` : 
        `Credentials retrieved for ${patient.name}`
      )
    } catch (error) {
      setMessage("Failed to get patient credentials")
      console.error('Credentials error:', error)
    }
  }

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showDietModal, setShowDietModal] = useState(false)
  const [editingDietChart, setEditingDietChart] = useState(null)

  function handleViewDietCharts(patient){ 
    setSelectedPatient(patient); 
    setShowDietModal(true); 
    setEditingDietChart(null) 
  }
  
  function handleEditDietChart(chart, index){ 
    setEditingDietChart({ ...chart, index }) 
  }
  
  function syncSelectedPatient(){
    if(selectedPatient){
      const fresh = patients.find(p => p._id === selectedPatient._id)
      if (fresh) setSelectedPatient(fresh)
    }
  }
  
  async function handleUpdateDietChart(updatedChart){
    try {
      await updateDietChart({
        id: selectedPatient._id,
        chartIndex: editingDietChart.index,
        diet: updatedChart.diet,
        notes: updatedChart.notes
      }).unwrap()
      setMessage("Diet chart updated successfully")
      syncSelectedPatient()
      setEditingDietChart(null)
    } catch (error) {
      setMessage("Failed to update diet chart")
    }
  }
  
  async function handleDeleteDietChart(index){
    if(!window.confirm("Delete this diet chart?")) return
    try {
      await deleteDietChart({
        id: selectedPatient._id,
        chartIndex: index
      }).unwrap()
      setMessage("Diet chart deleted")
      syncSelectedPatient()
      if (editingDietChart?.index === index) setEditingDietChart(null)
    } catch (error) {
      setMessage("Failed to delete diet chart")
    }
  }



  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q ? patients.filter(p => (
      (p.name||"").toLowerCase().includes(q) ||
      (p.gender||"").toLowerCase().includes(q) ||
      (p.dominantPrakriti||"").toLowerCase().includes(q) ||
      (p.dosha||"").toLowerCase().includes(q) ||
      (p.existingDisease||"").toLowerCase().includes(q) ||
      (p.loginId||"").toLowerCase().includes(q)
    )) : [...patients]
    list.sort((a,b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const av = (a[sortKey]??"").toString().toLowerCase()
      const bv = (b[sortKey]??"").toString().toLowerCase()
      if (av < bv) return -1*dir
      if (av > bv) return 1*dir
      return 0
    })
    return list
  }, [patients, search, sortKey, sortDir])

  function SortHeader({ label, keyName }){
    const isActive = sortKey === keyName
    return (
      <button onClick={() => { setSortKey(keyName); setSortDir(prev => isActive ? (prev === "asc" ? "desc" : "asc") : "asc") }} className="bg-transparent border-none cursor-pointer font-medium hover:text-blue-600 transition-colors">
        {label}{isActive ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
      </button>
    )
  }

  const getPrakritiColor = (prakriti) => {
    switch(prakriti){
      case "Vata": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Pitta": return "bg-red-100 text-red-800 border-red-200"
      case "Kapha": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  const getAgniColor = (agni) => {
    switch(agni){
      case "Mandya": return "bg-red-100 text-red-800 border-red-200"
      case "Madhyama": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Tikshna": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Patients</h1>
            <p className="text-sm text-muted-foreground">Add, edit, and manage patient health data with auto-generated login credentials.</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => refetch()} 
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isFetchingPatients}
            >
              {isFetchingPatients ? 'Refreshing...' : 'Refresh'}
            </button>
            {message && (
              <div className="px-4 py-2 rounded-md border bg-emerald-50 text-emerald-700 text-sm flex items-center gap-2">
                <span>{message}</span>
                <button onClick={() => setMessage("")} className="hover:text-emerald-900">×</button>
              </div>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-sm">Processing…</p>
            </div>
          </div>
        )}

        {/* Login Credentials Modal */}
        {showCredentials && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
              <button onClick={() => setShowCredentials(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">×</button>
              <h3 className="text-lg font-semibold mb-4 text-green-700">
                {showCredentials.isNewPassword ? '🔄 New Password Generated!' : 
                 showCredentials.password ? '✅ Patient Credentials!' : 
                 '👤 Patient Login Information'}
              </h3>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-l-4 ${showCredentials.password ? 'bg-blue-50 border-blue-400' : 'bg-orange-50 border-orange-400'}`}>
                  <h4 className={`font-medium mb-2 ${showCredentials.password ? 'text-blue-800' : 'text-orange-800'}`}>
                    Patient Login Credentials
                    {showCredentials.isNewPassword && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">PASSWORD RESET</span>
                    )}
                  </h4>
                  <p className={`text-sm mb-3 ${showCredentials.password ? 'text-blue-700' : 'text-orange-700'}`}>
                    {showCredentials.password 
                      ? (showCredentials.isNewPassword 
                          ? 'A new password has been generated. Please share these credentials with the patient:'
                          : 'Please share these credentials with the patient:'
                        )
                      : 'Password was provided when patient was first created.'
                    }
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white p-2 rounded border">
                      <span className="text-sm font-medium">Patient Name:</span>
                      <span className="text-sm font-medium">{showCredentials.name}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border">
                      <span className="text-sm font-medium">Login ID:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{showCredentials.loginId}</code>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border">
                      <span className="text-sm font-medium">Password:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {showCredentials.password || 'Not available'}
                      </code>
                    </div>
                  </div>
                  
                  {showCredentials.isNewPassword && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      <strong>Important:</strong> The patient's old password has been replaced with this new one. 
                      They will need to use this new password to login.
                    </div>
                  )}
                  
                  <p className={`text-xs mt-3 ${showCredentials.password ? 'text-blue-600' : 'text-orange-600'}`}>
                    Patient can use these credentials to login at the patient portal and view their diet chart.
                  </p>
                  
                  {/* Debug info - remove in production */}
                  {showCredentials._debug && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      <strong>Debug:</strong> {showCredentials._debug}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  {showCredentials.password && (
                    <button 
                      onClick={() => {
                        const credText = `Patient: ${showCredentials.name}\nLogin ID: ${showCredentials.loginId}\nPassword: ${showCredentials.password}`
                        navigator.clipboard.writeText(credText)
                        setMessage("Credentials copied to clipboard!")
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Copy Credentials
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      const credText = `Patient: ${showCredentials.name}\nLogin ID: ${showCredentials.loginId}`
                      navigator.clipboard.writeText(credText)
                      setMessage("Login ID copied to clipboard!")
                    }}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Copy Login ID
                  </button>
                  <button 
                    onClick={() => setShowCredentials(null)} 
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 text-sm">
          {['add','list','stats'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-4 py-2 rounded-md border transition", activeTab===tab ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70")}>{tab==='add'? 'Add / Edit' : tab==='list' ? 'Patient List' : 'Statistics'}</button>
          ))}
        </div>

        {activeTab === 'add' && (
          <Card>
            <CardHeader><CardTitle>{editingId !== null ? 'Edit Patient' : 'Add New Patient'}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label className="block text-xs font-medium mb-1">Name *</label><Input name="name" value={form.name} onChange={handleChange} placeholder="Full name" /></div>
                <div><label className="block text-xs font-medium mb-1">Age</label><Input name="age" type="number" value={form.age} onChange={handleChange} placeholder="35" /></div>
                <div><label className="block text-xs font-medium mb-1">Gender *</label><select name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-md border px-2 py-2 text-sm"><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div><label className="block text-xs font-medium mb-1">Dominant Prakriti *</label><select name="dominantPrakriti" value={form.dominantPrakriti} onChange={handleChange} className="w-full rounded-md border px-2 py-2 text-sm"><option value="">Select</option><option>Vata</option><option>Pitta</option><option>Kapha</option></select></div>
                <div><label className="block text-xs font-medium mb-1">Dosha</label><Input name="dosha" value={form.dosha} onChange={handleChange} placeholder="Primary imbalance" /></div>
                <div><label className="block text-xs font-medium mb-1">Lifestyle</label><Input name="lifestyle" value={form.lifestyle} onChange={handleChange} placeholder="Diet, sleep, activity" /></div>
                <div><label className="block text-xs font-medium mb-1">Existing Disease</label><Input name="existingDisease" value={form.existingDisease} onChange={handleChange} placeholder="Comorbidities" /></div>
                <div><label className="block text-xs font-medium mb-1">BP</label><Input name="bp" value={form.bp} onChange={handleChange} placeholder="120/80" /></div>
                <div><label className="block text-xs font-medium mb-1">Weight (kg)</label><Input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="70" /></div>
                <div><label className="block text-xs font-medium mb-1">Agni *</label><select name="agni" value={form.agni} onChange={handleChange} className="w-full rounded-md border px-2 py-2 text-sm"><option value="">Select</option><option>Mandya</option><option>Madhyama</option><option>Tikshna</option></select></div>
                {errors.length > 0 && (
                  <div className="md:col-span-3">
                    <ul className="list-disc text-xs text-red-600 ml-4 space-y-0.5">{errors.map((e,i)=><li key={i}>{e}</li>)}</ul>
                  </div>
                )}
                <div className="md:col-span-3 flex items-center gap-2 pt-2">
                  <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">{editingId !== null ? 'Update' : 'Add'} Patient</button>
                  {editingId !== null && <button type="button" onClick={resetForm} className="px-4 py-2 rounded-md border text-sm">Cancel</button>}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'list' && (
          <Card>
            <CardHeader><CardTitle>Patient List</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4"><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patients..." className="flex-1" /><span className="text-xs text-muted-foreground">{filteredSorted.length} found</span></div>
              {filteredSorted.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No patients yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium"><SortHeader label="Name" keyName="name" /></th>
                        <th className="px-3 py-2 text-left font-medium"><SortHeader label="Login ID" keyName="loginId" /></th>
                        <th className="px-3 py-2 text-left font-medium"><SortHeader label="Age" keyName="age" /></th>
                        <th className="px-3 py-2 text-left font-medium"><SortHeader label="Gender" keyName="gender" /></th>
                        <th className="px-3 py-2 text-left font-medium"><SortHeader label="Prakriti" keyName="dominantPrakriti" /></th>
                        <th className="px-3 py-2 text-left font-medium"><SortHeader label="Agni" keyName="agni" /></th>
                        <th className="px-3 py-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSorted.map(p => (
                        <tr key={p._id} className="odd:bg-white even:bg-muted/30 hover:bg-muted/60 transition-colors">
                          <td className="px-3 py-2 font-medium">{p.name}</td>
                          <td className="px-3 py-2"><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{p.loginId}</code></td>
                          <td className="px-3 py-2">{p.age}</td>
                          <td className="px-3 py-2">{p.gender}</td>
                          <td className="px-3 py-2"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getPrakritiColor(p.dominantPrakriti)}`}>{p.dominantPrakriti}</span></td>
                          <td className="px-3 py-2"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getAgniColor(p.agni)}`}>{p.agni}</span></td>
                          <td className="px-3 py-2 space-x-2">
                            <button onClick={()=>handleEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                            <button onClick={()=>handleGetCredentials(p)} className="text-orange-600 hover:underline">Get Password</button>
                            <button onClick={()=>handleGenerateDietChart(p)} className="text-emerald-600 hover:underline">Diet</button>
                            <button onClick={()=>handleViewDietCharts(p)} className="text-purple-600 hover:underline">History{p.dietCharts?.length?`(${p.dietCharts.length})`:''}</button>
                            <button onClick={()=>handleDelete(p._id)} className="text-red-600 hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'stats' && (
          <Card>
            <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-blue-800">Total Patients</h3>
                  <p className="text-2xl font-bold text-blue-900">{patients.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-green-800">With Diet Charts</h3>
                  <p className="text-2xl font-bold text-green-900">
                    {patients.filter(p => p.dietCharts && p.dietCharts.length > 0).length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-purple-800">Avg Age</h3>
                  <p className="text-2xl font-bold text-purple-900">
                    {patients.length > 0 ? Math.round(patients.filter(p => p.age).reduce((sum, p) => sum + parseInt(p.age || 0), 0) / patients.filter(p => p.age).length) || 0 : 0}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-orange-800">Total Diet Charts</h3>
                  <p className="text-2xl font-bold text-orange-900">
                    {patients.reduce((total, p) => total + (p.dietCharts?.length || 0), 0)}
                  </p>
                </div>
              </div>

              {/* Prakriti Distribution */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Prakriti Distribution</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Vata', 'Pitta', 'Kapha'].map(prakriti => {
                    const count = patients.filter(p => p.dominantPrakriti === prakriti).length
                    const percentage = patients.length > 0 ? ((count / patients.length) * 100).toFixed(1) : 0
                    return (
                      <div key={prakriti} className={`p-3 rounded-lg border ${getPrakritiColor(prakriti)}`}>
                        <h4 className="font-medium">{prakriti}</h4>
                        <p className="text-xl font-bold">{count}</p>
                        <p className="text-xs opacity-75">{percentage}% of patients</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Agni Distribution */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Agni Distribution</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Mandya', 'Madhyama', 'Tikshna'].map(agni => {
                    const count = patients.filter(p => p.agni === agni).length
                    const percentage = patients.length > 0 ? ((count / patients.length) * 100).toFixed(1) : 0
                    return (
                      <div key={agni} className={`p-3 rounded-lg border ${getAgniColor(agni)}`}>
                        <h4 className="font-medium">{agni}</h4>
                        <p className="text-xl font-bold">{count}</p>
                        <p className="text-xs opacity-75">{percentage}% of patients</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Gender Distribution */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Gender Distribution</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Male', 'Female', 'Other'].map(gender => {
                    const count = patients.filter(p => p.gender === gender).length
                    const percentage = patients.length > 0 ? ((count / patients.length) * 100).toFixed(1) : 0
                    return (
                      <div key={gender} className="bg-gray-50 p-3 rounded-lg border">
                        <h4 className="font-medium text-gray-800">{gender}</h4>
                        <p className="text-xl font-bold text-gray-900">{count}</p>
                        <p className="text-xs text-gray-600">{percentage}% of patients</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Patients</h3>
                <div className="space-y-2">
                  {patients.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(patient => (
                    <div key={patient._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{patient.name}</span>
                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPrakritiColor(patient.dominantPrakriti)}`}>
                          {patient.dominantPrakriti}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'Date unknown'}
                      </div>
                    </div>
                  ))}
                  {patients.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No patients added yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showDietModal && selectedPatient && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
              <button onClick={()=>setShowDietModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">×</button>
              <h3 className="text-lg font-semibold mb-4">Diet Chart History - {selectedPatient.name}</h3>
              {selectedPatient.dietCharts?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No diet charts yet.</p>
              ) : (
                <div className="space-y-4">
                  {selectedPatient.dietCharts.slice().reverse().map((chart, index) => {
                    const originalIndex = selectedPatient.dietCharts.length - 1 - index
                    return (
                    <div key={chart.date} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Diet Chart #{selectedPatient.dietCharts.length - index}</p>
                          <p className="text-xs text-muted-foreground">{new Date(chart.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={()=>handleEditDietChart(chart, originalIndex)} className="text-blue-600 text-xs hover:underline">Edit</button>
                          <button onClick={()=>handleDeleteDietChart(originalIndex)} className="text-red-600 text-xs hover:underline">Delete</button>
                        </div>
                      </div>
                      {editingDietChart?.index === originalIndex ? (
                        <div className="space-y-3">
                          {['breakfast','lunch','dinner','snacks'].map(meal => (
                            <div key={meal}>
                              <label className="block text-xs font-medium mb-1 capitalize">{meal}</label>
                              <textarea value={editingDietChart.diet[meal].join('\n')} onChange={e => setEditingDietChart(prev => ({ ...prev, diet: { ...prev.diet, [meal]: e.target.value.split('\n').filter(Boolean) } }))} className="w-full h-20 border rounded-md px-2 py-1 text-xs" />
                            </div>
                          ))}
                          {['restrictions','recommendations'].map(key => (
                            <div key={key}>
                              <label className="block text-xs font-medium mb-1 capitalize">{key}</label>
                              <textarea value={editingDietChart.diet[key].join('\n')} onChange={e => setEditingDietChart(prev => ({ ...prev, diet: { ...prev.diet, [key]: e.target.value.split('\n').filter(Boolean) } }))} className="w-full h-20 border rounded-md px-2 py-1 text-xs" />
                            </div>
                          ))}
                          <div>
                            <label className="block text-xs font-medium mb-1">Notes</label>
                            <textarea value={editingDietChart.notes} onChange={e => setEditingDietChart(prev => ({ ...prev, notes: e.target.value }))} className="w-full h-20 border rounded-md px-2 py-1 text-xs" />
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button onClick={()=>setEditingDietChart(null)} className="text-xs px-3 py-1 border rounded-md">Cancel</button>
                            <button onClick={()=>handleUpdateDietChart(editingDietChart)} className="text-xs px-3 py-1 rounded-md bg-primary text-primary-foreground">Save</button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="font-medium mb-1">Breakfast</p>
                            <ul className="list-disc ml-4 space-y-0.5">{chart.diet.breakfast.map((i,idx)=><li key={idx}>{i}</li>)}</ul>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Lunch</p>
                            <ul className="list-disc ml-4 space-y-0.5">{chart.diet.lunch.map((i,idx)=><li key={idx}>{i}</li>)}</ul>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Dinner</p>
                            <ul className="list-disc ml-4 space-y-0.5">{chart.diet.dinner.map((i,idx)=><li key={idx}>{i}</li>)}</ul>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Snacks</p>
                            <ul className="list-disc ml-4 space-y-0.5">{chart.diet.snacks.map((i,idx)=><li key={idx}>{i}</li>)}</ul>
                          </div>
                          <div className="col-span-2 border-t pt-2">
                            <p className="font-medium mb-1">Restrictions</p>
                            <ul className="list-disc ml-4 space-y-0.5">{chart.diet.restrictions.map((i,idx)=><li key={idx}>{i}</li>)}</ul>
                          </div>
                          <div className="col-span-2">
                            <p className="font-medium mb-1">Recommendations</p>
                            <ul className="list-disc ml-4 space-y-0.5">{chart.diet.recommendations.map((i,idx)=><li key={idx}>{i}</li>)}</ul>
                          </div>
                          <div className="col-span-2">
                            <p className="italic text-muted-foreground">{chart.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    )})}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
  )
}

export default Patients
