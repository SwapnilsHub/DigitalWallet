import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Plus, 
  Send, 
  History, 
  User, 
  LogOut,
  Wallet,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Money', path: '/add-money', icon: Plus },
    { name: 'Send Money', path: '/send-money', icon: Send },
    { name: 'Transactions', path: '/transactions', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <>
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25 }}
        className={`fixed left-0 top-0 h-full w-72 glass-dark border-r border-white/5 z-50 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-white/5">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20 group-hover:rotate-12 transition-transform duration-500">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
                DigitalWallet
              </span>
            </Link>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-8">
            <nav className="space-y-2">
              <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Main Menu</p>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                      isActive
                        ? 'text-cyan-400 font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-500"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon
                      size={22}
                      className={`relative z-10 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'}`}
                    />
                    <span className="relative z-10 text-sm tracking-wide">{item.name}</span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="p-6 border-t border-white/5">
            <div className="glass rounded-2xl p-5 mb-6 border border-white/5 hover:border-cyan-500/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.username || 'User Account'}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate font-medium uppercase tracking-wider">
                    Premium Member
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/5 hover:text-red-300 transition-all duration-500 group"
            >
              <div className="p-2 rounded-lg bg-red-500/0 group-hover:bg-red-500/10 transition-all">
                <LogOut size={20} />
              </div>
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  )
}

export default Sidebar
