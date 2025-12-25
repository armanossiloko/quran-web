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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Index
          </Link>
          <h1 className="text-4xl font-bold mb-4">Bookmarks</h1>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {searchQuery ? 'No bookmarks found matching your search.' : 'No bookmarks yet.'}
            </p>
            {!searchQuery && (
              <Link
                to="/"
                className="text-blue-400 hover:text-blue-300 mt-4 inline-block"
              >
                Browse surahs to add bookmarks
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map((bookmark) => {
              const showInput = showEditInput[bookmark.id];

              return (
                <div
                  key={bookmark.id}
                  className="bg-gray-800 p-6 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link
                        to={`/surah/${bookmark.surahNumber}#${bookmark.verseNumber}`}
                        className="text-xl font-semibold text-blue-400 hover:text-blue-300"
                      >
                        {bookmark.surahName} - Verse {bookmark.verseNumber}
                      </Link>
                      <p className="text-gray-400 text-sm mt-1">
                        Surah {bookmark.surahNumber}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNote(bookmark.id)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      >
                        Edit Note
                      </button>
                      <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {showInput ? (
                    <div className="mt-3">
                      <textarea
                        value={editingNote[bookmark.id] || ''}
                        onChange={(e) =>
                          setEditingNote(prev => ({ ...prev, [bookmark.id]: e.target.value }))
                        }
                        placeholder="Add or edit note..."
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2 min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveNote(bookmark.id)}
                          className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelEdit(bookmark.id)}
                          className="bg-gray-600 hover:bg-gray-500 px-4 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    bookmark.note && (
                      <div className="mt-3 p-3 bg-gray-700 rounded">
                        <p className="text-gray-300">{bookmark.note}</p>
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

