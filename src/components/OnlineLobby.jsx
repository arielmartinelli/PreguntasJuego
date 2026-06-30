import React, { useEffect, useState } from 'react';
import { audioSynth } from '../audioSynth';

export default function OnlineLobby({ 
  roomCode, 
  playMode, 
  players, 
  isHost, 
  soundEnabled, 
  onStartGame, 
  onSimulateJoin, 
  onKickPlayer,
  onLeave 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (soundEnabled) audioSynth.playCoin();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    if (soundEnabled) audioSynth.playStart();
    onStartGame();
  };

  const handleSimulate = () => {
    if (soundEnabled) audioSynth.playCoin();
    // Predefined board game themed players
    const names = [
      "Ana ♟️", "Carlos 🪵", "Sofía 🃏", "Mateo 🎲", 
      "Laura 🚩", "Tomás 🏆", "Elena 🎨", "Felipe 🧩"
    ];
    // Pick a name not already in players
    const unusedNames = names.filter(name => !players.some(p => p.name === name));
    const randomName = unusedNames.length > 0 
      ? unusedNames[Math.floor(Math.random() * unusedNames.length)]
      : `Jugador ${players.length + 1} 🧩`;

    onSimulateJoin(randomName);
  };

  // Auto-simulate a player joining after 3 seconds if the user is host, to show off lobby realtime feel!
  useEffect(() => {
    if (isHost && players.length === 1) {
      const timer = setTimeout(() => {
        handleSimulate();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [players, isHost]);

  return (
    <div className="arcade-panel flex-column gap-3" style={{ minHeight: '420px' }}>
      <div className="flex-column flex-center text-center">
        <span className="category-badge" style={{ borderColor: 'var(--color-blue)', color: 'var(--color-blue)' }}>
          {playMode === 'host_controller' ? "MODO HOST + CONTROLES" : "MODO LOBBY SINCRONIZADO"}
        </span>
        <h2 className="subtitle-arcade" style={{ fontSize: '1.4rem', margin: '0.5rem 0' }}>CÓDIGO DE ACCESO</h2>
        
        {/* Large room code display */}
        <div 
          onClick={handleCopyCode}
          className="room-code-display"
          title="Click para copiar código"
        >
          {roomCode}
          {copied && (
            <span style={{ fontSize: '0.8rem', position: 'absolute', bottom: '-22px', left: '0', right: '0', textAlign: 'center', color: 'var(--color-green)', fontFamily: 'var(--font-standard)', fontWeight: 'bold' }}>
              ✓ ¡Copiado!
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Pide a otros jugadores que ingresen este código para unirse a la mesa.
        </p>
      </div>

      {/* Players List */}
      <div>
        <label className="arcade-label" style={{ textAlign: 'center' }}>JUGADORES EN LA MESA ({players.length})</label>
        <div className="lobby-grid">
          {players.map((p, idx) => (
            <div 
              key={idx} 
              className={`player-card ${p.isHost ? 'is-ready' : ''}`} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.2rem',
                position: 'relative'
              }}
            >
              {!p.isHost && isHost && (
                <button
                  type="button"
                  onClick={() => onKickPlayer(idx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'var(--color-red)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  title="Sacar de la mesa"
                >
                  ✕
                </button>
              )}
              <span style={{ fontSize: '1.2rem', color: p.isHost ? 'var(--color-green)' : '#ffffff' }}>
                {p.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                {p.isHost ? "👑 HOST" : "👤 JUGADOR"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ borderColor: 'rgba(0, 240, 255, 0.15)', margin: '1rem 0' }} />

      {/* Control Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {isHost ? (
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button 
              type="button"
              className="arcade-btn btn-yellow"
              style={{ flex: 1, fontSize: '0.9rem' }}
              onClick={handleSimulate}
            >
              ➕ SIMULAR JUGADOR
            </button>
            <button 
              type="button"
              className="arcade-btn btn-green"
              style={{ flex: 1.5, fontSize: '1rem' }}
              onClick={handleStart}
              disabled={players.length < 2} // Require at least 2 players to start a multiplayer game
            >
              ⚡ INICIAR PARTIDA
            </button>
          </div>
        ) : (
          <div className="flex-center" style={{ fontFamily: 'var(--font-title)', fontStyle: 'italic', color: 'var(--text-muted)', margin: '0.5rem 0', fontSize: '1.1rem' }}>
            ⏳ Esperando que el Host comience la partida...
          </div>
        )}

        <button 
          type="button"
          className="arcade-btn btn-red"
          style={{ width: '100%', fontSize: '0.9rem' }}
          onClick={() => {
            if (soundEnabled) audioSynth.playCoin();
            onLeave();
          }}
        >
          SALIR DE LA SALA
        </button>
      </div>
    </div>
  );
}
