import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#1E40AF]" />
              Instant analysis • PDF reports • Secure processing
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Detect AI Writing &amp; Plagiarism Instantly
            </h1>

            <p className="mt-4 text-gray-600 text-base md:text-lg">
              Trusted by students and educators to protect academic integrity
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1E40AF] text-white font-semibold hover:bg-[#1E40AF]/90 transition"
              >
                Get Started
              </Link>

              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#1E40AF] text-[#1E40AF] font-semibold hover:bg-blue-50 transition"
              >
                See How It Works
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-lg border bg-white">
                <div className="text-2xl font-extrabold text-gray-900">10,000+</div>
                <div className="text-sm text-gray-600">Documents Scanned</div>
              </div>
              <div className="p-4 rounded-lg border bg-white">
                <div className="text-2xl font-extrabold text-gray-900">99%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="p-4 rounded-lg border bg-white">
                <div className="text-2xl font-extrabold text-gray-900">2</div>
                <div className="text-sm text-gray-600">Reports Generated Per Scan</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#1E40AF]/15 to-transparent rounded-3xl blur" />
            <div className="relative bg-white border rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-bold text-gray-900">Live Preview</div>
                <div className="text-xs font-semibold text-[#1E40AF] bg-blue-50 px-3 py-1 rounded-full">
                  Secure • Private
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border">
                  <div className="w-10 h-10 rounded-lg bg-[#1E40AF] text-white flex items-center justify-center font-bold">AI</div>
                  <div>
                    <div className="font-semibold text-gray-900">AI Writing Detection</div>
                    <div className="text-sm text-gray-600">Percentage + sentence-level highlights</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border">
                  <div className="w-10 h-10 rounded-lg bg-[#1E40AF] text-white flex items-center justify-center font-bold">%</div>
                  <div>
                    <div className="font-semibold text-gray-900">Plagiarism Similarity</div>
                    <div className="text-sm text-gray-600">Similarity report + matched sources</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border bg-white">
                  <div className="text-xs text-gray-500">Average AI</div>
                  <div className="text-2xl font-extrabold text-gray-900">—</div>
                </div>
                <div className="p-4 rounded-xl border bg-white">
                  <div className="text-xs text-gray-500">Similarity</div>
                  <div className="text-2xl font-extrabold text-gray-900">—</div>
                </div>
              </div>

              <p className="mt-5 text-xs text-gray-500">
                Upload your document to generate two professional PDFs: AI report + plagiarism report.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

