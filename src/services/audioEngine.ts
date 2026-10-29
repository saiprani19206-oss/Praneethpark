import { SongComposition, NoteEvent, ChordBar, DrumStep } from '../types/music';
import { midiToFreq } from './musicTheory';

export interface AudioEngineCallbacks {
  onStep: (step: number, totalSteps: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
}

export interface TrackState {
  muted: boolean;
  solo: boolean;
  volume: number; // 0.0 to 1.0
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;

  // Sub-busses
  private melodyGain: GainNode | null = null;
  private chordsGain: GainNode | null = null;
  private bassGain: GainNode | null = null;
  private drumsGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  private isPlaying: boolean = false;
  private currentSong: SongComposition | null = null;
  private currentStep: number = 0;
  private nextStepTime: number = 0;
  private timerId: number | null = null;

  private callbacks: AudioEngineCallbacks = {
    onStep: () => {},
    onPlayStateChange: () => {}
  };

  public trackStates: Record<'melody' | 'chords' | 'bass' | 'drums', TrackState> = {
    melody: { muted: false, solo: false, volume: 0.85 },
    chords: { muted: false, solo: false, volume: 0.75 },
    bass: { muted: false, solo: false, volume: 0.8 },
    drums: { muted: false, solo: false, volume: 0.8 }
  };

  private initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master Compressor / Limiter
    this.limiter = this.ctx.createDynamicsCompressor();
    this.limiter.threshold.setValueAtTime(-3, this.ctx.currentTime);
    this.limiter.knee.setValueAtTime(10, this.ctx.currentTime);
    this.limiter.ratio.setValueAtTime(8, this.ctx.currentTime);
    this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.limiter.release.setValueAtTime(0.2, this.ctx.currentTime);

    // Master Analyser
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

    this.limiter.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Track Gais
    this.melodyGain = this.ctx.createGain();
    this.chordsGain = this.ctx.createGain();
    this.bassGain = this.ctx.createGain();
    this.drumsGain = this.ctx.createGain();

    // Delay FX for ambient space
    this.delayNode = this.ctx.createDelay(1.0);
    this.delayNode.delayTime.setValueAtTime(0.3, this.ctx.currentTime);
    this.delayGain = this.ctx.createGain();
    this.delayGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    this.delayNode.connect(this.delayGain);
    this.delayGain.connect(this.limiter);

    // Send melody and chords to delay
    this.melodyGain.connect(this.delayNode);
    this.chordsGain.connect(this.delayNode);

    // Connect tracks to limiter
    this.melodyGain.connect(this.limiter);
    this.chordsGain.connect(this.limiter);
    this.bassGain.connect(this.limiter);
    this.drumsGain.connect(this.limiter);

    this.updateTrackGains();
  }

  public setCallbacks(cbs: AudioEngineCallbacks) {
    this.callbacks = cbs;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setSong(song: SongComposition) {
    this.currentSong = song;
    if (this.delayNode && this.ctx) {
      // Sync delay time to dotted 8th note at current BPM
      const beatSec = 60 / song.bpm;
      const dotted8th = (beatSec / 2) * 1.5;
      this.delayNode.delayTime.setValueAtTime(dotted8th, this.ctx.currentTime);
    }
  }

  public setTrackState(track: 'melody' | 'chords' | 'bass' | 'drums', updates: Partial<TrackState>) {
    this.trackStates[track] = { ...this.trackStates[track], ...updates };
    this.updateTrackGains();
  }

  private updateTrackGains() {
    if (!this.ctx) return;
    const tracks: ('melody' | 'chords' | 'bass' | 'drums')[] = ['melody', 'chords', 'bass', 'drums'];
    const anySolo = tracks.some(t => this.trackStates[t].solo);

    tracks.forEach(track => {
      let node: GainNode | null = null;
      if (track === 'melody') node = this.melodyGain;
      if (track === 'chords') node = this.chordsGain;
      if (track === 'bass') node = this.bassGain;
      if (track === 'drums') node = this.drumsGain;

      if (!node) return;
      const state = this.trackStates[track];
      let effectiveGain = state.volume;

      if (state.muted) {
        effectiveGain = 0;
      } else if (anySolo && !state.solo) {
        effectiveGain = 0;
      }

      node.gain.setTargetAtTime(effectiveGain, this.ctx!.currentTime, 0.02);
    });
  }

  public async start() {
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.05;
    this.callbacks.onPlayStateChange(true);

    this.schedulerLoop();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.callbacks.onPlayStateChange(false);
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private schedulerLoop = () => {
    if (!this.isPlaying || !this.ctx || !this.currentSong) return;

    const scheduleAheadTime = 0.1; // lookahead 100ms
    const stepDuration = (60 / this.currentSong.bpm) / 4; // 16th note

    while (this.nextStepTime < this.ctx.currentTime + scheduleAheadTime) {
      // Calculate swing offset for odd sixteenth notes
      let stepTime = this.nextStepTime;
      const isOddStep = this.currentStep % 2 === 1;
      if (isOddStep && this.currentSong.swing > 0) {
        stepTime += this.currentSong.swing * (stepDuration * 0.4);
      }

      this.scheduleStep(this.currentStep, stepTime, stepDuration);

      // Dispatch UI callback
      const scheduledStep = this.currentStep;
      const delayMs = Math.max(0, (stepTime - this.ctx.currentTime) * 1000);
      window.setTimeout(() => {
        if (this.isPlaying) {
          this.callbacks.onStep(scheduledStep, this.currentSong?.totalSteps || 16);
        }
      }, delayMs);

      // Advance
      this.nextStepTime += stepDuration;
      this.currentStep = (this.currentStep + 1) % (this.currentSong.totalSteps || 16);
    }

    this.timerId = window.setTimeout(this.schedulerLoop, 25);
  };

  private scheduleStep(step: number, time: number, stepDuration: number) {
    if (!this.currentSong || !this.ctx) return;

    // 1. Play Chords on bar boundaries or specified duration
    const chord = this.currentSong.chords.find(c => c.barIndex * 4 === step);
    if (chord) {
      const chordDuration = chord.duration * stepDuration;
      chord.midiNotes.forEach(midi => {
        this.playRhodesNote(midi, time, chordDuration, 0.4);
      });
    }

    // 2. Play Melody notes on this step
    const melNotes = this.currentSong.melody.filter(n => n.step === step);
    melNotes.forEach(n => {
      this.playLeadNote(n.midiNumber, time, n.duration * stepDuration, n.velocity);
    });

    // 3. Play Bass notes on this step
    const bassNotes = this.currentSong.bassline.filter(n => n.step === step);
    bassNotes.forEach(b => {
      this.playBassNote(b.midiNumber, time, b.duration * stepDuration, b.velocity);
    });

    // 4. Play Drums on this step
    const drum = this.currentSong.drums.find(d => d.step === step);
    if (drum) {
      if (drum.kick) this.playKick(time, drum.velocity);
      if (drum.snare) this.playSnare(time, drum.velocity);
      if (drum.hihat) this.playHiHat(time, drum.velocity, drum.openHat);
    }
  }

  // --- Voice Synthesis Methods ---

  // Warm Rhodes / Electric Piano for Chords
  public playRhodesNote(midi: number, time?: number, duration: number = 0.8, velocity: number = 0.5) {
    this.initContext();
    if (!this.ctx || !this.chordsGain) return;
    const playTime = time ?? this.ctx.currentTime;
    const freq = midiToFreq(midi);

    // Dual Oscillator: Sine + gentle Triangle for bell-like tine harmonics
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, playTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, playTime); // upper tine overtone
    osc2.detune.setValueAtTime(4, playTime); // subtle chorus

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, playTime);
    filter.frequency.exponentialRampToValueAtTime(600, playTime + duration);

    const amp = velocity * 0.25;
    noteGain.gain.setValueAtTime(0, playTime);
    noteGain.gain.linearRampToValueAtTime(amp, playTime + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(amp * 0.4, playTime + 0.2);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, playTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.chordsGain);

    osc1.start(playTime);
    osc2.start(playTime);
    osc1.stop(playTime + duration);
    osc2.stop(playTime + duration);
  }

  // Expressive Lead Synth
  public playLeadNote(midi: number, time?: number, duration: number = 0.4, velocity: number = 0.7) {
    this.initContext();
    if (!this.ctx || !this.melodyGain) return;
    const playTime = time ?? this.ctx.currentTime;
    const freq = midiToFreq(midi);

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, playTime);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, playTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, playTime);
    filter.Q.setValueAtTime(3.5, playTime);
    filter.frequency.exponentialRampToValueAtTime(900, playTime + duration);

    const amp = velocity * 0.35;
    noteGain.gain.setValueAtTime(0, playTime);
    noteGain.gain.linearRampToValueAtTime(amp, playTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(amp * 0.6, playTime + 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, playTime + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.melodyGain);

    osc.start(playTime);
    subOsc.start(playTime);
    osc.stop(playTime + duration);
    subOsc.stop(playTime + duration);
  }

  // Warm Sub / Analog Bass Synth
  public playBassNote(midi: number, time?: number, duration: number = 0.4, velocity: number = 0.8) {
    this.initContext();
    if (!this.ctx || !this.bassGain) return;
    const playTime = time ?? this.ctx.currentTime;
    const freq = midiToFreq(midi);

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, playTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, playTime);
    filter.Q.setValueAtTime(2, playTime);

    const amp = velocity * 0.5;
    noteGain.gain.setValueAtTime(0, playTime);
    noteGain.gain.linearRampToValueAtTime(amp, playTime + 0.01);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, playTime + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.bassGain);

    osc.start(playTime);
    osc.stop(playTime + duration);
  }

  // 808 Style Pitch-Swept Kick
  private playKick(time: number, velocity: number) {
    if (!this.ctx || !this.drumsGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Pitch drops from 150Hz to 48Hz
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(48, time + 0.09);

    const amp = velocity * 0.7;
    gain.gain.setValueAtTime(amp, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.drumsGain);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  // Snare: Tone + Filtered Noise Burst
  private playSnare(time: number, velocity: number) {
    if (!this.ctx || !this.drumsGain) return;

    // 1. Tonal body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(185, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);

    oscGain.gain.setValueAtTime(velocity * 0.3, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.drumsGain);

    osc.start(time);
    osc.stop(time + 0.1);

    // 2. White noise snap
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.45, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.drumsGain);

    noise.start(time);
    noise.stop(time + 0.18);
  }

  // Hi-Hat: High-passed noise burst
  private playHiHat(time: number, velocity: number, isOpen: boolean = false) {
    if (!this.ctx || !this.drumsGain) return;

    const duration = isOpen ? 0.22 : 0.045;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.drumsGain);

    noise.start(time);
    noise.stop(time + duration);
  }

  // Audition utility
  public previewNote(midi: number, track: 'melody' | 'chords' | 'bass' = 'melody') {
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    if (track === 'melody') {
      this.playLeadNote(midi, this.ctx.currentTime, 0.4, 0.8);
    } else if (track === 'chords') {
      this.playRhodesNote(midi, this.ctx.currentTime, 0.8, 0.7);
    } else {
      this.playBassNote(midi, this.ctx.currentTime, 0.5, 0.9);
    }
  }
}

export const audioEngine = new AudioEngine();
