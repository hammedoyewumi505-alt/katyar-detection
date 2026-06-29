export default function PricingCard({ plan, mostPopular, onBuyNow }) {
  const pricePkr = plan.price ?? 0

  return (
    <div
      className={
        mostPopular
          ? 'relative rounded-2xl p-7 bg-[#1e40af] text-white shadow-[0_20px_60px_rgba(30,64,175,0.4)]'
          : 'relative rounded-2xl p-7 bg-white text-gray-900 border border-blue-100 shadow-sm'
      }
      style={{ transform: mostPopular ? 'scale(1.05)' : 'scale(1)' }}
    >
      {mostPopular && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2"
          style={{ background: '#fbbf24', color: '#1f2937', padding: '4px 16px', borderRadius: '9999px', fontSize: 12, fontWeight: 700 }}
        >
          MOST POPULAR
        </div>
      )}

      <div className="text-[20px] font-extrabold" style={{ marginTop: mostPopular ? 18 : 0 }}>
        {plan.name}
      </div>

      <div className="mt-2 text-gray-500" style={{ color: mostPopular ? '#bfdbfe' : '#6b7280', fontSize: 14, fontWeight: 600 }}>
        {plan.subtitle}
      </div>

      <div className="mt-5">
        <div className="text-[48px] font-extrabold" style={{ color: mostPopular ? '#ffffff' : '#111827' }}>
          ₨{pricePkr}
        </div>
        <div className="mt-1 text-sm" style={{ color: mostPopular ? '#bfdbfe' : '#6b7280', fontSize: 14 }}>
          {plan.slots} slots
        </div>
      </div>

      <ul className="mt-6" style={{ textAlign: 'left' }}>
        {(plan.features || []).map((f) => (
          <li key={f} className="flex items-center gap-3 mb-3" style={{ fontSize: 14 }}>
            <span style={{ color: '#22c55e', fontWeight: 700, lineHeight: '1' }}>✓</span>
            <span style={{ color: mostPopular ? '#ffffff' : '#374151' }}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onBuyNow}
        className="w-full mt-2 bg-[#1d4ed8] text-white py-4 rounded-xl font-semibold hover:bg-[#1e40af] transition"
      >
        Buy Now
      </button>
    </div>
  )
}




