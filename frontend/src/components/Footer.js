import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: '#1E40AF', color: 'white' }}
              >
                KD
              </div>
              <div>
                <div className="font-extrabold text-lg" style={{ color: '#1E40AF' }}>
                  Katyar Detection
                </div>
                <div className="text-sm text-gray-600">
                  Detect AI writing & plagiarism instantly.
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="font-bold text-sm text-gray-900">Company</div>
                <div className="mt-3 space-y-2">
                  <Link className="block text-sm text-gray-600 hover:text-gray-900" to="/">
                    Home
                  </Link>
                  <Link className="block text-sm text-gray-600 hover:text-gray-900" to="/pricing">
                    Pricing
                  </Link>
                  <a className="block text-sm text-gray-600 hover:text-gray-900" href="#how-it-works">
                    How it works
                  </a>
                </div>
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">Account</div>
                <div className="mt-3 space-y-2">
                  <Link className="block text-sm text-gray-600 hover:text-gray-900" to="/signin">
                    Sign In
                  </Link>
                  <Link className="block text-sm text-gray-600 hover:text-gray-900" to="/signup">
                    Sign Up
                  </Link>
                </div>
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">Support</div>
                <div className="mt-3 space-y-2">
                  <a className="block text-sm text-gray-600 hover:text-gray-900" href="#faq">
                    FAQ
                  </a>
                  <span className="block text-sm text-gray-600">help@katyardection.example</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-gray-500">
          © {new Date().getFullYear()} Katyar Detection. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

