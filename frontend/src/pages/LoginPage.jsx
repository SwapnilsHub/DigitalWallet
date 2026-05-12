import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username) {
      newErrors.username = 'Username is required'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await authAPI.login(formData)
      const { token, user } = response.data
      
      login(token, user)
      navigate('/dashboard')
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      toast.error(errorMessage)
      console.error('Login Error details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex p-4 glass rounded-3xl mb-6 neon-border"
          >
            <Wallet className="w-10 h-10 text-cyan-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 text-lg">Sign in to access your digital assets</p>
        </div>

        <div className="p-8 sm:p-10 glass-dark rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Username</label>
              <Input
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                autoComplete="username"
                className="bg-white/[0.03] border-white/10 focus:border-cyan-500/50 h-14 rounded-2xl"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-semibold text-gray-300">Password</label>
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot?</a>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="current-password"
                className="bg-white/[0.03] border-white/10 focus:border-cyan-500/50 h-14 rounded-2xl"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="h-14 rounded-2xl text-lg font-bold shadow-lg shadow-cyan-500/20"
            >
              Sign In
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link to="/" className="text-gray-500 hover:text-gray-300 transition-all text-sm font-medium flex items-center justify-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage
