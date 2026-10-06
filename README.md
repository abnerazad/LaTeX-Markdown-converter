# LaTeX Converter by Abner

A professional, lightning-fast web application to convert LaTeX mathematical equations, scientific notation, and Markdown tables into clean, human-readable normal text and genuine Microsoft Word / Docs tables.

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

This application is a pure client-side static web app (HTML, CSS, JavaScript) that requires **zero build steps** and runs globally on edge CDNs for free.

---

### Option 1: Deploy on Vercel (Recommended ⚡)

#### Method A: Via GitHub (Continuous Deployment)
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Deploy LaTeX Converter"
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"** → Import your GitHub repository.
4. Leave settings at default (Framework: Other, Build Command: None, Output Directory: None).
5. Click **"Deploy"**.

#### Method B: Via Vercel CLI
```bash
npx vercel --prod
```

---

### Option 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign in.
2. Click **"New +"** → Select **"Static Site"**.
3. Connect your GitHub repository.
4. Set:
   - **Build Command:** *(Leave empty)*
   - **Publish Directory:** `.`
5. Click **"Create Static Site"**.

---

### Option 3: Deploy on GitHub Pages
1. Go to repository **Settings** → **Pages**.
2. Under **Build and deployment** → **Branch**, select `main` and `/ (root)`.
3. Click **Save**.

---

## 💻 Local Usage

Open `index.html` directly in any web browser, or serve locally:
```bash
npm start
```

---

## 📄 License
MIT License
