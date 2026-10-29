import React, { useState } from 'react';
import { SongComposition, SongArrangementSection } from '../types/music';
import { Layers, Sparkles, Wand2, Lightbulb, Check } from 'lucide-react';

interface ArrangementViewProps {
  composition: SongComposition;
  onApplyVariation: (instruction: string) => Promise<void>;
  isApplyingVariation: boolean;
}

export const ArrangementView: React.FC<ArrangementViewProps> = ({
  composition,
  onApplyVariation,
  isApplyingVariation,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [variationFeedback, setVariationFeedback] = useState<string | null>(null);

  const sections = composition.sections || [];

  const handleQuickVariation = async (instruction: string) => {
    await onApplyVariation(instruction);
    setVariationFeedback(`Applied: ${instruction}`);
    setTimeout(() => setVariationFeedback(null), 3000);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    await onApplyVariation(customPrompt);
    setVariationFeedback(`Applied custom variation: "${customPrompt}"`);
    setCustomPrompt('');
    setTimeout(() => setVariationFeedback(null), 4000);
  };

  return (
    <div className="bg-[#131B2B] border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Full Song Structure & Arrangement Blueprint
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated arrangement progression from Intro to Outro with dynamic energy curves and production notes.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Total Duration: ~32 bars
        </span>
      </div>

      {/* Variation Feedback Notification */}
      {variationFeedback && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{variationFeedback}</span>
        </div>
      )}

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden"
          >
            {/* Top Bar with Section Name & Energy Meter */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{section.name}</span>
              <span className="text-[11px] font-mono text-slate-400">{section.bars} Bars</span>
            </div>

            {/* Energy Level Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Energy Curve</span>
                <span className="font-mono text-amber-400">{Math.round(section.energyLevel * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                  style={{ width: `${section.energyLevel * 100}%` }}
                />
              </div>
            </div>

            {/* Chords in this section */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Harmony
              </span>
              <div className="flex flex-wrap gap-1 font-mono text-xs font-bold text-amber-300">
                {section.chordProgression.map((chord, cIdx) => (
                  <span
                    key={cIdx}
                    className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded"
                  >
                    {chord}
                  </span>
                ))}
              </div>
            </div>

            {/* Lyric Prompt / Hook */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Lyrical / Vocal Idea
              </span>
              <p className="text-slate-300 italic text-[11px] bg-slate-950/60 p-2 rounded border border-slate-800/80">
                "{section.lyricHook}"
              </p>
            </div>

            {/* Production Texture Tip */}
            <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2">
              <strong className="text-slate-300">Mix:</strong> {section.productionNote}
            </div>
          </div>
        ))}
      </div>

      {/* AI Song Variations Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Song Variations & Musical Re-Harmonization
          </span>
          <span className="text-[11px] text-slate-400">One-click musical alterations</span>
        </div>

        {/* Quick Variation Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            'Make chords more jazzy with substituted 9ths',
            'Increase syncopation and swing for lofi bounce',
            'Shift into dreamy Lydian floating mode',
            'Add dramatic tension leading tone resolution',
            'Strip drums back to ambient Rhodes chords'
          ].map((instruction, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickVariation(instruction)}
              disabled={isApplyingVariation}
              className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Wand2 className="w-3 h-3 text-amber-400" />
              {instruction}
            </button>
          ))}
        </div>

        {/* Custom Variation Prompt */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-2 border-t border-slate-800/60">
          <input
            type="text"
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder="Type custom variation... (e.g. 'Make it sound like a rainy cyberpunk anime credit sequence')"
            className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={isApplyingVariation || !customPrompt.trim()}
            className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
          >
            {isApplyingVariation ? 'Applying...' : 'Apply'}
          </button>
        </form>
      </div>
    </div>
  );
};
