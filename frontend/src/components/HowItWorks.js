const steps = [
  {
    title: 'Upload your document',
    subtitle: 'PDF, DOCX, or TXT',
    icon: '⬆️'
  },
  {
    title: 'Our AI analyzes',
    subtitle: 'AI writing + plagiarism detection',
    icon: '🧠'
  },
  {
    title: 'Download your reports',
    subtitle: 'Two detailed PDF reports',
    icon: '⬇️'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            How it works
          </h2>
          <p className="mt-3 text-gray-600">
            Scan in minutes and get clear, professional PDF reports.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div
              key={s.title}
              className="border rounded-2xl p-6 shadow-sm bg-white"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: '#1E40AF', color: 'white' }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: '#1E40AF' }}
                  >
                    Step {idx + 1}
                  </div>
                  <div className="font-bold text-lg text-gray-900">
                    {s.title}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{s.subtitle}</p>
              <div className="mt-6 flex items-center gap-2 text-sm">
                <div className="h-1 w-10 rounded-full" style={{ background: '#1E40AF' }} />
                <div className="text-gray-500">Get accurate results with clear explanations.</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

