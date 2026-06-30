// Retro 8-bit Audio Synthesizer using Web Audio API

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const audioSynth = {
  playCoin() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Coin sound: 2 rapid frequencies, 987.77Hz (B5) then 1318.51Hz (E6)
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  },

  playCorrect() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const noteStart = now + (index * 0.07);
        osc.frequency.setValueAtTime(freq, noteStart);
        
        gain.gain.setValueAtTime(0.12, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.25);
        
        osc.start(noteStart);
        osc.stop(noteStart + 0.25);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  },

  playIncorrect() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Buzz sound: descending low frequencies
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.3);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  },

  playTick() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(880, now); // A5 short tick
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      // Ignored for performance
    }
  },

  playTickCritical() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(1200, now); // Higher pitched, louder square tick
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      // Ignored
    }
  },

  playStart() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Fun ascending scale C4 -> E4 -> G4 -> C5
      const scale = [261.63, 329.63, 392.00, 523.25];
      scale.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square';
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const noteStart = now + (index * 0.1);
        osc.frequency.setValueAtTime(freq, noteStart);
        
        gain.gain.setValueAtTime(0.08, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.18);
        
        osc.start(noteStart);
        osc.stop(noteStart + 0.2);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  },

  playVictory() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Fast victory arpeggio: C5 -> E5 -> G5 -> C6 -> E6 -> G6 -> C7
      const scale = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      scale.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const noteStart = now + (index * 0.08);
        osc.frequency.setValueAtTime(freq, noteStart);
        
        const duration = index === scale.length - 1 ? 0.6 : 0.25;
        gain.gain.setValueAtTime(0.1, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.005, noteStart + duration);
        
        osc.start(noteStart);
        osc.stop(noteStart + duration);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  },

  playGameOver() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Sad descending sound: C5 -> B4 -> G#4 -> F4 (long note)
      const scale = [523.25, 493.88, 415.30, 349.23];
      scale.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const noteStart = now + (index * 0.15);
        osc.frequency.setValueAtTime(freq, noteStart);
        
        const duration = index === scale.length - 1 ? 0.8 : 0.2;
        gain.gain.setValueAtTime(0.12, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.005, noteStart + duration);
        
        osc.start(noteStart);
        osc.stop(noteStart + duration);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }
};
