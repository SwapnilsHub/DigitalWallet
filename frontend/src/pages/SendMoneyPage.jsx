import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Wallet, User, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { walletAPI } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

const SendMoneyPage = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    receiver: '',
    amount: '',
  })
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fetchingBalance, setFetchingBalance] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [errors, setErrors] = useState({})

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.receiver) {
      newErrors.receiver = 'Receiver username is required'
    } else if (formData.receiver === user?.username) {
      newErrors.receiver = 'Cannot send money to yourself'
    }

    const amountValue = parseFloat(formData.amount)
    if (!formData.amount || amountValue <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    } else if (amountValue < 1) {
      newErrors.amount = 'Minimum amount is $1'
    } else if (amountValue > balance) {
      newErrors.amount = 'Insufficient balance'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    setShowConfirmModal(true)
  }

  const confirmSend = async () => {
    setLoading(true)
    try {
      await walletAPI.sendMoney({
        toUsername: formData.receiver,
        amount: parseFloat(formData.amount),
      })
      toast.success('Money sent successfully!')
      setFormData({ receiver: '', amount: '' })
      setShowConfirmModal(false)
      fetchBalance()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send money')
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
          <Send className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Send Money</h1>
        <p className="text-gray-400 text-lg">Transfer funds to anyone instantly</p>
      </motion.div>

      <Card className="p-8 sm:p-10 glass-dark border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-300 ml-1 uppercase tracking-wider">Recipient Details</label>
            <Input
              icon={User}
              type="text"
              name="receiver"
              placeholder="Recipient's username"
              value={formData.receiver}
              onChange={handleChange}
              error={errors.receiver}
              required
              inputClassName="h-16 rounded-2xl text-lg !bg-white/[0.03] !border-white/10 focus:!border-cyan-500/50"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-300 ml-1 uppercase tracking-wider">Amount to Send</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-cyan-400 group-focus-within:scale-110 transition-transform">₹</div>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                name="amount"
                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-8 pl-16 pr-8 text-4xl font-bold text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-700"
                required
              />
              {errors.amount && <p className="mt-2 text-sm text-red-400">{errors.amount}</p>}
            </div>
          </div>

          <div className="p-6 glass rounded-2xl border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Transaction Summary</h4>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Transfer Fee</span>
              <span className="text-green-400 font-bold">₹0.00</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-gray-500">Total to Deduct</span>
              <span className="text-white font-bold text-xl">₹{formData.amount || '0.00'}</span>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            className="h-16 rounded-2xl text-xl font-bold shadow-lg shadow-cyan-500/20"
          >
            Send Money Now
          </Button>
        </form>
      </Card>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Transaction"
      >
        <div className="space-y-6">
          <div className="p-6 glass rounded-xl">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Receiver</span>
                <span className="text-white font-medium">{formData.receiver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-bold text-xl">
                  {formatCurrency(parseFloat(formData.amount))}
                </span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between">
                <span className="text-gray-400">Fee</span>
                <span className="text-green-400 font-medium">₹0.00</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between">
                <span className="text-gray-400">Total</span>
                <span className="text-white font-bold text-xl">
                  {formatCurrency(parseFloat(formData.amount))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              fullWidth
              loading={loading}
              onClick={confirmSend}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SendMoneyPage
