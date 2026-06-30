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
    <div className="arcade-panel flex-column flex-center gap-3" style={{ minHeight: '380px' }}>
      <div className="flex-column flex-center">
        <h2 className="subtitle-arcade flicker-text">★ PRESS START ★</h2>
        <p 
          style={{ 
            fontFamily: 'var(--font-title)', 
            fontSize: 'clamp(1rem, 4vw, 1.4rem)', 
            color: 'var(--color-yellow)', 
            textShadow: '3px 3px 0 #000000', 
            marginBottom: '2rem', 
            textAlign: 'center', 
            fontWeight: 'bold',
            lineHeight: '1.6'
          }}
        >
          SUPER TRIVIA BROS
        </p>
      </div>

      <div className="flex-column gap-2" style={{ width: '100%', maxWidth: '400px' }}>
        <button 
          className="arcade-btn btn-green"
          onClick={handleLocalClick}
          style={{ width: '100%', fontSize: '0.8rem', padding: '1.1rem' }}
        >
          🎮 JUGAR LOCAL
        </button>

        <button 
          className="arcade-btn btn-pink"
          onClick={handleOnlineClick}
          style={{ width: '100%', fontSize: '0.8rem', padding: '1.1rem' }}
        >
          🌐 SALAS ONLINE
        </button>
      </div>

      <div style={{ marginTop: '2rem', fontFamily: 'var(--font-title)', fontSize: '0.6rem', color: '#888' }}>
        NES EDITION © 2026
      </div>
    </div>
  );
}
