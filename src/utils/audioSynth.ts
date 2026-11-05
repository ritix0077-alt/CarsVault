import { SoundProfile } from '../types/car';

class EngineSynthesizer {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private baseOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private highOsc: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private currentRpm: number = 1000;
  private targetThrottle: number = 0;
  private animFrameId: number | null = null;
  private activeProfile: SoundProfile | null = null;
  private onRpmUpdate?: (rpm: number) => void;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start(profile: SoundProfile, onRpm?: (rpm: number) => void) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.activeProfile = profile;
    this.onRpmUpdate = onRpm;
    this.currentRpm = 1000;
    this.targetThrottle = 0;
    this.isRunning = true;

    // Master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Filter
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(3, this.ctx.currentTime);
    this.filterNode.connect(this.masterGain);

    // Base oscillator (fundamental engine combustion pitch)
    this.baseOsc = this.ctx.createOscillator();
    this.baseOsc.type = profile.engineType === 'flat6' ? 'sawtooth' : profile.engineType === 'v10' ? 'triangle' : 'sawtooth';
    this.baseOsc.frequency.setValueAtTime(profile.idleFreq, this.ctx.currentTime);

    // Sub oscillator for deep rumble
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(profile.idleFreq * 0.5, this.ctx.currentTime);

    // High overtone oscillator (simulates valvetrain / exhaust rasp)
    this.highOsc = this.ctx.createOscillator();
    this.highOsc.type = 'sawtooth';
    this.highOsc.frequency.setValueAtTime(profile.idleFreq * 2, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.subOsc.connect(subGain);
    subGain.connect(this.filterNode);

    const baseGain = this.ctx.createGain();
    baseGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.baseOsc.connect(baseGain);
    baseGain.connect(this.filterNode);

    const highGain = this.ctx.createGain();
    highGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.highOsc.connect(highGain);
    highGain.connect(this.filterNode);

    this.baseOsc.start();
    this.subOsc.start();
    this.highOsc.start();

    this.loop();
  }

  public setThrottle(throttle: number) {
    // throttle between 0.0 (idle) and 1.0 (redline)
    this.targetThrottle = Math.max(0, Math.min(1, throttle));
  }

  private loop = () => {
    if (!this.isRunning || !this.ctx || !this.activeProfile) return;

    const maxRpm = this.activeProfile.engineType === 'v12-nat-asp' ? 9500 : this.activeProfile.engineType === 'vtec-i4' ? 8800 : 9000;
    const idleRpm = 950;
    const targetRpm = idleRpm + (maxRpm - idleRpm) * this.targetThrottle;

    // Smooth RPM interpolation with realistic inertia
    const lerpRate = this.targetThrottle > 0.1 ? 0.08 : 0.04;
    this.currentRpm += (targetRpm - this.currentRpm) * lerpRate;

    // Calculate current frequency
    const ratio = (this.currentRpm - idleRpm) / (maxRpm - idleRpm);
    let currentFreq = this.activeProfile.idleFreq + (this.activeProfile.redlineFreq - this.activeProfile.idleFreq) * ratio;

    // VTEC crossover harmonic bump!
    if (this.activeProfile.vtecCrossoverRpm && this.currentRpm >= this.activeProfile.vtecCrossoverRpm) {
      currentFreq *= 1.15; // aggressive high-cam overtone shift
    }

    const now = this.ctx.currentTime;
    if (this.baseOsc) {
      this.baseOsc.frequency.setTargetAtTime(currentFreq, now, 0.03);
    }
    if (this.subOsc) {
      this.subOsc.frequency.setTargetAtTime(currentFreq * 0.5, now, 0.03);
    }
    if (this.highOsc) {
      this.highOsc.frequency.setTargetAtTime(currentFreq * 2.5, now, 0.03);
    }
    if (this.filterNode) {
      // Open filter up as revs climb
      const filterFreq = 400 + ratio * 3200;
      this.filterNode.frequency.setTargetAtTime(filterFreq, now, 0.04);
    }

    if (this.onRpmUpdate) {
      this.onRpmUpdate(Math.round(this.currentRpm));
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.baseOsc) {
      try {
        this.baseOsc.stop();
        this.baseOsc.disconnect();
      } catch {
        // ignore
      }
      this.baseOsc = null;
    }
    if (this.subOsc) {
      try {
        this.subOsc.stop();
        this.subOsc.disconnect();
      } catch {
        // ignore
      }
      this.subOsc = null;
    }
    if (this.highOsc) {
      try {
        this.highOsc.stop();
        this.highOsc.disconnect();
      } catch {
        // ignore
      }
      this.highOsc = null;
    }
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
  }
}

export const audioSynth = new EngineSynthesizer();
