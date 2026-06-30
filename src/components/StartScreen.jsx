import React from 'react';
import { audioSynth } from '../audioSynth';

export default function StartScreen({ onSelectLocal, onSelectOnline, soundEnabled }) {
  const handleLocalClick = () => {
    if (soundEnabled) audioSynth.playCoin();
    onSelectLocal();
  };

  const handleOnlineClick = () => {
    if (soundEnabled) audioSynth.playCoin();
    onSelectOnline();
  };

  return (
    <div className="arcade-panel flex-column flex-center gap-3" style={{ minHeight: '400px' }}>
      <div className="flex-column flex-center">
        <h2 className="subtitle-arcade flicker-text">★ SYSTEM START ★</h2>
        <p style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', color: 'var(--color-cyan)', textShadow: 'var(--glow-cyan)', marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
          CYBER TRIVIA ARENA
        </p>
      </div>

      <div className="flex-column gap-2" style={{ width: '100%', maxWidth: '400px' }}>
        <button 
          className="arcade-btn btn-green"
          onClick={handleLocalClick}
          style={{ width: '100%', fontSize: '1.1rem', padding: '1.2rem' }}
        >
          🎮 JUGAR LOCAL
        </button>

        <button 
          className="arcade-btn btn-pink"
          onClick={handleOnlineClick}
          style={{ width: '100%', fontSize: '1.1rem', padding: '1.2rem' }}
        >
          🌐 SALAS ONLINE
        </button>
      </div>

      <div style={{ marginTop: '2rem', fontFamily: 'var(--font-title)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        NEON EDITION © 2026
      </div>
    </div>
  );
}
