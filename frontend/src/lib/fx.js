export function formatUsd(amount) {
  const n = typeof amount === 'number' ? amount : Number(amount)
  if (!Number.isFinite(n)) return ''

  // Use 2 decimals for typical FX display
  return `$${n.toFixed(2)}`
}

export async function fetchPkrToUsdRate() {
  // Public, no-auth endpoint. Returns JSON like: { conversion_rates: { USD: <rate> } }
  // If the endpoint fails, we return null and let UI fall back to PKR only.
  const url = `https://api.exchangerate.host/latest?base=PKR&symbols=USD`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`FX request failed (${res.status})`)
  const json = await res.json()

  const rate = json?.rates?.USD
  return typeof rate === 'number' ? rate : null
}

export function convertPkrToUsd(pkr, rate) {
  const n = typeof pkr === 'number' ? pkr : Number(pkr)
  if (!Number.isFinite(n) || !Number.isFinite(rate)) return null
  return n * rate
}

