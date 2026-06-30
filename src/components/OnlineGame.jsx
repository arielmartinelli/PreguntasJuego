import React, { useState, useEffect, useRef } from 'react';
import { audioSynth } from '../audioSynth';

export default function OnlineGame({ 
  players, 
  difficulty, 
  hardModeOptions, 
  questions, 
  totalRounds,
  questionsPerRound,
  playMode, // 'host_controller' | 'shared_lobby'
  isHost,   // Is this device the Host
  soundEnabled, 
  onGameEnd 
}) {
  // Game states: 'question' | 'feedback' | 'scoreboard'
  const [gameState, setGameState] = useState('question');
  const [round, setRound] = useState(1);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [questionNumberInRound, setQuestionNumberInRound] = useState(1);
  
  // Timer state
  const [timer, setTimer] = useState(20);
  const timerRef = useRef(null);

  // Players scores & answer states
  const [localPlayers, setLocalPlayers] = useState(
    players.map(p => ({ ...p, score: 0, answered: false, correct: false, lastAns: '' }))
  );
  
  // Active user state
  const [hasAnswered, setHasAnswered] = useState(false);
  const [userSelectedAns, setUserSelectedAns] = useState('');
  const [shaking, setShaking] = useState(false);
  
  // Simulation config
  const [mockProjectorOpen, setMockProjectorOpen] = useState(true); // Let players see Host question for solo testing

  const currentQuestion = questions[questionIdx];
  const totalQuestions = totalRounds * questionsPerRound;

  // Clean text helper
  const cleanText = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
      .trim();
  };

  // 1. Timer Loop
  useEffect(() => {
    if (gameState === 'question' && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleRoundTimeout();
            return 0;
          }
          // Sound ticks
          if (soundEnabled) {
            if (prev <= 6) audioSynth.playTickCritical();
            else audioSynth.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timer]);

  // 2. Simulated Realtime: Mock players answer after random delay
  useEffect(() => {
    if (gameState === 'question') {
      const mockTimers = [];
      
      localPlayers.forEach((p, idx) => {
        // Skip host if host_controller mode (host doesn't answer questions)
        if (playMode === 'host_controller' && p.isHost) return;
        // Skip actual user (index 0 is the user)
        if (idx === 0) return;
        
        // Random delay: 2 to 7 seconds
        const delay = 2000 + Math.random() * 5000;
        const mockTimer = setTimeout(() => {
          setLocalPlayers(prev => {
            const updated = [...prev];
            const player = updated[idx];
            if (!player.answered) {
              player.answered = true;
              
              // Simulate answer accuracy: 65% correct for easy, 50% medium, 30% hard
              let correctChance = 0.5;
              if (difficulty === 'easy') correctChance = 0.65;
              if (difficulty === 'hard') correctChance = 0.35;
              
              const isCorrect = Math.random() < correctChance;
              player.correct = isCorrect;
              
              if (isCorrect) {
                player.score += 1;
                player.lastAns = currentQuestion.correct_answer;
              } else {
                // Find a wrong answer
                const wrongOptions = currentQuestion.options.filter(o => o !== currentQuestion.correct_answer);
                player.lastAns = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || "Equivocada";
              }
            }
            return updated;
          });
        }, delay);
        
        mockTimers.push(mockTimer);
      });

      return () => mockTimers.forEach(clearTimeout);
    }
  }, [gameState, questionIdx]);

  // 3. Auto-reveal when everyone has answered
  useEffect(() => {
    if (gameState === 'question') {
      // Determine who needs to answer
      const activePlayersNeeded = playMode === 'host_controller' 
        ? localPlayers.filter(p => !p.isHost) // Host doesn't answer
        : localPlayers;                      // Everyone answers
      
      const allAnswered = activePlayersNeeded.every(p => p.answered);
      
      if (allAnswered && activePlayersNeeded.length > 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        revealAnswers();
      }
    }
  }, [localPlayers, gameState]);

  const handleRoundTimeout = () => {
    // Force answer reveal on timeout
    revealAnswers();
  };

  const revealAnswers = () => {
    // If the active user didn't answer, they get incorrect
    const user = localPlayers[0];
    const userNeedsToAnswer = !(playMode === 'host_controller' && isHost);
    
    if (userNeedsToAnswer && !user.answered) {
      if (soundEnabled) audioSynth.playIncorrect();
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }

    if (soundEnabled) {
      const userCorrect = userNeedsToAnswer ? user.correct : true;
      if (userCorrect) audioSynth.playCorrect();
      else audioSynth.playIncorrect();
    }

    setGameState('feedback');
  };

  // User submits answer
  const handleUserAnswerSubmit = (ans) => {
    if (hasAnswered) return;
    setUserSelectedAns(ans);
    setHasAnswered(true);
    
    const isCorrectAns = cleanText(ans) === cleanText(currentQuestion.correct_answer);
    
    setLocalPlayers(prev => {
      const updated = [...prev];
      // User is always index 0
      updated[0].answered = true;
      updated[0].correct = isCorrectAns;
      updated[0].lastAns = ans;
      if (isCorrectAns) {
        updated[0].score += 1;
      }
      return updated;
    });
  };

  // Move to next question or scoreboard
  const handleNext = () => {
    if (soundEnabled) audioSynth.playCoin();
    
    // Reset answers states
    setLocalPlayers(prev => prev.map(p => ({ ...p, answered: false, correct: false, lastAns: '' })));
    setHasAnswered(false);
    setUserSelectedAns('');
    setTimer(20);
    
    const nextQNum = questionNumberInRound + 1;
    
    if (nextQNum <= questionsPerRound) {
      // Continue to next question in same round
      setQuestionNumberInRound(nextQNum);
      setQuestionIdx(prev => (prev + 1) % questions.length);
      setGameState('question');
    } else {
      // Round complete! Show intermediate scoreboard
      setGameState('scoreboard');
    }
  };

  // Advance from scoreboard to next round or end game
  const handleScoreboardContinue = () => {
    if (soundEnabled) audioSynth.playCoin();
    
    if (round < totalRounds) {
      // Next round
      setRound(prev => prev + 1);
      setQuestionNumberInRound(1);
      setQuestionIdx(prev => (prev + 1) % questions.length);
      setGameState('question');
    } else {
      // Game over!
      onGameEnd(localPlayers);
    }
  };

  const getOptionLetter = (idx) => String.fromCharCode(65 + idx);

  // Sorting for leaderboards
  const sortedLeaderboard = [...localPlayers].sort((a, b) => b.score - a.score);

  return (
    <div className={`crt-container ${shaking ? 'screen-shake' : ''}`} style={{ width: '100%' }}>
      
      {/* -------------------- PANTALLA JUEGO -------------------- */}
      {gameState === 'question' && (
        <div className="arcade-panel flex-column">
          
          {/* HUD Bar */}
          <div className="hud-bar">
            <div className="hud-item">
              <span>RONDA:</span>
              <span className="hud-value">{round}/{totalRounds}</span>
            </div>
            <div className="hud-item">
              <span>PREG:</span>
              <span className="hud-value">{questionNumberInRound}/{questionsPerRound}</span>
            </div>
            <div className="hud-item" style={{ flexBasis: '100%', marginTop: '0.4rem', justifyContent: 'center', fontFamily: 'var(--font-title)' }}>
              <span>MODO: {playMode === 'host_controller' ? "HOST + CONTROLES" : "LOBBY SINCRONIZADO"}</span>
            </div>
          </div>

          {/* TIMER TRACK */}
          <div className={`timer-bar-container ${timer <= 5 ? 'timer-critical' : ''}`}>
            <div className="timer-bar-fill" style={{ width: `${(timer / 20) * 100}%` }}></div>
          </div>

          {/* FLOW SECTIONS */}
          {playMode === 'host_controller' && isHost ? (
            /* --- HOST VIEW (Host + Controller) --- */
            <div className="flex-column flex-center gap-2">
              <span className="category-badge">{currentQuestion.category}</span>
              <h2 className="question-text" style={{ fontSize: '2.2rem', textAlign: 'center' }}>
                {currentQuestion.question_text}
              </h2>
              
              {/* Show options to look at */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', width: '100%', margin: '1rem 0' }}>
                {currentQuestion.options.map((opt, idx) => (
                  <div key={idx} style={{ padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '6px', background: '#faf8f5', textAlign: 'left', fontWeight: 'bold' }}>
                    <span style={{ color: 'var(--color-red)', marginRight: '0.4rem' }}>({getOptionLetter(idx)})</span> {opt}
                  </div>
                ))}
              </div>

              {/* Status of players submitting answers */}
              <div style={{ width: '100%', marginTop: '1rem' }}>
                <label className="arcade-label" style={{ textAlign: 'center' }}>RESPUESTAS DE JUGADORES</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                  {localPlayers.filter(p => !p.isHost).map((p, idx) => (
                    <span 
                      key={idx} 
                      className="category-badge"
                      style={{ 
                        borderColor: p.answered ? 'var(--color-green)' : 'var(--color-yellow)',
                        color: p.answered ? 'var(--color-green)' : 'var(--color-yellow)',
                        background: p.answered ? '#f0fdf4' : '#fefce8'
                      }}
                    >
                      {p.name} {p.answered ? "✓ LISTO" : "⏳ ..."}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : playMode === 'host_controller' && !isHost ? (
            /* --- PLAYER CONTROLLER VIEW (Host + Controller) --- */
            <div className="flex-column flex-center gap-2">
              {/* Simulated project option for testing convenience */}
              <div style={{ width: '100%', marginBottom: '0.5rem', textAlign: 'right' }}>
                <button 
                  type="button" 
                  className="toggle-icon-btn" 
                  onClick={() => setMockProjectorOpen(!mockProjectorOpen)}
                  style={{ fontSize: '0.7rem' }}
                >
                  {mockProjectorOpen ? "Ocultar Carta Pregunta" : "Ver Carta Pregunta (Simulación)"}
                </button>
              </div>

              {mockProjectorOpen && (
                <div className="arcade-panel" style={{ padding: '1rem', background: '#f5eedc', borderStyle: 'dashed', marginBottom: '1rem' }}>
                  <span className="category-badge" style={{ fontSize: '0.65rem' }}>PROYECTOR HOST: {currentQuestion.category}</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-dark)' }}>
                    {currentQuestion.question_text}
                  </div>
                  {/* Show answer options list */}
                  <div style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                    {currentQuestion.options.map((o, idx) => (
                      <div key={idx}>({getOptionLetter(idx)}) {o}</div>
                    ))}
                  </div>
                </div>
              )}

              <p style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', textAlign: 'center', margin: '0.5rem 0' }}>
                🎮 ¡SELECCIONA TU RESPUESTA EN EL MANDO!
              </p>

              {hasAnswered ? (
                <div className="flex-column flex-center" style={{ minHeight: '140px' }}>
                  <span className="flicker-text" style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-blue)' }}>
                    Respuesta enviada...
                  </span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    Tu respuesta: <span style={{ fontWeight: 'bold' }}>{userSelectedAns}</span>
                  </p>
                </div>
              ) : (
                /* Interactive gamepad buttons */
                difficulty === 'hard' && !hardModeOptions ? (
                  /* Written input controller */
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = e.target.elements.writtenAns.value.trim();
                      if (val) handleUserAnswerSubmit(val);
                    }} 
                    className="flex-column gap-2" 
                    style={{ width: '100%', maxWidth: '400px' }}
                  >
                    <input name="writtenAns" type="text" autoFocus required className="arcade-input" placeholder="Tu respuesta..." />
                    <button type="submit" className="arcade-btn btn-green">RESPONDER</button>
                  </form>
                ) : (
                  /* Multiple choice buttons */
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                    {currentQuestion.options.map((_, idx) => {
                      const letter = getOptionLetter(idx);
                      return (
                        <button 
                          key={idx}
                          className="arcade-btn btn-yellow"
                          style={{ height: '70px', fontSize: '1.8rem', fontFamily: 'var(--font-title)' }}
                          onClick={() => handleUserAnswerSubmit(currentQuestion.options[idx])}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          ) : (
            /* --- SHARED LOBBY VIEW (Everyone sees everything) --- */
            <div className="flex-column">
              <div className="question-container">
                <span className="category-badge">{currentQuestion.category}</span>
                <div className="question-text">{currentQuestion.question_text}</div>
              </div>

              {hasAnswered ? (
                <div className="flex-column flex-center" style={{ minHeight: '180px' }}>
                  <span className="flicker-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-blue)' }}>
                    ¡Respuesta Enviada!
                  </span>
                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Esperando a los demás jugadores de la mesa...
                  </p>
                </div>
              ) : (
                difficulty === 'hard' && !hardModeOptions ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = e.target.elements.writtenAns.value.trim();
                      if (val) handleUserAnswerSubmit(val);
                    }} 
                    className="flex-column gap-2" 
                    style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}
                  >
                    <input name="writtenAns" type="text" autoFocus required className="arcade-input" placeholder="..." />
                    <button type="submit" className="arcade-btn btn-green" style={{ marginTop: '0.8rem' }}>RESPONDER</button>
                  </form>
                ) : (
                  <div className="options-grid">
                    {currentQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        className="option-btn"
                        onClick={() => handleUserAnswerSubmit(opt)}
                      >
                        <span className="option-label">{getOptionLetter(idx)}</span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* -------------------- PANTALLA REVELACIÓN / FEEDBACK -------------------- */}
      {gameState === 'feedback' && (
        <div className="arcade-panel flex-column flex-center gap-2" style={{ minHeight: '380px' }}>
          <div>
            <span className="category-badge" style={{ borderColor: 'var(--color-tertiary)', color: 'var(--color-tertiary)' }}>
              RESPUESTA CORRECTA
            </span>
          </div>

          <div 
            style={{ 
              fontFamily: 'var(--font-title)', 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              color: 'var(--color-green)',
              textAlign: 'center',
              margin: '1rem 0'
            }}
          >
            {currentQuestion.correct_answer}
          </div>

          {/* Personal result if the user is a player */}
          {!(playMode === 'host_controller' && isHost) && (
            <div className="flex-column flex-center">
              {localPlayers[0].correct ? (
                <h2 className="subtitle-arcade" style={{ color: 'var(--color-green)' }}>
                  ✓ ¡ACERTASTE! (+1 pt)
                </h2>
              ) : (
                <h2 className="subtitle-arcade" style={{ color: 'var(--color-red)' }}>
                  ✗ INCORRECTO (+0 pt)
                </h2>
              )}
            </div>
          )}

          {/* Show who answered what */}
          <div style={{ width: '100%', maxWidth: '500px', margin: '1rem 0' }}>
            <label className="arcade-label" style={{ textAlign: 'center' }}>RESULTADOS DE LA MESA</label>
            <div className="flex-column gap-1">
              {localPlayers.filter(p => !p.isHost || playMode === 'shared_lobby').map((p, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '0.6rem 0.8rem',
                    border: `1px solid ${p.correct ? 'var(--color-green)' : 'var(--color-red)'}`,
                    background: p.correct ? '#f0fdf4' : '#fdf2f2',
                    borderRadius: '6px',
                    fontSize: '0.95rem'
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                  <span>
                    {p.correct ? "✓ Correcto" : `✗ falló (${p.lastAns || 'Sin Tiempo'})`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Only the Host controls advancing */}
          {isHost ? (
            <button 
              className="arcade-btn btn-green"
              style={{ fontSize: '0.9rem', padding: '0.8rem 2rem', marginTop: '1rem' }}
              onClick={handleNext}
            >
              SIGUIENTE PREGUNTA ➔
            </button>
          ) : (
            <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '1rem' }}>
              Esperando que el Host continúe...
            </div>
          )}
        </div>
      )}

      {/* -------------------- TABLA DE POSICIONES INTERMEDIA -------------------- */}
      {gameState === 'scoreboard' && (
        <div className="arcade-panel flex-column flex-center gap-3" style={{ width: '100%' }}>
          <div>
            <span className="category-badge" style={{ borderColor: 'var(--color-blue)', color: 'var(--color-blue)' }}>
              RESULTADOS PARCIALES
            </span>
          </div>
          <h2 className="subtitle-arcade" style={{ fontSize: '1.3rem' }}>RONDA {round} DE {totalRounds} FINALIZADA</h2>

          <div style={{ width: '100%', maxWidth: '500px' }}>
            <table className="retro-table">
              <thead>
                <tr>
                  <th>POS</th>
                  <th>JUGADOR</th>
                  <th style={{ textAlign: 'right' }}>PUNTOS</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((p, index) => (
                  <tr key={index}>
                    <td>
                      {index === 0 && <span className="place-badge place-1">1ST</span>}
                      {index === 1 && <span className="place-badge place-2">2ND</span>}
                      {index === 2 && <span className="place-badge place-3">3RD</span>}
                      {index > 2 && `#${index + 1}`}
                    </td>
                    <td style={{ fontWeight: p.name === players[0].name ? 'bold' : 'normal' }}>
                      {p.name} {p.name === players[0].name ? "(Tú)" : ""}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--color-green)' }}>
                      {p.score} pt(s)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isHost ? (
            <button 
              className="arcade-btn btn-green"
              style={{ fontSize: '0.9rem', padding: '0.8rem 2rem', marginTop: '1rem' }}
              onClick={handleScoreboardContinue}
            >
              {round < totalRounds ? "SIGUIENTE RONDA ➔" : "VER PODIO FINAL 🏆"}
            </button>
          ) : (
            <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '1rem' }}>
              Esperando que el Host continúe la partida...
            </div>
          )}
        </div>
      )}

    </div>
  );
}
