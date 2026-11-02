// Professional Web Audio API Synthesis Engine
// Complies with strict browser autoplay policies: disabled by default, requires explicit user interaction.

class ChakraAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.droneOsc = null;
    this.droneFilter = null;
    this.isMuted = true; // Non-negotiable: disabled by default
    this.volume = 0.5; // Normalized UI volume (0.0 to 1.0)
    this.isInitialized = false;
  }

  // Must only be called from a user gesture (click/tap)
  init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported in this browser environment.');
        return false;
      }

      this.ctx = new AudioContextClass();

      // Master Gain Node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime); // Start muted
      this.masterGain.connect(this.ctx.destination);

      this.isInitialized = true;
      return true;
    } catch (err) {
      console.warn('AudioContext initialization failed:', err);
      return false;
    }
  }

  startDrone() {
    if (!this.init() || !this.ctx) return;

    if (this.droneOsc) {
      this.unmute();
      return;
    }

    try {
      // 108 Hz meditative chakra fundamental frequency (harmonic A2)
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.setValueAtTime(108, this.ctx.currentTime);

      // Low-pass warm filter to keep drone atmospheric and non-fatiguing
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Dedicated Drone Gain Node
      this.droneGain = this.ctx.createGain();
      const targetGain = this.volume * 0.035; // Keep gentle background ambience

      this.droneOsc.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc.start();
      this.unmute(targetGain);
    } catch (err) {
      console.warn('Error starting chakra drone:', err);
    }
  }

  // Play subtle spatial chime when navigating realms or inspecting 3D objects
  playJutsuChime(baseFreq = 432) {
    if (this.isMuted || !this.ctx || !this.isInitialized) return;

    try {
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      chimeOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.35);

      const chimeVol = this.volume * 0.04;
      chimeGain.gain.setValueAtTime(chimeVol, this.ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      chimeOsc.start();
      chimeOsc.stop(this.ctx.currentTime + 0.52);

      // Auto disconnect after completion
      setTimeout(() => {
        chimeOsc.disconnect();
        chimeGain.disconnect();
      }, 550);
    } catch (err) {
      // Audio cue failure must never affect visual experience
    }
  }

  setVolume(newVol) {
    this.volume = Math.max(0, Math.min(1, newVol));
    if (!this.isMuted && this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.05);
    }
  }

  mute() {
    this.isMuted = true;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
    }
  }

  unmute(targetVol = this.volume) {
    this.isMuted = false;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 0.15);
    }
  }

  toggle() {
    if (this.isMuted) {
      if (!this.droneOsc) {
        this.startDrone();
      } else {
        this.unmute();
      }
      return true; // Now unmuted
    } else {
      this.mute();
      return false; // Now muted
    }
  }

  // Proper lifecycle cleanup
  destroy() {
    try {
      if (this.droneOsc) {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
        this.droneOsc = null;
      }
      if (this.droneFilter) {
        this.droneFilter.disconnect();
        this.droneFilter = null;
      }
      if (this.masterGain) {
        this.masterGain.disconnect();
        this.masterGain = null;
      }
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close();
        this.ctx = null;
      }
      this.isInitialized = false;
      this.isMuted = true;
    } catch (err) {
      console.warn('Audio cleanup notice:', err);
    }
  }
}

export const chakraAudio = new ChakraAudioEngine();

