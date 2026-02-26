# Vercel Deployment – Google Sheets Setup

Para gumana ang form submission sa Vercel:

## 1. Environment Variable

Sa **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_GOOGLE_SHEETS_WEB_APP_URL` | `https://script.google.com/macros/s/YOUR_ID/exec` |

- Para sa **Production**, Preview, at Development kung gusto mo.
- Copy ang **Web App URL** mula sa Google Apps Script:
  - Extensions → Apps Script → Deploy → Manage deployments → Web app URL

## 2. Redeploy

Pagkatapos mag-add ng env var:
- **Deployments** → **…** sa latest deployment → **Redeploy**

## 3. Google Apps Script

- Deploy bilang **Web App**
- **Execute as:** Me
- **Who has access:** Anyone
