import { Routes,Route } from "react-router-dom"
import Home from "./pages/main/home"

function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="/home" element={<Home/>}>

        </Route>
      </Routes>
    </div>
  )
}

export default App