import { useState } from 'react'
import { Icon } from '@iconify/react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const DESIGNATIONS = ['MAYOR', 'MAD', 'PA', 'BRO', 'MVO', 'PVO', 'GOVERNOR']

const PROVINCES = ['Oriental Mindoro', 'Occidental Mindoro', 'Palawan', 'Marinduque', 'Romblon']

const INITIAL_STATE = {
  officeAddress: '',
  firstName: '',
  lastName: '',
  middleInitial: '',
  nameExtension: '',
  designation: '',
  contactNumber: '',
  emailAddress: '',
  province: '',
  municipality: '',
}

export default function UserForm() {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const required = ['officeAddress', 'firstName', 'lastName', 'designation', 'contactNumber', 'emailAddress', 'province', 'municipality']
    const missing = required.filter((f) => !formData[f]?.trim())
    if (missing.length) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, 'forms'), {
        ...formData,
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
      setFormData(INITIAL_STATE)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to submit form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 sm:py-2 rounded-lg border-2 bg-white font-poppins text-base sm:text-sm outline-none transition-all min-h-[44px]'
  const inputStyle = { borderColor: '#4D7E58', color: '#0F571C' }
  const labelClass = 'block text-xs font-medium mb-1.5'
  const labelStyle = { color: '#0F571C' }

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center" style={{ border: '2px solid #BEB68F', borderTop: '3px solid #0F571C' }}>
          <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f0e9' }}>
            <Icon icon="mdi:check-circle" className="text-4xl" style={{ color: '#0F571C' }} />
          </div>
          <h2 className="text-lg font-semibold mb-1.5" style={{ color: '#0F571C' }}>Form Submitted Successfully!</h2>
          <p className="text-sm mb-6" style={{ color: '#4D7E58' }}>Thank you for submitting your regulatory division form.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-5 py-2.5 text-sm text-white rounded-lg transition-colors font-medium shadow hover:opacity-90"
            style={{ backgroundColor: '#0F571C' }}
          >
            Submit Another Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ border: '2px solid #BEB68F', borderTop: '3px solid #0F571C' }}>
        <div className="text-white px-4 sm:px-6 py-3 sm:py-4" style={{ backgroundColor: '#0F571C' }}>
          <h1 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Icon icon="mdi:form-textbox" className="text-2xl" />
            Regulatory Division Form
          </h1>
          <p className="text-white/90 text-sm mt-0.5">Fill in your information below</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg flex items-center gap-2 text-sm" style={{ backgroundColor: '#F1EAD6', border: '1px solid #BEB68F', color: '#0F571C' }}>
              <Icon icon="mdi:alert-circle" className="text-lg flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className={labelClass} style={labelStyle}>Office Address <span style={{ color: '#8B6914' }}>*</span></label>
            <input
              type="text"
              name="officeAddress"
              value={formData.officeAddress}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
              placeholder="Enter office address"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>First Name <span style={{ color: '#8B6914' }}>*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Last Name <span style={{ color: '#8B6914' }}>*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Middle Initial</label>
              <input
                type="text"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="M.I."
                maxLength={2}
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Name Extension</label>
              <input
                type="text"
                name="nameExtension"
                value={formData.nameExtension}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="Jr., Sr., III"
              />
            </div>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Designation <span style={{ color: '#8B6914' }}>*</span></label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
              required
            >
              <option value="">Select designation</option>
              {DESIGNATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Contact # <span style={{ color: '#8B6914' }}>*</span></label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="09XXXXXXXXX"
                required
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Email <span style={{ color: '#8B6914' }}>*</span></label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="example@gmail.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Province <span style={{ color: '#8B6914' }}>*</span></label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                required
              >
                <option value="">Select province</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Municipality <span style={{ color: '#8B6914' }}>*</span></label>
              <input
                type="text"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="Municipality"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow hover:opacity-90"
              style={{ backgroundColor: '#0F571C' }}
            >
              {loading ? (
                <>
                  <span className="animate-spin">
                    <Icon icon="mdi:loading" className="text-xl" />
                  </span>
                  Submitting...
                </>
              ) : (
                <>
                  <Icon icon="mdi:send" className="text-lg" />
                  Submit Form
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
