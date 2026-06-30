import React, { useEffect } from 'react';
import { audioSynth } from '../audioSynth';

export default function Scoreboard({ players, isFinal, currentRound, totalRounds, onAction, soundEnabled }) {
  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  useEffect(() => {
    if (isFinal && soundEnabled) {
      audioSynth.playVictory();
    }
  }, [isFinal]);

  // Podium positions helper
  const getPodiumOrder = () => {
    const podium = { first: null, second: null, third: null };
    if (sortedPlayers.length > 0) podium.first = sortedPlayers[0];
    if (sortedPlayers.length > 1) podium.second = sortedPlayers[1];
    if (sortedPlayers.length > 2) podium.third = sortedPlayers[2];
    return podium;
  };

  const { first, second, third } = getPodiumOrder();

  const handleButtonClick = () => {
    if (soundEnabled) audioSynth.playCoin();
    onAction();
  };

  return (
    <div className="arcade-panel flex-column flex-center gap-3" style={{ width: '100%' }}>
      {isFinal ? (
        /* --- FINAL PODIUM SCREEN --- */
        <div className="flex-column flex-center gap-3" style={{ width: '100%' }}>
          <div>
            <span className="category-badge" style={{ borderColor: 'var(--color-yellow)', color: 'var(--color-yellow)' }}>
              🏆 PODIO FINAL 🏆
            </span>
          </div>
          <h2 className="subtitle-arcade flicker-text">¡FIN DE LA PARTIDA!</h2>

          {/* Retro NES Podium Visual */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'center', 
              gap: '1rem', 
              margin: '2rem 0',
              width: '100%',
              maxWidth: '500px',
              height: '240px',
              fontFamily: 'var(--font-standard)'
            }}
          >
            {/* 2nd Place */}
            {second && (
              <div className="flex-column flex-center" style={{ flex: 1 }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-primary)', textAlign: 'center', fontWeight: 'bold' }}>
                  {second.name}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--color-yellow)', marginBottom: '0.5rem' }}>
                  {second.score} pt(s)
                </span>
                <div 
                  style={{ 
                    width: '100%', 
                    height: '90px', 
                    background: '#222',
                    border: '4px solid #ffffff',
                    borderRadius: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '4px 4px 0 #000'
                  }}
                >
                  <span className="place-badge place-2">2ND</span>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {first && (
              <div className="flex-column flex-center" style={{ flex: 1.2, zIndex: 10 }}>
                <span style={{ fontSize: '1.5rem', color: 'var(--color-yellow)', textAlign: 'center', fontWeight: 'bold' }}>
                  👑 {first.name}
                </span>
                <span style={{ fontSize: '1.3rem', color: 'var(--color-green)', marginBottom: '0.5rem' }}>
                  {first.score} pt(s)
                </span>
                <div 
                  style={{ 
                    width: '100%', 
                    height: '130px', 
                    background: '#333',
                    border: '4px solid var(--color-yellow)',
                    borderRadius: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '4px 4px 0 #000'
                  }}
                >
                  <span className="place-badge place-1">1ST</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {third && (
              <div className="flex-column flex-center" style={{ flex: 1 }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)', textAlign: 'center', fontWeight: 'bold' }}>
                  {third.name}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--color-yellow)', marginBottom: '0.5rem' }}>
                  {third.score} pt(s)
                </span>
                <div 
                  style={{ 
                    width: '100%', 
                    height: '60px', 
                    background: '#111',
                    border: '4px solid #ffffff',
                    borderRadius: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '4px 4px 0 #000'
                  }}
                >
                  <span className="place-badge place-3">3RD</span>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Table for remaining players if N > 3 */}
          {sortedPlayers.length > 3 && (
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <table className="retro-table">
                <thead>
                  <tr>
                    <th>POS</th>
                    <th>JUGADOR</th>
                    <th style={{ textAlign: 'right' }}>SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.slice(3).map((player, index) => (
                    <tr key={index}>
                      <td>#{index + 4}</td>
                      <td>{player.name}</td>
                      <td style={{ textAlign: 'right', color: 'var(--color-green)' }}>{player.score} pt(s)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button 
            className="arcade-btn btn-green"
            style={{ fontSize: '0.9rem', padding: '1rem 2rem', marginTop: '1rem' }}
            onClick={handleButtonClick}
          >
            🎲 VOLVER AL INICIO
          </button>
        </div>
      ) : (
        /* --- INTERMEDIATE SCOREBOARD --- */
        <div className="flex-column flex-center gap-3" style={{ width: '100%' }}>
          <div>
            <span className="category-badge" style={{ borderColor: 'var(--color-yellow)', color: 'var(--color-yellow)' }}>
              POSICIONES DE LA RONDA
            </span>
          </div>
          <h2 className="subtitle-arcade" style={{ fontSize: '1.2rem' }}>RONDA {currentRound - 1} DE {totalRounds} COMPLETADA</h2>

          <div style={{ width: '100%', maxWidth: '500px' }}>
            <table className="retro-table">
              <thead>
                <tr>
                  <th>POS</th>
                  <th>JUGADOR</th>
                  <th style={{ textAlign: 'right' }}>SCORE</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => (
                  <tr key={index}>
                    <td>
                      {index === 0 && <span className="place-badge place-1">1ST</span>}
                      {index === 1 && <span className="place-badge place-2">2ND</span>}
                      {index === 2 && <span className="place-badge place-3">3RD</span>}
                      {index > 2 && `#${index + 1}`}
                    </td>
                    <td>{player.name}</td>
                    <td style={{ textAlign: 'right', color: 'var(--color-green)' }}>{player.score} pt(s)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button 
            className="arcade-btn btn-green"
            style={{ fontSize: '0.9rem', padding: '0.8rem 2rem', marginTop: '1rem' }}
            onClick={handleButtonClick}
          >
            SIGUIENTE RONDA ➔
          </button>
        </div>
      )}
    </div>
  );
}
