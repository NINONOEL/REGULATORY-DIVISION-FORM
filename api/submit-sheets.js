const GOOGLE_FETCH_TIMEOUT_MS = 22000

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }
}

export async function POST(request) {
  const SHEETS_URL = process.env.VITE_GOOGLE_SHEETS_WEB_APP_URL || process.env.GOOGLE_SHEETS_WEB_APP_URL

  if (!SHEETS_URL) {
    return new Response(
      JSON.stringify({ success: false, message: 'Google Sheets URL not configured. Add VITE_GOOGLE_SHEETS_WEB_APP_URL in Vercel Environment Variables.' }),
      { status: 500, headers: corsHeaders() }
    )
  }

  try {
    const formData = await request.json()
    const body = new URLSearchParams(formData).toString()

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

    if (resp.ok) {
      try {
        const json = JSON.parse(text)
        if (json.success === false) {
          return new Response(
            JSON.stringify({ success: false, message: json.message || 'Google Sheets error' }),
            { status: 500, headers: corsHeaders() }
          )
        }
        return new Response(JSON.stringify(json), { status: 200, headers: corsHeaders() })
      } catch {
        return new Response(
          JSON.stringify({ success: true, message: 'Submitted' }),
          { status: 200, headers: corsHeaders() }
        )
      }
    } else {
      return new Response(
        JSON.stringify({ success: false, message: text || 'Request failed' }),
        { status: 500, headers: corsHeaders() }
      )
    }
  } catch (err) {
    const isTimeout = err.name === 'AbortError'
    return new Response(
      JSON.stringify({
        success: false,
        message: isTimeout ? 'Request timed out. Please try again.' : (err.message || 'Failed to submit'),
      }),
      { status: 500, headers: corsHeaders() }
    )
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}
