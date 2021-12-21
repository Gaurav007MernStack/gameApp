import "./App.css";
import Board from "./Board";
import Square from "./Square";
import { useState, useEffect } from "react";
import { useStopwatch } from "react-use-stopwatch";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

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
  const [humanInput, setHumanInput] = useState();

  useEffect(() => {
    if (time > 30000 && !winner) {
      setSquares(defaultSquares);
      setWinner(null);
      reset();
      alert("Match timedout , Please start again.");
      window.location.reload();
    }
  }, [time]);

  useEffect(() => {
    console.log("winner: ", winner);
    if (winner == "x" || winner == "o") {
      setTimeout(() => {
        if (
          window.confirm(
            `Hurray!! ${
              winner === humanInput ? "You won" : "You lost"
            }, wanna to play again!, `
          )
        ) {
          setWinner("null");
          window.location.reload();
        } else {
          window.location.reload();
        }
      }, 100);
    }
  }, [winner]);

  useEffect(() => {
    let isComputerTurn;
    // if (!winner && squares.filter((square) => square !== null)) {
    isComputerTurn =
      squares.filter((square) => square !== null).length % 2 === 1;
    // }

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
    const playerWon =
      linesThatAre(humanInput, humanInput, humanInput).length > 0;
    const computerWon =
      linesThatAre(
        humanInput === "x" ? "o" : "x",
        humanInput === "x" ? "o" : "x",
        humanInput === "x" ? "o" : "x"
      ).length > 0;
    if (squares.filter((square) => square === null).length === 0 && !winner) {
      alert("`Match Tied!!, Restart again");
      setWinner("null");
      window.location.reload();
    }
    if (playerWon) {
      setWinner(humanInput);
    }
    if (computerWon) {
      setWinner(humanInput === "x" ? "o" : "x");
    }
    const putComputerAt = (index) => {
      if (squares[index] == humanInput) {
        return;
      }
      if (squares[index] == (humanInput === "x" ? "o" : "x")) {
        return alert("Already filled.");
      }
      let newSquares = squares;
      newSquares[index] = humanInput === "x" ? "o" : "x";
      setSquares([...newSquares]);
    };

    if (isComputerTurn) {
      reset();
      const winingLines = linesThatAre(
        humanInput === "x" ? "o" : "x",
        humanInput === "x" ? "o" : "x",
        null
      );
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].filter(
          (index) => squares[index] === null
        )[0];

        putComputerAt(winIndex);
        return;
      }

      const linesToBlock = linesThatAre(humanInput, humanInput, null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(blockIndex);
        return;
      }

      const linesToContinue = linesThatAre(
        humanInput === "x" ? "o" : "x",
        null,
        null
      );
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
    if (!humanInput && humanInput !== "") {
      return alert("Please choose input first!");
    }
    if (squares.filter((square) => square === null).length === 0 && !winner) {
      alert("`Match Draw!, Restart again");
      setWinner("null");
      window.location.reload();
    }
    console.log("!winner: ", !winner);

    let isPlayerTurn;
    console.log(
      "squares.filter((square) => square !== null): ",
      squares.filter((square) => square !== null).length == 0
    );
    // if (!winner && squares.filter((square) => square !== null)) {

    isPlayerTurn = squares.filter((square) => square !== null).length % 2 === 0;
    // }

    if (isPlayerTurn) {
      console.log("squares[index]: ", squares[index]);
      if (squares[index] == (humanInput === "x" ? "o" : "x")) {
        return alert("You can't click on it.");
      }
      if (squares[index] == humanInput) {
        return alert("Already filled.");
      }
      if (!winner && squares.filter((square) => square !== null).length == 0) {
        console.log("ddddd");
        start();
        start();
      }
      console.log("ss");
      // start();
      let newSquares = squares;
      newSquares[index] = humanInput;
      setSquares([...newSquares]);
    }
  }

  return (
    <div className="col-md-12 col-sm-12">
      <div
        className="text-uppercase p-2 text-center"
        style={{ backgroundColor: "white", color: "tomato" }}
      >
        <h1>TIC TAC TOE</h1>
      </div>  
      <main>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {humanInput
              ? `Chosen input ${humanInput === "o" ? "O" : "X"}`
              : "Choose input"}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li
              className="dropdown-item text-center border"
              style={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => setHumanInput("x")}
            >
              X
            </li>
            <li
              className="dropdown-item text-center border"
              style={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => setHumanInput("o")}
            >
              O
            </li>
          </ul>
        </div>

        {humanInput && (
          <>
            {" "}
            <div className="text-white">
              Time : {"  "}
              <strong>{Math.floor(time / 1000)}</strong>
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
          </>
        )}

        <div
          className={`${
            winner && winner === humanInput
              ? "result green"
              : winner && winner !== "null" && "result red"
          }`}
        >
          {winner && winner !== "" && winner === humanInput ? (
            <span className="text-uppercase text-white bold">You won</span>
          ) : (
            winner &&
            winner !== "null" && (
              <span className="text-uppercase text-white bold">You lost</span>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
