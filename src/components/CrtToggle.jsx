import React from 'react';

export default function CrtToggle({ crtEnabled, setCrtEnabled, soundEnabled, setSoundEnabled }) {
  return (
    <div className="effect-toggle-container">
      <button 
        className="toggle-icon-btn" 
        onClick={() => setCrtEnabled(!crtEnabled)}
        title="Alternar grilla digital cyberpunk"
      >
        INTERFAZ: {crtEnabled ? "GRID 🌐" : "DARK 🌌"}
      </button>
      <button 
        className="toggle-icon-btn" 
        onClick={() => setSoundEnabled(!soundEnabled)}
        title="Alternar efectos de sonido"
      >
        AUDIO: {soundEnabled ? "ON 🔊" : "OFF 🔇"}
      </button>
    </div>
  );
}
