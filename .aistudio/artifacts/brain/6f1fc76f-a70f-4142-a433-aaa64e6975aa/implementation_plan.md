# MelodyMood: AI Music Automation & Mood-to-Music Studio

A streamlined music automation studio that translates human emotion and mood inputs into custom melodies, harmonic progressions, and rhythmic groove patterns using algorithmic music theory "tricks", real-time Web Audio polyphonic synthesis, and exportable sheet music / chord lead sheets.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned with your selections and will guide the build:

- **Confirmed Interface**: Streamlined mood-to-music player with intuitive quick-generation controls, real-time waveform visualizer, and instant trick auditioning.
- **Confirmed Audio & Export**: Real-time Web Audio API multi-voice synthesizer (Lead, Chords/Pads, Bass, Drum patterns) paired with exportable printable Sheet Music / Lead Sheets (with notes on staves, chord symbols, roman numeral analysis, and tempo/feel markings) and MIDI export.
- **Confirmed Generation Engine & Tricks**: Mood-to-scale mapping (Natural Minor, Dorian, Lofi Pentatonic, Lydian Hopeful, Phrygian Tension, Major Uplift) combined with rhythm pattern automation tricks (syncopated ostinatos, dotted eighth bounce, Euclidean pulses) and automated AI composition expansions via Gemini.

---

### 1. Overview & Core Concept

**MelodyMood** is an AI-powered music automation suite designed for creators, songwriters, game developers, and beatmakers who need instant musical inspiration without getting bogged down in complex DAW configuration.

- **What It Does**:
  1. **Mood & Vibe Input**: Users select or blend emotional coordinates (e.g., *Dreamy Lofi*, *Melancholic Chill*, *Cyberpunk Drive*, *Uplifting Indie*, *Late-Night Jazz*, *Heroic Triumph*), tempo (BPM), and harmonic key.
  2. **Music Theory "Tricks" Engine**: Algorithmic rules automatically pick scales (e.g., Dorian for bittersweet wonder, Minor Pentatonic for soulful lofi), generate signature motifs, inject rhythmic syncopations, and voice chords with emotional color tones (add9, maj7, sus4).
  3. **Real-time Polyphonic Synthesizer**: Pure in-browser Web Audio synthesis playing smooth Rhodes/electric piano chords, analog-style synth leads, sub-bass lines, and rhythmic kick/snare/hi-hat patterns with reverb and stereo panning.
  4. **Visual Playback & Interactive Piano Roll**: Visual note grid showing the generated melody in real-time as the playhead advances, with tap-to-audition notes.
  5. **Exportable Sheet Music & Chord Lead Sheets**: High-resolution, printable/SVG chord lead sheet complete with treble/bass stave representation, lyric/vibe guide, Roman numerals, and chord diagram boxes ready for rehearsal or studio tracking.
  6. **AI Song Automations**: Server-side Gemini intelligence that enriches compositions with arrangement suggestions, melody variations ("Make it more unresolved", "Add counterpoint"), and section progression blueprints (Intro → Verse → Chorus → Outro).

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Mood Tuning & Trick Selection**:
   - The user selects a mood preset (e.g., "Lofi Rain", "Euphoric Daylight", "Midnight Noir", "Ethereal Ambient") or adjusts 3 dynamic sliders: **Valence** (Sad ↔ Joyful), **Energy** (Meditative ↔ Frenetic), and **Tension** (Consonant ↔ Jazz/Dissonant).
   - "Music Theory Trick" toggles highlight what rule is active: *Dorian Mode Wonder*, *Pentatonic Cascade*, *Polyrhythmic Hi-hats*, *Substituted Minor 9ths*.
2. **Instant Generation & Playback**:
   - Clicking **"Generate Song"** runs the deterministic mood-to-scale pattern engine alongside the AI arrangement assistant.
   - The audio player bar activates with Play, Pause, Loop, Tempo (BPM), Key Transpose, and Track Mute/Solo (Melody, Chords, Bass, Rhythm).
   - An active waveform/bar visualizer pulses in sync with the audio beat.
3. **Interactive Melody & Pattern Inspector**:
   - A clean horizontal step timeline displays active melody notes, chord blocks, and drum kicks.
   - Users can trigger instant variations ("Ascending Motif", "Syncopated Bounce", "Arpeggiated Flourish") with a single click.
4. **Lead Sheet & Sheet Music Exporter**:
   - A dedicated **Lead Sheet** modal/view renders a clean, printable musical chart with standard musical staves, chord notation (e.g., `Dm7 - G7 - Cmaj9`), scale notes, and performance notes.
   - One-click export options: **Print / Save as PDF Lead Sheet**, **Export Standard MIDI File**, and **Copy Chord Progression**.

#### Visual Identity & Theme
- **Aesthetic Direction**: Sleek, modern audio studio workstation (inspired by boutique hardware synthesizers and Teenage Engineering minimalism).
- **Color Palette**:
  - Dominant Canvas (60%): Deep obsidian slate (`#0B0F17`) and rich charcoal surfaces (`#131B2B`).
  - Structural Surfaces (30%): Subdued borderlines (`#1E293B`), velvet-black step channels (`#0F172A`), and crisp ivory text typography (`#F8FAFC`).
  - Accent Budget (10%): Electric amber/gold (`#F59E0B`) for playback & active note pulses; warm violet/cyan indicators for scale degrees.
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` (punchy, clean modern studio typography).
  - Data & Metrics: `JetBrains Mono` / `tabular-nums` for BPM, time signatures, scale degree markers, and frequency readouts.
- **Anti-Slop Discipline**: No arbitrary pulsing green dots, no code comment headers (`// 01_ENGINE`), no fake "99% AI ACCURACY" vanity metrics, no pill capsules enclosing metadata.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Web Audio API vs. Server Audio Rendering**:
  - *Chosen Approach*: Built-in browser Web Audio API oscillator nodes, gain envelopes, filter nodes, and convolution-style spatial delays.
  - *Why*: Zero network latency, instant responsiveness to tempo/key tweaks, seamless looping, and zero audio streaming bottlenecks.
- **Decision 2: Algorithmic Mood Theory Rules + Gemini AI Dual Layer**:
  - *Chosen Approach*: Algorithmic scale & rhythm generator ensures instant, deterministic musical output even without internet or API delays; Gemini is integrated server-side to provide high-level artistic song structure, variation tricks, lyric phrasing prompts, and emotional harmonization guidance.
  - *Why*: Combining rule-based music theory (which guarantees pleasing harmonic intervals) with LLM creative reasoning creates musically coherent results without AI hallucinations or dissonance.
- **Decision 3: Exportable Lead Sheet Format**:
  - *Chosen Approach*: Native scalable vector graphic (SVG) musical staves and standard chord symbols formatted for standard print/PDF view, plus Standard MIDI file binary export (`.mid`) generated in-memory.
  - *Why*: Delivers exactly what musicians, beatmakers, and producers need to take their generated ideas straight into Ableton, Logic, or an acoustic piano rehearsal.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             MelodyMood Workstation                          │
└───────┬──────────────────────────────────────────────────────────────┬──────┘
        │                                                              │
        ▼                                                              ▼
┌──────────────────────────────┐              ┌───────────────────────────────┐
│     Mood & Trick Controls    │              │       Gemini AI Service       │
│  - Mood / Emotion Matrix     │  Auto-Prompt │   (/api/music/generate-song)  │
│  - Key & Scale Selector      ├─────────────►│  - Gemini-3.8-Flash analysis  │
│  - Music Theory "Tricks"     │              │  - Chord substitution tricks │
│  - Tempo (BPM) & Swing       │              │  - Arrangement & lyrics       │
└──────────────┬───────────────┘              └───────────────┬───────────────┘
               │                                              │
               ▼                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Harmonic & Rhythm Engine (Client)                       │
│  - Scales: Minor, Dorian, Lofi Pentatonic, Lydian, Mixolydian               │
│  - Voice Leading & Chord Voicing (Triads, 7ths, 9ths, suspended chords)     │
│  - Rhythm Automations: Euclidean beat generation, Syncopated basslines      │
└──────────────┬──────────────────────────────────────────────┬───────────────┘
               │                                              │
               ▼                                              ▼
┌──────────────────────────────┐              ┌───────────────────────────────┐
│       Web Audio Synth        │              │     Export & Lead Sheet       │
│  - Multi-track polyphonic    │              │  - High-res Stave SVG View    │
│  - ADSR Envelopes & Filters  │              │  - Roman Numeral Analysis     │
│  - Step Sequencer Loop       │              │  - Standard MIDI Generator    │
│  - Real-time Audio Visualizer│              │  - Print-to-PDF formatting    │
└──────────────────────────────┘              └───────────────────────────────┘
```

#### Core Data Models
- **`MoodProfile`**:
  `{ id, name, description, valence, energy, tension, defaultScale, suggestedBpm, trickDescription }`
- **`SongComposition`**:
  `{ title, key, scale, bpm, chords: ChordBar[], melody: NoteEvent[], bassline: NoteEvent[], drums: DrumTrack, arrangementTip: string, theoryTricksApplied: string[] }`
- **`NoteEvent`**:
  `{ pitch: string, midiNumber: number, step: number, duration: number, velocity: number }`
- **`ChordBar`**:
  `{ root: string, quality: string, romanNumeral: string, notes: string[], duration: number }`

#### Interactive Component & State Mapping
- **`MoodSelector`**: Presets (Chillhop, Midnight Soul, Cyber Wave, Euphoric Pop, Melancholic Piano) or freeform slider adjustments dynamically re-derive the musical scale and base pattern.
- **`PlaybackControls`**: Play/Pause toggle, loop toggle, BPM tap/scrubber, volume fader, and visual step indicator ($1 \dots 16$ or $1 \dots 32$).
- **`MusicTricksPanel`**: Interactive toggle cards demonstrating and auditioning core tricks:
  1. *Dorian Bittersweetness* (Natural 6th in a minor scale)
  2. *Lofi Pentatonic Cascade* (Skipping half-steps for dreamy serenity)
  3. *Euclidean Drum Pattern* (Spreading $k$ hits across $n$ steps for organic syncopation)
  4. *Secondary Dominant / Color Chords* (Tension & release substitutions)
- **`LeadSheetModal`**: Formatted musical chart with key signature, tempo mark, chord grids, melody notation, and instant PDF/print stylesheet styling.
