import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const styles = {
  brand: {
    color: '#1E40AF'
  }
}

export default function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data?.user ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#1E40AF', color: 'white' }}
          >
            KD
          </div>
          <Link to="/" className="font-bold text-lg" style={styles.brand}>
            Katyar Detection
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#1E40AF] text-white hover:bg-[#1E40AF]/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

