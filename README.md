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

## Deployment

The repo deploys to GitHub Pages automatically on push to `master` via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). The build copies `index.html` to `404.html` so deep links and refreshes work on GitHub Pages.

To enable Pages on a fork:
1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `master` or re-run the deploy workflow

The production `base` path in `vite.config.ts` is set to `/quran-web/` to match the GitHub repository name. If you fork under a different repo name, update `base` in `vite.config.ts` and the matching `basename` in `src/App.tsx`.

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

