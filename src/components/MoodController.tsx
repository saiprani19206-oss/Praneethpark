import React from 'react';
import { MoodProfile, MusicalKey, ScaleType } from '../types/music';
import { MOOD_PRESETS, NOTE_NAMES, SCALE_INTERVALS } from '../services/musicTheory';
import { Sparkles, SlidersHorizontal, Compass, Wand2 } from 'lucide-react';

interface MoodControllerProps {
  selectedPreset: MoodProfile;
  onSelectPreset: (preset: MoodProfile) => void;
  valence: number;
  onValenceChange: (v: number) => void;
  energy: number;
  onEnergyChange: (e: number) => void;
  tension: number;
  onTensionChange: (t: number) => void;
  musicalKey: MusicalKey;
  onKeyChange: (key: MusicalKey) => void;
  scaleType: ScaleType;
  onScaleChange: (scale: ScaleType) => void;
  onGenerateSong: () => void;
  onAiGenerate: () => void;
  isAiGenerating: boolean;
}

export const MoodController: React.FC<MoodControllerProps> = ({
  selectedPreset,
  onSelectPreset,
  valence,
  onValenceChange,
  energy,
  onEnergyChange,
  tension,
  onTensionChange,
  musicalKey,
  onKeyChange,
  scaleType,
  onScaleChange,
  onGenerateSong,
  onAiGenerate,
  isAiGenerating,
}) => {
  return (
    <div className="bg-[#131B2B] border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      {/* Header & Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            Mood & Emotional Coordinates
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a curated mood preset or shape custom emotional valence, energy, and tension.
          </p>
        </div>

        <button
          onClick={onAiGenerate}
          disabled={isAiGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all disabled:opacity-50 whitespace-nowrap"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
          {isAiGenerating ? 'AI Composing...' : 'Gemini AI Enhance'}
        </button>
      </div>

      {/* Mood Presets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {MOOD_PRESETS.map(preset => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-3 rounded-lg text-left transition-all border ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold truncate text-white">{preset.name}</div>
              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {preset.suggestedKey} · {SCALE_INTERVALS[preset.suggestedScale].name.replace(' Mode', '')}
              </div>
              <div className="text-[10px] font-mono text-amber-400/90 mt-1.5 tabular-nums">
                {preset.suggestedBpm} BPM
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Emotion Sliders & Theory Anchors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 border-t border-slate-800/60">
        {/* Valence Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300">Valence (Mood)</span>
            <span className="font-mono text-amber-400 tabular-nums">
              {valence < -0.2 ? 'Melancholic' : valence > 0.2 ? 'Euphoric' : 'Bittersweet'} ({valence > 0 ? `+${valence.toFixed(2)}` : valence.toFixed(2)})
            </span>
          </div>
          <input
            type="range"
            min="-1.0"
            max="1.0"
            step="0.05"
            value={valence}
            onChange={e => onValenceChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Minor / Somber</span>
            <span>Neutral</span>
            <span>Major / Radiant</span>
          </div>
        </div>

        {/* Energy Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300">Energy (Drive)</span>
            <span className="font-mono text-amber-400 tabular-nums">
              {energy < 0.35 ? 'Calm / Ambient' : energy > 0.7 ? 'High Momentum' : 'Mid Groove'} ({Math.round(energy * 100)}%)
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={energy}
            onChange={e => onEnergyChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Chill / Slow</span>
            <span>Moderate</span>
            <span>Energetic / Fast</span>
          </div>
        </div>

        {/* Tension Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300">Tension (Harmonic Color)</span>
            <span className="font-mono text-amber-400 tabular-nums">
              {tension < 0.25 ? 'Consonant Pure' : tension > 0.65 ? 'Jazz Extended' : 'Modern Color'} ({Math.round(tension * 100)}%)
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={tension}
            onChange={e => onTensionChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Simple Triads</span>
            <span>add9 / maj7</span>
            <span>Dissonant / b9 / #11</span>
          </div>
        </div>
      </div>

      {/* Harmonic Key and Scale Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-800/60 items-center">
        {/* Key Picker */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Musical Key (Root)</label>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {NOTE_NAMES.map(k => (
              <button
                key={k}
                onClick={() => onKeyChange(k)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors shrink-0 ${
                  musicalKey === k
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Scale Picker */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Theory Scale (Mode)</label>
          <select
            value={scaleType}
            onChange={e => onScaleChange(e.target.value as ScaleType)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-400"
          >
            {(Object.keys(SCALE_INTERVALS) as ScaleType[]).map(s => (
              <option key={s} value={s}>
                {SCALE_INTERVALS[s].name} — {SCALE_INTERVALS[s].moodDesc}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Generate Action */}
        <div>
          <button
            onClick={onGenerateSong}
            className="w-full py-2 px-4 bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Generate Composition
          </button>
        </div>
      </div>
    </div>
  );
};
