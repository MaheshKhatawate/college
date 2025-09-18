import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/main/home"
import Layout from "./components/main/layout"
import AdminLayout from "./components/admin/layout"
import Dashboard from "./pages/admin/dashboard"
import Patients from "./pages/admin/patients"
import Reports from "./pages/admin/reports"
import Settings from "./pages/admin/settings"

import { PatientHome } from "./pages/patient/home"

function App() {
  return (
    <div className="flex flex-col overflow-hidden">
      <Routes>
        <Route path="/" element={<Navigate to="/main/home" replace />} />

        {/* Main Layout Routes */}
        <Route path="/main" element={<Layout />}>
          <Route path="home" element={<Home />} />
        </Route>

        {/* Admin Layout Routes */}
        <Route path='/admin' element={<AdminLayout/>}>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="patients" element={<Patients/>} />
          <Route path="reports" element={<Reports/>} />
          <Route path="settings" element={<Settings/>} />
        </Route>

        {/* Patient Routes - Handle authentication internally */}
        <Route path="/patient/*" element={<PatientHome />} />
      </Routes>
    </div>
  )
}

export default App