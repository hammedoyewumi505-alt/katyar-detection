import PricingCard from './PricingCard'

export default function Pricing({ plans, onBuyNow, loading }) {
  if (loading) {
    return (
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 text-center">Loading plans...</div>
      </section>
    )
  }

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Pricing</h2>
          <p className="mt-3 text-gray-600">Choose the plan that fits your workflow.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={plan.id === 'pro' ? 'lg:order-2' : undefined}>
              <PricingCard
                plan={plan}
                mostPopular={plan.id === 'pro' || plan.most_popular}
                onBuyNow={() => onBuyNow(plan.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

