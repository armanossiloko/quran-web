import { Bookmark, ReadingProgress } from '../types';

const READING_PROGRESS_KEY = 'quran_reading_progress';
const BOOKMARKS_KEY = 'quran_bookmarks';

export const getReadingProgress = (): ReadingProgress | null => {
  const stored = localStorage.getItem(READING_PROGRESS_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const saveReadingProgress = (progress: ReadingProgress): void => {
  localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(progress));
};

export const getBookmarks = (): Bookmark[] => {
  const stored = localStorage.getItem(BOOKMARKS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveBookmark = (bookmark: Bookmark): void => {
  const bookmarks = getBookmarks();
  bookmarks.push(bookmark);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
};

export const removeBookmark = (id: string): void => {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter(b => b.id !== id);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
};

export const updateBookmark = (id: string, note: string): void => {
  const bookmarks = getBookmarks();
  const updated = bookmarks.map(b => 
    b.id === id ? { ...b, note } : b
  );
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
};

