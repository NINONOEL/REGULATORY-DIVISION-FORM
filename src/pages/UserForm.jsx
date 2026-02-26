import { useState } from 'react'
import { Icon } from '@iconify/react'
import StyledSelect from '../components/StyledSelect'

const DESIGNATIONS = ['MAYOR', 'MAO', 'PA', 'BPLO', 'MVO', 'PVO', 'GOVERNOR']

const PROVINCES = ['Oriental Mindoro', 'Occidental Mindoro', 'Palawan', 'Marinduque', 'Romblon']

const SUBMIT_TIMEOUT_MS = 25000

async function submitToGoogleSheets(data) {
  const base = import.meta.env.VITE_API_URL || ''
  const apiUrl = `${base}/api/submit-sheets`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.message || 'Failed to submit to Google Sheets')
    return json
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.')
    }
    throw err
  }
}

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
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess(false)
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
    setError('')
    try {
      await submitToGoogleSheets(formData)
      setSuccess(true)
      setFormData(INITIAL_STATE)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to submit form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 sm:py-2 rounded-lg border-2 bg-white font-poppins text-base sm:text-sm outline-none transition-all duration-200 min-h-[44px] hover:shadow-sm'
  const inputStyle = { borderColor: '#4D7E58', color: '#0F571C' }
  const labelClass = 'block text-xs font-medium mb-1.5'
  const labelStyle = { color: '#0F571C' }

  return (
    <div className="relative w-full min-w-0 max-w-lg mx-auto px-3 xs:px-4 sm:px-6 py-4 sm:py-6 md:py-8">
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 bg-black/50 animate-fade-in safe-area-padding">
          <div className="bg-white rounded-xl shadow-2xl p-5 sm:p-6 md:p-8 text-center w-full max-w-sm animate-scale-in overflow-auto max-h-[min(400px,calc(100dvh-1.5rem))]" style={{ border: '2px solid #BEB68F', borderTop: '3px solid #0F571C' }}>
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f0e9' }}>
              <Icon icon="mdi:check-circle" className="text-4xl" style={{ color: '#0F571C' }} />
            </div>
            <h2 className="text-lg font-semibold mb-1.5" style={{ color: '#0F571C' }}>Form Submitted Successfully!</h2>
            <p className="text-sm mb-6" style={{ color: '#4D7E58' }}>Thank you for submitting your regulatory division form.</p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="w-full py-3 text-sm text-white font-semibold rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#0F571C' }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up transition-shadow duration-300 hover:shadow-xl" style={{ border: '2px solid #BEB68F', borderTop: '2px solid #BEB68F' }}>
        <div className="relative px-4 sm:px-6 py-5 sm:py-6 md:py-8 text-center min-h-[140px] xs:min-h-[160px] sm:min-h-[180px] flex flex-col items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center blur-[1px]"
            style={{ backgroundImage: 'url(/ABOUTPAGE.png)' }}
          />
          <div className="relative z-10">
            <img src="/RD LOGO.png" alt="Regulatory Division" className="h-14 w-14 xs:h-16 xs:w-16 sm:h-20 sm:w-20 mx-auto mb-2 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105" />
            <h1 className="text-base xs:text-lg sm:text-xl font-semibold text-white drop-shadow-md">Regulatory Division Form</h1>
            <p className="text-white/95 text-sm xs:text-base sm:text-lg mt-0.5 drop-shadow-md">Fill in your information below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-3 xs:p-4 sm:p-6 space-y-3 sm:space-y-4">
          {error && (
            <div className="p-3 rounded-lg flex items-center gap-2 text-sm animate-slide-down" style={{ backgroundColor: '#F1EAD6', border: '1px solid #BEB68F', color: '#0F571C' }}>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <StyledSelect
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              options={DESIGNATIONS}
              placeholder="Select designation"
              required
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Province <span style={{ color: '#8B6914' }}>*</span></label>
              <StyledSelect
                name="province"
                value={formData.province}
                onChange={handleChange}
                options={PROVINCES}
                placeholder="Select province"
                required
                openUp
                style={inputStyle}
              />
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
              className="w-full py-3 min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100"
              style={{ backgroundColor: '#0F571C' }}
            >
              {loading ? (
                <>
                  <span className="animate-spin">
                    <Icon icon="mdi:loading" className="text-base" />
                  </span>
                  Submitting
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
