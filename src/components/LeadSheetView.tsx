import React, { useState } from 'react';
import { SongComposition, NoteEvent } from '../types/music';
import { generateMidiFile, noteToMidi } from '../services/musicTheory';
import { Printer, Download, Copy, Check, FileMusic, Music, ChevronLeft } from 'lucide-react';

interface LeadSheetViewProps {
  composition: SongComposition;
  onBackToStudio: () => void;
}

// Convert MIDI pitch to staff Y coordinate
// On standard treble staff (height = 80px, 5 lines with 10px spacing: y=20,30,40,50,60)
// F5 = line 1 (y=20), E5 = space (y=25), D5 = line 2 (y=30), C5 = space (y=35),
// B4 = line 3 (y=40), A4 = space (y=45), G4 = line 4 (y=50), F4 = space (y=55),
// E4 = line 5 (y=60), D4 = space below (y=65), C4 = middle C ledger line (y=70).
function midiToStaffY(midi: number): { y: number; isLedger: boolean } {
  // Approximate diatonic steps relative to B4 (midi 71 = staff center line y=40)
  // Each diatonic step is 5px
  // Let's map note names
  const midiMap: Record<number, number> = {
    60: 70, // C4 (ledger)
    62: 65, // D4
    64: 60, // E4 (line 5)
    65: 55, // F4
    67: 50, // G4 (line 4)
    69: 45, // A4
    71: 40, // B4 (line 3, middle)
    72: 35, // C5
    74: 30, // D5 (line 2)
    76: 25, // E5
    77: 20, // F5 (line 1)
    79: 15, // G5
    81: 10, // A5
  };

  const closestMidi = Object.keys(midiMap)
    .map(Number)
    .reduce((prev, curr) => Math.abs(curr - midi) < Math.abs(prev - midi) ? curr : prev);

  const y = midiMap[closestMidi] ?? 40;
  return {
    y,
    isLedger: closestMidi <= 60 || closestMidi >= 81
  };
}

export const LeadSheetView: React.FC<LeadSheetViewProps> = ({ composition, onBackToStudio }) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMidi = () => {
    const blob = generateMidiFile(composition);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${composition.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyChart = () => {
    const textChart = `TITLE: ${composition.title}
KEY: ${composition.key} ${composition.scale.toUpperCase()}
TEMPO: ${composition.bpm} BPM
TIME SIGNATURE: 4/4

CHORD PROGRESSION:
| ${composition.chords.map(c => `${c.name} (${c.romanNumeral})`).join(' | ')} |

THEORY TRICKS:
${composition.activeTricks.map(t => `- ${t}`).join('\n')}

PERFORMANCE INSIGHT:
${composition.aiAnalysis?.arrangementInsight || 'Keep the groove steady with subtle swing feel.'}
`;
    navigator.clipboard.writeText(textChart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden on print) */}
      <div className="no-print flex items-center justify-between gap-4 bg-[#131B2B] border border-slate-800 rounded-xl p-4">
        <button
          onClick={onBackToStudio}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Studio
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyChart}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Chart Copied!' : 'Copy Chord Chart'}
          </button>

          <button
            onClick={handleDownloadMidi}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download MIDI (.mid)
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-1.5 rounded-lg shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet Music Document Canvas */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-300 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Sheet Music Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 font-serif">
                {composition.title}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-600 italic mt-0.5">
                {composition.aiAnalysis?.moodDescription || 'Atmospheric melody & groove lead sheet'}
              </p>
            </div>
            <div className="text-right text-xs font-mono space-y-0.5">
              <div><strong>Key:</strong> {composition.key} {composition.scale}</div>
              <div><strong>Tempo:</strong> ♩ = {composition.bpm}</div>
              <div><strong>Time:</strong> 4/4</div>
            </div>
          </div>
        </div>

        {/* 4-Bar Musical Stave View */}
        <div className="space-y-8 my-8">
          <div className="relative border border-slate-400 rounded-lg p-4 bg-slate-50/50">
            {/* SVG Rendered Sheet Music Staves */}
            <svg viewBox="0 0 800 130" className="w-full h-auto">
              {/* 5 Staff Lines */}
              <line x1="40" y1="30" x2="780" y2="30" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="40" y1="42" x2="780" y2="42" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="40" y1="54" x2="780" y2="54" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="40" y1="66" x2="780" y2="66" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="40" y1="78" x2="780" y2="78" stroke="#1e293b" strokeWidth="1.5" />

              {/* Start & End Bar lines */}
              <line x1="40" y1="30" x2="40" y2="78" stroke="#1e293b" strokeWidth="3" />
              <line x1="775" y1="30" x2="775" y2="78" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="780" y1="30" x2="780" y2="78" stroke="#1e293b" strokeWidth="3" />

              {/* Measure barlines (4 bars) */}
              <line x1="225" y1="30" x2="225" y2="78" stroke="#64748b" strokeWidth="1.5" />
              <line x1="410" y1="30" x2="410" y2="78" stroke="#64748b" strokeWidth="1.5" />
              <line x1="595" y1="30" x2="595" y2="78" stroke="#64748b" strokeWidth="1.5" />

              {/* Treble Clef Symbol SVG */}
              <path
                d="M 52 74 C 55 68 58 52 54 42 C 50 32 60 22 62 18 C 63 15 57 15 56 22 C 54 35 48 55 52 78 C 55 90 45 92 45 86 C 45 80 55 82 55 74 Z"
                fill="#0f172a"
              />

              {/* 4/4 Time Signature */}
              <text x="76" y="52" fontFamily="serif" fontSize="22" fontWeight="bold" fill="#0f172a">4</text>
              <text x="76" y="74" fontFamily="serif" fontSize="22" fontWeight="bold" fill="#0f172a">4</text>

              {/* Render 4 Chord Symbols above the measures */}
              {composition.chords.map((chord, i) => {
                const xPos = 100 + i * 185;
                return (
                  <g key={i}>
                    {/* Chord Symbol */}
                    <text x={xPos} y="18" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#b45309">
                      {chord.name}
                    </text>
                    {/* Roman Numeral below staff */}
                    <text x={xPos} y="105" fontFamily="sans-serif" fontSize="12" fontWeight="600" fill="#475569">
                      {chord.romanNumeral}
                    </text>
                    <text x={xPos} y="120" fontFamily="sans-serif" fontSize="9" fill="#94a3b8">
                      {chord.trickExplanation ? chord.trickExplanation.slice(0, 24) + '...' : ''}
                    </text>
                  </g>
                );
              })}

              {/* Render Melody Notes on staff */}
              {composition.melody.map((note, idx) => {
                const { y, isLedger } = midiToStaffY(note.midiNumber);
                // Distribute across 16 steps along X axis (bar 0 = 100..220, bar 1 = 230..400, etc.)
                const bar = Math.floor(note.step / 4);
                const stepInBar = note.step % 4;
                const noteX = 105 + bar * 185 + stepInBar * 36;

                return (
                  <g key={idx}>
                    {/* Ledger line if needed */}
                    {isLedger && (
                      <line x1={noteX - 9} y1={y} x2={noteX + 9} y2={y} stroke="#1e293b" strokeWidth="1.5" />
                    )}
                    {/* Note Head (Rotated Ellipse) */}
                    <ellipse
                      cx={noteX}
                      cy={y}
                      rx="5"
                      ry="3.8"
                      transform={`rotate(-20 ${noteX} ${y})`}
                      fill="#0f172a"
                    />
                    {/* Note Stem */}
                    <line
                      x1={noteX + 4.5}
                      y1={y}
                      x2={noteX + 4.5}
                      y2={y - 26}
                      stroke="#0f172a"
                      strokeWidth="1.4"
                    />
                    {/* Note Name text below */}
                    <text
                      x={noteX}
                      y={y + 16}
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#0284c7"
                    >
                      {note.pitch}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chord Voicings & Fingering Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          {composition.chords.map((chord, idx) => (
            <div key={idx} className="border border-slate-300 rounded-lg p-3 bg-slate-50">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="font-bold text-base text-slate-900 font-mono">{chord.name}</span>
                <span className="text-xs text-amber-700 font-semibold">{chord.romanNumeral}</span>
              </div>
              <div className="mt-2 text-xs text-slate-700 font-medium">
                <div>Notes: <strong className="font-mono text-slate-900">{chord.notes.join(' - ')}</strong></div>
                <div className="text-[11px] text-slate-500 mt-1">{chord.trickExplanation}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance & Arrangement Guide */}
        <div className="mt-8 pt-6 border-t-2 border-slate-900 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Music Theory & Performance Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="space-y-2">
              <p>
                <strong>Scale & Mood Trick:</strong> {composition.aiAnalysis?.whyScaleWorks || 'Dorian and Lofi pentatonic scales emphasize color notes without creating unwanted harmonic clash.'}
              </p>
              <p>
                <strong>Active Tricks Applied:</strong> {composition.activeTricks.join(', ')}.
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Rhythm & Articulation:</strong> {composition.aiAnalysis?.arrangementInsight || `Played at ${composition.bpm} BPM with ${Math.round(composition.swing * 100)}% swing feel.`}
              </p>
              <p>
                <strong>Lyrical / Thematic Concept:</strong> {composition.aiAnalysis?.lyricTheme || 'Reflective twilight motifs.'}
              </p>
            </div>
          </div>
        </div>

        {/* Lead Sheet Footer */}
        <div className="mt-12 text-center text-[10px] text-slate-400 font-mono">
          Generated with Parkerloop AI Workstation · Formatted for rehearsal, recording & DAW import
        </div>
      </div>
    </div>
  );
};
