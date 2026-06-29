const testimonials = [
  {
    name: 'Ali R.',
    role: 'BS Computer Science Student',
    quote:
      'The report is clear and professional. I used it to rewrite parts of my assignment and got a better grade.'
  },
  {
    name: 'Sara K.',
    role: 'Teacher (Secondary Education)',
    quote:
      'Fast results and reliable similarity highlights. It helps me focus on academic integrity without extra work.'
  },
  {
    name: 'Hamza M.',
    role: 'Final Year Student',
    quote:
      'Downloading the PDF reports was effortless. The AI verdict and paraphrased sentence list made revisions simple.'
  }
]

export default function Testimonials() {
  return (
    <section className="bg-white" id="testimonials">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Testimonials</h2>
          <p className="mt-3 text-gray-600">Students love the clarity. Educators love the speed.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="border rounded-2xl p-6 shadow-sm bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E40AF] flex items-center justify-center font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.role}</div>
                </div>
              </div>
              <p className="mt-4 text-gray-700">“{t.quote}”</p>
              <div className="mt-4 text-[#1E40AF]">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

