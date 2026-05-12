import { Link, useNavigate } from 'react-router-dom'
import { Wallet, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = [
    { name: 'Home', path: '#home' },
    { name: 'Features', path: '#features' },
    { name: 'About', path: '#about' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20"
            >
              <Wallet className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
              DigitalWallet
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-sm font-bold text-gray-400 hover:text-white transition-all hover:tracking-widest duration-300 uppercase tracking-widest"
              >
                {link.name}
              </a>
            ))}
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-8 py-3.5 bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 hover:shadow-cyan-500/40 active:scale-95 transition-all duration-300 uppercase tracking-widest"
              >
                Get Started
              </Link>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 text-gray-400 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-dark border-t border-white/5 shadow-2xl"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="block text-lg font-bold text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <Link
                  to="/login"
                  className="block w-full text-center py-4 text-gray-400 font-bold hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black rounded-2xl shadow-lg shadow-cyan-500/20"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
