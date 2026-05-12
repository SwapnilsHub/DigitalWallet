import { useContext } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Shield, LogOut, Edit2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, logout } = useAuth()

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Profile & Settings</h1>
        <p className="text-gray-400 text-lg">Manage your digital identity and security</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <User size={150} className="text-cyan-400" />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-500">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-slate-900 border border-white/10 rounded-xl text-cyan-400 hover:text-white transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-white mb-1">{user?.username || 'User Account'}</h2>
                  <p className="text-gray-400 text-lg">{user?.email || 'user@example.com'}</p>
                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-wider border border-cyan-500/20">Verified</span>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-500/20">Premium</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 glass rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
                      <User size={20} />
                    </div>
                    <span className="text-gray-400 font-medium">Username</span>
                  </div>
                  <p className="text-xl font-bold text-white">{user?.username || 'N/A'}</p>
                </div>

                <div className="p-6 glass rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                      <Mail size={20} />
                    </div>
                    <span className="text-gray-400 font-medium">Email</span>
                  </div>
                  <p className="text-xl font-bold text-white truncate">{user?.email || 'N/A'}</p>
                </div>

                <div className="p-6 glass rounded-2xl border border-white/5 hover:border-green-500/30 transition-all group sm:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
                      <Calendar size={20} />
                    </div>
                    <span className="text-gray-400 font-medium">Account Created</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {user?.createdAt ? formatDate(user.createdAt) : 'May 10, 2024'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Security</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5">
                  <span className="text-gray-400 font-medium">2FA Status</span>
                  <span className="text-yellow-500 font-bold text-xs uppercase tracking-widest bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">Inactive</span>
                </div>
                <Button variant="outline" fullWidth className="h-14 rounded-2xl border-white/10 hover:border-cyan-500/50">
                  Update Password
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 border-red-500/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                  <LogOut size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Sessions</h3>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Log out of this device. Your data remains safe on our secure cloud.
              </p>
              <Button
                variant="danger"
                fullWidth
                onClick={handleLogout}
                className="h-14 rounded-2xl shadow-lg shadow-red-500/10 font-bold"
              >
                Sign Out Account
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
