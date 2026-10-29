import { MoodProfile, MusicalKey, NoteEvent, ChordBar, DrumStep, ScaleType, SongComposition, TheoryTrick, SongArrangementSection } from '../types/music';

export const NOTE_NAMES: MusicalKey[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SCALE_INTERVALS: Record<ScaleType, { intervals: number[]; name: string; moodDesc: string; trickDescription: string }> = {
  'dorian': {
    intervals: [0, 2, 3, 5, 7, 9, 10],
    name: 'Dorian Mode',
    moodDesc: 'Bittersweet, cinematic, nostalgic wonder (used in Pink Floyd, Daft Punk)',
    trickDescription: 'The "Raised 6th" trick: gives minor harmony a hopeful gleam without sounding cheesy or purely happy.'
  },
  'lofi-pentatonic': {
    intervals: [0, 3, 5, 7, 10],
    name: 'Lofi Minor Pentatonic',
    moodDesc: 'Soulful, mellow, cozy and serene with zero harsh dissonance',
    trickDescription: 'The "No-Half-Steps" trick: eliminates harsh semitone clashes so every melody note effortlessly flows over chords.'
  },
  'natural-minor': {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    name: 'Natural Minor (Aeolian)',
    moodDesc: 'Deep, emotional, solemn and reflective',
    trickDescription: 'The "Flat 6th Tension" trick: creates a heavy gravitational pull towards the tonic root.'
  },
  'major': {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    name: 'Major (Ionian)',
    moodDesc: 'Bright, joyful, heroic and triumphant',
    trickDescription: 'The "Tonic Anchor" trick: solid resolution using the classic 1-4-5 backbone with suspended color.'
  },
  'lydian': {
    intervals: [0, 2, 4, 6, 7, 9, 11],
    name: 'Lydian Mode',
    moodDesc: 'Dreamy, ethereal, floating, space-like and magical',
    trickDescription: 'The "Sharp 4th" trick: introduces a floating, weightless feeling used in film scores (E.T., Simpsons theme).'
  },
  'mixolydian': {
    intervals: [0, 2, 4, 5, 7, 9, 10],
    name: 'Mixolydian Mode',
    moodDesc: 'Bluesy, groove-heavy, funky and warm',
    trickDescription: 'The "Flat 7th" trick: keeps the major brightness while stripping away stiff classical resolution for natural groove.'
  },
  'phrygian': {
    intervals: [0, 1, 3, 5, 7, 8, 10],
    name: 'Phrygian Mode',
    moodDesc: 'Dark, exotic, menacing, flamenco tension',
    trickDescription: 'The "Half-step Drop" trick: instant sinister tension from the very first step (b2 interval).'
  },
  'harmonic-minor': {
    intervals: [0, 2, 3, 5, 7, 8, 11],
    name: 'Harmonic Minor',
    moodDesc: 'Dramatic, neo-classical, gothic and passionate',
    trickDescription: 'The "Leading Tone Leap" trick: creates an exotic 1.5-step jump (augmented second) between b6 and natural 7.'
  }
};

export const MOOD_PRESETS: MoodProfile[] = [
  {
    id: 'dreamy-dorian',
    name: 'Dreamy Twilight',
    tagline: 'Bittersweet & reflective with nostalgic cinematic warmth',
    valence: 0.1,
    energy: 0.45,
    tension: 0.3,
    suggestedScale: 'dorian',
    suggestedKey: 'D',
    suggestedBpm: 86,
    primaryTrick: 'Dorian Raised 6th (i - IV progression)',
    chordsSummary: ['Dm9', 'G13', 'Dm9', 'Em7b5']
  },
  {
    id: 'lofi-coffee',
    name: 'Lofi Rainy Coffee',
    tagline: 'Smooth, soulful and cozy with warm vinyl Rhodes harmony',
    valence: 0.2,
    energy: 0.35,
    tension: 0.2,
    suggestedScale: 'lofi-pentatonic',
    suggestedKey: 'F',
    suggestedBpm: 76,
    primaryTrick: 'Omission of Tension & Minor 9th Clusters',
    chordsSummary: ['Fm9', 'Bbm7', 'Eb9', 'Abmaj7']
  },
  {
    id: 'midnight-drive',
    name: 'Midnight Cyber Drive',
    tagline: 'Dark, energetic synthwave pulse with driving momentum',
    valence: -0.4,
    energy: 0.85,
    tension: 0.65,
    suggestedScale: 'natural-minor',
    suggestedKey: 'A',
    suggestedBpm: 122,
    primaryTrick: 'Euclidean Ostinato & Pedal Sub-Bass',
    chordsSummary: ['Am', 'Fmaj7', 'Dm7', 'Em7']
  },
  {
    id: 'euphoric-sunrise',
    name: 'Euphoric Horizon',
    tagline: 'Floating optimism and uplifting festival energy',
    valence: 0.85,
    energy: 0.75,
    tension: 0.15,
    suggestedScale: 'lydian',
    suggestedKey: 'C',
    suggestedBpm: 116,
    primaryTrick: 'Lydian Sharp-4 Floating Wonder',
    chordsSummary: ['Cmaj7(#11)', 'D/C', 'Am9', 'Gadd9']
  },
  {
    id: 'deep-ambient-chill',
    name: 'Deep Ambient Chill',
    tagline: 'Spacious, calm and introspective for focus or rest',
    valence: 0.05,
    energy: 0.25,
    tension: 0.1,
    suggestedScale: 'lofi-pentatonic',
    suggestedKey: 'G',
    suggestedBpm: 72,
    primaryTrick: 'Dotted Eighth Delay & Pentatonic Arpeggios',
    chordsSummary: ['Gm7', 'Ebmaj7', 'Bbmaj9', 'Fsus4']
  },
  {
    id: 'noir-jazz-lounge',
    name: 'Late-Night Noir',
    tagline: 'Sophisticated tension, smoky chords and mysterious groove',
    valence: -0.3,
    energy: 0.4,
    tension: 0.75,
    suggestedScale: 'harmonic-minor',
    suggestedKey: 'C',
    suggestedBpm: 82,
    primaryTrick: 'Harmonic Minor Leading Tone & Diminished Passes',
    chordsSummary: ['Cm9', 'Abmaj7', 'Dø7', 'G7b9']
  }
];

export const AVAILABLE_TRICKS: TheoryTrick[] = [
  {
    id: 'dorian-mode',
    title: 'Dorian Raised 6th (Bittersweet Magic)',
    category: 'harmony',
    shortDesc: 'Swaps minor 6th for major 6th to turn gloom into wonder',
    musicalExplanation: 'Standard minor sounds sad. Dorian raises the 6th degree by a half-step (e.g., B natural in D minor), creating a major IV chord (like Dm to G) that sounds wistful, noble, and cinematic.',
    active: true,
    exampleProgression: 'i - IV7 - i - v7'
  },
  {
    id: 'lofi-pentatonic',
    title: 'Lofi Pentatonic Smoothness',
    category: 'melody',
    shortDesc: 'Eliminates semitone clashes for dreamy flow',
    musicalExplanation: 'By stripping the 2nd and 6th from minor (leaving 1, b3, 4, 5, b7), every note is at least a whole step away. Melodies never sound sour or clashing over shifting chords.',
    active: true,
    exampleProgression: 'Melody focuses on 9th, 7th, and 11th color tones'
  },
  {
    id: 'euclidean-rhythm',
    title: 'Euclidean Groove Distribution',
    category: 'rhythm',
    shortDesc: 'Mathematically spreads beat hits for organic syncopation',
    musicalExplanation: 'Uses Euclid\'s algorithm (Bresenham line) to distribute $k$ pulses across $n$ steps (e.g. 5 hits across 16 steps: X..X..X..X.X..). Naturally mimics West African, Cuban, and jazz polyrhythms.',
    active: true,
    exampleProgression: 'E(5, 16) on Hi-Hats, E(3, 8) on Kick'
  },
  {
    id: 'color-chords',
    title: 'Emotional Color Chords (add9 & maj7)',
    category: 'harmony',
    shortDesc: 'Replaces plain triads with lush extended voicings',
    musicalExplanation: 'Plain major/minor triads sound thin. Adding the 9th and 7th infuses rich emotional weight without clashing, instantly providing modern indie and neo-soul warmth.',
    active: true,
    exampleProgression: 'maj9, m9, 13, sus2'
  },
  {
    id: 'dotted-bounce',
    title: 'Dotted Eighth & Swing Humanization',
    category: 'rhythm',
    shortDesc: 'Micro-timing offsets that prevent robotic loops',
    musicalExplanation: 'Delays the 2nd and 4th sixteenth notes slightly (swing ratio 58-64%) and accents dotted-eighth intervals (3/16 timing) for that irresistible head-nod bounce.',
    active: true,
    exampleProgression: '16th-note swing + offbeat syncopation'
  }
];

// Pitch & MIDI utility functions
export function noteToMidi(pitch: string): number {
  const match = pitch.match(/^([A-G][#b]?)(-?\d+)$/);
  if (!match) return 60;
  let [, note, octStr] = match;
  if (note === 'Db') note = 'C#';
  if (note === 'Eb') note = 'D#';
  if (note === 'Gb') note = 'F#';
  if (note === 'Ab') note = 'G#';
  if (note === 'Bb') note = 'A#';
  
  const octave = parseInt(octStr, 10);
  const noteIndex = NOTE_NAMES.indexOf(note as MusicalKey);
  if (noteIndex === -1) return 60;
  return (octave + 1) * 12 + noteIndex;
}

export function midiToNote(midi: number): string {
  const noteIndex = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Generate Euclidean Rhythm Pattern: distributes `pulses` across `steps`
export function generateEuclidean(pulses: number, steps: number = 16): boolean[] {
  if (pulses <= 0) return new Array(steps).fill(false);
  if (pulses >= steps) return new Array(steps).fill(true);

  const pattern: boolean[] = new Array(steps).fill(false);
  let bucket = 0;
  for (let i = 0; i < steps; i++) {
    bucket += pulses;
    if (bucket >= steps) {
      bucket -= steps;
      pattern[i] = true;
    }
  }
  return pattern;
}

// Get notes in a scale for a given root key
export function getScaleMidiNotes(rootKey: MusicalKey, scaleType: ScaleType, octave: number = 4): number[] {
  const rootIndex = NOTE_NAMES.indexOf(rootKey);
  const baseMidi = (octave + 1) * 12 + rootIndex;
  const intervals = SCALE_INTERVALS[scaleType].intervals;
  return intervals.map(interval => baseMidi + interval);
}

// Deterministic chord & melody generator based on mood parameters
export function generateCompositionFromMood(
  mood: MoodProfile, 
  customKey?: MusicalKey, 
  customBpm?: number
): SongComposition {
  const key = customKey || mood.suggestedKey;
  const scale = mood.suggestedScale;
  const bpm = customBpm || mood.suggestedBpm;
  const keyIdx = NOTE_NAMES.indexOf(key);

  // Generate 4-bar chord progression based on mood and scale
  const chords: ChordBar[] = [];
  const rootBaseMidi = 48 + keyIdx; // octave 3

  if (scale === 'dorian') {
    // i9 - IV13 - i9 - v7 or bVII
    chords.push(
      { barIndex: 0, root: key, quality: 'm9', romanNumeral: 'i9', name: `${key}m9`, duration: 4, notes: [midiToNote(rootBaseMidi), midiToNote(rootBaseMidi + 3), midiToNote(rootBaseMidi + 7), midiToNote(rootBaseMidi + 10), midiToNote(rootBaseMidi + 14)], midiNotes: [rootBaseMidi, rootBaseMidi + 3, rootBaseMidi + 7, rootBaseMidi + 10, rootBaseMidi + 14], trickExplanation: 'Minor 9th chord establishes bittersweet anchor' },
      { barIndex: 1, root: NOTE_NAMES[(keyIdx + 5) % 12], quality: '13', romanNumeral: 'IV13', name: `${NOTE_NAMES[(keyIdx + 5) % 12]}13`, duration: 4, notes: [midiToNote(rootBaseMidi + 5), midiToNote(rootBaseMidi + 9), midiToNote(rootBaseMidi + 12), midiToNote(rootBaseMidi + 14)], midiNotes: [rootBaseMidi + 5, rootBaseMidi + 9, rootBaseMidi + 12, rootBaseMidi + 14], trickExplanation: 'Dorian Raised 6th: Major IV chord introduces nostalgic lift' },
      { barIndex: 2, root: key, quality: 'm9', romanNumeral: 'i9', name: `${key}m9`, duration: 4, notes: [midiToNote(rootBaseMidi), midiToNote(rootBaseMidi + 3), midiToNote(rootBaseMidi + 7), midiToNote(rootBaseMidi + 10)], midiNotes: [rootBaseMidi, rootBaseMidi + 3, rootBaseMidi + 7, rootBaseMidi + 10], trickExplanation: 'Return to tonic anchor with warm ninth voicing' },
      { barIndex: 3, root: NOTE_NAMES[(keyIdx + 10) % 12], quality: 'maj7', romanNumeral: 'bVIImaj7', name: `${NOTE_NAMES[(keyIdx + 10) % 12]}maj7`, duration: 4, notes: [midiToNote(rootBaseMidi + 10), midiToNote(rootBaseMidi + 14), midiToNote(rootBaseMidi + 17), midiToNote(rootBaseMidi + 21)], midiNotes: [rootBaseMidi + 10, rootBaseMidi + 14, rootBaseMidi + 17, rootBaseMidi + 21], trickExplanation: 'Subtonic major 7th creates gentle loop turnaround' }
    );
  } else if (scale === 'lofi-pentatonic') {
    // i7 - iv7 - bVII9 - bIIImaj7
    chords.push(
      { barIndex: 0, root: key, quality: 'm9', romanNumeral: 'i9', name: `${key}m9`, duration: 4, notes: [midiToNote(rootBaseMidi), midiToNote(rootBaseMidi + 3), midiToNote(rootBaseMidi + 7), midiToNote(rootBaseMidi + 10), midiToNote(rootBaseMidi + 14)], midiNotes: [rootBaseMidi, rootBaseMidi + 3, rootBaseMidi + 7, rootBaseMidi + 10, rootBaseMidi + 14], trickExplanation: 'Lofi ninth voicing with zero semitone friction' },
      { barIndex: 1, root: NOTE_NAMES[(keyIdx + 5) % 12], quality: 'm7', romanNumeral: 'iv7', name: `${NOTE_NAMES[(keyIdx + 5) % 12]}m7`, duration: 4, notes: [midiToNote(rootBaseMidi + 5), midiToNote(rootBaseMidi + 8), midiToNote(rootBaseMidi + 12), midiToNote(rootBaseMidi + 15)], midiNotes: [rootBaseMidi + 5, rootBaseMidi + 8, rootBaseMidi + 12, rootBaseMidi + 15], trickExplanation: 'Subdominant minor preserves gentle melancholy' },
      { barIndex: 2, root: NOTE_NAMES[(keyIdx + 10) % 12], quality: '9', romanNumeral: 'bVII9', name: `${NOTE_NAMES[(keyIdx + 10) % 12]}9`, duration: 4, notes: [rootBaseMidi - 2, rootBaseMidi + 2, rootBaseMidi + 5, rootBaseMidi + 8].map(midiToNote), midiNotes: [rootBaseMidi - 2, rootBaseMidi + 2, rootBaseMidi + 5, rootBaseMidi + 8], trickExplanation: 'Dominant 9th color chord creates soulful pull' },
      { barIndex: 3, root: NOTE_NAMES[(keyIdx + 3) % 12], quality: 'maj7', romanNumeral: 'bIIImaj7', name: `${NOTE_NAMES[(keyIdx + 3) % 12]}maj7`, duration: 4, notes: [rootBaseMidi + 3, rootBaseMidi + 7, rootBaseMidi + 10, rootBaseMidi + 14].map(midiToNote), midiNotes: [rootBaseMidi + 3, rootBaseMidi + 7, rootBaseMidi + 10, rootBaseMidi + 14], trickExplanation: 'Relative major seventh provides cozy resolution' }
    );
  } else if (scale === 'lydian') {
    // Imaj7(#11) - II/I - vi9 - Vadd9
    chords.push(
      { barIndex: 0, root: key, quality: 'maj7(#11)', romanNumeral: 'Imaj7(#11)', name: `${key}maj7#11`, duration: 4, notes: [rootBaseMidi, rootBaseMidi + 4, rootBaseMidi + 6, rootBaseMidi + 11].map(midiToNote), midiNotes: [rootBaseMidi, rootBaseMidi + 4, rootBaseMidi + 6, rootBaseMidi + 11], trickExplanation: 'Lydian Sharp-4: Magical floating cinematic chord' },
      { barIndex: 1, root: NOTE_NAMES[(keyIdx + 2) % 12], quality: 'maj/I', romanNumeral: 'II/I', name: `${NOTE_NAMES[(keyIdx + 2) % 12]}`, duration: 4, notes: [rootBaseMidi + 2, rootBaseMidi + 6, rootBaseMidi + 9, rootBaseMidi + 12].map(midiToNote), midiNotes: [rootBaseMidi + 2, rootBaseMidi + 6, rootBaseMidi + 9, rootBaseMidi + 12], trickExplanation: 'Major II triad over tonic creates space-age lift' },
      { barIndex: 2, root: NOTE_NAMES[(keyIdx + 9) % 12], quality: 'm9', romanNumeral: 'vi9', name: `${NOTE_NAMES[(keyIdx + 9) % 12]}m9`, duration: 4, notes: [rootBaseMidi - 3, rootBaseMidi, rootBaseMidi + 4, rootBaseMidi + 7].map(midiToNote), midiNotes: [rootBaseMidi - 3, rootBaseMidi, rootBaseMidi + 4, rootBaseMidi + 7], trickExplanation: 'Submediant minor anchors with warmth' },
      { barIndex: 3, root: NOTE_NAMES[(keyIdx + 7) % 12], quality: 'add9', romanNumeral: 'Vadd9', name: `${NOTE_NAMES[(keyIdx + 7) % 12]}add9`, duration: 4, notes: [rootBaseMidi - 5, rootBaseMidi - 1, rootBaseMidi + 2, rootBaseMidi + 4].map(midiToNote), midiNotes: [rootBaseMidi - 5, rootBaseMidi - 1, rootBaseMidi + 2, rootBaseMidi + 4], trickExplanation: 'Dominant add9 leads smoothly back to tonic' }
    );
  } else {
    // Default Natural Minor / Aeolian (i - VI - III - VII)
    chords.push(
      { barIndex: 0, root: key, quality: 'm', romanNumeral: 'i', name: `${key}m`, duration: 4, notes: [rootBaseMidi, rootBaseMidi + 3, rootBaseMidi + 7, rootBaseMidi + 10].map(midiToNote), midiNotes: [rootBaseMidi, rootBaseMidi + 3, rootBaseMidi + 7, rootBaseMidi + 10], trickExplanation: 'Minor tonic foundation' },
      { barIndex: 1, root: NOTE_NAMES[(keyIdx + 8) % 12], quality: 'maj7', romanNumeral: 'VImaj7', name: `${NOTE_NAMES[(keyIdx + 8) % 12]}maj7`, duration: 4, notes: [rootBaseMidi - 4, rootBaseMidi, rootBaseMidi + 3, rootBaseMidi + 7].map(midiToNote), midiNotes: [rootBaseMidi - 4, rootBaseMidi, rootBaseMidi + 3, rootBaseMidi + 7], trickExplanation: 'Submediant jump produces emotional vulnerability' },
      { barIndex: 2, root: NOTE_NAMES[(keyIdx + 3) % 12], quality: 'maj', romanNumeral: 'III', name: `${NOTE_NAMES[(keyIdx + 3) % 12]}`, duration: 4, notes: [rootBaseMidi + 3, rootBaseMidi + 7, rootBaseMidi + 10, rootBaseMidi + 14].map(midiToNote), midiNotes: [rootBaseMidi + 3, rootBaseMidi + 7, rootBaseMidi + 10, rootBaseMidi + 14], trickExplanation: 'Relative major offers brief uplifting contrast' },
      { barIndex: 3, root: NOTE_NAMES[(keyIdx + 10) % 12], quality: 'sus4', romanNumeral: 'VIIsus4', name: `${NOTE_NAMES[(keyIdx + 10) % 12]}sus4`, duration: 4, notes: [rootBaseMidi - 2, rootBaseMidi + 3, rootBaseMidi + 5, rootBaseMidi + 8].map(midiToNote), midiNotes: [rootBaseMidi - 2, rootBaseMidi + 3, rootBaseMidi + 5, rootBaseMidi + 8], trickExplanation: 'Suspended subtonic creates unresolved forward motion' }
    );
  }

  // Generate Lead Melody (16 steps across 4 bars = 4 steps per bar)
  const scaleNotes = getScaleMidiNotes(key, scale, 4); // octave 4
  const highScaleNotes = getScaleMidiNotes(key, scale, 5); // octave 5
  const fullScale = [...scaleNotes, ...highScaleNotes];

  const melody: NoteEvent[] = [];
  // 16-step rhythmic positions for melodic motifs
  // Bar 0: Steps 0, 2
  // Bar 1: Steps 4, 6, 7
  // Bar 2: Steps 8, 10, 11
  // Bar 3: Steps 12, 14, 15
  const melodySteps = [0, 2, 4, 6, 7, 8, 10, 11, 12, 14, 15];
  
  melodySteps.forEach((step, idx) => {
    // Pick note matching scale and chord context
    const chordIndex = Math.floor(step / 4);
    const activeChord = chords[chordIndex];
    // Favor chord tone or tension note
    let midiNote: number;
    if (idx === 0) {
      midiNote = fullScale[0]; // root start
    } else if (idx === 1) {
      midiNote = fullScale[2]; // 3rd
    } else if (idx === 2) {
      midiNote = fullScale[4]; // 5th or 6th
    } else if (idx === 3) {
      midiNote = fullScale[scale === 'dorian' ? 5 : 3]; // Dorian raised 6th feature!
    } else if (idx === 4) {
      midiNote = fullScale[4];
    } else if (idx === 5) {
      midiNote = fullScale[1]; // 9th extension
    } else if (idx === 6) {
      midiNote = fullScale[3]; // 11th
    } else if (idx === 7) {
      midiNote = fullScale[2];
    } else if (idx === 8) {
      midiNote = fullScale[6]; // 7th leading tone
    } else if (idx === 9) {
      midiNote = fullScale[4];
    } else {
      midiNote = fullScale[0]; // resolution
    }

    melody.push({
      id: `mel_${step}_${idx}`,
      pitch: midiToNote(midiNote),
      midiNumber: midiNote,
      step: step,
      duration: idx % 3 === 0 ? 2 : 1,
      velocity: 0.75 + (idx % 2 === 0 ? 0.15 : -0.1),
      track: 'melody'
    });
  });

  // Generate Bassline (Sub-bass / electric bass)
  const bassline: NoteEvent[] = [];
  chords.forEach((chord, bar) => {
    const rootMidi = chord.midiNotes[0] - 12; // octave 2
    const fifthMidi = rootMidi + 7;
    // Step on beat 1
    bassline.push({
      id: `bass_${bar * 4}_0`,
      pitch: midiToNote(rootMidi),
      midiNumber: rootMidi,
      step: bar * 4,
      duration: 2,
      velocity: 0.9,
      track: 'bass'
    });
    // Syncopated pickup on step 2 or 3
    bassline.push({
      id: `bass_${bar * 4}_2`,
      pitch: midiToNote(bar % 2 === 0 ? fifthMidi : rootMidi),
      midiNumber: bar % 2 === 0 ? fifthMidi : rootMidi,
      step: bar * 4 + 2,
      duration: 1,
      velocity: 0.75,
      track: 'bass'
    });
    if (bar === 3) {
      // Walkup note on step 15
      const walkMidi = rootMidi + (scale === 'dorian' ? 10 : 11);
      bassline.push({
        id: `bass_${bar * 4}_3`,
        pitch: midiToNote(walkMidi),
        midiNumber: walkMidi,
        step: 15,
        duration: 1,
        velocity: 0.8,
        track: 'bass'
      });
    }
  });

  // Generate Drums using Euclidean Rhythms
  // Kick: Euclidean E(4, 16) or E(5, 16)
  // Snare: Standard backbeat on steps 4, 12
  // Hi-Hat: Euclidean E(7, 16) or continuous with ghost notes
  const kickPattern = generateEuclidean(mood.energy > 0.6 ? 5 : 4, 16);
  // Ensure beat 0 always has a kick
  kickPattern[0] = true;
  const hihatPattern = generateEuclidean(mood.energy > 0.5 ? 9 : 7, 16);

  const drums: DrumStep[] = [];
  for (let s = 0; s < 16; s++) {
    const isBackbeatSnare = s === 4 || s === 12;
    const isKick = kickPattern[s] || (s === 0 || s === 8);
    const isHat = hihatPattern[s] || (s % 2 === 0);
    const isOpenHat = s === 14;

    drums.push({
      step: s,
      kick: isKick,
      snare: isBackbeatSnare,
      hihat: isHat,
      openHat: isOpenHat,
      velocity: s % 4 === 0 ? 0.9 : 0.65
    });
  }

  const sections: SongArrangementSection[] = [
    {
      name: 'Intro',
      bars: 4,
      chordProgression: [chords[0].name, chords[1].name, chords[0].name, chords[3].name],
      energyLevel: 0.3,
      lyricHook: '(Ambient texture, Rhodes chords swell, distant percussion)',
      productionNote: 'Low-pass filter at 800Hz, gradual high-shelf opening towards bar 4'
    },
    {
      name: 'Verse',
      bars: 8,
      chordProgression: chords.map(c => c.name),
      energyLevel: 0.55,
      lyricHook: `In the quiet shadow of ${key}... whispers caught between the lines`,
      productionNote: 'Full drum groove enters, bass anchors the pulse, vocals/lead stay intimate'
    },
    {
      name: 'Chorus',
      bars: 8,
      chordProgression: [chords[1].name, chords[3].name, chords[0].name, chords[2].name],
      energyLevel: 0.9,
      lyricHook: `Let the ${scale} light break through, higher than the evening glow`,
      productionNote: 'Open stereo width, layered pad harmonies, doubled lead synth with subtle chorus'
    },
    {
      name: 'Outro',
      bars: 4,
      chordProgression: [chords[0].name, chords[1].name, chords[0].name, `${key}maj9`],
      energyLevel: 0.2,
      lyricHook: 'Fade into tape warmth...',
      productionNote: 'Reverb wash delay tail, drums dropout leaving solo sustained chord'
    }
  ];

  return {
    id: `song_${Date.now()}`,
    title: `${mood.name} in ${key} ${SCALE_INTERVALS[scale].name}`,
    moodName: mood.name,
    key,
    scale,
    bpm,
    swing: mood.energy < 0.5 ? 0.25 : 0.1,
    totalSteps: 16,
    chords,
    melody,
    bassline,
    drums,
    activeTricks: [mood.primaryTrick, 'Euclidean Drum Distribution', 'Color Chord Voicing'],
    aiAnalysis: {
      moodDescription: mood.tagline,
      whyScaleWorks: SCALE_INTERVALS[scale].trickDescription,
      arrangementInsight: `At ${bpm} BPM, the rhythm strikes a balance between hypnotic pulse and thoughtful groove. The ${chords[1].name} chord introduces emotional resolution without becoming cliché.`,
      lyricTheme: `Themes of longing, quiet wonder, late-night introspection, and urban stillness.`
    },
    sections
  };
}

// Generate Standard MIDI File Binary (Format 0/1) for download
export function generateMidiFile(song: SongComposition): Blob {
  // Standard MIDI file writer
  // Header chunk: MThd, length 6, format 0 (single track) or 1 (multi-track), ntracks, division (ticks per quarter note = 480)
  const ticksPerBeat = 480;
  const ticksPerStep = ticksPerBeat / 4; // 16th note = 120 ticks
  const bytes: number[] = [];

  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
  }

  function writeUint32(num: number) {
    bytes.push((num >> 24) & 0xff);
    bytes.push((num >> 16) & 0xff);
    bytes.push((num >> 8) & 0xff);
    bytes.push(num & 0xff);
  }

  function writeUint16(num: number) {
    bytes.push((num >> 8) & 0xff);
    bytes.push(num & 0xff);
  }

  function writeVarLength(value: number) {
    let buffer = value & 0x7f;
    while ((value >>= 7) > 0) {
      buffer <<= 8;
      buffer |= 0x80;
      buffer += (value & 0x7f);
    }
    while (true) {
      bytes.push(buffer & 0xff);
      if (buffer & 0x80) buffer >>= 8;
      else break;
    }
  }

  // Header chunk
  writeString('MThd');
  writeUint32(6); // 6 bytes for header data
  writeUint16(0); // format 0 (single multichannel track)
  writeUint16(1); // 1 track
  writeUint16(ticksPerBeat);

  // Collect and sort all MIDI events across melody, chords, bass, drums
  interface MidiRawEvent {
    tick: number;
    status: number;
    data1: number;
    data2: number;
  }
  const events: MidiRawEvent[] = [];

  // Tempo event at tick 0: microseconds per quarter note = 60,000,000 / BPM
  const usPerBeat = Math.round(60000000 / song.bpm);

  // Melody on Channel 0
  song.melody.forEach(n => {
    const startTick = n.step * ticksPerStep;
    const durationTicks = n.duration * ticksPerStep - 5;
    events.push({ tick: startTick, status: 0x90, data1: n.midiNumber, data2: Math.round(n.velocity * 127) });
    events.push({ tick: startTick + durationTicks, status: 0x80, data1: n.midiNumber, data2: 0 });
  });

  // Chords on Channel 1
  song.chords.forEach(c => {
    const startTick = c.barIndex * 4 * ticksPerStep;
    const durationTicks = c.duration * ticksPerStep - 10;
    c.midiNotes.forEach(midi => {
      events.push({ tick: startTick, status: 0x91, data1: midi, data2: 90 });
      events.push({ tick: startTick + durationTicks, status: 0x81, data1: midi, data2: 0 });
    });
  });

  // Bass on Channel 2
  song.bassline.forEach(b => {
    const startTick = b.step * ticksPerStep;
    const durationTicks = b.duration * ticksPerStep - 5;
    events.push({ tick: startTick, status: 0x92, data1: b.midiNumber, data2: Math.round(b.velocity * 127) });
    events.push({ tick: startTick + durationTicks, status: 0x82, data1: b.midiNumber, data2: 0 });
  });

  // Drums on Channel 9 (Standard MIDI percussion channel)
  // 36 = Bass Drum 1, 38 = Acoustic Snare, 42 = Closed Hi-Hat, 46 = Open Hi-Hat
  song.drums.forEach(d => {
    const tick = d.step * ticksPerStep;
    if (d.kick) {
      events.push({ tick, status: 0x99, data1: 36, data2: Math.round(d.velocity * 120) });
      events.push({ tick: tick + 60, status: 0x89, data1: 36, data2: 0 });
    }
    if (d.snare) {
      events.push({ tick, status: 0x99, data1: 38, data2: 110 });
      events.push({ tick: tick + 60, status: 0x89, data1: 38, data2: 0 });
    }
    if (d.hihat) {
      events.push({ tick, status: 0x99, data1: 42, data2: 85 });
      events.push({ tick: tick + 40, status: 0x89, data1: 42, data2: 0 });
    }
    if (d.openHat) {
      events.push({ tick, status: 0x99, data1: 46, data2: 95 });
      events.push({ tick: tick + 80, status: 0x89, data1: 46, data2: 0 });
    }
  });

  // Sort events chronologically
  events.sort((a, b) => a.tick - b.tick);

  // Build Track Data
  const trackBytes: number[] = [];
  function writeTrackVarLength(value: number) {
    let buffer = value & 0x7f;
    while ((value >>= 7) > 0) {
      buffer <<= 8;
      buffer |= 0x80;
      buffer += (value & 0x7f);
    }
    while (true) {
      trackBytes.push(buffer & 0xff);
      if (buffer & 0x80) buffer >>= 8;
      else break;
    }
  }

  // Set Tempo Meta Event at tick 0
  writeTrackVarLength(0);
  trackBytes.push(0xff, 0x51, 0x03);
  trackBytes.push((usPerBeat >> 16) & 0xff);
  trackBytes.push((usPerBeat >> 8) & 0xff);
  trackBytes.push(usPerBeat & 0xff);

  let currentTick = 0;
  events.forEach(ev => {
    const delta = Math.max(0, ev.tick - currentTick);
    writeTrackVarLength(delta);
    trackBytes.push(ev.status, ev.data1, ev.data2);
    currentTick = ev.tick;
  });

  // End of Track Meta Event
  writeTrackVarLength(0);
  trackBytes.push(0xff, 0x2f, 0x00);

  // Write MTrk Chunk
  writeString('MTrk');
  writeUint32(trackBytes.length);
  for (let b of trackBytes) {
    bytes.push(b);
  }

  const u8Array = new Uint8Array(bytes);
  return new Blob([u8Array], { type: 'audio/midi' });
}
