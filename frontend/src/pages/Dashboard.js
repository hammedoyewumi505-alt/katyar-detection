import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const [userPlanRow, setUserPlanRow] = useState(null) // user_plans row with plans join
  const [scans, setScans] = useState([])


  const [uploadFile, setUploadFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const [analyzeSuccess, setAnalyzeSuccess] = useState('')

  const backendUrl = process.env.REACT_APP_BACKEND_URL

  const fetchData = useCallback(async () => {
    setLoading(true)
    setAnalyzeError('')
    setAnalyzeSuccess('')

    const { data: authData } = await supabase.auth.getUser()
    const u = authData?.user || null
    setUser(u)

    const DEMO_EMAIL = 'demo@katyardetection.com'
    if (u?.email === DEMO_EMAIL) {
      const today = new Date().toISOString().split('T')[0]

      const { data: planData } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', u.id)
        .eq('status', 'active')
        .single()

      if (planData && planData.last_refill_date !== today) {
        await supabase
          .from('user_plans')
          .update({
            slots_remaining: 100,
            last_refill_date: today
          })
          .eq('id', planData.id)
      }
    }

    if (!u) {
      setUserPlanRow(null)
      setScans([])
      setLoading(false)
      return
    }

    const { data: planData } = await supabase
      .from('user_plans')
      .select('*, plans(*)')
      .eq('user_id', u.id)
      .eq('status', 'active')
      .single()

    setUserPlanRow(planData || null)

    const { data: scansData, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', u.id)
      .order('created_at', { ascending: false })

    if (!error) setScans(scansData || [])
    else setScans([])

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const hasProcessing = scans.some((s) => s.status === 'processing')
    if (!hasProcessing) return

    const interval = setInterval(() => {
      fetchData()
    }, 15000)

    return () => clearInterval(interval)
  }, [scans, fetchData])


  const planStatus = useMemo(() => {
    if (!user) return null
    if (!userPlanRow) return 'none'

    const total = userPlanRow.plans?.slots ?? userPlanRow.plans?.slot_total ?? userPlanRow.plans?.slots_total ?? 0
    const remaining = userPlanRow.slots_remaining ?? 0

    return {
      remaining,
      total
    }
  }, [user, userPlanRow])

  const hasActivePlan = Boolean(user && userPlanRow)
  const slotsRemaining = userPlanRow?.slots_remaining ?? 0

  const handleAnalyze = async () => {
    setAnalyzeError('')
    setAnalyzeSuccess('')

    if (!uploadFile) {
      setAnalyzeError('Please upload a document to analyze.')
      return
    }

    if (uploadFile.size > 10 * 1024 * 1024) {
      setAnalyzeError('File too large. Max size is 10MB.')
      return
    }

    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (uploadFile.type && !allowed.includes(uploadFile.type)) {
      // Some browsers may not set correct mime for .docx; fallback to extension.
      const ext = uploadFile.name.toLowerCase().split('.').pop()
      const ok = ['pdf', 'docx', 'txt'].includes(ext)
      if (!ok) {
        setAnalyzeError('Only PDF, DOCX, or TXT files are supported.')
        return
      }
    }

    if (!backendUrl) {
      setAnalyzeError('Backend URL not configured. Please check .env.')
      return
    }

    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      if (userPlanRow?.plans?.id) formData.append('plan_id', userPlanRow.plans.id)

      const res = await fetch(`${backendUrl}/api/scan`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.access_token || ''}`
        },
        body: formData
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || 'Scan failed')
      }

      setAnalyzeSuccess('Scan complete. Reports are being prepared...')

      // Refresh scans
      const { data: scansData } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setScans(scansData || [])
      setUploadFile(null)
    } catch (err) {
      setAnalyzeError(err?.message || 'Scan failed')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-red-600 font-semibold">Please sign in to view your dashboard.</div>
      </div>
    )
  }

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Welcome back, {fullName}</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {hasActivePlan ? (
          <div className="md:col-span-1 border rounded-2xl p-6 shadow-sm bg-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-gray-600">Current Plan</div>
                <div className="text-xl font-extrabold text-gray-900 mt-1">
                  {userPlanRow.plans?.name || 'Plan'}
                </div>
              </div>
              <div className="text-sm font-semibold" style={{ color: '#1E40AF' }}>
                {slotsRemaining} left
              </div>
            </div>

            <div className="mt-5">
              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-[#1E40AF]"
                  style={{ width: `${planStatus?.total ? (planStatus.remaining / planStatus.total) * 100 : 0}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {planStatus?.remaining ?? slotsRemaining} slots remaining out of {planStatus?.total ?? userPlanRow.plans?.slots ?? 0}
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-1 border rounded-2xl p-6 shadow-sm bg-white">
            <div className="text-sm font-bold text-gray-600">Plan Status</div>
            <div className="text-xl font-extrabold text-gray-900 mt-1">No Active Plan</div>
            <div className="mt-3 text-sm text-gray-600">
              You need an active plan to analyze documents.
            </div>
            <a
              href="/pricing"
              className="mt-5 inline-flex px-4 py-2 rounded-xl font-semibold text-white"
              style={{ background: '#1E40AF' }}
            >
              View Pricing
            </a>
          </div>
        )}

        <div className="border rounded-2xl p-6 shadow-sm bg-white">
          <div className="text-sm font-bold text-gray-600">Total Scans</div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">{scans.length}</div>
        </div>

        <div className="border rounded-2xl p-6 shadow-sm bg-white">
          <div className="text-sm font-bold text-gray-600">AI Detected</div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">
            {scans.filter((s) => s.verdict === 'AI' || s.is_ai).length}
          </div>
        </div>
      </div>

      {hasActivePlan && slotsRemaining > 0 ? (
        <div className="mt-6 border rounded-2xl p-6 shadow-sm bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-extrabold text-gray-900">Upload & Analyze</div>
              <div className="text-sm text-gray-600 mt-1">Accepts PDF, DOCX, TXT • Max 10MB</div>
            </div>
            {analyzing ? (
              <div className="text-sm font-semibold text-[#1E40AF]">Analyzing…</div>
            ) : null}
          </div>

          <div className="mt-5">
            <label
              htmlFor="file-upload"
              className={`block border-2 border-dashed rounded-2xl p-6 cursor-pointer transition ${
                analyzing ? 'opacity-70 pointer-events-none' : ''
              }`}
              style={{ borderColor: '#1E40AF' }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="font-bold text-gray-900">Drop your file here</div>
                  <div className="text-sm text-gray-600">or click to upload</div>
                </div>
                <div className="text-sm text-gray-600">
                  {uploadFile ? `Selected: ${uploadFile.name}` : 'No file selected'}
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="application/pdf,.docx,.txt"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                disabled={analyzing}
              />
            </label>
          </div>

          {analyzeError ? <div className="mt-3 text-red-600 text-sm">{analyzeError}</div> : null}
          {analyzeSuccess ? <div className="mt-3 text-green-700 text-sm">{analyzeSuccess}</div> : null}

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="mt-5 w-full bg-[#1E40AF] text-white py-3 rounded-xl font-semibold hover:bg-[#1E40AF]/90 disabled:opacity-60"
          >
            {analyzing ? 'Analyzing your document, please wait...' : 'Analyze Document'}
          </button>
        </div>
      ) : null}

      <div className="mt-6 border rounded-2xl bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-gray-50 font-extrabold">Recent Scans</div>
        <div className="overflow-x-auto">
          {scans.length ? (
            <table className="min-w-full text-sm">
              <thead className="bg-white border-b">
                <tr className="text-left">
                  <th className="p-3">Document Name</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">AI%</th>
                  <th className="p-3">Plagiarism%</th>
                  <th className="p-3">Reports</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan) => (
                  <tr key={scan.id} className="border-b">
                    <td className="p-3 font-medium">{scan.document_name || 'Untitled Document'}</td>
                    <td className="p-3 text-gray-600">{scan.created_at ? new Date(scan.created_at).toLocaleString() : '-'}</td>
                    <td className="p-3">{scan.ai_percentage ?? '-'}</td>
                    <td className="p-3">
                      {scan.status === 'processing' && scan.plagiarism_percentage === null ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#fef3c7',
                            color: '#92400e',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#f59e0b',
                              animation: 'pulse 1.5s infinite'
                            }}
                          ></span>
                          Processing...
                        </span>
                      ) : (
                        <span
                          style={{
                            fontWeight: '700',
                            color: scan.plagiarism_percentage > 30 ? '#ef4444' : '#22c55e'
                          }}
                        >
                          {scan.plagiarism_percentage}%
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          className="px-3 py-2 rounded-lg font-semibold text-white"
                          style={{ background: '#1E40AF' }}
                          onClick={async () => {
                            window.location.href = `${backendUrl}/api/generate-ai-report?scanId=${scan.id}`
                          }}
                        >
                          Download AI Report
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg font-semibold text-white"
                          style={{
                            background: scan.status === 'processing' || scan.plagiarism_percentage === null ? '#94a3b8' : '#1E40AF'
                          }}
                          disabled={scan.status === 'processing' || scan.plagiarism_percentage === null}
                          onClick={async () => {
                            if (scan.status === 'processing' || scan.plagiarism_percentage === null) return
                            window.location.href = `${backendUrl}/api/generate-plagiarism-report?scanId=${scan.id}`
                          }}
                        >
                          {scan.status === 'processing' || scan.plagiarism_percentage === null ? 'Pending...' : 'Download Plagiarism Report'}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-gray-600">No documents analyzed yet. Upload your first document above.</div>
          )}
        </div>
      </div>
    </div>
  )
}

