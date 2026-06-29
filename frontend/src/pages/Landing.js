import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import PricingCard from '../components/PricingCard'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

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
  const [plans, setPlans] = useState(STATIC_PLANS)
  const [loadingPlans, setLoadingPlans] = useState(true)

  useEffect(() => {
    let alive = true
    const fetchPlans = async () => {
      // Optional: if Supabase has plans table configured, use it.
      try {
        const { data, error } = await supabase
          .from('plans')
          .select('id,name,price,slots,features,most_popular')
          .order('price', { ascending: true })

        if (error) throw error

        if (alive && Array.isArray(data) && data.length) {
          const normalized = data.map((p) => ({
            id: p.id,
            name: p.name,
            // force pricing/slot limits from frontend defaults
            price: STATIC_PLANS.find((sp) => sp.id === p.id)?.price ?? p.price,
            slots: STATIC_PLANS.find((sp) => sp.id === p.id)?.slots ?? (p.slots ?? p.slots_total ?? p.number_of_slots ?? p.slots_remaining ?? 0),
            features: Array.isArray(p.features)
              ? p.features
              : (p.features ? String(p.features).split(',').map((x) => x.trim()).filter(Boolean) : [])
          }))
          setPlans(normalized.length ? normalized : STATIC_PLANS)
        }
      } catch {
        if (alive) setPlans(STATIC_PLANS)
      } finally {
        if (alive) setLoadingPlans(false)
      }
    }

    fetchPlans()
    return () => {
      alive = false
    }
  }, [])

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
              {(loadingPlans ? STATIC_PLANS : plans).map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  mostPopular={plan.id === 'pro' || plan.most_popular}
                  onBuyNow={() => {
                    window.location.href = `/payment/${plan.id}`
                  }}
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

