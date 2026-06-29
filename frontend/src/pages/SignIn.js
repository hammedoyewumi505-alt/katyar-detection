import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SignIn() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold"
            style={{ background: '#1E40AF', color: 'white' }}
          >
            KD
          </div>
        </div>
        <h1 className="text-center text-2xl font-extrabold text-gray-900">Katyar Detection</h1>

        <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold mb-5">Sign In</h2>
          {error ? <div className="mb-4 text-red-600 text-sm">{error}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2.5 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-2.5 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mt-2 text-sm">
              <button
                type="button"
                className="text-[#1E40AF] font-semibold hover:underline"
                onClick={async () => {
                  if (!email) {
                    setError('Enter your email first')
                    return
                  }
                  setError('')
                  setLoading(true)
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/signin`
                  })
                  if (error) setError(error.message)
                  setLoading(false)
                }}
              >
                Forgot Password?
              </button>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E40AF] text-white py-2.5 rounded-lg font-semibold hover:bg-[#1E40AF]/90 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold" style={{ color: '#1E40AF' }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

