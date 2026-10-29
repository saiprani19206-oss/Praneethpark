import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Volume2, VolumeX, Repeat, Sliders, Activity } from 'lucide-react';
import { audioEngine, TrackState } from '../services/audioEngine';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentStep: number;
  totalSteps: number;
  bpm: number;
  onBpmChange: (newBpm: number) => void;
  swing: number;
  onSwingChange: (newSwing: number) => void;
  songTitle: string;
  songKey: string;
  scaleName: string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  onTogglePlay,
  currentStep,
  totalSteps,
  bpm,
  onBpmChange,
  swing,
  onSwingChange,
  songTitle,
  songKey,
  scaleName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [trackStates, setTrackStates] = useState<Record<'melody' | 'chords' | 'bass' | 'drums', TrackState>>(
    audioEngine.trackStates
  );
  const [masterVol, setMasterVol] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync canvas audio visualizer loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      animId = requestAnimationFrame(render);
      const analyser = audioEngine.getAnalyser();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!analyser || !isPlaying) {
        // Idle subtle waveform line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        for (let x = 0; x < canvas.width; x += 4) {
          const y = (canvas.height / 2) + Math.sin(x * 0.05) * 2;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const barWidth = (canvas.width / (bufferLength / 2)) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength / 2; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.95;
        // Amber to warm orange gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0.9)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const toggleTrackMute = (track: 'melody' | 'chords' | 'bass' | 'drums') => {
    const nextMuted = !trackStates[track].muted;
    audioEngine.setTrackState(track, { muted: nextMuted });
    setTrackStates({ ...audioEngine.trackStates });
  };

  const toggleTrackSolo = (track: 'melody' | 'chords' | 'bass' | 'drums') => {
    const nextSolo = !trackStates[track].solo;
    audioEngine.setTrackState(track, { solo: nextSolo });
    setTrackStates({ ...audioEngine.trackStates });
  };

  const handleBpmStep = (delta: number) => {
    const next = Math.min(180, Math.max(50, bpm + delta));
    onBpmChange(next);
  };

  return (
    <div className="bg-[#131B2B] border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Playback & Track Overview */}
        <div className="flex items-center gap-4">
          <button
            onClick={onTogglePlay}
            className={`w-13 h-13 rounded-xl flex items-center justify-center font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                : 'bg-white hover:bg-slate-200 text-slate-950 shadow-white/10'
            } active:scale-95`}
            title={isPlaying ? 'Pause playback (Space)' : 'Play song (Space)'}
          >
            {isPlaying ? (
              <Square className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-tight truncate max-w-[240px] sm:max-w-xs">
                {songTitle}
              </h2>
              <span className="text-xs text-amber-400 font-mono font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                {songKey} {scaleName}
              </span>
            </div>
            {/* Step Lights Indicator */}
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-75 ${
                    i === currentStep && isPlaying
                      ? 'w-4 bg-amber-400 shadow-sm shadow-amber-400/80'
                      : i % 4 === 0
                      ? 'w-2 bg-slate-600'
                      : 'w-1.5 bg-slate-800'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs font-mono text-slate-400 tabular-nums">
                {currentStep + 1}/{totalSteps}
              </span>
            </div>
          </div>
        </div>

        {/* Visualizer Canvas */}
        <div className="w-full lg:w-48 h-10 bg-slate-950/80 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center px-1">
          <canvas ref={canvasRef} width={180} height={40} className="w-full h-full" />
        </div>

        {/* Track Stems (Solo & Mute) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['melody', 'chords', 'bass', 'drums'] as const).map(track => {
            const state = trackStates[track];
            const labelMap = { melody: 'Lead', chords: 'Keys', bass: 'Bass', drums: 'Drums' };
            return (
              <div
                key={track}
                className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs"
              >
                <span className="px-2 font-medium text-slate-300 capitalize">{labelMap[track]}</span>
                <button
                  onClick={() => toggleTrackMute(track)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                    state.muted
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Mute ${labelMap[track]}`}
                >
                  M
                </button>
                <button
                  onClick={() => toggleTrackSolo(track)}
                  className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                    state.solo
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Solo ${labelMap[track]}`}
                >
                  S
                </button>
              </div>
            );
          })}
        </div>

        {/* BPM and Swing Controls */}
        <div className="flex items-center gap-4 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-500 font-medium">BPM</span>
            <button
              onClick={() => handleBpmStep(-2)}
              className="px-1 text-slate-400 hover:text-white font-mono font-bold"
            >
              -
            </button>
            <span className="font-mono font-semibold text-white tabular-nums w-8 text-center">{bpm}</span>
            <button
              onClick={() => handleBpmStep(+2)}
              className="px-1 text-slate-400 hover:text-white font-mono font-bold"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500 font-medium">Swing</span>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.05"
              value={swing}
              onChange={e => onSwingChange(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="font-mono text-slate-400 tabular-nums">
              {Math.round(swing * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
