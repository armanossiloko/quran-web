export interface Verse {
  number: number;
  numberAbsolute: number;
  surahNumber: number;
  surahName: string;
  textBosnian: string;
  textEnglish: string;
  textGerman: string;
  textArabic: string;
}

export interface Surah {
  name: string;
  number: number;
  verses: Verse[];
}

export type Language = 'bosnian' | 'english' | 'german' | 'arabic';

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  note?: string;
  createdAt: number;
}

export interface ReadingProgress {
  surahNumber: number;
  verseNumber: number;
}

