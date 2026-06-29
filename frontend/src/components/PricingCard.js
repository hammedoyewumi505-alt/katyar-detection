export default function PricingCard({ plan, mostPopular, onBuyNow }) {
  const price = plan.price_pkr ?? plan.price ?? 0

  return (
    <div className="relative border border-blue-100 rounded-2xl bg-white p-6 shadow-sm flex flex-col overflow-hidden">
      {mostPopular ? (
        <div className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white">
          Most Popular
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-extrabold text-gray-900">{plan.name}</div>
          <div className="mt-1 text-sm text-blue-700 font-semibold">Pay once, use slots anytime</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-4xl font-extrabold text-gray-900">₨{price}</div>
        <div className="mt-1 text-sm text-gray-600">{plan.slots} slots</div>
      </div>

      <ul className="mt-6 space-y-2">
        {plan.features.map((f, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="mt-1 w-2 h-2 rounded-full bg-blue-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <button
          onClick={onBuyNow}
          className="w-full bg-blue-700 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}


