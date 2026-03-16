import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

/**
 * Determine whether a board has a winner.
 * @param {(null|'X'|'O')[]} squares
 * @returns {{winner: null|'X'|'O', line: number[]|null}}
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * @param {(null|'X'|'O')[]} squares
 * @returns {boolean}
 */
function isDraw(squares) {
  return squares.every((v) => v !== null);
}

/**
 * @param {object} props
 * @param {null|'X'|'O'} props.value
 * @param {boolean} props.isWinning
 * @param {() => void} props.onClick
 * @param {boolean} props.disabled
 * @param {number} props.index
 */
function Square({ value, isWinning, onClick, disabled, index }) {
  return (
    <button
      type="button"
      className={`ttt-square ${isWinning ? "ttt-square--winning" : ""} ${
        value ? `ttt-square--${value}` : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Square ${index + 1}${value ? `, ${value}` : ""}`}
    >
      <span className="ttt-square__value" aria-hidden="true">
        {value}
      </span>
    </button>
  );
}

/**
 * @param {object} props
 * @param {(null|'X'|'O')[]} props.squares
 * @param {(i:number)=>void} props.onPlay
 * @param {number[]|null} props.winningLine
 * @param {boolean} props.locked
 */
function Board({ squares, onPlay, winningLine, locked }) {
  const winningSet = useMemo(() => new Set(winningLine ?? []), [winningLine]);

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          index={idx}
          isWinning={winningSet.has(idx)}
          disabled={locked || value !== null}
          onClick={() => onPlay(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Theme: keep the existing light/dark mechanism from the template, but style the game UI. */
  const [theme, setTheme] = useState("light");

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const draw = !winner && isDraw(squares);
  const gameOver = Boolean(winner) || draw;

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handlePlay = (index) => {
    if (gameOver) return;
    if (squares[index] !== null) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((v) => !v);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const status = winner
    ? `Winner: ${winner}`
    : draw
    ? "Draw game"
    : `Turn: ${xIsNext ? "X" : "O"}`;

  const statusHint = winner
    ? "Game over. Press Reset to play again."
    : draw
    ? "No more moves. Press Reset to play again."
    : "Select an empty square to place your mark.";

  return (
    <div className="App">
      <div className="ttt-shell">
        <header className="ttt-header">
          <div className="ttt-brand">
            <div className="ttt-badge" aria-hidden="true">
              TTT
            </div>
            <div className="ttt-brand__text">
              <h1 className="ttt-title">Tic Tac Toe</h1>
              <p className="ttt-subtitle">Local 2-player • Retro arcade vibe</p>
            </div>
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            type="button"
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </header>

        <main className="ttt-main">
          <section className="ttt-card" aria-label="Game">
            <div className="ttt-status">
              <div className="ttt-status__label" aria-live="polite">
                {status}
              </div>
              <div className="ttt-status__hint">{statusHint}</div>
            </div>

            <Board
              squares={squares}
              onPlay={handlePlay}
              winningLine={winningLine}
              locked={gameOver}
            />

            <div className="ttt-actions">
              <button
                type="button"
                className="ttt-btn ttt-btn--primary"
                onClick={resetGame}
              >
                Reset
              </button>
              <div className="ttt-legend" aria-label="Legend">
                <span className="ttt-chip ttt-chip--x">X</span>
                <span className="ttt-chip ttt-chip--o">O</span>
              </div>
            </div>
          </section>

          <footer className="ttt-footer">
            <p className="ttt-footer__text">
              Tip: First player is <strong>X</strong>. Win by getting three in a
              row.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
