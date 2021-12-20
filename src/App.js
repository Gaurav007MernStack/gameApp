import React, { useState, useEffect } from "react";
import "./App.css";
import { Card, CardBody, Container, Button, Col, Row } from "reactstrap";

import Icons from "./Icons";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [isCross, setIsCross] = useState(false);
  const [winMessage, setWinMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState("cross");
  const [selectedMatrix, setSelectedMatrix] = useState(3);
  const [fillArray, setFillArray] = useState(16);

  var aiPlayer = selectedValue === "cross" ? "zero" : "cross";
  var huPlayer = selectedValue;

  var origBoard;
  let cardArray = new Array(9).fill("empty");
  const [cells, setCells] = useState(document.querySelectorAll(".card"));
  console.log("cells: ", cells);

  useEffect(() => {
    startGame();
  }, []);

  const [winCombos, setWinCombos] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

  const startGame = () => {
    // document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(cardArray.keys());
  };

  const turnClick = (square) => {
    console.log('square: ', square);
    //square = index
    console.log("calling turn click");
    if (cardArray[square] == "empty") {
      
      console.log("yes");
      turn(square, huPlayer);
      // if (!checkWin(origBoard, huPlayer) && !checkTie())
      // turn(bestSpot(), aiPlayer);
    }
  };

  function turn(squareId, player) {
    console.log('player: ', player);
    cardArray[squareId] = player;
    
    document.getElementById(squareId).innerText = player;
    console.log('cardArray: ', cardArray);
    
    setIsCross(!isCross);
   
    // let gameWon = checkWin(origBoard, player);
    // if (gameWon) gameOver(gameWon);
  }

  function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
      if (win.every((elem) => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }
    return gameWon;
  }

  function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
      document.getElementById(index).style.backgroundColor =
        gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
  }

  function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
  }

  function emptySquares() {
    return origBoard.filter((s) => typeof s == "number");
  }

  function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
  }

  function checkTie() {
    if (emptySquares().length == 0) {
      for (var i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = "green";
        cells[i].removeEventListener("click", turnClick, false);
      }
      declareWinner("Tie Game!");
      return true;
    }
    return false;
  }

  function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, huPlayer)) {
      return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      var move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == aiPlayer) {
        var result = minimax(newBoard, huPlayer);
        move.score = result.score;
      } else {
        var result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  return (
    <>
      <Container className="p-5 first1">
        {/* <ToastContainer position="bottom-center" color="black" /> */}
        <Row>
          <Col md={6} className="offset-md-3">
            {winMessage !== "" ? (
              <div className="mb-2 mt-2">
                <h1 className=" text-uppercase text-center text-info ">
                  {winMessage}
                </h1>
                <Button
                  color="success text-uppercase"
                  block
                  // onClick={reloadGame}
                >
                  Reload game
                </Button>
              </div>
            ) : (
              <h1 className=" text-warning text-uppercase text-center ">
                {isCross ? "Circle" : "Cross"} turn
              </h1>
            )}
            <div className="grid">
              {cardArray.map((value, indexNumber) => {
                return (
                  <Card
                    key={indexNumber}
                    id={indexNumber}
                    onClick={() => {
                      // changeCardArray(indexNumber);
                      // checkWinner();
                      turnClick(indexNumber);
                    }}
                  >
                    <CardBody className="box">
                      {/* <Icons name={value} /> */}
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
