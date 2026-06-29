const features = [
  { icon: '🤖', title: 'AI Content Detection', desc: 'Identify AI-generated sections with sentence-level evidence.' },
  { icon: '🧾', title: 'Plagiarism Checking', desc: 'Detect similarity and matched sources for academic integrity.' },
  { icon: '📄', title: 'Downloadable PDF Reports', desc: 'Get two professional PDFs per scan, ready to share.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your documents are handled securely with controlled access.' },
  { icon: '⚡', title: 'Fast Results', desc: 'Quick turnaround so you can move forward with confidence.' },
  { icon: '🎓', title: 'Academic Grade Reports', desc: 'Clear findings designed for students and educators.' }
]

export default function Features() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Features</h2>
          <p className="mt-3 text-gray-600">
            Everything you need to verify originality and protect academic integrity.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border rounded-2xl p-6 shadow-sm bg-white">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: '#1E40AF' }}
              >
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

