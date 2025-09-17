import { Routes,Route, Navigate } from "react-router-dom"
import Home from "./pages/main/home"
import Dashboard from "./pages/admin-view/dashborad"

function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/admin/dashboard" element={<Dashboard/>}></Route>
      </Routes>
    </div>
  )
}

export default App