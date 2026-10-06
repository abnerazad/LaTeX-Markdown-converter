# LaTeX Converter by Abner

**LaTeX Converter by Abner** is a professional, lightning-fast web application designed to convert LaTeX mathematical equations, scientific notation, and Markdown tables into clean, human-readable normal text and genuine Microsoft Word / Docs tables.

---

## 🚀 Features

- **Conversion Modes:**
  - **ASCII Plain:** Converts `$p^+$` to `p^+`, `$10^{-19}$` to `10^(-19)`, `\times` to `*` (`+1.6022*10^(-19) C`), and tables to clean Tab-Separated Values (TSV).
  - **Unicode Pritty:** Converts into clean Unicode symbols (`p⁺`, `n⁰`, `e⁻`, `10⁻¹⁹`, `×`, `α`, `β`, `θ`, `π`, `≤`, `≥`, `√`).
- **Dual Output Views:**
  - **Plain Text View:** Clean plain text format ready for instant copying into text editors, code, or terminal.
  - **Rendered Visual View:** Rich, beautifully styled view with native table borders, bullets, and typography for reading and Word documents.
- **Smart "Copy Output" Button:**
  - When on **Rendered Visual View**: Automatically copies both `text/html` and `text/plain` so pasting with `Ctrl+V` into **Microsoft Word** pastes a real, native Word Table with formatted cells, bullets, and equations!
  - When on **Plain Text View**: Copies the clean plain text / TSV.
- **Zero Dollar Signs:** All `$` math delimiters are cleanly converted and stripped across all lines and tables.
- **Browser Cache Persistence:**
  - Previous text and all custom settings (mode, active tab, theme, dropdown options) are automatically saved to browser storage (`localStorage`) and restored whenever the user reopens the app.
  - Textbox starts completely empty with placeholder `"Enter your text . . ."` when fresh or cleared.
- **One-Click Actions:**
  - **Copy Output** (Copies based on active tab)
  - **Copy Table (TSV)** (Formatted specifically for Excel/Sheets)
  - **Download .txt** and **Download .tsv**
  - **Upload file** (`.txt`, `.tex`, `.md`)
  - **Dark / Light Theme Toggle**

---

## 🌐 Deployment Guide (Vercel & Render)

**Yes! You can deploy this project on both Vercel and Render for 100% FREE.**  
Because this application is a pure client-side static web app (HTML + Vanilla CSS + JavaScript), it requires **zero build steps** and runs globally on edge CDNs.

---

### Option 1: Deploy on Vercel (Recommended ⚡)

Vercel provides the fastest edge network and instant setup for static web apps.

#### Method A: Via GitHub (Automatic Continuous Deployment)
1. Push your project folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of LaTeX Converter by Abner"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Select your GitHub repository.
5. Vercel automatically detects the static site:
   - **Framework Preset:** `Other` (or auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** *(Leave empty)*
   - **Output Directory:** *(Leave empty)*
6. Click **"Deploy"**. Your website will be live in ~10 seconds with a free `.vercel.app` domain and automatic SSL!

#### Method B: Via Vercel CLI (Instant from Terminal)
1. Run in your terminal:
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts (Accept defaults).
3. To deploy to production:
   ```bash
   npx vercel --prod
   ```

---

### Option 2: Deploy on Render

Render supports free **Static Sites** with automated HTTPS and custom domains.

#### Steps to Deploy on Render:
1. Push your code to GitHub (see Git instructions above).
2. Go to [render.com](https://render.com) and sign in.
3. Click **"New +"** in the top right → Select **"Static Site"**.
4. Connect your GitHub repository.
5. Configure the following fields:
   - **Name:** `latex-converter-by-abner` (or your preferred name)
   - **Branch:** `main`
   - **Build Command:** *(Leave completely empty)*
   - **Publish Directory:** `.` *(or `./`)*
6. Click **"Create Static Site"**.
7. Render will build and deploy your site to `https://<your-app-name>.onrender.com` in seconds.

*(Note: A pre-configured `render.yaml` Blueprint file is already included in this repository).*

---

### Option 3: Deploy on Netlify (Alternative)
- Drag and drop this folder directly into [app.netlify.com/drop](https://app.netlify.com/drop), or connect your GitHub repository with publish directory set to `.`.

---

### Option 4: Deploy on GitHub Pages (Free with your GitHub Repo)
1. In your GitHub repository, go to **Settings** → **Pages**.
2. Under **Build and deployment** → **Branch**, select `main` and `/ (root)`.
3. Click **Save**. Your site will be published at `https://<username>.github.io/<repo-name>/`.

---

## 💻 Local Development

Run the test suite:
```bash
npm test
```

Serve locally:
```bash
npm start
```
Or open [index.html](file:///c:/Users/Doremon's%20Laptop/Desktop/Text%20Converte/index.html) directly in any web browser.

---

## 📄 License
MIT License. Created by Abner.
