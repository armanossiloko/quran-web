import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSurahs } from '../utils/data';
import { getReadingProgress } from '../utils/storage';
import { Surah } from '../types';

function IndexPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [continueReading, setContinueReading] = useState<{ surahNumber: number; verseNumber: number } | null>(null);

  useEffect(() => {
    const data = getSurahs();
    setSurahs(data);

    const progress = getReadingProgress();
    if (progress) {
      setContinueReading(progress);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Hero Header */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-4 text-white font-bold">
              Quran
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            {continueReading && (
              <Link
                to={`/surah/${continueReading.surahNumber}#${continueReading.verseNumber}`}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors w-full sm:w-auto text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Continue Reading
                </span>
              </Link>
            )}
            <Link
              to="/bookmarks"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition-colors w-full sm:w-auto text-center"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Bookmarks
              </span>
            </Link>
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
          {surahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              className="bg-gray-800 p-7 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-blue-400">{surah.number}</span>
                <span className="text-sm text-gray-400">{surah.verses.length} ayahs</span>
              </div>
              <h2 className="text-xl font-semibold text-white">
                {surah.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IndexPage;

