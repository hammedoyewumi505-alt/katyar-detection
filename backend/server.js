require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { Groq } = require('groq-sdk')
const { jsPDF } = require('jspdf')

const { createClient } = require('@supabase/supabase-js')
const fetch = require('node-fetch')

const PORT = 5000

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })
)
app.use(express.json({ limit: '10mb' }))

const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir)
  },
  filename: function (_req, file, cb) {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safe}`)
  }
})

const upload = multer({ storage })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

function cleanJSON(text) {
  // Remove markdown code blocks
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/```\s*$/i, '');
  return cleaned.trim();
}

function extractTextFromFile(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase()

  if (ext === '.txt') {
    return fs.promises.readFile(filePath, 'utf8')
  }

  if (ext === '.pdf') {
    // Minimal implementation. For production, use a PDF parser (pdf-parse).
    // Returning empty string will reduce accuracy.
    return Promise.resolve('')
  }

  if (ext === '.docx') {
    // Minimal implementation. For production, use mammoth.
    return Promise.resolve('')
  }

  return Promise.resolve('')
}

async function groqAIAnalysis(text) {
  const prompt =
    'Analyze the following text and return ONLY a JSON object with these exact fields:\n' +
    '  ai_percentage: number 0-100,\n' +
    '  ai_generated_only: number 0-100,\n' +
    '  ai_paraphrased: number 0-100,\n' +
    '  verdict: one of Human, Mixed, or AI,\n' +
    '  ai_sentences: array of strings that appear AI generated,\n' +
    '  paraphrased_sentences: array of strings that appear AI paraphrased'

  const resp = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: text }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0
  })

  const rawText = resp.choices?.[0]?.message?.content || '{}'
  const cleanedText = cleanJSON(rawText)
  const result = JSON.parse(cleanedText)
  return result
}

async function copyleaksPlagiarismCheck(text) {
  // Minimal placeholder implementation.
  // Production: call Copyleaks API and parse results.
  return {
    plagiarism_percentage: 0,
    match_groups: [],
    sources: [],
    integrity_flags: [],
    matched_sentences: []
  }
}

function highlightText(doc, sentences, fullText) {
  // Placeholder: jsPDF does not do rich text easily without additional libs.
  // We'll just output text.
  const margin = 14
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - margin * 2
  const lines = doc.splitTextToSize(fullText || '', 90)
  lines.forEach((line) => doc.text(line, margin, doc.getTextDimensions().h + 20))
  void sentences
  void maxWidth
}

app.post('/api/scan', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File is required' })

    // Auth: user id from JWT is expected in Authorization header.
    // If not available, we still proceed but may fail slot deduction.
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    let userId = null
    if (token) {
      // We validate token by asking Supabase if possible.
      const { data } = await supabase.auth.getUser(token).catch(() => ({ data: null }))
      userId = data?.user?.id || null
    }

    const filePath = req.file.path
    const originalName = req.file.originalname

    const text = await extractTextFromFile(filePath, originalName)

    const ai = await groqAIAnalysis(text)
    const plagiarism = await copyleaksPlagiarismCheck(text)

    const result = {
      document_name: originalName,
      ai_percentage: ai.ai_percentage,
      ai_generated_only: ai.ai_generated_only,
      ai_paraphrased: ai.ai_paraphrased,
      verdict: ai.verdict,
      paraphrased_sentences: ai.paraphrased_sentences,
      ai_sentences: ai.ai_sentences,
      plagiarism_percentage: plagiarism.plagiarism_percentage,
      match_groups: plagiarism.match_groups,
      sources: plagiarism.sources,
      integrity_flags: plagiarism.integrity_flags,
      matched_sentences: plagiarism.matched_sentences
    }

    // Save to Supabase scans table
    const scanInsert = {
      user_id: userId,
      document_name: result.document_name,
      ai_percentage: result.ai_percentage,
      ai_generated_only: result.ai_generated_only,
      ai_paraphrased: result.ai_paraphrased,
      verdict: result.verdict,
      paraphrased_sentences: result.paraphrased_sentences,
      ai_sentences: result.ai_sentences,
      plagiarism_percentage: result.plagiarism_percentage,
      match_groups: result.match_groups,
      sources: result.sources,
      integrity_flags: result.integrity_flags,
      matched_sentences: result.matched_sentences,
      raw_result: result
    }

    const { data: scanRow, error: scanError } = await supabase
      .from('scans')
      .insert(scanInsert)
      .select()
      .single()

    if (scanError) throw scanError

    // Deduct 1 slot
    if (userId) {
      const { error: updError } = await supabase
        .from('user_plans')
        .update({ slots_remaining: supabase.raw('slots_remaining - 1') })
        .eq('user_id', userId)
        .eq('status', 'active')

      if (updError) {
        // Non-fatal; scan still returns.
        console.warn('Slot deduction failed:', updError.message)
      }
    }

    // Schedule file deletion after 1 hour
    setTimeout(() => {
      fs.unlink(filePath, () => {})
    }, 60 * 60 * 1000)

    res.json({ scan: scanRow, result })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Scan failed' })
  }
})

app.post('/api/generate-ai-report', async (req, res) => {
  try {
    const scan = req.body.scan
    if (!scan) return res.status(400).json({ error: 'scan data required' })

    const doc = new jsPDF()

    // Cover
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text('Katyar Detection', 20, 20)
    doc.setFontSize(12)
    doc.text(`Document: ${scan.document_name || ''}`, 20, 35)
    doc.text(`AI Verdict: ${scan.verdict || ''}`, 20, 45)
    doc.text(`AI Percentage: ${scan.ai_percentage ?? ''}%`, 20, 55)

    // Summary page
    doc.addPage()
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`${scan.ai_percentage ?? 0}% detected as AI`, 20, 25)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text(`AI only: ${scan.ai_generated_only ?? 0}%`, 20, 45)
    doc.text(`AI paraphrased: ${scan.ai_paraphrased ?? 0}%`, 20, 60)

    // Disclaimer
    doc.rect(20, 75, 170, 35)
    doc.text('Disclaimer:', 25, 85)
    doc.setFontSize(11)
    doc.text(
      'This report is for academic integrity guidance and is not an absolute proof.',
      25,
      95
    )

    // Text page
    doc.addPage()
    doc.setFontSize(11)
    doc.text('Document text preview (highlights require advanced rich-text layout).', 20, 20)
    doc.text((scan.document_text || '').slice(0, 1500), 20, 35)

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=ai-report-${scan.id || 'scan'}.pdf`)
    res.send(pdfBuffer)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to generate AI report' })
  }
})

app.post('/api/generate-plagiarism-report', async (req, res) => {
  try {
    const scan = req.body.scan
    if (!scan) return res.status(400).json({ error: 'scan data required' })

    const doc = new jsPDF()

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text('Katyar Detection', 20, 20)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Document: ${scan.document_name || ''}`, 20, 35)
    doc.text(`Overall Similarity: ${scan.plagiarism_percentage ?? 0}%`, 20, 50)

    doc.addPage()
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`${scan.plagiarism_percentage ?? 0}% Overall Similarity`, 20, 25)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Match groups breakdown (simplified).', 20, 45)

    doc.addPage()
    doc.setFontSize(11)
    doc.text('Document text preview (highlights require advanced rich-text layout).', 20, 20)
    doc.text((scan.document_text || '').slice(0, 1500), 20, 35)

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=plagiarism-report-${scan.id || 'scan'}.pdf`)
    res.send(pdfBuffer)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to generate plagiarism report' })
  }
})

app.listen(PORT, () => {
  console.log(`Katyar Detection backend listening on port ${PORT}`)
})

