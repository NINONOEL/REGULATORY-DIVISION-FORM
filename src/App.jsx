import { Routes, Route, Navigate } from 'react-router-dom'
import UserForm from './pages/UserForm'

function App() {
  return (
    <div className="min-h-screen min-h-dvh font-poppins overflow-x-hidden" style={{ backgroundColor: '#F1EAD6' }}>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
