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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center">Quran</h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {continueReading && (
              <Link
                to={`/surah/${continueReading.surahNumber}#${continueReading.verseNumber}`}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Continue Reading
              </Link>
            )}
            <Link
              to="/bookmarks"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Bookmarks
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {surahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-blue-400">{surah.number}</span>
                <span className="text-sm text-gray-400">{surah.verses.length} ayahs</span>
              </div>
              <h2 className="text-xl font-semibold">{surah.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IndexPage;

