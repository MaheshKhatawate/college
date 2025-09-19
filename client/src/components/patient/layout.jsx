import { Outlet } from "react-router-dom";
import PatientHeader from "./header";
import PatientFooter from "./footer";

const PatientLayout = ({ children, patient }) => {
  return (
    <div>
        <PatientHeader patient={patient}/>
        <main>{children || <Outlet/>}</main>
        <PatientFooter/>
    </div>
  )
}

export default PatientLayout