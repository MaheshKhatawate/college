import { useEffect, useMemo, useState } from "react"

function Dashboard(){
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
        agni: ""
    }), [])

    const [patients, setPatients] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [activeTab, setActiveTab] = useState("add")
    const [search, setSearch] = useState("")
    const [sortKey, setSortKey] = useState("name")
    const [sortDir, setSortDir] = useState("asc")
    const [message, setMessage] = useState("")
    const [errors, setErrors] = useState([])

    useEffect(() => {
        const stored = localStorage.getItem("patients")
        if(stored){
            try { setPatients(JSON.parse(stored)) } catch {}
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("patients", JSON.stringify(patients))
    }, [patients])

    function handleChange(e){
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    function resetForm(){
        setForm(emptyForm)
        setEditingId(null)
        setErrors([])
    }

    function validateForm(current){
        const newErrors = []
        if(!current.name || current.name.trim().length < 2){ newErrors.push("Name is required (min 2 chars)") }
        if(current.age && isNaN(Number(current.age))){ newErrors.push("Age must be a number") }
        if(current.weight && isNaN(Number(current.weight))){ newErrors.push("Weight must be a number") }
        if(current.bp && !/^\d{2,3}\/\d{2,3}$/.test(current.bp.trim())){ newErrors.push("BP must be like 120/80") }
        if(!current.gender){ newErrors.push("Gender is required") }
        if(!current.dominantPrakriti){ newErrors.push("Dominant Prakriti is required") }
        if(!current.agni){ newErrors.push("Agni is required") }
        return newErrors
    }

    function handleSubmit(e){
        e.preventDefault()
        const v = validateForm(form)
        setErrors(v)
        if(v.length){ return }
        if(editingId !== null){
            setPatients(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p))
            setMessage("Patient updated")
            resetForm()
            return
        }
        const newPatient = { id: Date.now(), ...form }
        setPatients(prev => [newPatient, ...prev])
        setMessage("Patient added")
        resetForm()
    }

    function handleEdit(id){
        const patient = patients.find(p => p.id === id)
        if(!patient) return
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

    function handleDelete(id){
        setPatients(prev => prev.filter(p => p.id !== id))
        if(editingId === id){ resetForm() }
        setMessage("Patient deleted")
    }

    const filteredSorted = useMemo(() => {
        const q = search.trim().toLowerCase()
        let list = q ? patients.filter(p => (
            (p.name||"").toLowerCase().includes(q) ||
            (p.gender||"").toLowerCase().includes(q) ||
            (p.dominantPrakriti||"").toLowerCase().includes(q) ||
            (p.dosha||"").toLowerCase().includes(q) ||
            (p.existingDisease||"").toLowerCase().includes(q)
        )) : [...patients]
        list.sort((a,b) => {
            const dir = sortDir === "asc" ? 1 : -1
            const av = (a[sortKey] ?? "").toString().toLowerCase()
            const bv = (b[sortKey] ?? "").toString().toLowerCase()
            if(av < bv) return -1*dir
            if(av > bv) return 1*dir
            return 0
        })
        return list
    }, [patients, search, sortKey, sortDir])

    const stats = useMemo(() => {
        const total = patients.length
        const avgAge = total ? Math.round((patients.reduce((s,p)=> s + (Number(p.age)||0), 0) / total) * 10)/10 : 0
        const byPrakriti = patients.reduce((acc,p)=>{ const k=p.dominantPrakriti||"Unknown"; acc[k]=(acc[k]||0)+1; return acc }, {})
        return { total, avgAge, byPrakriti }
    }, [patients])

    function SortHeader({ label, keyName }){
        const isActive = sortKey === keyName
        return (
            <button onClick={() => { setSortKey(keyName); setSortDir(prev => (isActive ? (prev === "asc"?"desc":"asc") : "asc")) }} style={{ background:"transparent", border:"none", cursor:"pointer", fontWeight: isActive?600:500 }}>
                {label}{isActive ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
            </button>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-fuchsia-50">
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Doctor Dashboard</h2>

            <div className="flex gap-2 mb-4">
                <button onClick={()=>setActiveTab("add")} className={`px-3 py-2 rounded-md border transition-all duration-200 ${activeTab==="add" ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" : "border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow"}`}>Add Patient</button>
                <button onClick={()=>setActiveTab("list")} className={`px-3 py-2 rounded-md border transition-all duration-200 ${activeTab==="list" ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" : "border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow"}`}>Patient List</button>
                <button onClick={()=>setActiveTab("stats")} className={`px-3 py-2 rounded-md border transition-all duration-200 ${activeTab==="stats" ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" : "border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow"}`}>Stats</button>
            </div>

            {message && (
                <div role="status" className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900">{message}</div>
            )}

            {activeTab === "add" && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-border rounded-xl p-4 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input name="age" value={form.age} onChange={handleChange} placeholder="e.g., 35" className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Dominant Prakriti</label>
                    <select name="dominantPrakriti" value={form.dominantPrakriti} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select prakriti</option>
                        <option value="Vata">Vata</option>
                        <option value="Pitta">Pitta</option>
                        <option value="Kapha">Kapha</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Dosha</label>
                    <input name="dosha" value={form.dosha} onChange={handleChange} placeholder="Primary imbalance" className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Lifestyle</label>
                    <input name="lifestyle" value={form.lifestyle} onChange={handleChange} placeholder="Diet, sleep, activity" className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Existing Disease</label>
                    <input name="existingDisease" value={form.existingDisease} onChange={handleChange} placeholder="Comorbidities" className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">BP</label>
                    <input name="bp" value={form.bp} onChange={handleChange} placeholder="120/80" className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g., 70" className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Agni (digestion power)</label>
                    <select name="agni" value={form.agni} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select agni</option>
                        <option value="Mandya">Mandya (low)</option>
                        <option value="Madhyama">Madhyama (moderate)</option>
                        <option value="Tikshna">Tikshna (sharp)</option>
                    </select>
                </div>
                <div className="md:col-span-3 flex items-center gap-3">
                    <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">{editingId !== null ? "Update" : "Add"} Patient</button>
                    {editingId !== null && (
                        <button type="button" onClick={resetForm} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5">Cancel Edit</button>
                    )}
                    {errors.length > 0 && (
                        <ul className="ml-2 list-disc text-sm text-red-600">
                            {errors.map((err, idx) => (<li key={idx}>{err}</li>))}
                        </ul>
                    )}
                </div>
            </form>
            )}

            {activeTab === "list" && (
            <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, gender, prakriti, dosha" className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                {filteredSorted.length === 0 ? (
                    <div className="text-gray-600">No patients found.</div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"><SortHeader label="Name" keyName="name" /></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"><SortHeader label="Age" keyName="age" /></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"><SortHeader label="Gender" keyName="gender" /></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"><SortHeader label="Prakriti" keyName="dominantPrakriti" /></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"><SortHeader label="Dosha" keyName="dosha" /></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Lifestyle</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"><SortHeader label="Disease" keyName="existingDisease" /></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"><SortHeader label="BP" keyName="bp" /></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"><SortHeader label="Weight" keyName="weight" /></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600"><SortHeader label="Agni" keyName="agni" /></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredSorted.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.age}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.gender}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.dominantPrakriti}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.dosha}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.lifestyle}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.existingDisease}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.bp}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.weight}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{p.agni}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <button onClick={() => handleEdit(p.id)} className="mr-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5">Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            )}

            {activeTab === "stats" && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                    <div className="text-xs text-gray-600">Total patients</div>
                    <div className="text-3xl font-bold">{stats.total}</div>
                </div>
                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                    <div className="text-xs text-gray-600">Average age</div>
                    <div className="text-3xl font-bold">{stats.avgAge}</div>
                </div>
                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                    <div className="mb-1 text-xs text-gray-600">By prakriti</div>
                    {Object.keys(stats.byPrakriti).length === 0 ? (
                        <div className="text-gray-600">No data</div>
                    ) : (
                        <ul className="list-disc pl-4 text-sm">
                            {Object.entries(stats.byPrakriti).map(([k,v]) => (
                                <li key={k}>{k}: {v}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            )}
        </div>
        </div>
    )
}

export default Dashboard

