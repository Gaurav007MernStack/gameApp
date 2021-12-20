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

  useEffect(() => {
    const ab = squares.filter((item) => item != null);
    // console.log("time: ", time);
    if (time === 0 && !winner) {
      aiTurn();
    } else {
      if (ab.length === 0 && time > 6000) {
        reset();
        alert("Please click Start again");
      }
    }
  }, [time]);
  const [squares, setSquares] = useState(defaultSquares());

  const [winner, setWinner] = useState(null);

  useEffect(() => {
    console.log('winner: ', winner);
    if (winner) {
      
      reset();

      setSquares(defaultSquares);
      alert("Start again");
    }
  }, [winner]);
  
  const linesThatAre = (a, b, c) => {
    return lines.filter((squareIndexes) => {
      const squareValues = squareIndexes.map((index) => squares[index]);
      return (
        JSON.stringify([a, b, c].sort()) ===
        JSON.stringify(squareValues.sort())
      );
    });
  };
  const aiTurn = () => {
    const ab = squares.filter((item) => item != null);
    // console.log("ab: ", ab);

    if (ab.length !== 0 && time <= 0) {
      console.log("inside");
      let isComputerTurn = time <= 0;
    

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
        let newSquares = squares;
        newSquares[index] = "o";

        setSquares([...newSquares]);
        start();
        // if (time == 0) {
        //   setTimeout(() => {
        //     start();
        //   }, 1000);
        // }
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
    }
  };

  function handleSquareClick(index) {
    const isPlayerTurn = time > 0;
    // console.log('isPlayerTurn: ', isPlayerTurn);
    if (isPlayerTurn) {
      let newSquares = squares;
      newSquares[index] = "x";

      setSquares([...newSquares]);
      if (time > 0) {
        reset();
      }
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
