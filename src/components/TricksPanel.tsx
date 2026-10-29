import React, { useState } from 'react';
import { AVAILABLE_TRICKS, generateEuclidean } from '../services/musicTheory';
import { audioEngine } from '../services/audioEngine';
import { Lightbulb, PlayCircle, Sparkles, Check, Music2 } from 'lucide-react';

interface TricksPanelProps {
  currentKey: string;
  onApplyTrick: (trickId: string) => void;
}

export const TricksPanel: React.FC<TricksPanelProps> = ({ currentKey, onApplyTrick }) => {
  const [activeAudition, setActiveAudition] = useState<string | null>(null);
  const [euclideanPulses, setEuclideanPulses] = useState<number>(5);

  const auditionTrick = (trickId: string) => {
    setActiveAudition(trickId);

    if (trickId === 'dorian-mode') {
      // Play Dm9 then G13 (the classic Dorian i - IV trick)
      audioEngine.playRhodesNote(62, undefined, 0.8, 0.6); // D4
      audioEngine.playRhodesNote(65, undefined, 0.8, 0.6); // F4
      audioEngine.playRhodesNote(69, undefined, 0.8, 0.6); // A4
      audioEngine.playRhodesNote(72, undefined, 0.8, 0.6); // C5
      audioEngine.playLeadNote(71, undefined, 0.7, 0.9);   // B4 (The raised 6th note!)

      window.setTimeout(() => {
        // IV chord with raised 6th: G major / G13
        audioEngine.playRhodesNote(55, undefined, 1.0, 0.6); // G3
        audioEngine.playRhodesNote(59, undefined, 1.0, 0.6); // B3
        audioEngine.playRhodesNote(64, undefined, 1.0, 0.6); // E4 (13th)
        audioEngine.playRhodesNote(67, undefined, 1.0, 0.6); // G4
        audioEngine.playLeadNote(71, undefined, 0.9, 0.9);   // B4
        setActiveAudition(null);
      }, 700);
    } else if (trickId === 'lofi-pentatonic') {
      // Play a cascade of smooth minor pentatonic notes (D, F, G, A, C)
      const pentatonicMidi = [62, 65, 67, 69, 72, 74];
      pentatonicMidi.forEach((midi, i) => {
        window.setTimeout(() => {
          audioEngine.playLeadNote(midi, undefined, 0.35, 0.75);
          if (i === pentatonicMidi.length - 1) setActiveAudition(null);
        }, i * 140);
      });
    } else if (trickId === 'euclidean-rhythm') {
      // Play the Euclidean drum pulses
      const pattern = generateEuclidean(euclideanPulses, 16);
      pattern.forEach((isHit, i) => {
        window.setTimeout(() => {
          if (isHit) {
            audioEngine.previewNote(60, 'melody');
          }
          if (i === 15) setActiveAudition(null);
        }, i * 80);
      });
    } else if (trickId === 'color-chords') {
      // Contrast plain triad vs add9 / maj7
      // Plain Dm
      audioEngine.playRhodesNote(50, undefined, 0.6, 0.5);
      audioEngine.playRhodesNote(53, undefined, 0.6, 0.5);
      audioEngine.playRhodesNote(57, undefined, 0.6, 0.5);

      window.setTimeout(() => {
        // Rich Dm9 with add9 and 7th
        audioEngine.playRhodesNote(50, undefined, 1.2, 0.7);
        audioEngine.playRhodesNote(53, undefined, 1.2, 0.7);
        audioEngine.playRhodesNote(57, undefined, 1.2, 0.7);
        audioEngine.playRhodesNote(60, undefined, 1.2, 0.7); // 7th
        audioEngine.playRhodesNote(64, undefined, 1.2, 0.8); // 9th extension!
        setActiveAudition(null);
      }, 750);
    } else {
      // Dotted bounce
      [0, 3, 6, 8, 11, 14].forEach((step, i) => {
        window.setTimeout(() => {
          audioEngine.previewNote(58 + (i % 3) * 4, 'bass');
          if (i === 5) setActiveAudition(null);
        }, i * 120);
      });
    }
  };

  const euclideanPattern = generateEuclidean(euclideanPulses, 16);

  return (
    <div className="bg-[#131B2B] border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Music Theory Tricks & Generation Rules
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Smart algorithmic hacks for evoking specific emotions without sounding mechanical or dissonant.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Root: <strong className="text-amber-400">{currentKey}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_TRICKS.map(trick => {
          const isAuditioning = activeAudition === trick.id;
          return (
            <div
              key={trick.id}
              className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    {trick.title}
                  </div>
                  <div className="text-xs text-amber-400/90 font-medium mt-0.5">
                    {trick.shortDesc}
                  </div>
                </div>

                <button
                  onClick={() => auditionTrick(trick.id)}
                  disabled={isAuditioning}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    isAuditioning
                      ? 'bg-amber-400 text-slate-950 font-bold animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                  title="Audition this trick through Web Audio"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  {isAuditioning ? 'Auditioning...' : 'Audition'}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {trick.musicalExplanation}
              </p>

              {/* Special interactive widget for Euclidean Rhythm */}
              {trick.id === 'euclidean-rhythm' && (
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Euclidean Pulses: E({euclideanPulses}, 16)</span>
                    <span className="font-mono text-amber-400 font-semibold">{euclideanPulses} hits</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="11"
                    value={euclideanPulses}
                    onChange={e => setEuclideanPulses(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  {/* Step dots */}
                  <div className="grid grid-cols-16 gap-1 pt-1">
                    {euclideanPattern.map((hit, idx) => (
                      <div
                        key={idx}
                        className={`h-4 rounded flex items-center justify-center text-[9px] font-mono font-bold transition-all ${
                          hit
                            ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/50'
                            : 'bg-slate-900 border border-slate-800 text-slate-600'
                        }`}
                      >
                        {hit ? '•' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-800/60 font-mono">
                <span>Pattern: {trick.exampleProgression}</span>
                <button
                  onClick={() => onApplyTrick(trick.id)}
                  className="text-amber-400 hover:text-amber-300 font-medium font-sans flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Apply to Song
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
