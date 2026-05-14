# NewsHall

Your personalized morning intelligence app — news briefs, live scores, markets, weather, and daily wellness.

---

## Deploy to Vercel in 5 minutes

### Step 1 — Get your Anthropic API key
1. Go to https://console.anthropic.com
2. Click "API Keys" → "Create Key"
3. Copy it — you'll need it in Step 4

### Step 2 — Put this project on GitHub
1. Go to https://github.com/new and create a new repo called `newshall`
2. Open your terminal and run:
```bash
cd newshall
git init
git add .
git commit -m "Initial NewsHall"
git remote add origin https://github.com/YOUR_USERNAME/newshall.git
git push -u origin main
```

### Step 3 — Connect to Vercel
1. Go to https://vercel.com and sign up with your GitHub account
2. Click "Add New Project"
3. Import your `newshall` repo
4. Vercel auto-detects Next.js — no config needed
5. Click "Deploy"

### Step 4 — Add your API key
1. In Vercel, go to your project → Settings → Environment Variables
2. Add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from Step 1
3. Click Save
4. Go to Deployments → click the 3 dots on your latest deploy → "Redeploy"

### Done!
Your app is live at `https://newshall.vercel.app` (or similar URL Vercel assigns).

---

## What works out of the box
- **Morning Brief** — generates live news via Claude + web search
- **Weather** — real weather via Open-Meteo (no key needed)
- **Scores** — live scores via ESPN's free API (no key needed)
- **Markets** — stock/crypto prices via Yahoo Finance (no key needed)
- **Daily Boost** — health tips from Harvard Health, Mayo Clinic etc.
- **Location** — browser geolocation for timezone detection

## Local development
```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```
Open http://localhost:3000

---

## Project structure
```
app/
  page.tsx              — main page
  layout.tsx            — HTML shell, fonts
  globals.css           — base styles
  components/
    NewsHall.jsx        — the full app component
  api/
    brief/route.ts      — news brief generation (Claude)
    scores/route.ts     — ESPN scoreboard proxy
    markets/route.ts    — Yahoo Finance proxy
    weather/route.ts    — Open-Meteo proxy
    boost/route.ts      — daily wellness content (Claude)
```
