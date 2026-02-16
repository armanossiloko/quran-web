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
    // { value: 'arabic', label: 'Arabic' },
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const NavigationButtons = () => (
    <div className="flex justify-between items-center mb-6">
      {previousSurah ? (
        <Link
          to={`/surah/${previousSurah.number}`}
          onClick={scrollToTop}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          ← Previous: {previousSurah.name}
        </Link>
      ) : (
        <div></div>
      )}
      {nextSurah ? (
        <Link
          to={`/surah/${nextSurah.number}`}
          onClick={scrollToTop}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Index
          </Link>
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-white">
              {surah.name}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/30">
                <span className="text-blue-400 font-semibold">Surah {surah.number}</span>
              </span>
              <span className="text-gray-500">•</span>
              <span>{surah.verses.length} Ayahs</span>
            </p>
          </div>
        </div>

        <NavigationButtons />

        {/* Language Selector */}
        <div className="mb-8 bg-gray-800 p-6 sm:p-8 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-white">Select Languages</h3>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <label
                key={lang.value}
                className="flex items-center cursor-pointer text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(lang.value)}
                  onChange={() => handleLanguageToggle(lang.value)}
                  className="w-4 h-4 mr-2"
                />
                <span className="text-base">{lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Verses */}
        <div className="space-y-7">
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
                className={`bg-gray-800 p-7 sm:p-8 rounded-lg border transition-colors relative cursor-pointer ${
                  activeVerse === verse.number
                    ? 'border-green-500'
                    : isProgressSaved(verse.number)
                    ? 'border-blue-500'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {verse.number}
                    </span>
                    <span className="text-gray-400 text-base">Ayah {verse.number}</span>
                    {isProgressSaved(verse.number) && (
                      <span className="text-blue-400 text-sm">✓ Saved</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveProgress(verse.number);
                      }}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors text-white ${
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
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors text-white ${
                        isVerseBookmarked
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {isVerseBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                    </button>
                  </div>
                </div>

                {showInput && !isVerseBookmarked && (
                  <div className="mb-6 p-5 bg-gray-900 rounded-lg border border-gray-700">
                    <input
                      type="text"
                      placeholder="Add a note (optional)"
                      value={bookmarkNote[verse.number] || ''}
                      onChange={(e) =>
                        setBookmarkNote(prev => ({ ...prev, [verse.number]: e.target.value }))
                      }
                      className="w-full bg-gray-800 text-white text-base px-5 py-3 rounded-lg mb-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(verse.number);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBookmarkInput(prev => ({ ...prev, [verse.number]: false }));
                          setBookmarkNote(prev => ({ ...prev, [verse.number]: '' }));
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {isVerseBookmarked && bookmarks.find(b => b.surahNumber === surahNumber && b.verseNumber === verse.number)?.note && (
                  <div className="mb-6 p-5 bg-amber-900/20 rounded-lg border border-amber-700/50">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <p className="text-amber-100 text-base leading-relaxed">
                        {bookmarks.find(b => b.surahNumber === surahNumber && b.verseNumber === verse.number)?.note}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {/* {selectedLanguages.includes('arabic') && (
                    <div className="text-3xl sm:text-4xl text-right leading-loose font-arabic text-gray-100 py-2">
                      {verse.textArabic}
                    </div>
                  )} */}
                  {selectedLanguages.includes('bosnian') && (
                    <div className="text-lg sm:text-xl leading-relaxed text-gray-200">
                      {selectedLanguages.length > 1 && (
                        <span className="inline-block text-gray-400 text-sm font-semibold uppercase tracking-wide mb-1">Bosnian</span>
                      )}
                      <p className={selectedLanguages.length > 1 ? '' : ''}>{verse.textBosnian}</p>
                    </div>
                  )}
                  {selectedLanguages.includes('english') && (
                    <div className="text-lg sm:text-xl leading-relaxed text-gray-200">
                      {selectedLanguages.length > 1 && (
                        <span className="inline-block text-gray-400 text-sm font-semibold uppercase tracking-wide mb-1">English</span>
                      )}
                      <p className={selectedLanguages.length > 1 ? '' : ''}>{verse.textEnglish}</p>
                    </div>
                  )}
                  {selectedLanguages.includes('german') && (
                    <div className="text-lg sm:text-xl leading-relaxed text-gray-200">
                      {selectedLanguages.length > 1 && (
                        <span className="inline-block text-gray-400 text-sm font-semibold uppercase tracking-wide mb-1">German</span>
                      )}
                      <p className={selectedLanguages.length > 1 ? '' : ''}>{verse.textGerman}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <NavigationButtons />
        </div>
      </div>
    </div>
  );
}

export default SurahPage;

