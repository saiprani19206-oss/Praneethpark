import React from 'react';
import { FileText, Download, Sparkles } from 'lucide-react';
import { ParkerloopLogo } from './ParkerloopLogo';

interface TopBarProps {
  onOpenLeadSheet: () => void;
  onExportMidi: () => void;
  activeView: 'studio' | 'tricks' | 'leadsheet' | 'arrangement';
  setActiveView: (view: 'studio' | 'tricks' | 'leadsheet' | 'arrangement') => void;
  isAiGenerating?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenLeadSheet,
  onExportMidi,
  activeView,
  setActiveView,
  isAiGenerating = false
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark with minimalist SVG logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <ParkerloopLogo className="w-8 h-8 shrink-0 hover:scale-105 transition-transform cursor-pointer" />
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
          Parkerloop
        </span>
      </div>

      {/* Zone 2: 4 clean single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveView('studio')}
          className={`hover:text-white transition-colors whitespace-nowrap pb-0.5 ${
            activeView === 'studio' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          Studio Player
        </button>
        <button
          onClick={() => setActiveView('tricks')}
          className={`hover:text-white transition-colors whitespace-nowrap pb-0.5 ${
            activeView === 'tricks' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          Music Theory Tricks
        </button>
        <button
          onClick={() => setActiveView('leadsheet')}
          className={`hover:text-white transition-colors whitespace-nowrap pb-0.5 ${
            activeView === 'leadsheet' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          Lead Sheet & Notation
        </button>
        <button
          onClick={() => setActiveView('arrangement')}
          className={`hover:text-white transition-colors whitespace-nowrap pb-0.5 ${
            activeView === 'arrangement' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
          }`}
        >
          Song Structure
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenLeadSheet}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
          title="View printable lead sheet"
        >
          <FileText className="w-3.5 h-3.5" />
          Lead Sheet
        </button>
        <button
          onClick={onExportMidi}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          Export MIDI (.mid)
        </button>
      </div>
    </header>
  );
};
