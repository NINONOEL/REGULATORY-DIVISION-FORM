import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="text-white shadow-lg" style={{ backgroundColor: '#0F571C' }}>
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity min-w-0">
            <img 
              src="/RD LOGO.png" 
              alt="DA MIMAROPA Regulatory Division Logo" 
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-semibold tracking-tight truncate">Regulatory Division</h1>
              <p className="text-white/90 text-xs sm:text-sm truncate">Form Submission System</p>
            </div>
          </Link>
        </div>
      </header>
      <main className="flex-1" style={{ backgroundColor: '#F1EAD6' }}>
        <Outlet />
      </main>
      <footer className="text-white py-3 sm:py-4 mt-auto" style={{ backgroundColor: '#0F571C' }}>
        <div className="max-w-6xl mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm text-white/90">
          © {new Date().getFullYear()} Regulatory Division - DA MIMAROPA
        </div>
      </footer>
    </div>
  )
}
