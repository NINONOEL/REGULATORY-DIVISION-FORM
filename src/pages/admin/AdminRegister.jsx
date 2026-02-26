import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'

export default function AdminRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      })
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden" style={{ border: '3px solid #BEB68F', borderTop: '4px solid #0F571C' }}>
        <div className="text-white px-5 sm:px-8 py-4 sm:py-6" style={{ backgroundColor: '#0F571C' }}>
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Icon icon="mdi:account-plus" className="text-2xl sm:text-3xl" />
            Admin Register
          </h1>
          <p className="text-white/90 mt-1">Create an admin account</p>
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
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F571C' }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm" style={{ color: '#4D7E58' }}>
            Already have an account?{' '}
            <Link to="/admin/login" className="font-medium hover:underline" style={{ color: '#0F571C' }}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
