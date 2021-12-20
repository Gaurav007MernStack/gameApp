import "./App.css";
import Board from "./Board";
import Square from "./Square";
import { useState, useEffect } from "react";
import { useStopwatch } from "react-use-stopwatch";

const defaultSquares = () => new Array(9).fill(null);

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

function App() {
  const [{ time }, start, stop, reset] = useStopwatch();
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (time > 60000 && !winner) {
      reset();
      setSquares(defaultSquares);
      setWinner(null);
      alert("Start Again");
    }
  }, [time]);

  useEffect(() => {
    console.log("winner: ", winner);
    if (winner) {
      // setSquares(defaultSquares);
      // setWinner(null);
      // alert("Start again");
      setTimeout(()=>{
        if (window.confirm(`Want to Play Again!!, ${winner} won`)) {
          window.location.reload();
          // setWinner(null)
        } else {
          window.location.reload();
        }
      },1000)
    }
  }, [winner]);

  useEffect(() => {
    
    let isComputerTurn;
    if (!winner && squares.filter((square) => square !== null)) {
      isComputerTurn =
        squares.filter((square) => square !== null).length % 2 === 1;
    }

    const linesThatAre = (a, b, c) => {
      return lines.filter((squareIndexes) => {
        const squareValues = squareIndexes.map((index) => squares[index]);
        return (
          JSON.stringify([a, b, c].sort()) ===
          JSON.stringify(squareValues.sort())
        );
      });
    };
    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val !== null);
    const playerWon = linesThatAre("x", "x", "x").length > 0;
    const computerWon = linesThatAre("o", "o", "o").length > 0;
    if (playerWon) {
      setWinner("x");
    }
    if (computerWon) {
      setWinner("o");
    }
    const putComputerAt = (index) => {
      if((squares.filter((square) => square === null).length===0 && !winner)){
        alert('`Match Draw!!, Restart again')
        window.location.reload();
      }
      let newSquares = squares;
      newSquares[index] = "o";
      setSquares([...newSquares]);
    };

    if (isComputerTurn) {
      const winingLines = linesThatAre("o", "o", null);
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(winIndex);
        return;
      }

      const linesToBlock = linesThatAre("x", "x", null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(blockIndex);
        return;
      }

      const linesToContinue = linesThatAre("o", null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(
          linesToContinue[0].filter((index) => squares[index] === null)[0]
        );
        return;
      }

      const randomIndex =
        emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
      putComputerAt(randomIndex);
    }
  }, [squares]);

  function handleSquareClick(index) {
    if((squares.filter((square) => square === null).length===0 && !winner)){
      alert('`Match Draw!!, Restart again handle')
      window.location.reload();
    }
    if (!winner) {
      start();
      console.log("in");
    }
    let isPlayerTurn;
    if (!winner && squares.filter((square) => square !== null)) {
      isPlayerTurn =
        squares.filter((square) => square !== null).length % 2 === 0;
    }

    if (isPlayerTurn) {
      let newSquares = squares;
      newSquares[index] = "x";
      setSquares([...newSquares]);
    }
  }

  return (
    <main>
      <div>
        // Stopwatch Outputs
        <strong>{time}</strong>
        {/* <strong>{format}</strong> */}
        // Stopwatch Inputs
        <button
          onClick={() => {
            start();
            setWinner(null);
          }}
        >
          Start
        </button>
        {/* <button onClick={() => stop()}>Stop</button> */}
      </div>
      <Board>
        {squares.map((square, index) => (
          <Square
            x={square === "x" ? 1 : 0}
            o={square === "o" ? 1 : 0}
            onClick={() => handleSquareClick(index)}
          />
        ))}
      </Board>
      {!!winner && winner === "x" && (
        <div className="result green">You WON!</div>
      )}
      {!!winner && winner === "o" && (
        <div className="result red">You LOST!</div>
      )}
    </main>
  );
}

export default App;
