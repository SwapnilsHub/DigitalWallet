import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Clock,
  MoreHorizontal
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { walletAPI, transactionAPI } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [totalCredited, setTotalCredited] = useState(0)
  const [totalDebited, setTotalDebited] = useState(0)
  const [transactionCount, setTransactionCount] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [balanceRes, transactionsRes] = await Promise.all([
        walletAPI.getBalance(),
        transactionAPI.getTransactions()
      ])

      const balanceData = balanceRes.data
      const transactions = transactionsRes.data || []

      setBalance(balanceData.balance || 0)
      setTotalCredited(balanceData.totalCredited || 0)
      setTotalDebited(balanceData.totalDebited || 0)
      setTransactionCount(transactions.length)
      
      setRecentTransactions(transactions.slice(0, 5))
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{user?.username || 'User'}</span>! 👋
          </h1>
          <p className="text-gray-400 text-lg">Here's a summary of your digital assets</p>
        </div>
        <div className="flex gap-4">
          <Link to="/add-money">
            <Button variant="success" className="shadow-lg shadow-green-500/20 px-8">
              <ArrowDownLeft className="w-5 h-5 mr-2" />
              Add Money
            </Button>
          </Link>
          <Link to="/send-money">
            <Button variant="primary" className="shadow-lg shadow-cyan-500/20 px-8">
              <ArrowUpRight className="w-5 h-5 mr-2" />
              Send Money
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card glow className="lg:col-span-2 p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet size={120} className="text-cyan-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl border border-cyan-500/20">
                  <Wallet className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-400 font-medium uppercase tracking-wider text-xs">Total Balance</p>
                  <h2 className="text-5xl font-bold text-white text-glow mt-1">
                    {formatCurrency(balance)}
                  </h2>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20 text-green-400">
                  <TrendingUp size={18} />
                  <span className="text-sm font-bold">+12.5%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 glass rounded-2xl border border-white/5 group hover:border-green-500/30 transition-all">
                <p className="text-gray-400 text-sm font-medium mb-2">Total Credited</p>
                <p className="text-2xl font-bold text-green-400 group-hover:scale-105 transition-transform origin-left">{formatCurrency(totalCredited)}</p>
              </div>
              <div className="p-6 glass rounded-2xl border border-white/5 group hover:border-red-500/30 transition-all">
                <p className="text-gray-400 text-sm font-medium mb-2">Total Debited</p>
                <p className="text-2xl font-bold text-red-400 group-hover:scale-105 transition-transform origin-left">{formatCurrency(totalDebited)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 flex flex-col justify-between">
          <div>
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl border border-purple-500/20 w-fit mb-6">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-widest">Total Transactions</p>
            <p className="text-5xl font-bold text-white mb-8">{transactionCount}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5">
              <span className="text-gray-400">Activity Month</span>
              <span className="text-white font-bold">
                {recentTransactions.filter(t => {
                  const date = new Date(t.timestamp)
                  const now = new Date()
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                }).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-green-400 font-bold">99.9%</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h3>
            <Link to="/transactions">
              <Button variant="ghost" size="sm" className="hover:bg-white/10 px-4">
                View All Transactions
              </Button>
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <div className="p-6 bg-white/5 rounded-full mb-4">
                <Wallet className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">No transactions yet</p>
              <p className="text-gray-500 mt-1">Your activity will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-5 glass rounded-2xl hover:bg-white/[0.05] transition-all border border-white/5 group"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-xl transition-transform group-hover:scale-110 ${
                      transaction.type === 'CREDIT' 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      {transaction.type === 'CREDIT' ? (
                        <ArrowDownLeft className="w-6 h-6 text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg leading-tight">
                        {transaction.type === 'CREDIT' ? 'Funds Received' : 'Payment Sent'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                        <Clock size={14} className="opacity-50" />
                        {formatDate(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-xl ${
                      transaction.type === 'CREDIT' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'CREDIT' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    {(transaction.receiver || transaction.toUsername) && (
                      <p className="text-gray-400 text-sm font-medium mt-1">
                        {transaction.type === 'CREDIT' ? 'from' : 'to'} <span className="text-white">{transaction.receiver || transaction.toUsername}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Quick Actions</h3>
            <div className="space-y-4">
              <Link to="/add-money">
                <Button variant="outline" fullWidth className="justify-start h-16 px-6 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-2xl group">
                  <div className="p-2 bg-green-500/10 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                    <ArrowDownLeft className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-lg">Add Money</span>
                </Button>
              </Link>
              <Link to="/send-money">
                <Button variant="outline" fullWidth className="justify-start h-16 px-6 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-2xl group">
                  <div className="p-2 bg-purple-500/10 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-lg">Send Money</span>
                </Button>
              </Link>
              <Link to="/transactions">
                <Button variant="outline" fullWidth className="justify-start h-16 px-6 border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl group">
                  <div className="p-2 bg-blue-500/10 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-lg">View History</span>
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Account Insight</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-gray-400 font-medium">Status</span>
                </div>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/20">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-gray-400 font-medium">Tier</span>
                </div>
                <span className="text-white font-bold">Premium User</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Member Since</span>
                <span className="text-white font-bold opacity-80">
                  {user?.createdAt ? formatDate(user.createdAt).split(',')[0] : 'May 2024'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
