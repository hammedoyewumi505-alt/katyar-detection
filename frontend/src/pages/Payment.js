import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Payment() {
  const { planId } = useParams()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [screenshotFile, setScreenshotFile] = useState(null)
  const [transactionId, setTransactionId] = useState('')

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true)
      setError('')
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single()

      if (error) {
        setError('Failed to load plan details')
      } else {
        setPlan(data)
      }
      setLoading(false)
    }

    fetchPlan()
  }, [planId])

  const pricePk = useMemo(() => {
    if (!plan) return ''
    return `₨${plan.price ?? ''}`
  }, [plan])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!transactionId.trim()) {
      setError('Transaction ID is required')
      return
    }

    if (!screenshotFile) {
      setError('Please upload a payment screenshot')
      return
    }

    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user
    if (!user) {
      setError('Please sign in to submit payment')
      return
    }

    setSubmitting(true)

    try {
      const timestamp = Date.now()
      const fileExt = screenshotFile.name.split('.').pop() || 'png'
      const storagePath = `${user.id}/${planId}/${timestamp}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(storagePath, screenshotFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const screenshotPublicUrl = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(storagePath).data.publicUrl

      const { error: insertError } = await supabase
        .from('user_plans')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'pending',
          transaction_id: transactionId.trim(),
          screenshot_path: screenshotPublicUrl,
          created_at: new Date().toISOString()
        })

      if (insertError) throw insertError

      setSuccess(
        'Payment submitted successfully. Your account will be activated within 24 hours after verification.'
      )
      setSubmitting(false)
    } catch (err) {
      setSubmitting(false)
      setError(err?.message || 'Payment submission failed')
    }
  }

  if (loading) return <div className="p-6 text-center">Loading plan...</div>
  if (!plan) return <div className="p-6 text-center">Plan not found</div>

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold text-gray-900">Payment</h1>
      <p className="mt-2 text-gray-600">Submit your payment proof to activate your account.</p>

      <div className="mt-6 border rounded-2xl p-6 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-gray-900">Selected Plan</div>
            <div className="mt-1 text-2xl font-extrabold" style={{ color: '#1E40AF' }}>
              {plan.name}
            </div>
            <div className="mt-1 text-gray-600">Price: {pricePk}</div>
          </div>
          <div className="text-xs text-gray-500">Status: Pending Review</div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <div className="text-sm font-bold text-gray-900 mb-2">Bank Transfer Instructions</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 border rounded-xl bg-gray-50">
                <div className="text-gray-500">Bank Name</div>
                <div className="font-semibold text-gray-900">[Bank Name]</div>
              </div>
              <div className="p-3 border rounded-xl bg-gray-50">
                <div className="text-gray-500">Account Title</div>
                <div className="font-semibold text-gray-900">Katyar Detection</div>
              </div>
              <div className="p-3 border rounded-xl bg-gray-50 sm:col-span-2">
                <div className="text-gray-500">Account Number</div>
                <div className="font-semibold text-gray-900">[Account Number]</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Upload Payment Screenshot
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Transaction ID</label>
            <input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-2.5 border rounded-lg"
              placeholder="e.g., TRX123456"
            />
          </div>

          {error ? <div className="text-red-600 text-sm">{error}</div> : null}
          {success ? <div className="text-green-700 text-sm">{success}</div> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1E40AF] text-white py-2.5 rounded-lg font-semibold hover:bg-[#1E40AF]/90 disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Payment'}
          </button>
        </form>
      </div>
    </div>
  )
}

