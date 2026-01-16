
export interface DictionaryEntry {
  headword: string;
  partOfSpeech: string;
  pronunciation: string;
  
  // Bangla (L1)
  wordL1: string;
  pronunciationL1: string;
  meaningL1: string;
  synonymsL1: string[];
  antonymsL1: string[];
  exampleL1: string;

  // English (L2)
  translationL2: string; // This acts as the headword for English
  pronunciationL2: string;
  meaningL2: string;
  synonymsL2: string[];
  antonymsL2: string[];
  exampleL2: string;

  // Third Language (L3)
  translationL3: string; // This acts as the headword for L3
  pronunciationL3: string;
  meaningL3: string;
  synonymsL3: string[];
  antonymsL3: string[];
  exampleL3: string;

  usageNote?: string;
  etymology?: string;
}

export enum ThirdLanguage {
  ARABIC = 'Arabic',
  HINDI = 'Hindi',
  FRENCH = 'French',
  SPANISH = 'Spanish',
  GERMAN = 'German',
  JAPANESE = 'Japanese'
}
