import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Clock, Filter, Search, History } from 'lucide-react'
import { transactionAPI } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import toast from 'react-hot-toast'

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm, filter])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await transactionAPI.getTransactions()
      setTransactions(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = [...transactions]

    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter)
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        (t.receiver || t.toUsername || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.sender || t.fromUsername || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTransactions(filtered)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const stats = {
    total: transactions.length,
    credited: transactions.filter(t => t.type === 'CREDIT').length,
    debited: transactions.filter(t => t.type === 'DEBIT').length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
  }

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Transaction History</h1>
        <p className="text-gray-400 text-lg">Detailed record of your financial activity</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Transactions', value: stats.total, color: 'cyan' },
          { label: 'Total Credits', value: stats.credited, color: 'green' },
          { label: 'Total Debits', value: stats.debited, color: 'red' },
          { label: 'Volume', value: formatCurrency(stats.totalAmount), color: 'purple' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-8">
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            <div className="flex-1">
              <Input
                placeholder="Search by user or detail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                className="bg-white/[0.03] border-white/10 h-14 rounded-2xl pl-12"
              />
            </div>
            <div className="flex p-1 glass rounded-2xl w-fit">
              {['all', 'CREDIT', 'DEBIT'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    filter === type 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'CREDIT' ? 'Credits' : 'Debits'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
              <p className="text-gray-400 animate-pulse">Fetching history...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-24 opacity-50">
              <div className="p-6 bg-white/5 rounded-full w-fit mx-auto mb-4">
                <History className="w-12 h-12 text-gray-500" />
              </div>
              <p className="text-gray-400 text-xl font-medium">No records found</p>
              <p className="text-gray-500 mt-1">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-8 px-8">
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                    <th className="text-left py-2 px-6">Status</th>
                    <th className="text-left py-2 px-6">User Details</th>
                    <th className="text-left py-2 px-6">Timestamp</th>
                    <th className="text-right py-2 px-6">Transaction Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-dark hover:bg-white/[0.05] transition-all group"
                    >
                      <td className="py-5 px-6 rounded-l-2xl border-l border-y border-white/5">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                          transaction.type === 'CREDIT'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {transaction.type === 'CREDIT' ? (
                            <ArrowDownLeft size={14} />
                          ) : (
                            <ArrowUpRight size={14} />
                          )}
                          {transaction.type}
                        </div>
                      </td>
                      <td className="py-5 px-6 border-y border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-bold group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all">
                            {(transaction.type === 'CREDIT' 
                              ? (transaction.sender || transaction.fromUsername || 'S')
                              : (transaction.receiver || transaction.toUsername || 'R')
                            )[0].toUpperCase()}
                          </div>
                          <span className="text-white font-bold">
                            {transaction.type === 'CREDIT'
                              ? transaction.sender || transaction.fromUsername || 'System'
                              : transaction.receiver || transaction.toUsername || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6 border-y border-white/5">
                        <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                          <Clock size={14} className="opacity-50" />
                          {formatDate(transaction.timestamp)}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right rounded-r-2xl border-r border-y border-white/5">
                        <span className={`text-xl font-bold ${
                          transaction.type === 'CREDIT' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'CREDIT' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

export default TransactionHistoryPage
