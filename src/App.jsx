import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import UserForm from './pages/UserForm'
import AdminLogin from './pages/admin/AdminLogin'
import AdminRegister from './pages/admin/AdminRegister'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProtected from './components/AdminProtected'

function App() {
  return (
    <div className="min-h-screen font-poppins" style={{ backgroundColor: '#F1EAD6' }}>
      <Routes>
        {/* User routes - form only, no Admin Portal link */}
        <Route path="/" element={<Layout />}>
          <Route index element={<UserForm />} />
        </Route>

        {/* Admin routes - separate path, no Submit Form link */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="/admin/login" replace />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="register" element={<AdminRegister />} />
          <Route
            path="dashboard"
            element={
              <AdminProtected>
                <AdminDashboard />
              </AdminProtected>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
