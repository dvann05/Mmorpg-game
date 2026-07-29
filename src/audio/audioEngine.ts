import { AudioZoneId, AmbientSoundId, ReverbPreset, AudioVolumeState } from '../types/audio';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private uiGain: GainNode | null = null;
  private convolverNode: ConvolverNode | null = null;

  private currentZone: AudioZoneId = 'login';
  private musicLoopTimer: number | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeAmbientNodes: Map<AmbientSoundId, { gain: GainNode; stop?: () => void }> = new Map();

  private volumeState: AudioVolumeState = {
    master: 80,
    music: 70,
    ambient: 60,
    voice: 80,
    ui: 90,
  };

  private reverbPreset: ReverbPreset = 'none';

  public init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Setup Gain Nodes
    this.masterGain = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.ambientGain = this.ctx.createGain();
    this.voiceGain = this.ctx.createGain();
    this.uiGain = this.ctx.createGain();

    // Convolver for Environmental Reverb
    this.convolverNode = this.ctx.createConvolver();
    this.updateReverbImpulse('none');

    // Routing
    this.musicGain.connect(this.convolverNode);
    this.ambientGain.connect(this.convolverNode);
    this.convolverNode.connect(this.masterGain);

    this.voiceGain.connect(this.masterGain);
    this.uiGain.connect(this.masterGain);

    this.masterGain.connect(this.ctx.destination);

    this.applyVolumes();
  }

  public getVolumeState(): AudioVolumeState {
    return { ...this.volumeState };
  }

  public setVolumes(volumes: Partial<AudioVolumeState>) {
    this.volumeState = { ...this.volumeState, ...volumes };
    this.applyVolumes();
  }

  private applyVolumes() {
    if (!this.ctx || !this.masterGain || !this.musicGain || !this.ambientGain || !this.voiceGain || !this.uiGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(this.volumeState.master / 100, now, 0.05);
    this.musicGain.gain.setTargetAtTime(this.volumeState.music / 100, now, 0.05);
    this.ambientGain.gain.setTargetAtTime(this.volumeState.ambient / 100, now, 0.05);
    this.voiceGain.gain.setTargetAtTime(this.volumeState.voice / 100, now, 0.05);
    this.uiGain.gain.setTargetAtTime(this.volumeState.ui / 100, now, 0.05);
  }

  public setReverbPreset(preset: ReverbPreset) {
    this.reverbPreset = preset;
    this.updateReverbImpulse(preset);
  }

  private updateReverbImpulse(preset: ReverbPreset) {
    if (!this.ctx || !this.convolverNode) return;
    if (preset === 'none') {
      // Create short dry buffer
      const buffer = this.ctx.createBuffer(2, this.ctx.sampleRate * 0.01, this.ctx.sampleRate);
      this.convolverNode.buffer = buffer;
      return;
    }

    const duration = preset === 'room' ? 0.8 : preset === 'hall' ? 2.5 : preset === 'cave' ? 3.5 : 4.5;
    const decay = preset === 'room' ? 2.0 : preset === 'hall' ? 1.5 : preset === 'cave' ? 1.0 : 0.8;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = length - i;
      left[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
      right[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
    }
    this.convolverNode.buffer = impulse;
  }

  // Adaptive Music Player - Dynamic Synthesizer Progression
  public playZoneMusic(zone: AudioZoneId) {
    this.init();
    if (!this.ctx || !this.musicGain) return;

    this.stopMusic();
    this.currentZone = zone;

    const frequenciesMap: Record<AudioZoneId, number[]> = {
      login: [220, 277.18, 329.63, 440], // A minor / major dreamy pad
      charSelect: [261.63, 329.63, 392.00, 523.25], // C major awakening
      village: [261.63, 293.66, 329.63, 392.00, 440], // Peaceful pentatonic folk
      forest: [196.00, 246.94, 293.66, 349.23, 440], // Celtic G major / E minor
      snow: [329.63, 392.00, 493.88, 587.33], // Glacial high bell piano
      desert: [146.83, 174.61, 220.00, 293.66], // Mystical Phrygian D minor
      dungeon: [110.00, 130.81, 164.81, 220.00], // Deep dark ambient drone
      castle: [130.81, 164.81, 196.00, 261.63], // Majestic royal brass/orchestral pad
      boss: [98.00, 116.54, 146.83, 196.00], // Intense chromatic pulse
      raid: [110.00, 138.59, 164.81, 220.00], // Heroic epic choir/brass
      pvp: [146.83, 174.61, 220.00, 261.63], // Fast paced rhythmic pulse
      guild: [220.00, 261.63, 293.66, 329.63], // Bards lute & warm acoustic
      market: [261.63, 329.63, 392.00, 440.00], // Lively bustling folk
    };

    const freqs = frequenciesMap[zone] || frequenciesMap.village;
    const tempo = zone === 'boss' || zone === 'pvp' ? 1.5 : zone === 'snow' || zone === 'dungeon' ? 3.0 : 2.0;

    let noteIndex = 0;
    const playChordOrArpeggio = () => {
      if (!this.ctx || !this.musicGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Instrument Timbre
      if (zone === 'snow' || zone === 'village') {
        osc.type = 'sine'; // Soft piano / bell
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
      } else if (zone === 'forest' || zone === 'guild') {
        osc.type = 'triangle'; // Flute / acoustic string
        filter.type = 'bandpass';
        filter.frequency.value = 800;
      } else if (zone === 'boss' || zone === 'pvp' || zone === 'dungeon') {
        osc.type = 'sawtooth'; // Heavy synth / orchestral brass
        filter.type = 'lowpass';
        filter.frequency.value = 600;
      } else {
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
      }

      const freq = freqs[noteIndex % freqs.length];
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tempo + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + tempo + 0.6);

      this.activeOscillators.push(osc);
      noteIndex++;
    };

    playChordOrArpeggio();
    this.musicLoopTimer = window.setInterval(playChordOrArpeggio, tempo * 1000);
  }

  public stopMusic() {
    if (this.musicLoopTimer) {
      clearInterval(this.musicLoopTimer);
      this.musicLoopTimer = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // ignore
      }
    });
    this.activeOscillators = [];
  }

  // Ambient Layer Sound Generators
  public toggleAmbientSound(soundId: AmbientSoundId, active: boolean) {
    this.init();
    if (!this.ctx || !this.ambientGain) return;

    if (!active) {
      const existing = this.activeAmbientNodes.get(soundId);
      if (existing) {
        if (existing.stop) existing.stop();
        this.activeAmbientNodes.delete(soundId);
      }
      return;
    }

    if (this.activeAmbientNodes.has(soundId)) return;

    const nodeGain = this.ctx.createGain();
    nodeGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    nodeGain.connect(this.ambientGain);

    let stopFn: (() => void) | undefined;

    if (soundId === 'birds') {
      // Periodic chirping sine wave pulses
      const interval = setInterval(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200 + Math.random() * 800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(3200 + Math.random() * 400, this.ctx.currentTime + 0.1);

        g.gain.setValueAtTime(0.08, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        osc.connect(g);
        g.connect(nodeGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
      }, 2500);

      stopFn = () => clearInterval(interval);
    } else if (soundId === 'wind' || soundId === 'snowWind') {
      // Filtered pink/white noise wind howl
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = soundId === 'snowWind' ? 700 : 400;
      filter.Q.value = 3.0;

      whiteNoise.connect(filter);
      filter.connect(nodeGain);
      whiteNoise.start();

      stopFn = () => {
        try {
          whiteNoise.stop();
        } catch (e) {}
      };
    } else if (soundId === 'fireplace' || soundId === 'rain') {
      // Crackle / raindrop noise burst
      const interval = setInterval(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = soundId === 'fireplace' ? 120 + Math.random() * 200 : 800 + Math.random() * 1000;

        g.gain.setValueAtTime(soundId === 'fireplace' ? 0.05 : 0.02, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

        osc.connect(g);
        g.connect(nodeGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      }, soundId === 'fireplace' ? 150 : 80);

      stopFn = () => clearInterval(interval);
    } else {
      // Default ambient synth drone loop
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 110;
      osc.connect(nodeGain);
      osc.start();
      stopFn = () => {
        try {
          osc.stop();
        } catch (e) {}
      };
    }

    this.activeAmbientNodes.set(soundId, { gain: nodeGain, stop: stopFn });
  }

  // UI Sound Effects
  public playUISound(type: 'click' | 'success' | 'delete' | 'levelUp') {
    this.init();
    if (!this.ctx || !this.uiGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      g.gain.setValueAtTime(0.1, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (type === 'delete') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.25);
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (type === 'levelUp') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      osc.frequency.setValueAtTime(1320, now + 0.25);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.51);
    }

    osc.connect(g);
    g.connect(this.uiGain);
  }
}

export const audioEngine = new AudioEngine();
