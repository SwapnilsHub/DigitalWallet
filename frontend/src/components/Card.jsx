import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  glass = true,
  glow = false
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300'
  const glassStyles = glass ? 'glass-dark' : 'bg-slate-900/50'
  const hoverStyles = hover ? 'hover:scale-[1.02] hover:shadow-xl' : ''
  const glowStyles = glow ? 'neon-border' : ''

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${glowStyles} ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Card
