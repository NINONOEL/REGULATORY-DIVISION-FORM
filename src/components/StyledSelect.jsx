import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'

export default function StyledSelect({ name, value, onChange, options, placeholder, required, openUp = false, className = '', style = {} }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, bottom: null, width: 0 })
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const gap = 8
      const maxWidth = Math.min(rect.width, vw - 24)
      const left = Math.max(12, Math.min(rect.left, vw - maxWidth - 12))
      const width = Math.min(rect.width, maxWidth, vw - left - 12)

      if (openUp) {
        setPos({
          top: 'auto',
          bottom: vh - rect.top + gap,
          left,
          width,
        })
      } else {
        setPos({
          top: rect.bottom + gap,
          bottom: null,
          left,
          width,
        })
      }
    }
  }, [open, openUp])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayText = value ? options.find((o) => o === value) || value : placeholder

  const dropdown = open && (
    <div
      ref={menuRef}
      className={`fixed z-[9999] py-1 rounded-lg shadow-xl border-2 overflow-hidden animate-dropdown ${openUp ? 'animate-dropdown-up' : 'animate-dropdown-down'}`}
      style={{
        ...(openUp ? { bottom: pos.bottom, top: 'auto' } : { top: pos.top }),
        left: pos.left,
        width: pos.width,
        backgroundColor: '#FFFFFF',
        borderColor: '#4D7E58',
        maxHeight: 'min(220px, 45vh)',
        overflowY: 'auto',
      }}
    >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange({ target: { name, value: opt } })
                setOpen(false)
              }}
              className="w-full px-4 py-3 text-left font-poppins text-sm transition-all duration-150 flex items-center gap-2"
              style={{
                color: '#0F571C',
                backgroundColor: value === opt ? '#e8f0e9' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (value !== opt) e.currentTarget.style.backgroundColor = '#F1EAD6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = value === opt ? '#e8f0e9' : 'transparent'
              }}
            >
              {value === opt && <Icon icon="mdi:check" className="text-lg" style={{ color: '#0F571C' }} />}
              <span className={value === opt ? 'font-semibold' : 'font-medium'}>{opt}</span>
            </button>
          ))}
    </div>
  )

  return (
    <>
      <div ref={triggerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full px-3 py-2.5 sm:py-2 rounded-lg border-2 bg-white font-poppins text-base sm:text-sm text-left outline-none transition-all duration-200 min-h-[44px] flex items-center justify-between gap-2 hover:shadow-sm ${className}`}
          style={{
            ...style,
            borderColor: open ? '#0F571C' : style.borderColor || '#4D7E58',
            color: value ? style.color || '#0F571C' : '#4D7E58',
            boxShadow: open ? '0 0 0 2px rgba(15, 87, 28, 0.3)' : undefined,
        }}
      >
        <span className={value ? 'font-medium' : 'opacity-80'}>{displayText}</span>
        <Icon
          icon="mdi:chevron-down"
          className={`text-xl transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          style={{ color: '#0F571C' }}
        />
      </button>
      {typeof document !== 'undefined' && createPortal(dropdown || null, document.body)}
    </div>
    </>
  )
}
