import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, User, DollarSign } from 'lucide-react'
import { useState } from 'react'

const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  icon = null,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  name,
  autoComplete,
  rightIcon
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const getIcon = () => {
    if (icon) return icon
    if (type === 'password') return Lock
    if (type === 'email') return Mail
    if (name === 'username') return User
    if (name === 'amount') return DollarSign
    return null
  }

  const IconComponent = getIcon()

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {IconComponent && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <IconComponent size={20} />
          </div>
        )}
        <motion.input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 ${IconComponent ? 'pl-12' : ''} ${error ? 'border-red-500 focus:ring-red-500/50' : ''} ${isFocused ? 'shadow-lg shadow-cyan-500/20' : ''} ${inputClassName}`}
        />
        {type === 'password' && !rightIcon && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input
