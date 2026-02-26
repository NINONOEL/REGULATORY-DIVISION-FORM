import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const SHEETS_URL = process.env.VITE_GOOGLE_SHEETS_WEB_APP_URL || process.env.GOOGLE_SHEETS_WEB_APP_URL

app.use(express.json())
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

const GOOGLE_FETCH_TIMEOUT_MS = 22000

app.post('/api/submit-sheets', async (req, res) => {
  if (!SHEETS_URL) {
    return res.status(500).json({ success: false, message: 'Google Sheets URL not configured' })
  }
  try {
    const formData = req.body
    const body = new URLSearchParams(formData).toString()
    console.log('[Sheets] Forwarding to Google...', Object.keys(formData))
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), GOOGLE_FETCH_TIMEOUT_MS)
    let resp
    try {
      resp = await fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }
    const text = await resp.text()
    console.log('[Sheets] Google response:', resp.status, text.substring(0, 200))
    if (resp.ok) {
      try {
        const json = JSON.parse(text)
        if (json.success === false) {
          return res.status(500).json({ success: false, message: json.message || 'Google Sheets error' })
        }
        res.json(json)
      } catch {
        res.json({ success: true, message: 'Submitted' })
      }
    } else {
      res.status(resp.status).json({ success: false, message: text || 'Request failed' })
    }
  } catch (err) {
    console.error(err)
    const isTimeout = err.name === 'AbortError'
    res.status(500).json({
      success: false,
      message: isTimeout ? 'Request timed out. Please try again.' : (err.message || 'Failed to submit'),
    })
  }
})

app.use(express.static(path.join(__dirname, '../dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
