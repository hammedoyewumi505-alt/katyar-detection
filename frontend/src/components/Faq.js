const faqs = [
  {
    q: 'How accurate is Katyar Detection?',
    a: 'We combine AI writing detection and plagiarism similarity checks to provide clear, evidence-based results. Accuracy depends on document quality and originality.'
  },
  {
    q: 'What file types do you support?',
    a: 'Upload PDF, DOCX, or TXT files. We extract text and generate two professional PDF reports.'
  },
  {
    q: 'Do you store my documents?',
    a: 'We keep documents for a limited time for analysis, then delete them after processing. Payment screenshots and scan results are stored as needed for your account.'
  },
  {
    q: 'What do “AI generated” and “AI paraphrased” mean?',
    a: '“AI generated” indicates original text likely produced by AI, while “AI paraphrased” indicates text that appears rewritten by AI models.'
  },
  {
    q: 'Can I download reports?',
    a: 'Yes. After each scan, download both the AI report and the plagiarism report as PDFs.'
  }
]

export default function Faq() {
  return (
    <section className="bg-white" id="faq">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">FAQ</h2>
          <p className="mt-3 text-gray-600">Common questions about AI detection and plagiarism checks.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:gap-6">
          {faqs.map((item) => (
            <div key={item.q} className="border rounded-2xl p-6 bg-white shadow-sm">
              <div className="font-bold text-gray-900">{item.q}</div>
              <div className="mt-3 text-gray-600">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

