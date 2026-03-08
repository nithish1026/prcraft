# ⚡ PRCraft — AI Pull Request Description Writer

## PROJECT STRUCTURE
```
prcraft/
├── client/          ← React app (Vite + pure CSS)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── Header.jsx / Header.css
│   │       ├── InputForm.jsx / InputForm.css
│   │       └── ResultPanel.jsx / ResultPanel.css
│   ├── index.html   ← SEO meta tags here
│   ├── package.json
│   └── vite.config.js
├── server/          ← Express + Groq AI
│   ├── server.js
│   ├── package.json
│   └── .env         ← Add your GROQ_API_KEY here
├── .gitignore
└── README.md
```

=====================================================
  STEP 1 — RUN LOCALLY
=====================================================

Terminal 1 — Start the backend:
  cd server
  npm install
  npm start
  → Runs on http://localhost:4000

Terminal 2 — Start the frontend:
  cd client
  npm install
  npm run dev
  → Runs on http://localhost:3000

Open browser: http://localhost:3000

=====================================================
  STEP 2 — PUSH TO GITHUB
=====================================================

1. Go to https://github.com → Sign up / Sign in
2. Click "New repository"
3. Name it: prcraft
4. Set to Public
5. Click "Create repository"

6. Open terminal in the prcraft/ folder and run:

  git init
  git add .
  git commit -m "first commit: PRCraft initial build"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/prcraft.git
  git push -u origin main

Replace YOUR_USERNAME with your GitHub username.

=====================================================
  STEP 3 — DEPLOY BACKEND (Render — Free)
=====================================================

1. Go to https://render.com → Sign up with GitHub
2. Click "New" → "Web Service"
3. Connect your GitHub repo: prcraft
4. Settings:
   - Root Directory: server
   - Build Command:  npm install
   - Start Command:  npm start
5. Add Environment Variable:
   - Key:   GROQ_API_KEY
   - Value: your key from console.groq.com
6. Click "Create Web Service"
7. Wait 2-3 minutes → you get a URL like:
   https://prcraft-api.onrender.com

=====================================================
  STEP 4 — DEPLOY FRONTEND (Vercel — Free)
=====================================================

1. Go to https://vercel.com → Sign up with GitHub
2. Click "New Project"
3. Import your prcraft repo
4. Settings:
   - Root Directory: client
   - Framework:      Vite
   - Build Command:  npm run build
   - Output Dir:     dist
5. Add Environment Variable:
   - Key:   VITE_API_URL
   - Value: https://prcraft-api.onrender.com  ← your Render URL
6. Click "Deploy"
7. You get a URL like: https://prcraft.vercel.app  ✅

=====================================================
  STEP 5 — SEO (SHOW UP ON GOOGLE)
=====================================================

Your app already has:
✅ Proper <title> tag
✅ <meta name="description"> with keywords
✅ <meta name="keywords">
✅ Open Graph tags (for Slack/Twitter previews)
✅ Canonical URL tag
✅ robots meta tag

To ALSO show up on Google:

A) Submit to Google Search Console (free):
   1. Go to: https://search.google.com/search-console
   2. Add your Vercel URL as a property
   3. Verify ownership (Vercel makes this easy)
   4. Submit your sitemap: https://yoursite.vercel.app/sitemap.xml

B) Key SEO tips for ranking:
   - Target keyword: "pull request description generator"
   - Use that keyword in your h1 heading
   - Get other developers to link to your site
   - Share on Reddit (r/webdev, r/programming)
   - Share on dev.to and Hacker News
   - Google takes 2-4 weeks to index new sites

C) Speed = better ranking:
   - Vite builds are already very fast ✅
   - Vercel CDN serves globally fast ✅

=====================================================
  UPDATING YOUR SITE AFTER CHANGES
=====================================================

Every time you change code:
  git add .
  git commit -m "describe what you changed"
  git push

Vercel and Render automatically redeploy! ✅
