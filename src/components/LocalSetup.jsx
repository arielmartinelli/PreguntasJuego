import React, { useState } from 'react';
import { audioSynth } from '../audioSynth';

export const CATEGORIES = [
  "Geografía",
  "Historia",
  "Ciencia",
  "Arte y Literatura",
  "Deportes",
  "Entretenimiento"
];

export default function LocalSetup({ onStartGame, onBack, soundEnabled }) {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(["JUGADOR 1", "JUGADOR 2", "", "", "", ""]);
  const [difficulty, setDifficulty] = useState("medium");
  const [hardModeOptions, setHardModeOptions] = useState(true); // true = con opciones, false = sin opciones
  
  // New features
  const [rounds, setRounds] = useState(5);
  const [questionsPerRound, setQuestionsPerRound] = useState(3);
  const [selectedCategories, setSelectedCategories] = useState([...CATEGORIES]);

  const handleNumPlayersChange = (num) => {
    if (soundEnabled) audioSynth.playCoin();
    setNumPlayers(num);
  };

  const handleNameChange = (index, value) => {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  };

  const handleDifficultySelect = (diff) => {
    if (soundEnabled) audioSynth.playCoin();
    setDifficulty(diff);
  };

  const handleHardOptionsToggle = (val) => {
    if (soundEnabled) audioSynth.playCoin();
    setHardModeOptions(val);
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
      // Don't allow empty category selection
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
      // Keep only the first one to avoid empty list
      setSelectedCategories([CATEGORIES[0]]);
    } else {
      setSelectedCategories([...CATEGORIES]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (soundEnabled) audioSynth.playStart();
    
    // Filter active players and set defaults if empty
    const activePlayers = [];
    for (let i = 0; i < numPlayers; i++) {
      const name = playerNames[i].trim() || `JUGADOR ${i + 1}`;
      activePlayers.push({ name, score: 0 });
    }

    onStartGame({
      players: activePlayers,
      difficulty,
      hardModeOptions: difficulty === 'hard' ? hardModeOptions : true,
      rounds,
      questionsPerRound,
      categories: selectedCategories
    });
  };

  return (
    <div className="arcade-panel">
      <h2 className="subtitle-arcade text-center">⚙️ CONFIGURACIÓN DE PARTIDA</h2>
      
      <form onSubmit={handleSubmit} className="flex-column gap-3">
        {/* Número de Jugadores */}
        <div>
          <label className="arcade-label">NÚMERO DE JUGADORES</label>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                className={`arcade-btn ${numPlayers === num ? 'btn-green' : ''}`}
                style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', minWidth: '40px' }}
                onClick={() => handleNumPlayersChange(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Nombres de los Jugadores */}
        <div>
          <label className="arcade-label">NOMBRES DE LOS JUGADORES</label>
          <div style={{ display: 'grid', gridTemplateColumns: numPlayers > 3 ? '1fr 1fr' : '1fr', gap: '0.8rem' }}>
            {Array.from({ length: numPlayers }).map((_, idx) => (
              <div key={idx} className="flex-column">
                <input
                  type="text"
                  maxLength={15}
                  placeholder={`JUGADOR ${idx + 1}`}
                  className="arcade-input"
                  style={{ fontSize: '1.2rem', padding: '0.4rem' }}
                  value={playerNames[idx]}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                />
              </div>
            ))}
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
                onClick={() => handleHardOptionsToggle(true)}
              >
                CON OPCIONES (A, B, C, D)
              </button>
              <button
                type="button"
                className={`arcade-btn ${!hardModeOptions ? 'btn-pink' : ''}`}
                style={{ flex: 1, fontSize: '0.75rem', padding: '0.6rem' }}
                onClick={() => handleHardOptionsToggle(false)}
              >
                SIN OPCIONES (ESCRIBIR TEXTO)
              </button>
            </div>
          </div>
        )}

        {/* CONFIGURACIÓN DE RONDAS */}
        <div>
          <label className="arcade-label">CANTIDAD DE RONDAS</label>
          <div className="flex-center gap-2" style={{ fontFamily: 'var(--font-arcade)' }}>
            <button
              type="button"
              className="arcade-btn"
              style={{ minWidth: '44px', fontSize: '1rem', padding: '0.4rem' }}
              onClick={() => handleRoundsChange(-1)}
              disabled={rounds <= 1}
            >
              -
            </button>
            <span style={{ fontSize: '1.8rem', width: '50px', textAlign: 'center', color: 'var(--color-blue)', fontFamily: 'var(--font-title)', fontWeight: 'bold' }}>
              {rounds}
            </span>
            <button
              type="button"
              className="arcade-btn"
              style={{ minWidth: '44px', fontSize: '1rem', padding: '0.4rem' }}
              onClick={() => handleRoundsChange(1)}
              disabled={rounds >= 10}
            >
              +
            </button>
          </div>
        </div>

        {/* CONFIGURACIÓN DE PREGUNTAS POR RONDA */}
        <div>
          <label className="arcade-label">PREGUNTAS POR RONDA (POR JUGADOR)</label>
          <div className="flex-center gap-2" style={{ fontFamily: 'var(--font-arcade)' }}>
            <button
              type="button"
              className="arcade-btn"
              style={{ minWidth: '44px', fontSize: '1rem', padding: '0.4rem' }}
              onClick={() => handleQuestionsPerRoundChange(-1)}
              disabled={questionsPerRound <= 1}
            >
              -
            </button>
            <span style={{ fontSize: '1.8rem', width: '50px', textAlign: 'center', color: 'var(--color-orange)', fontFamily: 'var(--font-title)', fontWeight: 'bold' }}>
              {questionsPerRound}
            </span>
            <button
              type="button"
              className="arcade-btn"
              style={{ minWidth: '44px', fontSize: '1rem', padding: '0.4rem' }}
              onClick={() => handleQuestionsPerRoundChange(1)}
              disabled={questionsPerRound >= 10}
            >
              +
            </button>
          </div>
        </div>

        {/* CONFIGURACIÓN DE CATEGORÍAS */}
        <div>
          <label className="arcade-label">CATEGORÍAS DE PREGUNTAS</label>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.8rem' }}>
            <button
              type="button"
              className={`arcade-btn ${selectedCategories.length === CATEGORIES.length ? 'btn-green' : ''}`}
              style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}
              onClick={toggleAllCategories}
            >
              {selectedCategories.length === CATEGORIES.length ? "DESELECCIONAR TODAS" : "TODAS LAS CATEGORÍAS"}
            </button>
          </div>
          
          <div className="checkbox-grid">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat} 
                className="checkbox-item" 
                onClick={() => toggleCategory(cat)}
              >
                <div className={`checkbox-custom ${selectedCategories.includes(cat) ? 'checked' : ''}`}></div>
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />

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
            style={{ flex: 2, fontSize: '1.05rem' }}
          >
            ⚡ INICIAR JUEGO
          </button>
        </div>
      </form>
    </div>
  );
}
