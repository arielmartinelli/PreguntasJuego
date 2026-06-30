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
    <div className="arcade-panel flex-column flex-center gap-3" style={{ minHeight: '350px' }}>
      <div className="flex-column flex-center">
        <h2 className="subtitle-arcade flicker-text">★ TRIVIA CRACK ★</h2>
        <p 
          style={{ 
            fontFamily: 'var(--font-title)', 
            fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', 
            color: 'var(--color-btn-primary)', 
            marginBottom: '2rem', 
            textAlign: 'center', 
            fontWeight: '700',
            lineHeight: '1.4'
          }}
        >
          DESAFÍO PREGUNTADOS
        </p>
      </div>

      <div className="flex-column gap-2" style={{ width: '100%', maxWidth: '400px' }}>
        <button 
          className="arcade-btn btn-green"
          onClick={handleLocalClick}
          style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}
        >
          🎮 JUGAR LOCAL
        </button>

        <button 
          className="arcade-btn btn-pink"
          onClick={handleOnlineClick}
          style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}
        >
          🌐 SALAS ONLINE
        </button>
      </div>

      <div style={{ marginTop: '2rem', fontFamily: 'var(--font-title)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        EDICIÓN ESPECIAL © 2026
      </div>
    </div>
  );
}
