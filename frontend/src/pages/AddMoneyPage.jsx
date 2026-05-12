import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { walletAPI } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import toast from 'react-hot-toast'

const AddMoneyPage = () => {
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fetchingBalance, setFetchingBalance] = useState(true)

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      setFetchingBalance(true)
      const response = await walletAPI.getBalance()
      setBalance(response.data.balance || 0)
    } catch (error) {
      toast.error('Failed to fetch balance')
    } finally {
      setFetchingBalance(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const amountValue = parseFloat(amount)
    if (!amountValue || amountValue <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (amountValue < 1) {
      toast.error('Minimum amount is $1')
      return
    }

    if (amountValue > 10000) {
      toast.error('Maximum amount is $10,000')
      return
    }

    setLoading(true)
    try {
      const response = await walletAPI.addMoney({ amount: amountValue })
      toast.success('Money added successfully!')
      setAmount('')
      fetchBalance()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add money')
    } finally {
      setLoading(false)
    }
  }

  const quickAmounts = [100, 500, 1000, 5000]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex p-4 glass rounded-3xl mb-6 neon-border">
          <ArrowDownLeft className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Add Money</h1>
        <p className="text-gray-400 text-lg">Top up your wallet balance instantly</p>
      </motion.div>

      <Card className="p-8 sm:p-10 glass-dark border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-300 ml-1 uppercase tracking-wider">Amount to Add</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-green-400 group-focus-within:scale-110 transition-transform">₹</div>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-8 pl-16 pr-8 text-4xl font-bold text-white focus:outline-none focus:border-green-500/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[100, 500, 1000, 2000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val.toString())}
                className="py-4 glass rounded-2xl text-lg font-bold text-gray-400 hover:text-white hover:border-green-500/50 hover:bg-green-500/5 transition-all"
              >
                +₹{val}
              </button>
            ))}
          </div>

          <div className="p-6 glass rounded-2xl border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Transaction Limits</h4>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Minimum</span>
              <span className="text-white font-bold">₹1.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Maximum</span>
              <span className="text-white font-bold">₹10,000.00</span>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            className="h-16 rounded-2xl text-xl font-bold shadow-lg shadow-green-500/20"
          >
            Confirm & Deposit
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default AddMoneyPage
