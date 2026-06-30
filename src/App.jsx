import { useState } from 'react';
import StartScreen from './components/StartScreen';
import LocalSetup from './components/LocalSetup';
import LocalGame from './components/LocalGame';
import Scoreboard from './components/Scoreboard';
import CrtToggle from './components/CrtToggle';
import OnlineSetup from './components/OnlineSetup';
import OnlineLobby from './components/OnlineLobby';
import OnlineGame from './components/OnlineGame';
import { mockQuestions } from './mockQuestions';
import { audioSynth } from './audioSynth';

function App() {
  // Screen state: 
  // 'start' | 'local-setup' | 'local-game' | 'local-scoreboard'
  // 'online-home' | 'online-join' | 'online-setup' | 'online-lobby' | 'online-game' | 'online-scoreboard'
  const [screen, setScreen] = useState('start');
  
  // Visual/Audio Settings
  const [crtEnabled, setCrtEnabled] = useState(true); // true = wood table, false = linen canvas
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Common Game Parameters
  const [players, setPlayers] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [hardModeOptions, setHardModeOptions] = useState(true);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [totalRounds, setTotalRounds] = useState(5);
  const [questionsPerRound, setQuestionsPerRound] = useState(3);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Local Scoreboard state
  const [scoreboardPlayers, setScoreboardPlayers] = useState([]);
  const [isFinalScoreboard, setIsFinalScoreboard] = useState(false);
  const [nextRoundNumber, setNextRoundNumber] = useState(1);

  // Online Multiplayer State
  const [onlineRoomCode, setOnlineRoomCode] = useState('');
  const [onlinePlayMode, setOnlinePlayMode] = useState('host_controller');
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [onlineIsHost, setOnlineIsHost] = useState(true);
  const [joinName, setJoinName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Helper to shuffle arrays
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Setup questions for the session with category filtering and difficulty priority
  const selectQuestionsForGame = (diff, categories, countNeeded) => {
    let filtered = mockQuestions.filter(q => 
      q.difficulty === diff && 
      categories.includes(q.category)
    );
    
    let shuffled = shuffleArray(filtered);
    
    if (shuffled.length < countNeeded) {
      const otherDiffsSameCats = mockQuestions.filter(q => 
        q.difficulty !== diff && 
        categories.includes(q.category)
      );
      shuffled = [...shuffled, ...shuffleArray(otherDiffsSameCats)];
    }

    if (shuffled.length > 0) {
      const basePool = [...shuffled];
      while (shuffled.length < countNeeded) {
        shuffled = [...shuffled, ...shuffleArray(basePool)];
      }
    } else {
      let ultimatePool = mockQuestions;
      while (shuffled.length < countNeeded) {
        shuffled = [...shuffled, ...shuffleArray(ultimatePool)];
      }
    }

    return shuffled.slice(0, countNeeded);
  };

  // --- LOCAL GAME HANDLERS ---
  const handleStartLocalGame = (config) => {
    setPlayers(config.players);
    setDifficulty(config.difficulty);
    setHardModeOptions(config.hardModeOptions);
    setTotalRounds(config.rounds);
    setQuestionsPerRound(config.questionsPerRound);
    setSelectedCategories(config.categories);

    // Calculate questions needed: rounds * players * questionsPerRound
    const countNeeded = config.rounds * config.players.length * config.questionsPerRound;
    const selected = selectQuestionsForGame(config.difficulty, config.categories, countNeeded);
    setGameQuestions(selected);

    setScreen('local-game');
  };

  const handleRoundComplete = (updatedPlayers, nextRound) => {
    setScoreboardPlayers(updatedPlayers);
    setIsFinalScoreboard(false);
    setNextRoundNumber(nextRound);
    setScreen('local-scoreboard');
  };

  const handleGameEnd = (finalPlayers) => {
    setScoreboardPlayers(finalPlayers);
    setIsFinalScoreboard(true);
    setScreen('local-scoreboard');
  };

  const handleScoreboardAction = () => {
    if (isFinalScoreboard) {
      setScreen('start');
    } else {
      setPlayers([...scoreboardPlayers]);
      setScreen('local-game');
    }
  };

  // --- ONLINE GAME HANDLERS ---
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateOnlineRoom = (config) => {
    const code = generateRoomCode();
    setOnlineRoomCode(code);
    setOnlinePlayMode(config.playMode);
    setDifficulty(config.difficulty);
    setHardModeOptions(config.hardModeOptions);
    setTotalRounds(config.rounds);
    setQuestionsPerRound(config.questionsPerRound);
    setSelectedCategories(config.categories);
    setOnlineIsHost(true);
    
    // Host joins as first player
    setOnlinePlayers([
      { name: `${config.hostName} 👑`, score: 0, isHost: true }
    ]);

    setScreen('online-lobby');
  };

  const handleJoinOnlineRoomSubmit = (e) => {
    e.preventDefault();
    if (!joinName.trim() || !joinCode.trim()) return;
    if (soundEnabled) audioSynth.playCoin();

    const code = joinCode.trim().toUpperCase();
    setOnlineRoomCode(code);
    setOnlineIsHost(false);
    
    // Simulate room parameters for client
    setOnlinePlayMode(Math.random() > 0.5 ? 'host_controller' : 'shared_lobby');
    setDifficulty('medium');
    setHardModeOptions(true);
    setTotalRounds(5);
    setQuestionsPerRound(3);
    setSelectedCategories(["Geografía", "Historia", "Ciencia", "Deportes"]);

    // Set initial players list (User + Mock Host + Mock players)
    setOnlinePlayers([
      { name: `${joinName.trim()} ♟️`, score: 0, isHost: false },
      { name: "Host Creador 👑", score: 0, isHost: true },
      { name: "Carlos 🪵", score: 0, isHost: false }
    ]);

    setScreen('online-lobby');
  };

  const handleSimulateJoin = (playerName) => {
    setOnlinePlayers(prev => [...prev, { name: playerName, score: 0, isHost: false }]);
  };

  const handleStartOnlineGame = () => {
    // In online mode, questions are shared by everyone at once.
    // So total questions needed is simply: rounds * questionsPerRound
    const countNeeded = totalRounds * questionsPerRound;
    const selected = selectQuestionsForGame(difficulty, selectedCategories, countNeeded);
    setGameQuestions(selected);

    setScreen('online-game');
  };

  const handleOnlineGameEnd = (finalPlayers) => {
    setScoreboardPlayers(finalPlayers);
    setIsFinalScoreboard(true);
    setScreen('online-scoreboard');
  };

  return (
    <div className={`crt-container ${!crtEnabled ? 'table-linen-mode' : ''}`}>
      {/* Floating Settings Toggle */}
      <CrtToggle 
        crtEnabled={crtEnabled} 
        setCrtEnabled={setCrtEnabled} 
        soundEnabled={soundEnabled} 
        setSoundEnabled={setSoundEnabled} 
      />

      <div className="app-content">
        <h1 className="arcade-title">🎲 MESA DE TRIVIA 🎲</h1>

        {/* 1. START SCREEN */}
        {screen === 'start' && (
          <StartScreen 
            onSelectLocal={() => setScreen('local-setup')} 
            onSelectOnline={() => setScreen('online-home')}
            soundEnabled={soundEnabled}
          />
        )}

        {/* 2. LOCAL SETUP */}
        {screen === 'local-setup' && (
          <LocalSetup 
            onStartGame={handleStartLocalGame} 
            onBack={() => setScreen('start')}
            soundEnabled={soundEnabled}
          />
        )}

        {/* 3. LOCAL GAME LOOP */}
        {screen === 'local-game' && (
          <LocalGame 
            players={players}
            difficulty={difficulty}
            hardModeOptions={hardModeOptions}
            questions={gameQuestions}
            totalRounds={totalRounds}
            questionsPerRound={questionsPerRound}
            soundEnabled={soundEnabled}
            onGameEnd={handleGameEnd}
            onRoundComplete={handleRoundComplete}
          />
        )}

        {/* 4. LOCAL SCOREBOARD */}
        {screen === 'local-scoreboard' && (
          <Scoreboard 
            players={scoreboardPlayers}
            isFinal={isFinalScoreboard}
            currentRound={nextRoundNumber}
            totalRounds={totalRounds}
            onAction={handleScoreboardAction}
            soundEnabled={soundEnabled}
          />
        )}

        {/* 5. ONLINE HOME (Selection: Create vs Join) */}
        {screen === 'online-home' && (
          <div className="arcade-panel flex-column flex-center gap-3" style={{ minHeight: '350px' }}>
            <h2 className="subtitle-arcade">🌐 SALAS MULTIJUGADOR</h2>
            
            <div className="flex-column gap-2" style={{ width: '100%', maxWidth: '400px' }}>
              <button 
                className="arcade-btn btn-green"
                style={{ width: '100%' }}
                onClick={() => {
                  if (soundEnabled) audioSynth.playCoin();
                  setScreen('online-setup');
                }}
              >
                📦 CREAR NUEVA MESA
              </button>
              
              <button 
                className="arcade-btn btn-yellow"
                style={{ width: '100%' }}
                onClick={() => {
                  if (soundEnabled) audioSynth.playCoin();
                  setJoinName('');
                  setJoinCode('');
                  setScreen('online-join');
                }}
              >
                🔗 UNIRSE A UNA MESA
              </button>

              <button 
                className="arcade-btn btn-red"
                style={{ width: '100%', fontSize: '0.9rem' }}
                onClick={() => {
                  if (soundEnabled) audioSynth.playCoin();
                  setScreen('start');
                }}
              >
                VOLVER
              </button>
            </div>
          </div>
        )}

        {/* 6. ONLINE JOIN ROOM FORM */}
        {screen === 'online-join' && (
          <div className="arcade-panel">
            <h2 className="subtitle-arcade text-center">🔗 UNIRSE A UNA MESA</h2>
            <form onSubmit={handleJoinOnlineRoomSubmit} className="flex-column gap-3">
              <div>
                <label className="arcade-label">TU NOMBRE</label>
                <input
                  type="text"
                  maxLength={15}
                  required
                  placeholder="Escribe tu nombre..."
                  className="arcade-input"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                />
              </div>

              <div>
                <label className="arcade-label">CÓDIGO DE LA MESA (4 LETRAS)</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="ABCD"
                  className="arcade-input"
                  style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  className="arcade-btn btn-red"
                  style={{ flex: 1, fontSize: '0.9rem' }}
                  onClick={() => {
                    if (soundEnabled) audioSynth.playCoin();
                    setScreen('online-home');
                  }}
                >
                  VOLVER
                </button>
                <button 
                  type="submit" 
                  className="arcade-btn btn-green"
                  style={{ flex: 2 }}
                >
                  🎲 INGRESAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 7. ONLINE SETUP (Creating a room) */}
        {screen === 'online-setup' && (
          <OnlineSetup 
            onCreateRoom={handleCreateOnlineRoom} 
            onBack={() => setScreen('online-home')}
            soundEnabled={soundEnabled}
          />
        )}

        {/* 8. ONLINE LOBBY (Waiting for players) */}
        {screen === 'online-lobby' && (
          <OnlineLobby 
            roomCode={onlineRoomCode}
            playMode={onlinePlayMode}
            players={onlinePlayers}
            isHost={onlineIsHost}
            soundEnabled={soundEnabled}
            onStartGame={handleStartOnlineGame}
            onSimulateJoin={handleSimulateJoin}
            onLeave={() => setScreen('online-home')}
          />
        )}

        {/* 9. ONLINE GAME LOOP */}
        {screen === 'online-game' && (
          <OnlineGame 
            players={onlinePlayers}
            difficulty={difficulty}
            hardModeOptions={hardModeOptions}
            questions={gameQuestions}
            totalRounds={totalRounds}
            questionsPerRound={questionsPerRound}
            playMode={onlinePlayMode}
            isHost={onlineIsHost}
            soundEnabled={soundEnabled}
            onGameEnd={handleOnlineGameEnd}
          />
        )}

        {/* 10. ONLINE SCOREBOARD (Victory Podium) */}
        {screen === 'online-scoreboard' && (
          <Scoreboard 
            players={scoreboardPlayers}
            isFinal={true}
            currentRound={totalRounds}
            totalRounds={totalRounds}
            onAction={() => setScreen('start')}
            soundEnabled={soundEnabled}
          />
        )}

      </div>
    </div>
  );
}

export default App;
