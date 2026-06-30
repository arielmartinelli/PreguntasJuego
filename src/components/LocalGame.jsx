import React, { useState, useEffect, useRef } from 'react';
import { audioSynth } from '../audioSynth';
import Scoreboard from './Scoreboard';

export default function LocalGame({ 
  players, 
  difficulty, 
  hardModeOptions, 
  questions, 
  totalRounds,
  questionsPerRound,
  soundEnabled, 
  onGameEnd, 
  onRoundComplete,
  onCancel
}) {
  const [gameState, setGameState] = useState('turn-alert'); // 'turn-alert' | 'question' | 'feedback'
  const [round, setRound] = useState(1);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0); // Index in the questions array
  const [questionsAnsweredInTurn, setQuestionsAnsweredInTurn] = useState(0);
  
  // Timer state
  const [timer, setTimer] = useState(20);
  const timerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Game interaction states
  const [selectedOption, setSelectedOption] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [localPlayers, setLocalPlayers] = useState([...players]);
  
  const currentQuestion = questions[questionIdx];
  const activePlayer = localPlayers[currentPlayerIdx];

  // Clean strings for flexible written answer comparison
  const cleanText = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"") // Remove punctuation
      .trim();
  };

  // Timer loop
  useEffect(() => {
    if (gameState === 'question' && timer > 0 && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeout();
            return 0;
          }
          // Sound ticks
          if (soundEnabled) {
            if (prev <= 6) {
              audioSynth.playTickCritical();
            } else {
              audioSynth.playTick();
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timer, isPaused]);

  const handleStartTurn = () => {
    if (soundEnabled) audioSynth.playStart();
    setTimer(20);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsCorrect(false);
    setPointsEarned(0);
    setGameState('question');
  };

  const handleTimeout = () => {
    if (soundEnabled) audioSynth.playIncorrect();
    setIsCorrect(false);
    setPointsEarned(0);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    setGameState('feedback');
  };

  const processAnswer = (answerText) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const isAnsCorrect = cleanText(answerText) === cleanText(currentQuestion.correct_answer);
    let pts = 0;
    
    if (isAnsCorrect) {
      if (soundEnabled) audioSynth.playCorrect();
      // Scoring: 1 point for correct answer
      pts = 1;
      setIsCorrect(true);
      setPointsEarned(pts);
      
      // Update score in local players state
      const updatedPlayers = [...localPlayers];
      updatedPlayers[currentPlayerIdx].score += pts;
      setLocalPlayers(updatedPlayers);
    } else {
      if (soundEnabled) audioSynth.playIncorrect();
      setIsCorrect(false);
      setPointsEarned(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
    
    setGameState('feedback');
  };

  const handleOptionClick = (option) => {
    if (selectedOption !== null) return; // Prevent double clicking
    setSelectedOption(option);
    processAnswer(option);
  };

  const handleTypedSubmit = (e) => {
    e.preventDefault();
    if (!typedAnswer.trim()) return;
    processAnswer(typedAnswer);
  };

  const handleNext = () => {
    if (soundEnabled) audioSynth.playCoin();

    const nextTurnQuestionCount = questionsAnsweredInTurn + 1;

    if (nextTurnQuestionCount < questionsPerRound) {
      // Same player, next question
      setQuestionsAnsweredInTurn(nextTurnQuestionCount);
      setQuestionIdx((prev) => (prev + 1) % questions.length);
      setTimer(20);
      setSelectedOption(null);
      setTypedAnswer('');
      setIsCorrect(false);
      setPointsEarned(0);
      setGameState('question');
    } else {
      // Turn complete, reset turn count and move to next player
      const nextPlayerIdx = currentPlayerIdx + 1;

      if (nextPlayerIdx < localPlayers.length) {
        // Move to next player in the same round
        setQuestionsAnsweredInTurn(0);
        setCurrentPlayerIdx(nextPlayerIdx);
        setQuestionIdx((prev) => (prev + 1) % questions.length);
        setGameState('turn-alert');
      } else {
        // Round is complete
        if (round < totalRounds) {
          // Go to local intermediate scoreboard (no unmounting)
          setGameState('scoreboard');
        } else {
          // Game completed
          onGameEnd(localPlayers);
        }
      }
    }
  };

  const handleScoreboardContinue = () => {
    const nextRound = round + 1;
    setRound(nextRound);
    setQuestionsAnsweredInTurn(0);
    setCurrentPlayerIdx(0);
    setQuestionIdx((prev) => (prev + 1) % questions.length);
    setGameState('turn-alert');
  };

  // Determine option letters (A, B, C, D)
  const getOptionLetter = (idx) => {
    return String.fromCharCode(65 + idx); // A, B, C, D
  };

  return (
    <div className={`crt-container ${shaking ? 'screen-shake' : ''}`} style={{ width: '100%' }}>
      {/* 1. Turn Alert Screen */}
      {gameState === 'turn-alert' && (
        <div className="arcade-panel flex-column flex-center gap-3" style={{ minHeight: '350px' }}>
          <div>
            <span className="category-badge" style={{ borderColor: 'var(--color-tertiary)', color: 'var(--color-tertiary)' }}>
              RONDA {round} DE {totalRounds}
            </span>
          </div>
          <h2 className="subtitle-arcade flicker-text">¡PREPÁRATE!</h2>
          <div 
            style={{ 
              fontFamily: 'var(--font-arcade)', 
              fontSize: '1.8rem', 
              color: 'var(--color-primary)',
              margin: '1rem 0',
              textAlign: 'center'
            }}
          >
            {activePlayer.name}
          </div>
          <button 
            className="arcade-btn btn-green"
            style={{ fontSize: '1rem', padding: '1rem 2rem', marginTop: '1rem' }}
            onClick={handleStartTurn}
          >
            ⚡ EMPEZAR TURNO
          </button>
        </div>
      )}

      {/* 2. Active Question Screen */}
      {gameState === 'question' && (
        <div className="arcade-panel flex-column">
          {/* Highly Visible Floating Pause Button */}
          <button 
            type="button" 
            className="arcade-btn btn-pink" 
            style={{ 
              position: 'absolute', 
              top: '12px', 
              right: '12px', 
              minHeight: 'auto', 
              height: '36px', 
              padding: '0 0.8rem', 
              fontSize: '0.75rem', 
              borderRadius: '20px', 
              boxShadow: '0 3px 0 rgba(0,0,0,0.1)',
              zIndex: 50,
              margin: 0
            }}
            onClick={() => setIsPaused(true)}
          >
            ⏸️ PAUSAR
          </button>
          
          {/* HUD Bar */}
          <div className="hud-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="hud-item">
              <span>RONDA:</span>
              <span className="hud-value">{round}/{totalRounds}</span>
            </div>
            <div className="hud-item" style={{ fontSize: '1.2rem', color: 'var(--color-yellow)' }}>
              <span>{activePlayer.name}</span>
            </div>
            <div className="hud-item">
              <span>PREG:</span>
              <span className="hud-value">{questionsAnsweredInTurn + 1}/{questionsPerRound}</span>
            </div>
            <div className="hud-item">
              <span>SCORE:</span>
              <span className="hud-value" style={{ color: 'var(--color-success)' }}>{activePlayer.score} pts</span>
            </div>
          </div>

          {/* Question Details */}
          <div className="question-container">
            <span className="category-badge">{currentQuestion.category}</span>
            <div className="question-text">{currentQuestion.question_text}</div>
          </div>

          {/* Custom Timer Bar */}
          <div className={`timer-bar-container ${timer <= 5 ? 'timer-critical' : ''}`}>
            <div 
              className="timer-bar-fill" 
              style={{ 
                width: `${(timer / 20) * 100}%`,
              }}
            ></div>
          </div>

          {/* Options Grid or Text Input depending on difficulty */}
          {difficulty === 'hard' && !hardModeOptions ? (
            /* Written Answer Mode */
            <form onSubmit={handleTypedSubmit} className="flex-column gap-2" style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
              <label className="arcade-label">RESPUESTA EXACTA:</label>
              <input
                type="text"
                autoFocus
                required
                className="arcade-input"
                placeholder="..."
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
              />
              <button 
                type="submit"
                className="arcade-btn btn-green"
                style={{ fontSize: '0.8rem', marginTop: '1rem' }}
              >
                RESPONDER
              </button>
            </form>
          ) : (
            /* Multiple Choice Mode */
            <div className="options-grid">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-btn ${selectedOption === option ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                >
                  <span className="option-label">{getOptionLetter(idx)}</span>
                  <span>{option}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Feedback Screen */}
      {gameState === 'feedback' && (
        <div className="arcade-panel flex-column flex-center gap-2" style={{ minHeight: '380px' }}>
          <div>
            <span className="category-badge" style={{ borderColor: 'var(--color-tertiary)', color: 'var(--color-tertiary)' }}>
              TURNO TERMINADO
            </span>
          </div>

          {isCorrect ? (
            <div className="flex-column flex-center">
              <h2 className="subtitle-arcade flicker-text" style={{ color: 'var(--color-success)' }}>
                ★ ¡CORRECTO! ★
              </h2>
              <div 
                style={{ 
                  fontFamily: 'var(--font-arcade)', 
                  fontSize: '1.8rem', 
                  color: 'var(--color-tertiary)', 
                  margin: '1.5rem 0',
                }}
              >
                +{pointsEarned} PUNTO
              </div>
            </div>
          ) : (
            <div className="flex-column flex-center">
              <h2 className="subtitle-arcade" style={{ color: 'var(--color-secondary)' }}>
                ⚡ INCORRECTO ⚡
              </h2>
              <p style={{ fontFamily: 'var(--font-retro)', fontSize: '1.6rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Respuesta correcta:
              </p>
              <div 
                style={{ 
                  fontFamily: 'var(--font-arcade)', 
                  fontSize: '1rem', 
                  color: '#fff', 
                  margin: '1.5rem 0',
                  lineHeight: '1.4',
                  textAlign: 'center'
                }}
              >
                {currentQuestion.correct_answer}
              </div>
            </div>
          )}

          <div style={{ fontFamily: 'var(--font-retro)', fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>
            {activePlayer.name} tiene <span style={{ color: 'var(--color-success)' }}>{activePlayer.score} pt(s)</span> en total.
          </div>

          <button 
            className="arcade-btn btn-green"
            style={{ fontSize: '0.9rem', padding: '0.8rem 2rem' }}
            onClick={handleNext}
          >
            SIGUIENTE ➔
          </button>
        </div>
      )}

      {/* 4. Intermediate Scoreboard Screen */}
      {gameState === 'scoreboard' && (
        <Scoreboard 
          players={localPlayers}
          isFinal={false}
          currentRound={round + 1}
          totalRounds={totalRounds}
          onAction={handleScoreboardContinue}
          soundEnabled={soundEnabled}
        />
      )}

      {/* 5. Pause Screen Overlay */}
      {isPaused && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(8px)',
            zIndex: 2000, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: 'var(--border-radius-lg)',
            gap: '1.2rem'
          }}
        >
          <h2 className="subtitle-arcade flicker-text" style={{ color: 'var(--color-yellow)', fontSize: '1.8rem', textShadow: '2px 2px 0 #000' }}>
            ⏸️ PARTIDA PAUSADA
          </h2>
          <button 
            className="arcade-btn btn-green" 
            onClick={() => {
              if (soundEnabled) audioSynth.playCoin();
              setIsPaused(false);
            }}
            style={{ minWidth: '220px' }}
          >
            ▶️ REANUDAR
          </button>
          <button 
            className="arcade-btn btn-red" 
            onClick={() => {
              if (soundEnabled) audioSynth.playCoin();
              onCancel();
            }}
            style={{ minWidth: '220px' }}
          >
            ❌ CANCELAR PARTIDA
          </button>
        </div>
      )}
    </div>
  );
}
