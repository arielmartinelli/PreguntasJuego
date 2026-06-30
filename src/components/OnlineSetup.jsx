import React, { useState } from 'react';
import { audioSynth } from '../audioSynth';
import { CATEGORIES } from './LocalSetup';

export default function OnlineSetup({ onCreateRoom, onBack, soundEnabled }) {
  const [hostName, setHostName] = useState("HOST");
  const [playMode, setPlayMode] = useState("host_controller"); // 'host_controller' | 'shared_lobby'
  const [difficulty, setDifficulty] = useState("medium");
  const [hardModeOptions, setHardModeOptions] = useState(true);
  const [rounds, setRounds] = useState(5);
  const [questionsPerRound, setQuestionsPerRound] = useState(3);
  const [selectedCategories, setSelectedCategories] = useState([...CATEGORIES]);

  const handleDifficultySelect = (diff) => {
    if (soundEnabled) audioSynth.playCoin();
    setDifficulty(diff);
  };

  const handleRoundsChange = (val) => {
    if (soundEnabled) audioSynth.playCoin();
    const newVal = Math.max(1, Math.min(10, rounds + val));
    setRounds(newVal);
  };

  const handleQuestionsPerRoundChange = (val) => {
    if (soundEnabled) audioSynth.playCoin();
    const newVal = Math.max(1, Math.min(10, questionsPerRound + val));
    setQuestionsPerRound(newVal);
  };

  const toggleCategory = (category) => {
    if (soundEnabled) audioSynth.playCoin();
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleAllCategories = () => {
    if (soundEnabled) audioSynth.playCoin();
    if (selectedCategories.length === CATEGORIES.length) {
      setSelectedCategories([CATEGORIES[0]]);
    } else {
      setSelectedCategories([...CATEGORIES]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (soundEnabled) audioSynth.playStart();
    
    onCreateRoom({
      hostName: hostName.trim() || "HOST",
      playMode,
      difficulty,
      hardModeOptions: difficulty === 'hard' ? hardModeOptions : true,
      rounds,
      questionsPerRound,
      categories: selectedCategories
    });
  };

  return (
    <div className="arcade-panel">
      <h2 className="subtitle-arcade text-center">🌐 CREAR SALA ONLINE</h2>
      
      <form onSubmit={handleSubmit} className="flex-column gap-3">
        {/* Nombre del Host */}
        <div>
          <label className="arcade-label">TU NOMBRE (CREADOR)</label>
          <input
            type="text"
            maxLength={15}
            required
            className="arcade-input"
            style={{ fontSize: '1.2rem', padding: '0.4rem' }}
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
          />
        </div>

        {/* MODO DE JUEGO ONLINE */}
        <div>
          <label className="arcade-label" style={{ color: 'var(--color-blue)' }}>MODO DE JUEGO ONLINE</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button
              type="button"
              className={`arcade-btn ${playMode === 'host_controller' ? 'btn-green' : ''}`}
              style={{ fontSize: '0.85rem', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0.8rem 1.2rem', minHeight: 'auto' }}
              onClick={() => {
                if (soundEnabled) audioSynth.playCoin();
                setPlayMode('host_controller');
              }}
            >
              <span style={{ fontWeight: 'bold' }}>🖥️ Host + Controles (Estilo Kahoot)</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 'normal', marginTop: '0.2rem', opacity: 0.9 }}>
                Este dispositivo proyecta las preguntas. Los demás juegan usando sus móviles como mandos.
              </span>
            </button>
            
            <button
              type="button"
              className={`arcade-btn ${playMode === 'shared_lobby' ? 'btn-green' : ''}`}
              style={{ fontSize: '0.85rem', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0.8rem 1.2rem', minHeight: 'auto' }}
              onClick={() => {
                if (soundEnabled) audioSynth.playCoin();
                setPlayMode('shared_lobby');
              }}
            >
              <span style={{ fontWeight: 'bold' }}>📱 Lobby Compartido Sincronizado</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 'normal', marginTop: '0.2rem', opacity: 0.9 }}>
                Todos ven las preguntas y responden en sus propias pantallas al mismo tiempo.
              </span>
            </button>
          </div>
        </div>

        {/* Selección de Dificultad */}
        <div>
          <label className="arcade-label">DIFICULTAD</label>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="button"
              className={`arcade-btn ${difficulty === 'easy' ? 'btn-green' : ''}`}
              style={{ flex: 1, fontSize: '0.8rem' }}
              onClick={() => handleDifficultySelect('easy')}
            >
              FÁCIL
            </button>
            <button
              type="button"
              className={`arcade-btn ${difficulty === 'medium' ? 'btn-yellow' : ''}`}
              style={{ flex: 1, fontSize: '0.8rem' }}
              onClick={() => handleDifficultySelect('medium')}
            >
              NORMAL
            </button>
            <button
              type="button"
              className={`arcade-btn ${difficulty === 'hard' ? 'btn-pink' : ''}`}
              style={{ flex: 1, fontSize: '0.8rem' }}
              onClick={() => handleDifficultySelect('hard')}
            >
              DIFÍCIL
            </button>
          </div>
        </div>

        {/* Sub-opción para modo difícil */}
        {difficulty === 'hard' && (
          <div>
            <label className="arcade-label" style={{ color: 'var(--color-secondary)' }}>
              🔥 MODO DIFÍCIL: OPCIONES DE RESPUESTA
            </label>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                type="button"
                className={`arcade-btn ${hardModeOptions ? 'btn-pink' : ''}`}
                style={{ flex: 1, fontSize: '0.75rem', padding: '0.6rem' }}
                onClick={() => {
                  if (soundEnabled) audioSynth.playCoin();
                  setHardModeOptions(true);
                }}
              >
                CON OPCIONES (A, B, C, D)
              </button>
              <button
                type="button"
                className={`arcade-btn ${!hardModeOptions ? 'btn-pink' : ''}`}
                style={{ flex: 1, fontSize: '0.75rem', padding: '0.6rem' }}
                onClick={() => {
                  if (soundEnabled) audioSynth.playCoin();
                  setHardModeOptions(false);
                }}
              >
                SIN OPCIONES (ESCRIBIR)
              </button>
            </div>
          </div>
        )}

        {/* Rondas y Preguntas por Ronda */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="arcade-label">RONDAS</label>
            <div className="flex-center gap-1" style={{ fontSize: '0.9rem' }}>
              <button
                type="button"
                className="arcade-btn"
                style={{ minWidth: '38px', fontSize: '0.9rem', padding: '0.3rem', minHeight: '38px' }}
                onClick={() => handleRoundsChange(-1)}
                disabled={rounds <= 1}
              >
                -
              </button>
              <span style={{ fontSize: '1.4rem', width: '30px', textAlign: 'center', color: 'var(--color-cyan)', textShadow: '0 0 8px rgba(0, 240, 255, 0.5)', fontFamily: 'var(--font-title)', fontWeight: 'bold' }}>{rounds}</span>
              <button
                type="button"
                className="arcade-btn"
                style={{ minWidth: '38px', fontSize: '0.9rem', padding: '0.3rem', minHeight: '38px' }}
                onClick={() => handleRoundsChange(1)}
                disabled={rounds >= 10}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="arcade-label">PREGUNTAS / RONDA</label>
            <div className="flex-center gap-1" style={{ fontSize: '0.9rem' }}>
              <button
                type="button"
                className="arcade-btn"
                style={{ minWidth: '38px', fontSize: '0.9rem', padding: '0.3rem', minHeight: '38px' }}
                onClick={() => handleQuestionsPerRoundChange(-1)}
                disabled={questionsPerRound <= 1}
              >
                -
              </button>
              <span style={{ fontSize: '1.4rem', width: '30px', textAlign: 'center', color: 'var(--color-pink)', textShadow: '0 0 8px rgba(255, 0, 160, 0.5)', fontFamily: 'var(--font-title)', fontWeight: 'bold' }}>{questionsPerRound}</span>
              <button
                type="button"
                className="arcade-btn"
                style={{ minWidth: '38px', fontSize: '0.9rem', padding: '0.3rem', minHeight: '38px' }}
                onClick={() => handleQuestionsPerRoundChange(1)}
                disabled={questionsPerRound >= 10}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div>
          <label className="arcade-label">CATEGORÍAS</label>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.6rem' }}>
            <button
              type="button"
              className={`arcade-btn ${selectedCategories.length === CATEGORIES.length ? 'btn-green' : ''}`}
              style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', minHeight: 'auto' }}
              onClick={toggleAllCategories}
            >
              {selectedCategories.length === CATEGORIES.length ? "DESELECCIONAR TODAS" : "TODAS LAS CATEGORÍAS"}
            </button>
          </div>
          <div className="checkbox-grid">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="checkbox-item" onClick={() => toggleCategory(cat)} style={{ padding: '0.5rem', fontSize: '1rem', minHeight: '40px' }}>
                <div className={`checkbox-custom ${selectedCategories.includes(cat) ? 'checked' : ''}`} style={{ width: '18px', height: '18px' }}></div>
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            className="arcade-btn btn-red"
            style={{ flex: 1, fontSize: '0.9rem' }}
            onClick={() => {
              if (soundEnabled) audioSynth.playCoin();
              onBack();
            }}
          >
            VOLVER
          </button>
          
          <button
            type="submit"
            className="arcade-btn btn-green"
            style={{ flex: 2, fontSize: '1rem' }}
          >
            🎲 CREAR SALA
          </button>
        </div>
      </form>
    </div>
  );
}
