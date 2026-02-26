# Paano i-test ang form submission sa Google Sheets

## 1. Siguraduhing naka-share ang Google Sheet
- Buksan ang [Google Sheet](https://docs.google.com/spreadsheets/d/1K6dvpewcTm4GjBzZAKEy0GAIQwipbk0bJ8wcNQIFtIM/edit)
- **Share** → dapat may edit access ang Google account na gumawa ng Apps Script

## 2. I-redeploy ang Apps Script (IMPORTANTE)
- Extensions → Apps Script
- Save ang Code.gs
- **Deploy → Manage deployments → Edit (lapis icon) → New version → Deploy**
- Huwag baguhin ang Web App URL; kapag nag-redeploy, pareho pa rin iyon

## 3. Patakbuhin ang app nang tama
```bash
npm run dev
```
Dapat may **2 process**:
- Vite (port 3000)
- API server (port 3001)

## 4. Subukan
1. Buksan http://localhost:3000
2. Punan ang form
3. I-click Submit
4. Tingnan ang Google Sheet – dapat may bagong row

## 5. Kung may error
- F12 → Console: tingnan kung may error
- F12 → Network: tingnan kung nagsend ang request sa /api/submit-sheets
- Sa terminal ng API server: dapat may log na `[Sheets] Forwarding to Google...`
