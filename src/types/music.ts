export type ScaleType = 
  | 'dorian' 
  | 'lofi-pentatonic' 
  | 'natural-minor' 
  | 'major' 
  | 'lydian' 
  | 'mixolydian' 
  | 'harmonic-minor' 
  | 'phrygian';

export type MusicalKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface NoteEvent {
  id: string;
  pitch: string; // e.g. "D4", "F#4"
  midiNumber: number; // 60 for Middle C
  step: number; // 0 to 15 (or 31)
  duration: number; // in steps (e.g. 1, 2, 4)
  velocity: number; // 0.1 to 1.0
  track: 'melody' | 'chords' | 'bass';
}

export interface ChordBar {
  barIndex: number;
  root: MusicalKey;
  quality: string; // "m7", "maj9", "sus4", "add9", "7"
  romanNumeral: string; // "i", "IV", "v7", "bVI"
  notes: string[]; // ["D3", "F3", "A3", "C4"]
  midiNotes: number[];
  name: string; // "Dm7"
  duration: number; // in steps, default 4 or 8
  trickExplanation?: string;
}

export interface DrumStep {
  step: number;
  kick: boolean;
  snare: boolean;
  hihat: boolean;
  openHat?: boolean;
  velocity: number;
}

export interface TheoryTrick {
  id: string;
  title: string;
  category: 'harmony' | 'melody' | 'rhythm';
  shortDesc: string;
  musicalExplanation: string;
  active: boolean;
  exampleProgression: string;
}

export interface MoodProfile {
  id: string;
  name: string;
  tagline: string;
  valence: number; // -1.0 (melancholic) to +1.0 (euphoric)
  energy: number;  // 0.0 (calm/chill) to 1.0 (high drive)
  tension: number; // 0.0 (pure/consonant) to 1.0 (complex/dissonant)
  suggestedScale: ScaleType;
  suggestedKey: MusicalKey;
  suggestedBpm: number;
  primaryTrick: string;
  chordsSummary: string[];
}

export interface SongArrangementSection {
  name: 'Intro' | 'Verse' | 'Chorus' | 'Bridge' | 'Outro';
  bars: number;
  chordProgression: string[];
  energyLevel: number;
  lyricHook: string;
  productionNote: string;
}

export interface SongComposition {
  id: string;
  title: string;
  moodName: string;
  key: MusicalKey;
  scale: ScaleType;
  bpm: number;
  swing: number; // 0.0 to 0.4
  totalSteps: number; // usually 16 or 32
  chords: ChordBar[];
  melody: NoteEvent[];
  bassline: NoteEvent[];
  drums: DrumStep[];
  activeTricks: string[];
  aiAnalysis?: {
    moodDescription: string;
    whyScaleWorks: string;
    arrangementInsight: string;
    lyricTheme: string;
  };
  sections?: SongArrangementSection[];
}
