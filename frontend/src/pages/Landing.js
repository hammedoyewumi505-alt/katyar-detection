import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import PricingCard from '../components/PricingCard'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import Footer from '../components/Footer'

const STATIC_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 900,
    slots: 10,
    features: [
      '10 document scans',
      'AI Writing Detection report',
      'Plagiarism Check report',
      '2 PDF reports per scan',
      'Secure file processing',
      'Auto file deletion after 1 hour'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 2300,
    slots: 25,
    features: [
      '25 document scans',
      'AI Writing Detection report',
      'Plagiarism Check report',
      '2 PDF reports per scan',
      'Secure file processing',
      'Auto file deletion after 1 hour'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 5500,
    slots: 60,
    features: [
      '60 document scans',
      'AI Writing Detection report',
      'Plagiarism Check report',
      '2 PDF reports per scan',
      'Secure file processing',
      'Auto file deletion after 1 hour'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9000,
    slots: 100,
    features: [
      '100 document scans',
      'AI Writing Detection report',
      'Plagiarism Check report',
      '2 PDF reports per scan',
      'Secure file processing',
      'Auto file deletion after 1 hour'
    ]
  }
]

function LandingStats() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 -mt-3 md:-mt-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-2xl p-5 text-center bg-white">
            <div className="text-3xl font-extrabold text-gray-900">10,000+</div>
            <div className="text-sm text-gray-600">Documents Scanned</div>
          </div>
          <div className="border rounded-2xl p-5 text-center bg-white">
            <div className="text-3xl font-extrabold text-gray-900">99%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="border rounded-2xl p-5 text-center bg-white">
            <div className="text-3xl font-extrabold text-gray-900">2</div>
            <div className="text-sm text-gray-600">Reports Generated Per Scan</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const plans = useMemo(() => STATIC_PLANS, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <LandingStats />
        <HowItWorks />
        <Features />

        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Pricing Preview</h2>
              <p className="mt-3 text-gray-600">Pick a plan and get access to scans + downloadable reports.</p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={{ ...plan, subtitle: 'Pay once, use slots anytime' }}
                  mostPopular={plan.id === 'pro'}
                  onBuyNow={() => navigate('/signup')}
                />
              ))}
            </div>
          </div>
        </section>

        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}


