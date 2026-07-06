import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Sparkles, Database, LogOut, GraduationCap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const canManage = user?.role === 'admin' || user?.role === 'teacher'

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tutor', label: 'AI Tutor', icon: Sparkles },
    ...(canManage ? [{ to: '/manage', label: 'Manage Data', icon: Database }] : []),
  ]

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-violet-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-2 rounded-xl shadow-lg shadow-violet-200">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight gradient-text">
            Student Performance Tracker
          </span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-violet-200'
                    : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700 leading-tight">{user?.full_name}</p>
          <p className="text-xs text-violet-400 capitalize leading-tight font-medium">{user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-violet-200">
          {user?.full_name?.[0]?.toUpperCase()}
        </div>
        <button
          onClick={logout}
          className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  )
}
