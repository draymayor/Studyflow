import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import PublicOnlyRoute from './components/layout/PublicOnlyRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Courses from './pages/Courses.jsx'
import Availability from './pages/Availability.jsx'
import Timetable from './pages/Timetable.jsx'
import Materials from './pages/Materials.jsx'
import Settings from './pages/Settings.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
