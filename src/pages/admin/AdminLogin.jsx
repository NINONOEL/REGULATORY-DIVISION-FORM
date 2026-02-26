import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden" style={{ border: '3px solid #BEB68F', borderTop: '4px solid #0F571C' }}>
        <div className="text-white px-5 sm:px-8 py-4 sm:py-6" style={{ backgroundColor: '#0F571C' }}>
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Icon icon="mdi:shield-account" className="text-2xl sm:text-3xl" />
            Admin Login
          </h1>
          <p className="text-white/90 mt-1">Sign in to view submitted forms</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5 sm:space-y-6">
          {error && (
            <div className="p-4 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#F1EAD6', border: '1px solid #BEB68F', color: '#0F571C' }}>
              <Icon icon="mdi:alert-circle" className="text-xl flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F571C' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 bg-white outline-none transition-all"
              style={{ borderColor: '#4D7E58', color: '#0F571C' }}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F571C' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 bg-white outline-none transition-all"
              style={{ borderColor: '#4D7E58', color: '#0F571C' }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 disabled:opacity-70 text-white font-semibold rounded-lg transition-colors shadow-lg hover:opacity-90"
            style={{ backgroundColor: '#0F571C' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm" style={{ color: '#4D7E58' }}>
            Don't have an admin account?{' '}
            <Link to="/admin/register" className="font-medium hover:underline" style={{ color: '#0F571C' }}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
