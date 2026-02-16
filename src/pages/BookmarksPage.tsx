import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBookmarks, removeBookmark, updateBookmark } from '../utils/storage';
import { Bookmark } from '../types';

function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<{ [id: string]: string }>({});
  const [showEditInput, setShowEditInput] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const query = searchQuery.toLowerCase();
    return (
      bookmark.surahName.toLowerCase().includes(query) ||
      bookmark.note?.toLowerCase().includes(query) ||
      bookmark.verseNumber.toString().includes(query) ||
      bookmark.surahNumber.toString().includes(query)
    );
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this bookmark?')) {
      removeBookmark(id);
      setBookmarks(getBookmarks());
    }
  };

  const handleEditNote = (id: string) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (bookmark) {
      setEditingNote(prev => ({ ...prev, [id]: bookmark.note || '' }));
      setShowEditInput(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleSaveNote = (id: string) => {
    const note = editingNote[id] || '';
    updateBookmark(id, note);
    setBookmarks(getBookmarks());
    setShowEditInput(prev => ({ ...prev, [id]: false }));
  };

  const handleCancelEdit = (id: string) => {
    setShowEditInput(prev => ({ ...prev, [id]: false }));
    setEditingNote(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Index
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Bookmarks
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search bookmarks by surah, verse, or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white text-lg px-16 py-5 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-gray-500"
            />
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-800 border border-gray-700 mb-6">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="text-gray-400 text-2xl mb-6 font-medium">
              {searchQuery ? 'No bookmarks found matching your search.' : 'No bookmarks yet.'}
            </p>
            {!searchQuery && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Browse surahs to add bookmarks
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookmarks.map((bookmark) => {
              const showInput = showEditInput[bookmark.id];

              return (
                <div
                  key={bookmark.id}
                  className="bg-gray-800 p-7 sm:p-8 rounded-lg border border-gray-700 hover:border-amber-500 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <Link
                        to={`/surah/${bookmark.surahNumber}#${bookmark.verseNumber}`}
                        className="inline-block"
                      >
                        <h2 className="text-2xl sm:text-3xl text-blue-400 hover:text-blue-300 transition-colors mb-2">
                          {bookmark.surahName}
                          <span className="text-gray-500 mx-2">·</span>
                          <span className="text-xl sm:text-2xl">Verse {bookmark.verseNumber}</span>
                        </h2>
                      </Link>
                      <div className="flex items-center gap-3 text-base text-gray-400">
                        <span className="inline-flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/30">
                          <span className="text-blue-400 font-medium">Surah {bookmark.surahNumber}</span>
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500">
                          {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNote(bookmark.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        Edit Note
                      </button>
                      <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {showInput ? (
                    <div className="mt-5 p-5 bg-gray-900 rounded-lg border border-gray-700">
                      <textarea
                        value={editingNote[bookmark.id] || ''}
                        onChange={(e) =>
                          setEditingNote(prev => ({ ...prev, [bookmark.id]: e.target.value }))
                        }
                        placeholder="Add or edit note..."
                        className="w-full bg-gray-800 text-white text-base px-5 py-4 rounded-lg mb-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors min-h-[120px] resize-y"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveNote(bookmark.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelEdit(bookmark.id)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    bookmark.note && (
                      <div className="mt-5 p-5 bg-amber-900/20 rounded-lg border border-amber-700/50">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          <p className="text-amber-100 text-base sm:text-lg leading-relaxed flex-1">
                            {bookmark.note}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookmarksPage;

