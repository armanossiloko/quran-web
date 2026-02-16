import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import SurahPage from './pages/SurahPage';
import BookmarksPage from './pages/BookmarksPage';

function App() {
  // Use basename only in production (for GitHub Pages)
  const basename = import.meta.env.MODE === 'production' ? '/quran-web' : '/';

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/surah/:number" element={<SurahPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

