import React, { useState, useEffect } from "react";
import "./App.css";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem("bestScore")) || null
  );
  const [count, setCount] = useState(1);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDice());
    }
    return newDice;
  }

  function generateNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      id: nanoid(),
      isHeld: false,
    };
  }

  function holdDice(id) {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.id === id
          ? {
              ...die,
              isHeld: !die.isHeld,
            }
          : die
      )
    );
  }

  //compare count with bestScore
  function checkScore() {
    if (!bestScore) {
      setBestScore(count);
      localStorage.setItem("bestScore", JSON.stringify(bestScore));
    } else if (count < bestScore) {
      setBestScore(count);
      localStorage.setItem("bestScore", JSON.stringify(bestScore));
    } else {
      return;
    }
  }

  //add count
  function rollDice() {
    if (!tenzies) {
      setDice((prevDice) =>
        prevDice.map((die) => {
          return die.isHeld ? die : generateNewDice();
        })
      );
      setCount((prevCount) => prevCount + 1);
    } else {
      checkScore();
      setTenzies(false);
      setDice(allNewDice());
      setCount(1);
    }
  }

  useEffect(() => {
    //check for tenzies and if all held
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allMatch = dice.every((die) => die.value === firstValue);

    if (allHeld && allMatch) {
      setTenzies(true);
      console.log("You won!");
    } else {
      setTenzies(false);
    }
  }, [dice]);

  const buttonText = tenzies ? "New Game" : "Roll";

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      id={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls
      </p>
      <p className="best-score">Best Score: {bestScore}</p>
      <p className="count">
        {count} {count === 1 ? "roll" : "rolls"}
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {buttonText}
      </button>
    </main>
  );
}

export default App;
