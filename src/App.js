import { Routes, Route, Navigate } from "react-router"
import Login from "./pages/Login"
import CreateAccount from "./pages/CreateAccount"
import Patient from "./pages/patient/Patient"
import Dashboard from "./pages/patient/Dashboard"
import Appointment from "./pages/patient/Appintment"
import TherapyGroup from "./pages/patient/TherapyGroup"
import Vdt from "./pages/patient/Vdt"
import MedicalRecord from "./pages/patient/MedicalRecord"
import ApplyForHelp from "./pages/patient/ApplyForHelp"
import Profile from "./pages/patient/Profile"
import Blog from "./pages/patient/Blog"
import DoctorList from "./pages/patient/DoctorsList"
import Room from "./pages/patient/Room"
import Doctor from "./pages/doctor/Doctor"
import Activity from "./pages/doctor/Activity"
import Office from "./pages/doctor/Office"
import HomeDoctor from "./pages/doctor/HomeDoctor"
import DocBlog from "./pages/doctor/DocBlog"
import Admin from "./pages/admin/Admin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import Doctors from "./pages/admin/Doctors"
import HelpApplications from "./pages/admin/HelpApplications"
import Setting from "./pages/admin/Setting"
import Schedule from "./pages/doctor/Schedule"
import PrivateElement from "./components/route/PrivateElement"
import DocIndex from "./pages/doctor/DocIndex"
import useToken from "./hooks/useToken"
import DocTherapyGroup from "./pages/doctor/DocTherapyGroup"
import DocVideoRoom from "./pages/doctor/DocVideoRoom"
import Checkout from "./pages/pharmacy/Checkout"
import NotFound from "./pages/guest/NotFound"
import Prescription from "./pages/patient/Prescription"
import BlogDetaile from "./components/blog/BlogDetaile"
import HelpDetail from "./components/help/HelpDetail"
import HomeAppointment from "./pages/patient/HomeAppointment"
function App() {
  const { token } = useToken()
  const loggedIn = Boolean(token?.username)
  return (
    <Routes>
      <Route path="/" element={<Navigate to="login" replace />} />
      <Route
        path="login"
        element={
          loggedIn ? (
            <Navigate to={`/user/${token.role.toLowerCase()}`} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route path="create-account" element={<CreateAccount />} />
      <Route path="user" element={<PrivateElement />}>
        <Route path="patient" element={<Patient />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="appointment" element={<Appointment />} />
            <Route path="therapygroup" element={<TherapyGroup />} />
            <Route path="vdt" element={<Vdt />} />
            <Route path="medicalrecord" element={<MedicalRecord />} />
          </Route>
          <Route path="blogdetaile" element={<BlogDetaile />} />
          <Route path="helpdetail" element={<HelpDetail />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="homedoctor" element={<HomeAppointment />} />
          <Route path="therapygroup" element={<TherapyGroup />} />
          <Route path="vdt" element={<Vdt />} />
          <Route path="prescription" element={<Prescription />} />
          <Route path="medicalrecord" element={<MedicalRecord />} />
          <Route path="applyforhelp" element={<ApplyForHelp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="blog" element={<Blog />} />
          <Route path="doctorlist" element={<DoctorList />} />
          <Route path="room/:username" element={<Room />} />
        </Route>
        <Route path="doctor" element={<Doctor />}>
          <Route index element={<DocIndex />} />
          <Route path="activity" element={<Activity />} />
          <Route path="office" element={<Office />} />
          <Route path="homedoctor" element={<HomeDoctor />} />
          <Route path="profile" element={<Profile />} />
          <Route path="blog" element={<DocBlog />} />
          <Route path="blogdetaile" element={<BlogDetaile />} />
          <Route path="helpdetail" element={<HelpDetail />} />
          <Route path="therapygroup" element={<DocTherapyGroup />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="room" element={<DocVideoRoom />} />
        </Route>
        <Route path="admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="helpapplications" element={<HelpApplications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Route>
      <Route path="pharmacy/:prescriptionId" element={<Checkout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
