import { useState, useEffect, useMemo, useRef } from 'react'
import { Icon } from '@iconify/react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, query, orderBy, limit, startAfter, onSnapshot, getDocs } from 'firebase/firestore'
import { useVirtualizer } from '@tanstack/react-virtual'
import { auth, db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'

const PAGE_SIZE = 100

const PROVINCES = ['Oriental Mindoro', 'Occidental Mindoro', 'Palawan', 'Marinduque', 'Romblon']

export default function AdminDashboard() {
  const [firstPageForms, setFirstPageForms] = useState([])
  const [extraForms, setExtraForms] = useState([])
  const [lastDoc, setLastDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [provinceFilter, setProvinceFilter] = useState('')
  const [selectedForm, setSelectedForm] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const listRef = useRef(null)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const allLoadedForms = useMemo(() => [...firstPageForms, ...extraForms], [firstPageForms, extraForms])

  // Filter forms by search and province
  const filteredForms = useMemo(() => {
    let result = allLoadedForms
    if (provinceFilter) {
      result = result.filter((f) => (f.province || '').toLowerCase() === provinceFilter.toLowerCase())
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      result = result.filter(
        (f) =>
          (f.lastName || '').toLowerCase().includes(term) ||
          (f.firstName || '').toLowerCase().includes(term) ||
          (f.designation || '').toLowerCase().includes(term) ||
          (f.municipality || '').toLowerCase().includes(term) ||
          (f.province || '').toLowerCase().includes(term) ||
          (f.emailAddress || '').toLowerCase().includes(term) ||
          (f.officeAddress || '').toLowerCase().includes(term)
      )
    }
    return result
  }, [allLoadedForms, searchTerm, provinceFilter])

  // Initial load + real-time for first page
  useEffect(() => {
    const q = query(
      collection(db, 'forms'),
      orderBy('createdAt', 'desc'),
      limit(PAGE_SIZE)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
        }
      })
      setFirstPageForms(items)
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1])
      }
      setHasMore(snapshot.docs.length >= PAGE_SIZE)
      setInitialLoading(false)
    }, (err) => {
      console.error(err)
      setInitialLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const loadMore = async () => {
    if (!lastDoc || loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const nextQ = query(
        collection(db, 'forms'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      )
      const snapshot = await getDocs(nextQ)
      const newItems = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
        }
      })
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1])
      }
      setExtraForms((prev) => [...prev, ...newItems])
      setHasMore(snapshot.docs.length >= PAGE_SIZE)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMore(false)
    }
  }

  const virtualizer = useVirtualizer({
    count: filteredForms.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 80,
    overscan: 5,
  })

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 2000))
      await signOut(auth)
      setShowLogoutModal(false)
      navigate('/admin/login')
    } finally {
      setLogoutLoading(false)
    }
  }

  const formatDate = (d) => {
    if (!d) return '-'
    const date = d instanceof Date ? d : new Date(d)
    return date.toLocaleString()
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 truncate" style={{ color: '#0F571C' }}>
            <Icon icon="mdi:view-dashboard" className="text-2xl sm:text-3xl flex-shrink-0" />
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm sm:text-base" style={{ color: '#4D7E58' }}>
            {allLoadedForms.length} form{allLoadedForms.length !== 1 ? 's' : ''} loaded
            {(searchTerm || provinceFilter) && ` • ${filteredForms.length} matching`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px]" style={{ color: '#4D7E58' }} title={currentUser?.email}>
            {currentUser?.email}
          </span>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium transition-colors shadow hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: '#0F571C' }}
          >
            <Icon icon="mdi:logout" />
            Logout
          </button>
        </div>
      </div>

      {initialLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#0F571C' }}></div>
        </div>
      ) : firstPageForms.length === 0 && extraForms.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 sm:p-12 text-center" style={{ border: '3px solid #BEB68F' }}>
          <Icon icon="mdi:file-document-outline" className="text-5xl sm:text-6xl mx-auto mb-3 sm:mb-4" style={{ color: '#4D7E58' }} />
          <h3 className="text-lg sm:text-xl font-medium mb-2" style={{ color: '#0F571C' }}>No forms yet</h3>
          <p style={{ color: '#4D7E58' }}>Forms submitted by users will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:items-stretch">
          <div className="flex flex-col gap-3 min-h-[280px] sm:min-h-[300px] lg:h-[calc(100vh-320px)]">
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <div className="relative flex-1">
                <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={{ color: '#4D7E58' }} />
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg border-2 bg-white outline-none text-sm"
                  style={{ borderColor: '#4D7E58', color: '#0F571C' }}
                />
              </div>
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="w-full sm:w-auto sm:min-w-[180px] px-3 py-2 sm:py-2.5 rounded-lg border-2 bg-white outline-none text-sm"
                style={{ borderColor: '#4D7E58', color: '#0F571C' }}
              >
                <option value="">All provinces</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div
              ref={listRef}
              className="flex-1 min-h-0 overflow-auto rounded-xl border-2"
              style={{ borderColor: '#BEB68F' }}
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const form = filteredForms[virtualRow.index]
                  const isSelected = selectedForm?.id === form.id
                  return (
                    <div
                      key={form.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                        padding: '4px 8px',
                      }}
                    >
                      <button
                        onClick={() => setSelectedForm(form)}
                        className="w-full text-left p-2.5 sm:p-3 rounded-lg border-2 transition-all min-h-[64px] sm:min-h-[72px]"
                        style={isSelected
                          ? { borderColor: '#0F571C', backgroundColor: '#e8f0e9' }
                          : { borderColor: '#BEB68F', backgroundColor: '#fff' }
                        }
                      >
                        <div className="font-medium truncate text-sm" style={{ color: '#0F571C' }}>
                          {form.lastName}, {form.firstName}
                        </div>
                        <div className="text-xs truncate" style={{ color: '#4D7E58' }}>{form.designation} • {form.municipality}</div>
                        <div className="text-xs" style={{ color: '#6b7f6b' }}>{formatDate(form.createdAt)}</div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            {(hasMore || loadingMore) && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-70"
                style={{ backgroundColor: '#0F571C' }}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>

          <div className="flex flex-col min-h-[280px] sm:min-h-[300px] lg:h-[calc(100vh-320px)]">
            {selectedForm ? (
              <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col h-full" style={{ border: '3px solid #BEB68F' }}>
                <div className="text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 gap-2" style={{ backgroundColor: '#0F571C' }}>
                  <h2 className="font-semibold text-sm sm:text-base truncate">
                    {selectedForm.firstName} {selectedForm.middleInitial} {selectedForm.lastName} {selectedForm.nameExtension}
                  </h2>
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="lg:hidden p-1 hover:bg-white/20 rounded"
                  >
                    <Icon icon="mdi:close" className="text-xl" />
                  </button>
                </div>
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
                  <DetailRow label="Office Address" value={selectedForm.officeAddress} />
                  <DetailRow label="Designation" value={selectedForm.designation} />
                  <DetailRow label="Contact #" value={selectedForm.contactNumber} />
                  <DetailRow label="Email" value={selectedForm.emailAddress} />
                  <DetailRow label="Province" value={selectedForm.province} />
                  <DetailRow label="Municipality" value={selectedForm.municipality} />
                  <DetailRow label="Submitted" value={formatDate(selectedForm.createdAt)} />
                </div>
              </div>
            ) : (
              <div className="flex bg-white rounded-xl items-center justify-center min-h-[120px] lg:min-h-0 lg:h-full text-sm py-8 lg:py-0" style={{ border: '2px solid #BEB68F', color: '#4D7E58' }}>
                Select a form to view details
              </div>
            )}
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !logoutLoading && setShowLogoutModal(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-5 sm:p-6" onClick={(e) => e.stopPropagation()} style={{ border: '2px solid #BEB68F' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f0e9' }}>
                <Icon icon="mdi:logout" className="text-2xl" style={{ color: '#0F571C' }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: '#0F571C' }}>Logout</h3>
            </div>
            <p className="text-sm mb-6" style={{ color: '#4D7E58' }}>Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={logoutLoading}
                className="flex-1 py-2.5 rounded-lg font-medium border-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ borderColor: '#BEB68F', color: '#4D7E58' }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex-1 py-2.5 rounded-lg font-medium text-white transition-colors hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: '#0F571C' }}
              >
                {logoutLoading ? (
                  <>
                    <span className="animate-spin">
                      <Icon icon="mdi:loading" className="text-lg" />
                    </span>
                    Logging out...
                  </>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div>
      <span className="text-xs sm:text-sm font-medium" style={{ color: '#4D7E58' }}>{label}</span>
      <p className="mt-0.5 break-words text-sm sm:text-base" style={{ color: '#0F571C' }}>{value || '-'}</p>
    </div>
  )
}
