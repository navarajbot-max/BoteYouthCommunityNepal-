<div align="center">

<img width="1200" height="475" alt="Bote Youth Community Nepal" src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop" />

  <h1>🇳🇵 Bote Youth Community Nepal</h1>
  <p><strong>Official Community Web Platform, Tarahi Bote Language Lexicon &amp; Cultural Heritage Portal</strong></p>
  <p><em>Central Headquarters: Ward No. 11, Karmaiya, Bagmati Municipality, Sarlahi District, Nepal</em></p>

</div>

---

## 🌟 Overview
Official digital portal of the **Bote Youth Community Nepal (बोटे युवा समुदाय नेपाल)**. Dedicated to safeguarding ancient single-log dugout canoe craft (Ek-Dunge Nau), revitalizing the endangered Tarahi Bote language, and empowering indigenous youth through educational scholarships and digital identity cards.

## 🚀 Live Website & Deployment

### 1. GitHub Pages
This project is configured with GitHub Actions to build and deploy to **GitHub Pages**:
- Go to your repository on GitHub: **Settings** &rarr; **Pages**
- Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**
- On every push to `main`, GitHub Actions builds and publishes your site automatically to:
  `https://<your-username>.github.io/<your-repo>/`

### 2. Blogger Theme Support
- Download the complete theme package: [`/Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip`](public/Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip)
- Or the raw XML theme: [`/Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml`](public/Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml)
- Pre-configured with Google Search Console verification meta tag, 10 executive officer widgets, digital ID generator, and authentic Nepali Flag colors.

## 🛠️ Tech Stack & Build
- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Deployment**: Vite build with relative asset resolution (`base: './'`) for universal hosting
- **Backend / Dev**: Express server (`server.ts`) with dynamic Google Search verification and Blogger theme endpoints

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📜 Verification & SEO
- **Google Search Console**: Verification meta tag pre-installed in `<head>`
- **Live Sitemap**: `/sitemap.xml`
- **Robots Policy**: `/robots.txt`
