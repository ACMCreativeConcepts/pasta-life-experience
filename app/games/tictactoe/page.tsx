'use client';

import { useState, useEffect } from 'react';

type Player = 'X' | 'O' | null;
type GameMode = 'menu' | 'aiCharSelect' | 'pvpCharSelect1' | 'pvpCharSelect2' | 'pvp' | 'pva';

function calculateWinner(board: Player[]): Player {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function getAIMove(board: Player[]): number {
  // Check if AI can win
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = 'X';
      if (calculateWinner(testBoard) === 'X') return i;
    }
  }

  // Check if need to block player
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = 'O';
      if (calculateWinner(testBoard) === 'O') return i;
    }
  }

  // Take center if available
  if (board[4] === null) return 4;

  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((i) => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Take any available
  const available = board.map((cell, i) => (cell === null ? i : null)).filter((i) => i !== null) as number[];
  return available[Math.floor(Math.random() * available.length)];
}

function CharSelectScreen({ playerNum, onSelect }: { playerNum: number; onSelect: (char: 'bowtie' | 'ravioli') => void }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 100%)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
            fontWeight: 800,
            color: '#f5f5f5',
            marginBottom: '12px',
            fontFamily: 'var(--font-oswald)',
            letterSpacing: '-0.02em',
          }}
        >
          Player {playerNum}, pick your pasta!
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#f5f5f5',
            opacity: 0.6,
            marginBottom: '40px',
          }}
        >
          {playerNum === 1 ? 'Ravioli Pasta goes first' : 'Pick the other one'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={() => onSelect('bowtie')}
            style={{
              padding: '24px',
              fontSize: '18px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #e63030, #ff6b1a)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-oswald)',
              letterSpacing: '0.02em',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(230, 48, 48, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <img
              src="/images/game-assets/bowtie-tic-tac-toe-pop-art.png"
              alt="Bowtie"
              style={{ width: '50px', height: '50px' }}
            />
            <span>BOWTIE PASTA</span>
          </button>

          <button
            onClick={() => onSelect('ravioli')}
            style={{
              padding: '24px',
              fontSize: '18px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ffd700, #ff6b1a)',
              color: '#0d0d0d',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-oswald)',
              letterSpacing: '0.02em',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <img
              src="/images/game-assets/raviolli-tic-tac-toe-pop-art.png"
              alt="Ravioli"
              style={{ width: '50px', height: '50px' }}
            />
            <span>RAVIOLI PASTA</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function TicTacToePage() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [userChar, setUserChar] = useState<'bowtie' | 'ravioli' | null>(null);
  const [player1Char, setPlayer1Char] = useState<'bowtie' | 'ravioli' | null>(null);
  const [player2Char, setPlayer2Char] = useState<'bowtie' | 'ravioli' | null>(null);
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(false); // O goes first
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Derived state
  const winner = calculateWinner(board);
  const isBoardFull = board.every((cell) => cell !== null);
  const isDraw = !winner && isBoardFull;
  const userPlaysX = userChar === 'bowtie'; // Bowtie is X, Ravioli is O

  // AI move
  useEffect(() => {
    if (gameMode === 'pva' && !gameOver && !isDraw && !winner) {
      const aiShouldPlay = userPlaysX ? !isXNext : isXNext;
      if (aiShouldPlay) {
        const timer = setTimeout(() => {
          const aiMoveIndex = getAIMove(board);
          const newBoard = [...board];
          newBoard[aiMoveIndex] = userPlaysX ? 'O' : 'X';
          setBoard(newBoard);
          setIsXNext(!isXNext);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [board, isXNext, gameMode, gameOver, isDraw, winner, userPlaysX]);

  // Check for game end
  useEffect(() => {
    if (winner || isDraw) {
      setGameOver(true);
      if (winner === 'X') {
        setScores((s) => ({ ...s, X: s.X + 1 }));
      } else if (winner === 'O') {
        setScores((s) => ({ ...s, O: s.O + 1 }));
      } else {
        setScores((s) => ({ ...s, draws: s.draws + 1 }));
      }
    }
  }, [winner, isDraw]);

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver) return;
    if (gameMode === 'pva' && (userPlaysX ? !isXNext : isXNext)) return; // AI is playing

    const newBoard = [...board];
    if (gameMode === 'pva') {
      // AI mode: user plays piece based on their character choice
      newBoard[index] = userPlaysX ? 'X' : 'O';
    } else {
      // PvP mode: alternate based on whose turn it is
      newBoard[index] = isXNext ? 'X' : 'O';
    }
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(false); // O always goes first
    setGameOver(false);
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
    setUserChar(null);
    setPlayer1Char(null);
    setPlayer2Char(null);
    setBoard(Array(9).fill(null));
    setIsXNext(false);
    setScores({ X: 0, O: 0, draws: 0 });
    setGameOver(false);
  };

  // ── Character Selection Screens ────────────────────────────────────────
  if (gameMode === 'aiCharSelect') {
    return (
      <CharSelectScreen
        playerNum={1}
        onSelect={(char) => {
          setUserChar(char);
          setGameMode('pva');
        }}
      />
    );
  }

  if (gameMode === 'pvpCharSelect1') {
    return (
      <CharSelectScreen
        playerNum={1}
        onSelect={(char) => {
          setPlayer1Char(char);
          // Auto-assign opposite character to Player 2
          setPlayer2Char(char === 'bowtie' ? 'ravioli' : 'bowtie');
          setGameMode('pvp');
        }}
      />
    );
  }

  // ── Main Menu ──────────────────────────────────────────────────────────────
  if (gameMode === 'menu') {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 100%)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '440px' }}>
          <img
            src="/images/game-assets/tictac-pasta-logo.png"
            alt="Tic-Tac-Pasta"
            style={{
              width: '100%',
              maxWidth: '380px',
              height: 'auto',
              margin: '0 auto 16px',
              display: 'block',
              filter: 'drop-shadow(0 6px 16px rgba(255, 215, 0, 0.35))',
            }}
          />
          <p
            style={{
              fontSize: '16px',
              color: '#f5f5f5',
              opacity: 0.7,
              marginBottom: '40px',
              lineHeight: 1.5,
              fontFamily: 'var(--font-inter)',
            }}
          >
            Bowtie vs. Ravioli. Who will win?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setGameMode('aiCharSelect')}
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #e63030, #ff6b1a)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-oswald)',
                letterSpacing: '0.02em',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              👤 Play vs. AI
            </button>
            <button
              onClick={() => setGameMode('pvpCharSelect1')}
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffd700, #ff6b1a)',
                color: '#0d0d0d',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-oswald)',
                letterSpacing: '0.02em',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              👥 Play with Friend
            </button>
          </div>

          <a
            href="/#games"
            style={{
              display: 'inline-block',
              marginTop: '40px',
              color: '#ff6b1a',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            ← Back to Games
          </a>
        </div>
      </main>
    );
  }

  // ── Game Screen ────────────────────────────────────────────────────────────
  // Determine who is X and O for scoring
  const determinePlayerLabels = () => {
    if (gameMode === 'pva') {
      // In AI mode: X = Bowtie, O = Ravioli (always)
      // If user picked Bowtie: user is X, AI is O
      // If user picked Ravioli: user is O, AI is X
      if (userChar === 'bowtie') {
        return {
          oLabel: 'AI',
          oName: 'RAVIOLI',
          xLabel: 'YOU',
          xName: 'BOWTIE',
        };
      } else {
        return {
          oLabel: 'YOU',
          oName: 'RAVIOLI',
          xLabel: 'AI',
          xName: 'BOWTIE',
        };
      }
    } else {
      // PvP mode: O = Ravioli (always), X = Bowtie (always)
      return {
        oLabel: player1Char === 'ravioli' ? 'PLAYER 1' : 'PLAYER 2',
        oName: 'RAVIOLI',
        xLabel: player1Char === 'bowtie' ? 'PLAYER 1' : 'PLAYER 2',
        xName: 'BOWTIE',
      };
    }
  };

  const labels = determinePlayerLabels();
  const currentPlayer = gameMode === 'pva' 
    ? (userPlaysX ? (isXNext ? 'You' : 'AI') : (isXNext ? 'AI' : 'You'))
    : (isXNext ? (player1Char === 'bowtie' ? 'Player 1' : 'Player 2') : (player1Char === 'ravioli' ? 'Player 1' : 'Player 2'));

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 100%)',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(230, 48, 48, 0.1) 0%, transparent 50%)',
        fontFamily: 'var(--font-oswald)',
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
              fontWeight: 800,
              color: '#f5f5f5',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            {gameMode === 'pva' ? '👤 YOU vs AI' : '👥 Player vs. Player'}
          </h1>
          <p style={{ color: '#f5f5f5', opacity: 0.6, fontSize: '14px' }}>
            {winner ? (
              <>
                <span style={{ fontSize: '24px' }}>
                  {(gameMode === 'pva' && userPlaysX ? winner === 'X' : winner === 'O') ? '🎉' : '🎊'}
                </span>
                <br />
                {gameMode === 'pva' 
                  ? (userPlaysX ? (winner === 'X' ? 'You Win!' : 'AI Wins!') : (winner === 'O' ? 'You Win!' : 'AI Wins!'))
                  : (winner === 'O' ? (player1Char === 'ravioli' ? 'Player 1 Wins!' : 'Player 2 Wins!') : (player1Char === 'bowtie' ? 'Player 1 Wins!' : 'Player 2 Wins!'))
                }
              </>
            ) : isDraw ? (
              <>
                <span style={{ fontSize: '24px' }}>🤝</span>
                <br />
                It's a Draw!
              </>
            ) : (
              <>{currentPlayer}'s Turn</>
            )}
          </p>
        </div>

        {/* Scoreboard */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 107, 26, 0.2))',
              border: '2px solid #ffd700',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.2), inset 0 1px 3px rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '10px', color: '#ffd700', fontWeight: 600, letterSpacing: '0.06em' }}>
                {labels.oLabel}
              </div>
              <div style={{ fontSize: '10px', color: '#f5f5f5', fontWeight: 600, letterSpacing: '0.06em', marginTop: '2px' }}>
                {labels.oName}
              </div>
              <div style={{ fontSize: '32px', color: '#ffd700', fontWeight: 800, marginTop: '4px' }}>
                {scores.O}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '50%',
                zIndex: 0,
              }}
            />
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(230, 48, 48, 0.3), rgba(255, 107, 26, 0.2))',
              border: '2px solid #e63030',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 20px rgba(230, 48, 48, 0.3), inset 0 1px 3px rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '11px', color: '#e63030', fontWeight: 600, letterSpacing: '0.08em' }}>
                DRAWS
              </div>
              <div style={{ fontSize: '32px', color: '#e63030', fontWeight: 800, marginTop: '4px' }}>
                {scores.draws}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '-10px',
                left: '-10px',
                width: '40px',
                height: '40px',
                background: 'rgba(230, 48, 48, 0.3)',
                borderRadius: '50%',
                zIndex: 0,
              }}
            />
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(86, 180, 70, 0.2))',
              border: '2px solid #22c55e',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.3), inset 0 1px 3px rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600, letterSpacing: '0.06em' }}>
                {labels.xLabel}
              </div>
              <div style={{ fontSize: '10px', color: '#f5f5f5', fontWeight: 600, letterSpacing: '0.06em', marginTop: '2px' }}>
                {labels.xName}
              </div>
              <div style={{ fontSize: '32px', color: '#22c55e', fontWeight: 800, marginTop: '4px' }}>
                {scores.X}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                width: '40px',
                height: '40px',
                background: 'rgba(34, 197, 94, 0.3)',
                borderRadius: '50%',
                zIndex: 0,
              }}
            />
          </div>
        </div>

        {/* Game Board */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0px',
            marginBottom: '24px',
            background: 'url(/images/game-assets/board-grid.png) center / cover',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '0px',
            borderRadius: '0px',
            border: '4px solid rgba(230, 48, 48, 0.8)',
            boxShadow: '0 12px 32px rgba(230, 48, 48, 0.4), inset 0 1px 3px rgba(255,255,255,0.1)',
            position: 'relative',
            aspectRatio: '1 / 1',
          }}
        >
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              style={{
                aspectRatio: '1 / 1',
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '0px',
                cursor: cell || gameOver || (gameMode === 'pva' && isXNext) ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!cell && !gameOver && !(gameMode === 'pva' && isXNext)) {
                  e.currentTarget.style.background = 'rgba(255, 107, 26, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
              }}
            >
              {cell === 'X' && (
                <img
                  src="/images/game-assets/bowtie-tic-tac-toe-pop-art.png"
                  alt="Bowtie"
                  style={{
                    width: '85%',
                    height: '85%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  }}
                />
              )}
              {cell === 'O' && (
                <img
                  src="/images/game-assets/raviolli-tic-tac-toe-pop-art.png"
                  alt="Ravioli"
                  style={{
                    width: '85%',
                    height: '85%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          {gameOver ? (
            <>
              <button
                onClick={handleRestart}
                style={{
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #e63030, #ff6b1a)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                ↻ Play Again
              </button>
              <button
                onClick={handleBackToMenu}
                style={{
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  background: 'transparent',
                  color: '#ff6b1a',
                  border: '2px solid #ff6b1a',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                ← Change Mode
              </button>
            </>
          ) : (
            <button
              onClick={handleBackToMenu}
              style={{
                padding: '14px',
                fontSize: '15px',
                fontWeight: 700,
                background: 'transparent',
                color: '#ff6b1a',
                border: '2px solid #ff6b1a',
                borderRadius: '8px',
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              ← Back to Menu
            </button>
          )}
        </div>

        {/* Mobile hint */}
        <p
          style={{
            fontSize: '12px',
            color: '#f5f5f5',
            opacity: 0.4,
            textAlign: 'center',
            marginTop: '24px',
          }}
        >
          💡 Works on mobile & tablet. Save to home screen for easy access!
        </p>
      </div>
    </main>
  );
}
