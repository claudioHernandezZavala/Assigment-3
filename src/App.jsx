import { useState } from "react";
import winGif from "./assets/winner.gif";
import tsk from "./assets/draw.gif";
function Square({ value, onClick, highlight }) {
  const className = highlight ? "square highlight" : "square"; //improvement #4
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i); // Improvement #5
  }

  const result = calculateWinner(squares); // Improvement #4
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];

  const isDraw = !winner && squares.every((s) => s !== null); // Improvement #4

  let status = "";
  if (winner) status = `Winner: ${winner}`;
  else if (isDraw) status = "Draw: No one wins.";
  else status = `Next player: ${xIsNext ? "X" : "O"}`;

  const boardRows = []; // Improvement #2 using two loops
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;
      squaresInRow.push(
        <Square
          key={i}
          value={squares[i]}
          onClick={() => handleClick(i)}
          highlight={winningLine.includes(i)} // Improvement #4
        />,
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>,
    );
  }

  return (
    <>
      <div className="boardContainer">
        <div className="status">{status}</div>
        {boardRows}
      </div>

      {winner && <img src={winGif} alt="Winner!" />}
      {isDraw && <img src={tsk} alt="No winner!" />}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), moveIndex: null },
  ]);
  // Improvement #5
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true); // Improvement #3

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, moveIndex) {
    const nextHistory = history
      .slice(0, currentMove + 1)
      .concat([{ squares: nextSquares, moveIndex }]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((step, move) => {
    let locationText = "";
    if (move > 0) {
      //immprovement #5
      const row = Math.floor(step.moveIndex / 3) + 1;
      const col = (step.moveIndex % 3) + 1;
      locationText = ` (${row}, ${col})`;
    }

    //improvement #1 the move i am in
    if (move === currentMove) {
      return (
        <li key={move}>
          You are at move #{move}
          {locationText}
        </li>
      );
    }

    const description =
      move === 0 ? "Go to game start" : `Go to move #${move}${locationText}`;

    return (
      <li key={move}>
        <button className="jumpButton" onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  //improvement #3
  const displayedMoves = sortAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <button onClick={() => setSortAscending(!sortAscending)}>
          {sortAscending ? "Sort descending" : "Sort ascending"}
        </button>
        <ol>{displayedMoves}</ol>
      </div>
    </div>
  );
}

// Improvement #4
function calculateWinner(squares) {
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
