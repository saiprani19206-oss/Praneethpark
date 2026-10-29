import React, { useState, useEffect, useCallback } from 'react';
import { SongComposition, MoodProfile, MusicalKey, ScaleType } from './types/music';
import { MOOD_PRESETS, generateCompositionFromMood, generateMidiFile, SCALE_INTERVALS } from './services/musicTheory';
import { audioEngine } from './services/audioEngine';
import { TopBar } from './components/TopBar';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { MoodController } from './components/MoodController';
import { PatternVisualizer } from './components/PatternVisualizer';
import { TricksPanel } from './components/TricksPanel';
import { LeadSheetView } from './components/LeadSheetView';
import { ArrangementView } from './components/ArrangementView';

export default function App() {
  const [activeView, setActiveView] = useState<'studio' | 'tricks' | 'leadsheet' | 'arrangement'>('studio');
  const [selectedPreset, setSelectedPreset] = useState<MoodProfile>(MOOD_PRESETS[0]);
  const [valence, setValence] = useState<number>(MOOD_PRESETS[0].valence);
  const [energy, setEnergy] = useState<number>(MOOD_PRESETS[0].energy);
  const [tension, setTension] = useState<number>(MOOD_PRESETS[0].tension);
  const [musicalKey, setMusicalKey] = useState<MusicalKey>(MOOD_PRESETS[0].suggestedKey);
  const [scaleType, setScaleType] = useState<ScaleType>(MOOD_PRESETS[0].suggestedScale);
  const [bpm, setBpm] = useState<number>(MOOD_PRESETS[0].suggestedBpm);
  const [swing, setSwing] = useState<number>(0.2);

  const [composition, setComposition] = useState<SongComposition>(() => {
    return generateCompositionFromMood(MOOD_PRESETS[0], MOOD_PRESETS[0].suggestedKey, MOOD_PRESETS[0].suggestedBpm);
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [isApplyingVariation, setIsApplyingVariation] = useState<boolean>(false);

  // Sync initial song with audio engine
  useEffect(() => {
    audioEngine.setSong(composition);
    audioEngine.setCallbacks({
      onStep: (step: number) => {
        setCurrentStep(step);
      },
      onPlayStateChange: (playing: boolean) => {
        setIsPlaying(playing);
      }
    });
  }, [composition]);

  // Spacebar toggle playback shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        audioEngine.togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Preset Selection
  const handleSelectPreset = (preset: MoodProfile) => {
    setSelectedPreset(preset);
    setValence(preset.valence);
    setEnergy(preset.energy);
    setTension(preset.tension);
    setMusicalKey(preset.suggestedKey);
    setScaleType(preset.suggestedScale);
    setBpm(preset.suggestedBpm);

    const newSong = generateCompositionFromMood(preset, preset.suggestedKey, preset.suggestedBpm);
    setComposition(newSong);
    audioEngine.setSong(newSong);
  };

  // Generate deterministic song from current coordinates
  const handleGenerateSong = useCallback(() => {
    const customMoodProfile: MoodProfile = {
      ...selectedPreset,
      name: `${selectedPreset.name} (Custom)`,
      valence,
      energy,
      tension,
      suggestedKey: musicalKey,
      suggestedScale: scaleType,
      suggestedBpm: bpm
    };
    const newSong = generateCompositionFromMood(customMoodProfile, musicalKey, bpm);
    newSong.swing = swing;
    setComposition(newSong);
    audioEngine.setSong(newSong);
  }, [selectedPreset, valence, energy, tension, musicalKey, scaleType, bpm, swing]);

  // Dynamic Mood Coordinates Change
  const handleValenceChange = (newValence: number) => {
    setValence(newValence);
    // Auto-suggest scale if valence drastically shifts
    if (newValence > 0.5 && scaleType !== 'lydian' && scaleType !== 'major') {
      setScaleType('lydian');
    } else if (newValence < -0.3 && scaleType !== 'natural-minor' && scaleType !== 'harmonic-minor') {
      setScaleType('natural-minor');
    }
  };

  const handleEnergyChange = (newEnergy: number) => {
    setEnergy(newEnergy);
    // Suggest tempo matching energy
    const calculatedBpm = Math.round(68 + newEnergy * 65);
    setBpm(calculatedBpm);
  };

  const handleTensionChange = (newTension: number) => {
    setTension(newTension);
    if (newTension > 0.7 && scaleType !== 'harmonic-minor') {
      setScaleType('harmonic-minor');
    }
  };

  // AI-Powered Song Generation & Arrangement Analysis (via Gemini backend)
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/music/generate-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodName: selectedPreset.name,
          valence,
          energy,
          tension,
          scale: scaleType,
          key: musicalKey,
          bpm,
          tricks: composition.activeTricks
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setComposition(prev => ({
          ...prev,
          title: data.title || prev.title,
          aiAnalysis: {
            moodDescription: data.moodDescription || data.analysis.moodDescription,
            whyScaleWorks: data.whyScaleWorks || data.analysis.whyScaleWorks,
            arrangementInsight: data.arrangementInsight || data.analysis.arrangementInsight,
            lyricTheme: data.lyricTheme || data.analysis.lyricTheme
          }
        }));
      }
    } catch (err) {
      console.warn('AI Generation used local fallback:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI-Powered Variation Request
  const handleApplyVariation = async (instruction: string) => {
    setIsApplyingVariation(true);
    try {
      const res = await fetch('/api/music/variation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentComposition: composition,
          instruction
        })
      });
      const data = await res.json();

      if (data.success) {
        if (instruction.toLowerCase().includes('lydian')) {
          setScaleType('lydian');
        } else if (instruction.toLowerCase().includes('swing')) {
          setSwing(0.35);
        } else if (instruction.toLowerCase().includes('jazzy')) {
          setTension(0.8);
        }

        handleGenerateSong();
      }
    } catch (err) {
      console.warn('Variation applied locally:', err);
    } finally {
      setIsApplyingVariation(false);
    }
  };

  // Direct MIDI Export Trigger
  const handleExportMidi = () => {
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

  // Apply Specific Music Theory Trick
  const handleApplyTrick = (trickId: string) => {
    if (trickId === 'dorian-mode') {
      setScaleType('dorian');
    } else if (trickId === 'lofi-pentatonic') {
      setScaleType('lofi-pentatonic');
    } else if (trickId === 'dotted-bounce') {
      setSwing(0.35);
    }
    handleGenerateSong();
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <TopBar
        onOpenLeadSheet={() => setActiveView('leadsheet')}
        onExportMidi={handleExportMidi}
        activeView={activeView}
        setActiveView={setActiveView}
        isAiGenerating={isAiGenerating}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Persistent Audio Player & Visualizer Bar */}
        <AudioPlayerBar
          isPlaying={isPlaying}
          onTogglePlay={() => audioEngine.togglePlay()}
          currentStep={currentStep}
          totalSteps={composition.totalSteps || 16}
          bpm={bpm}
          onBpmChange={(newBpm) => {
            setBpm(newBpm);
            setComposition(prev => ({ ...prev, bpm: newBpm }));
          }}
          swing={swing}
          onSwingChange={(newSwing) => {
            setSwing(newSwing);
            setComposition(prev => ({ ...prev, swing: newSwing }));
          }}
          songTitle={composition.title}
          songKey={composition.key}
          scaleName={SCALE_INTERVALS[composition.scale].name}
        />

        {/* View Switching */}
        {activeView === 'studio' && (
          <div className="space-y-6 animate-fadeIn">
            <MoodController
              selectedPreset={selectedPreset}
              onSelectPreset={handleSelectPreset}
              valence={valence}
              onValenceChange={handleValenceChange}
              energy={energy}
              onEnergyChange={handleEnergyChange}
              tension={tension}
              onTensionChange={handleTensionChange}
              musicalKey={musicalKey}
              onKeyChange={(k) => {
                setMusicalKey(k);
                setComposition(prev => ({ ...prev, key: k }));
              }}
              scaleType={scaleType}
              onScaleChange={(s) => {
                setScaleType(s);
                setComposition(prev => ({ ...prev, scale: s }));
              }}
              onGenerateSong={handleGenerateSong}
              onAiGenerate={handleAiGenerate}
              isAiGenerating={isAiGenerating}
            />

            <PatternVisualizer
              composition={composition}
              currentStep={currentStep}
              isPlaying={isPlaying}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Theory Insights Card */}
              <div className="bg-[#131B2B] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Harmonic Theory & Mood Analysis
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {composition.aiAnalysis?.whyScaleWorks || SCALE_INTERVALS[scaleType].trickDescription}
                </p>
                <div className="text-[11px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                  <strong>Scale Formula:</strong> {SCALE_INTERVALS[scaleType].intervals.join(' · ')} semitones
                </div>
              </div>

              {/* Rhythmic Pocket Card */}
              <div className="bg-[#131B2B] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Rhythmic Groove & Tempo Pocket
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {composition.aiAnalysis?.arrangementInsight || `Driving at ${bpm} BPM with Euclidean hi-hat distribution across 16 steps.`}
                </p>
                <div className="text-[11px] text-slate-400 font-mono bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex justify-between">
                  <span>Groove Feel: <strong>{swing > 0.15 ? 'Lazy Lofi Swing' : 'Straight Electro'}</strong></span>
                  <span>Time: <strong>4/4</strong></span>
                </div>
              </div>

              {/* Active Tricks Card */}
              <div className="bg-[#131B2B] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Applied Generation Tricks
                </h3>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {composition.activeTricks.map((trick, i) => (
                    <li key={i} className="text-slate-200">
                      <span className="text-amber-400 font-medium">{trick}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setActiveView('tricks')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors inline-block mt-1"
                >
                  Explore All Music Theory Tricks →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'tricks' && (
          <div className="animate-fadeIn">
            <TricksPanel
              currentKey={composition.key}
              onApplyTrick={handleApplyTrick}
            />
          </div>
        )}

        {activeView === 'leadsheet' && (
          <div className="animate-fadeIn">
            <LeadSheetView
              composition={composition}
              onBackToStudio={() => setActiveView('studio')}
            />
          </div>
        )}

        {activeView === 'arrangement' && (
          <div className="animate-fadeIn">
            <ArrangementView
              composition={composition}
              onApplyVariation={handleApplyVariation}
              isApplyingVariation={isApplyingVariation}
            />
          </div>
        )}
      </main>

      {/* Subtle Studio Footer */}
      <footer className="no-print border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        Parkerloop AI Workstation · Polyphonic Web Audio Synthesis · MIDI Format 0/1 Export
      </footer>
    </div>
  );
}
