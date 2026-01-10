import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import SurahPage from './pages/SurahPage';
import BookmarksPage from './pages/BookmarksPage';

function App() {
  return (
    <BrowserRouter basename="/quran-web">
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/surah/:number" element={<SurahPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

