/* ==========================================================================
   AquaSaver Pro: Synthesized Web Audio API Module
   ========================================================================== */

const AudioSynth = {
  ctx: null,
  enabled: true,
  waterNode: null,
  waterFilter: null,
  waterGain: null,
  waterLfo: null,
  
  init() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn("Web Audio API not supported on this browser.", e);
    }
  },
  
  playClick() {
    if (!this.enabled) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  },
  
  startWaterSound() {
    if (!this.enabled) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.waterNode) return; // Already running
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    // Create white noise source
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    // Bandpass filter to simulate hollow trickling liquid
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 850;
    filter.Q.value = 2.5;
    
    // LFO modulator to simulate organic splashing waves
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 4.5; // 4.5Hz splash ripples
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 180;
    
    // Master volume gain node
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0.07;
    
    // Routing connections
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    lfo.start();
    whiteNoise.start();
    
    this.waterNode = whiteNoise;
    this.waterFilter = filter;
    this.waterGain = gainNode;
    this.waterLfo = lfo;
  },
  
  stopWaterSound() {
    if (this.waterNode) {
      try {
        this.waterNode.stop();
        this.waterLfo.stop();
      } catch (e) {}
      this.waterNode = null;
      this.waterFilter = null;
      this.waterGain = null;
      this.waterLfo = null;
    }
  },
  
  playSuccessChime() {
    if (!this.enabled) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);
      
      gain.gain.setValueAtTime(0, now + index * 0.07);
      gain.gain.linearRampToValueAtTime(0.12, now + index * 0.07 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.35);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + 0.35);
    });
  }
};

function toggleAudio() {
  AudioSynth.enabled = !AudioSynth.enabled;
  const btn = document.getElementById("btn-audio-toggle");
  if (!btn) return;
  
  if (AudioSynth.enabled) {
    btn.innerHTML = '<span class="icon">🔊</span> Sounds On';
    btn.classList.remove("btn-secondary");
    btn.classList.add("glass");
    if (window.tapStatus === "open") AudioSynth.startWaterSound();
  } else {
    btn.innerHTML = '<span class="icon">🔇</span> Sounds Muted';
    btn.classList.remove("glass");
    btn.classList.add("btn-secondary");
    AudioSynth.stopWaterSound();
  }
}
