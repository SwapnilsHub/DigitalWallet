import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 h-screen flex flex-col relative z-10 overflow-hidden">
        <header className="lg:hidden flex-none glass-dark border-b border-white/5 px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 text-gray-400 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              DigitalWallet
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 lg:pt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                {children}
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
