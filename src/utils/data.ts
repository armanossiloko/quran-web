import { Surah } from '../types';
import quranData from '../../data/quran.json';

export const getSurahs = (): Surah[] => {
  return quranData as Surah[];
};

export const getSurah = (number: number): Surah | undefined => {
  const surahs = getSurahs();
  return surahs.find(s => s.number === number);
};

export const getTotalAyahs = (): number => {
  const surahs = getSurahs();
  return surahs.reduce((total, surah) => total + surah.verses.length, 0);
};

