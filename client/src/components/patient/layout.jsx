import { Outlet } from "react-router-dom";
import PatientHeader from "./header";
import PatientFooter from "./footer";

const PatientLayout = () => {
  return (
    <div>
        <PatientHeader/>
        <main><Outlet/></main>
        <PatientFooter/>
    </div>
  )
}

export default PatientLayout