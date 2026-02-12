import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getSurah, getSurahs } from '../utils/data';
import { saveReadingProgress, getReadingProgress, getBookmarks, saveBookmark, removeBookmark } from '../utils/storage';
import { Surah, Language, Bookmark } from '../types';

function SurahPage() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const surahNumber = parseInt(number || '1', 10);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['bosnian']);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkNote, setBookmarkNote] = useState<{ [verseId: string]: string }>({});
  const [showBookmarkInput, setShowBookmarkInput] = useState<{ [verseId: string]: boolean }>({});
  const [savedProgress, setSavedProgress] = useState<{ surahNumber: number; verseNumber: number } | null>(null);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const languages: { value: Language; label: string }[] = [
    { value: 'bosnian', label: 'Bosnian' },
    { value: 'english', label: 'English' },
    { value: 'german', label: 'German' },
    { value: 'arabic', label: 'Arabic' },
  ];

  useEffect(() => {
    const data = getSurah(surahNumber);
    if (!data) {
      navigate('/');
      return;
    }
    setSurah(data);
    setBookmarks(getBookmarks());
    const progress = getReadingProgress();
    if (progress && progress.surahNumber === surahNumber) {
      setSavedProgress(progress);
    }
    
    // Check for initial hash
    const hash = window.location.hash.slice(1);
    if (hash) {
      const verseNum = parseInt(hash, 10);
      if (verseNum) {
        setActiveVerse(verseNum);
      }
    }
  }, [surahNumber, navigate]);

  // Handle scroll to verse when hash changes or component mounts
  useEffect(() => {
    const scrollToVerse = () => {
      const hash = window.location.hash.slice(1);
      if (hash && surah) {
        const verseNum = parseInt(hash, 10);
        if (verseNum && verseRefs.current[verseNum]) {
          setActiveVerse(verseNum);
          const verseElement = verseRefs.current[verseNum];
          if (verseElement) {
            // Use requestAnimationFrame to ensure smooth scrolling
            requestAnimationFrame(() => {
              verseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          }
        }
      } else {
        setActiveVerse(null);
      }
    };

    // Initial scroll on mount
    setTimeout(() => scrollToVerse(), 100);

    // Listen for hash changes
    const handleHashChange = () => {
      scrollToVerse();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [surah]);

  const handleLanguageToggle = (lang: Language) => {
    setSelectedLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const handleSaveProgress = (verseNumber: number) => {
    if (surah) {
      saveReadingProgress({ surahNumber: surah.number, verseNumber });
      setSavedProgress({ surahNumber: surah.number, verseNumber });
      // Show brief visual feedback
      const verseElement = verseRefs.current[verseNumber];
      if (verseElement) {
        verseElement.classList.add('ring-2', 'ring-blue-500');
        setTimeout(() => {
          verseElement.classList.remove('ring-2', 'ring-blue-500');
        }, 1000);
      }
    }
  };

  const isProgressSaved = (verseNumber: number): boolean => {
    return savedProgress !== null && 
           savedProgress.surahNumber === surahNumber && 
           savedProgress.verseNumber === verseNumber;
  };

  const handleVerseClick = (verseNumber: number) => {
    // Update URL hash when clicking on the verse card
    // Buttons and inputs will stop propagation, so they won't trigger this
    
    // Use history API to update hash without triggering default scroll behavior
    const currentHash = window.location.hash;
    const newHash = `#${verseNumber}`;
    
    if (currentHash !== newHash) {
      // Update URL without triggering default scroll
      window.history.replaceState(null, '', `${window.location.pathname}${newHash}`);
      
      // Manually trigger smooth scroll
      setActiveVerse(verseNumber);
      const verseElement = verseRefs.current[verseNumber];
      if (verseElement) {
        requestAnimationFrame(() => {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  };

  const isBookmarked = (verseNumber: number): boolean => {
    return bookmarks.some(
      b => b.surahNumber === surahNumber && b.verseNumber === verseNumber
    );
  };

  const getBookmarkId = (verseNumber: number): string | undefined => {
    const bookmark = bookmarks.find(
      b => b.surahNumber === surahNumber && b.verseNumber === verseNumber
    );
    return bookmark?.id;
  };

  const handleBookmark = (verseNumber: number) => {
    if (!surah) return;

    const existingBookmark = bookmarks.find(
      b => b.surahNumber === surahNumber && b.verseNumber === verseNumber
    );

    if (existingBookmark) {
      removeBookmark(existingBookmark.id);
      setBookmarks(getBookmarks());
      setShowBookmarkInput(prev => ({ ...prev, [verseNumber]: false }));
    } else {
      const note = bookmarkNote[verseNumber] || '';
      const newBookmark: Bookmark = {
        id: `${surahNumber}-${verseNumber}-${Date.now()}`,
        surahNumber: surah.number,
        surahName: surah.name,
        verseNumber,
        note: note || undefined,
        createdAt: Date.now(),
      };
      saveBookmark(newBookmark);
      setBookmarks(getBookmarks());
      setShowBookmarkInput(prev => ({ ...prev, [verseNumber]: false }));
      setBookmarkNote(prev => ({ ...prev, [verseNumber]: '' }));
    }
  };

  const allSurahs = getSurahs();
  const currentIndex = allSurahs.findIndex(s => s.number === surahNumber);
  const previousSurah = currentIndex > 0 ? allSurahs[currentIndex - 1] : null;
  const nextSurah = currentIndex < allSurahs.length - 1 ? allSurahs[currentIndex + 1] : null;

  const NavigationButtons = () => (
    <div className="flex justify-between items-center mb-6">
      {previousSurah ? (
        <Link
          to={`/surah/${previousSurah.number}`}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
        >
          ← Previous: {previousSurah.name}
        </Link>
      ) : (
        <div></div>
      )}
      {nextSurah ? (
        <Link
          to={`/surah/${nextSurah.number}`}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
        >
          Next: {nextSurah.name} →
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );

  if (!surah) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Index
          </Link>
          <h1 className="text-4xl font-bold mb-2">{surah.name}</h1>
          <p className="text-gray-400">Surah {surah.number} • {surah.verses.length} ayahs</p>
        </div>

        <NavigationButtons />

        <div className="mb-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Select Languages:</h3>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <label
                key={lang.value}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(lang.value)}
                  onChange={() => handleLanguageToggle(lang.value)}
                  className="w-4 h-4 mr-2"
                />
                <span>{lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {surah.verses.map((verse) => {
            const isVerseBookmarked = isBookmarked(verse.number);
            const showInput = showBookmarkInput[verse.number];

            return (
              <div
                key={verse.number}
                id={verse.number.toString()}
                ref={(el) => {
                  verseRefs.current[verse.number] = el;
                }}
                onClick={() => handleVerseClick(verse.number)}
                className={`bg-gray-800 p-6 rounded-lg border transition-all relative cursor-pointer ${
                  activeVerse === verse.number
                    ? 'border-green-500 border-2 ring-2 ring-green-500/20'
                    : isProgressSaved(verse.number) 
                    ? 'border-blue-500 border-2' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {verse.number}
                    </span>
                    <span className="text-gray-400 text-sm">Ayah {verse.number}</span>
                    {isProgressSaved(verse.number) && (
                      <span className="text-blue-400 text-xs">✓ Saved</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveProgress(verse.number);
                      }}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        isProgressSaved(verse.number)
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      title="Save reading progress"
                    >
                      {isProgressSaved(verse.number) ? '✓ Saved' : 'Save Progress'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isVerseBookmarked) {
                          setShowBookmarkInput(prev => ({ ...prev, [verse.number]: true }));
                        } else {
                          const bookmarkId = getBookmarkId(verse.number);
                          if (bookmarkId) {
                            removeBookmark(bookmarkId);
                            setBookmarks(getBookmarks());
                          }
                        }
                      }}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        isVerseBookmarked
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {isVerseBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                    </button>
                  </div>
                </div>

                {showInput && !isVerseBookmarked && (
                  <div className="mb-4 p-3 bg-gray-700 rounded">
                    <input
                      type="text"
                      placeholder="Add a note (optional)"
                      value={bookmarkNote[verse.number] || ''}
                      onChange={(e) =>
                        setBookmarkNote(prev => ({ ...prev, [verse.number]: e.target.value }))
                      }
                      className="w-full bg-gray-600 text-white px-3 py-2 rounded mb-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(verse.number);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBookmarkInput(prev => ({ ...prev, [verse.number]: false }));
                          setBookmarkNote(prev => ({ ...prev, [verse.number]: '' }));
                        }}
                        className="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {isVerseBookmarked && bookmarks.find(b => b.surahNumber === surahNumber && b.verseNumber === verse.number)?.note && (
                  <div className="mb-4 p-3 bg-yellow-900/30 rounded border border-yellow-700">
                    <p className="text-yellow-200 text-sm">
                      Note: {bookmarks.find(b => b.surahNumber === surahNumber && b.verseNumber === verse.number)?.note}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedLanguages.includes('arabic') && (
                    <div className="text-2xl text-right leading-relaxed font-arabic">
                      {verse.textArabic}
                    </div>
                  )}
                  {selectedLanguages.includes('bosnian') && (
                    <div className="text-lg leading-relaxed">
                      {selectedLanguages.length > 1 && (
                        <span className="text-gray-400 text-sm">Bosnian: </span>
                      )}
                      {verse.textBosnian}
                    </div>
                  )}
                  {selectedLanguages.includes('english') && (
                    <div className="text-lg leading-relaxed">
                      {selectedLanguages.length > 1 && (
                        <span className="text-gray-400 text-sm">English: </span>
                      )}
                      {verse.textEnglish}
                    </div>
                  )}
                  {selectedLanguages.includes('german') && (
                    <div className="text-lg leading-relaxed">
                      {selectedLanguages.length > 1 && (
                        <span className="text-gray-400 text-sm">German: </span>
                      )}
                      {verse.textGerman}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <NavigationButtons />
      </div>
    </div>
  );
}

export default SurahPage;

