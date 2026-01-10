# Quran App

A modern web application for reading the Quran with multi-language support, bookmarking, and reading progress tracking.

## Features

- **Index Page**: Browse all surahs with name, number, and ayah count
- **Surah Detail Page**: Read complete surahs with:
  - Multi-language selector (Bosnian, English, German, Arabic)
  - Verse-by-verse navigation with direct linking (#id)
  - Previous/Next navigation buttons
  - Bookmark functionality with optional notes
- **Continue Reading**: Automatically saves your reading progress
- **Bookmarks**: Save verses with optional notes and search functionality
- **Dark Theme**: Beautiful dark UI with light text
- **Responsive Design**: Works on all devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages.

### Prerequisites

1. Make sure your repository is pushed to GitHub
2. Ensure you have the correct repository name configured in `vite.config.ts` (the `base` path should match your repository name)

### Deploying

1. Build and deploy to GitHub Pages:
```bash
npm run deploy
```

This will:
- Build your production-ready app
- Deploy it to the `gh-pages` branch
- Make it available at `https://[username].github.io/[repository-name]/`

### Important Notes

- **Repository Name**: If your GitHub repository has a different name than "Quran", update the `base` path in `vite.config.ts` to match your repository name (e.g., if your repo is "my-quran-app", change it to `'/my-quran-app/'`)
- **GitHub Pages Settings**: After the first deployment, go to your repository Settings → Pages and ensure the source is set to the `gh-pages` branch
- **Custom Domain**: If you're using a custom domain, set the `base` path in `vite.config.ts` to `'/'` instead

## Usage

- **Browse Surahs**: Click on any surah from the index page to read it
- **Select Languages**: Use the multi-select dropdown to choose which languages to display (default: Bosnian)
- **Direct Verse Linking**: Use URLs like `/surah/2#36` to jump directly to a specific verse
- **Bookmark Verses**: Click the bookmark button on any verse to save it with an optional note
- **Continue Reading**: Use the "Continue Reading" button on the index page to resume where you left off
- **Search Bookmarks**: Visit the Bookmarks page to search and manage your saved verses

## Technologies

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Vite

