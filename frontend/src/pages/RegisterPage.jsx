import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const registerResponse = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      
      // Check if registration response already includes a token
      let { token, user } = registerResponse.data
      
      // If no token in registration response, perform auto-login
      if (!token) {
        console.log('No token in registration response, performing auto-login...')
        const loginResponse = await authAPI.login({
          username: formData.username,
          password: formData.password
        })
        token = loginResponse.data.token
        user = loginResponse.data.user
      }
      
      if (token) {
        login(token, user)
        toast.success('Account created and logged in!')
        navigate('/dashboard')
      } else {
        // Fallback if somehow both fail to give a token
        toast.success('Account created! Please sign in.')
        navigate('/login')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(errorMessage)
      console.error('Registration Error details:', error)
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

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: 'Contains letters', met: /[a-zA-Z]/.test(formData.password) },
    { text: 'Contains numbers', met: /\d/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

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
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Create Account</h1>
          <p className="text-gray-400 text-lg">Join the future of digital finance</p>
        </div>

        <div className="p-8 sm:p-10 glass-dark border border-white/5 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Username</label>
              <Input
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                autoComplete="username"
                className="bg-white/[0.03] border-white/10 focus:border-cyan-500/50 h-14 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
              <Input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
                className="bg-white/[0.03] border-white/10 focus:border-cyan-500/50 h-14 rounded-2xl"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
                className="bg-white/[0.03] border-white/10 focus:border-cyan-500/50 h-14 rounded-2xl"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="h-14 rounded-2xl text-lg font-bold shadow-lg shadow-cyan-500/20"
            >
              Get Started
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors underline-offset-4 hover:underline">
                Sign in
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

export default RegisterPage
