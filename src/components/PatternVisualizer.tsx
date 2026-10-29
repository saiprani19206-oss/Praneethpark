import React from 'react';
import { SongComposition, NoteEvent } from '../types/music';
import { audioEngine } from '../services/audioEngine';
import { Grid, Volume2 } from 'lucide-react';

interface PatternVisualizerProps {
  composition: SongComposition;
  currentStep: number;
  isPlaying: boolean;
}

export const PatternVisualizer: React.FC<PatternVisualizerProps> = ({
  composition,
  currentStep,
  isPlaying,
}) => {
  const steps = Array.from({ length: composition.totalSteps || 16 }, (_, i) => i);

  const handleNoteClick = (midi: number, track: 'melody' | 'chords' | 'bass') => {
    audioEngine.previewNote(midi, track);
  };

  return (
    <div className="bg-[#131B2B] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Grid className="w-4 h-4 text-amber-400" />
            Interactive Step Sequencer & Piano Roll
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time visual playback matrix. Click any note to audition its pitch.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
          <span>Playhead: Step {currentStep + 1}</span>
        </div>
      </div>

      {/* Sequencer Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px] space-y-2">
          {/* Step Ruler / Bar numbers */}
          <div className="grid grid-cols-[80px_repeat(16,1fr)] gap-1 text-[10px] font-mono font-medium text-slate-500 pb-1 border-b border-slate-800">
            <div className="text-slate-400 pl-1">Bar / Step</div>
            {steps.map(step => {
              const isBarStart = step % 4 === 0;
              const barNum = Math.floor(step / 4) + 1;
              const stepInBar = (step % 4) + 1;
              const isCurrent = step === currentStep && isPlaying;
              return (
                <div
                  key={step}
                  className={`text-center py-0.5 rounded transition-colors ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : isBarStart
                      ? 'text-slate-200 font-bold bg-slate-900/80'
                      : 'text-slate-500'
                  }`}
                >
                  {isBarStart ? `${barNum}.1` : `.${stepInBar}`}
                </div>
              );
            })}
          </div>

          {/* Row 1: Chords Progression */}
          <div className="grid grid-cols-[80px_repeat(16,1fr)] gap-1 items-center">
            <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 pl-1">
              <span>Chords</span>
            </div>
            {composition.chords.map((chord, barIdx) => {
              const isCurrentBar = Math.floor(currentStep / 4) === barIdx && isPlaying;
              return (
                <div
                  key={barIdx}
                  style={{ gridColumn: `span 4` }}
                  onClick={() => chord.midiNotes.forEach(m => audioEngine.previewNote(m, 'chords'))}
                  className={`h-9 rounded-lg border px-2.5 flex flex-col justify-center cursor-pointer transition-all ${
                    isCurrentBar
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm shadow-amber-400/20'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                  title={`${chord.name} (${chord.romanNumeral}) - Click to play chord`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-white">{chord.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono font-medium">{chord.romanNumeral}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    {chord.notes.slice(0, 3).join(' ')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2: Lead Melody */}
          <div className="grid grid-cols-[80px_repeat(16,1fr)] gap-1 items-center">
            <div className="text-xs font-semibold text-cyan-400 pl-1">
              <span>Melody</span>
            </div>
            {steps.map(step => {
              const note = composition.melody.find(n => n.step === step);
              const isCurrent = step === currentStep && isPlaying;
              return (
                <div
                  key={step}
                  onClick={() => note && handleNoteClick(note.midiNumber, 'melody')}
                  className={`h-8 rounded flex items-center justify-center text-[10px] font-mono font-semibold transition-all ${
                    note
                      ? isCurrent
                        ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40 font-bold scale-105'
                        : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 cursor-pointer'
                      : isCurrent
                      ? 'bg-slate-800/80 border border-slate-700'
                      : 'bg-slate-900/40 border border-slate-900'
                  }`}
                  title={note ? `${note.pitch} (Step ${step + 1})` : undefined}
                >
                  {note ? note.pitch : ''}
                </div>
              );
            })}
          </div>

          {/* Row 3: Bassline */}
          <div className="grid grid-cols-[80px_repeat(16,1fr)] gap-1 items-center">
            <div className="text-xs font-semibold text-indigo-400 pl-1">
              <span>Bass</span>
            </div>
            {steps.map(step => {
              const note = composition.bassline.find(n => n.step === step);
              const isCurrent = step === currentStep && isPlaying;
              return (
                <div
                  key={step}
                  onClick={() => note && handleNoteClick(note.midiNumber, 'bass')}
                  className={`h-7 rounded flex items-center justify-center text-[9px] font-mono font-semibold transition-all ${
                    note
                      ? isCurrent
                        ? 'bg-indigo-400 text-slate-950 font-bold scale-105 shadow-md shadow-indigo-400/40'
                        : 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 cursor-pointer'
                      : isCurrent
                      ? 'bg-slate-800/80 border border-slate-700'
                      : 'bg-slate-900/40 border border-slate-900'
                  }`}
                  title={note ? `${note.pitch} (Bass Step ${step + 1})` : undefined}
                >
                  {note ? note.pitch : ''}
                </div>
              );
            })}
          </div>

          {/* Row 4: Drum Hits (Kick / Snare / Hats) */}
          <div className="grid grid-cols-[80px_repeat(16,1fr)] gap-1 items-center pt-1 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-rose-400 pl-1">
              <span>Drums</span>
            </div>
            {steps.map(step => {
              const drum = composition.drums.find(d => d.step === step);
              const isCurrent = step === currentStep && isPlaying;
              return (
                <div
                  key={step}
                  className={`h-7 rounded flex flex-col items-center justify-center gap-0.5 text-[8px] font-mono font-bold transition-all ${
                    isCurrent ? 'bg-slate-700/80 border border-amber-400/60' : 'bg-slate-900/50 border border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-0.5">
                    {drum?.kick && <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>}
                    {drum?.snare && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                    {drum?.hihat && <span className="w-1 h-1 rounded-full bg-sky-300"></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Help */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-cyan-400"></span> Lead Melody
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-amber-400"></span> Chords (Rhodes)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-indigo-400"></span> Bassline
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Kick
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Snare
            <span className="w-1 h-1 rounded-full bg-sky-300"></span> Hi-Hat
          </span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Tip: Spacebar toggles playback anytime
        </span>
      </div>
    </div>
  );
};
