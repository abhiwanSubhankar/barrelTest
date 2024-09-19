import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';
import EndScene from './scenes/gameOver';
import "./App.css";
import { subscribe, unsubscribe } from './CustomEvents/events';
import { updateScore } from './CustomEvents/eventKeys';
import PreStartScene from './scenes/preStart';

function App() {
  const [gameState, setGameState] = useState();

  const [currentCoins, setCurrentCoins] = useState(524);
  const [betAmount, setBetAmount] = useState(JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount || 0);
  const [currentWinnings, setCurrentWinnings] = useState(0);

  const [score, setScore] = useState(JSON.parse(sessionStorage.getItem("gameOver")) || null);


  // game window size
  const [sizes, setSizes] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {

    let gameCanvas = document.getElementById("gameCanvas")

    const config = {
      type: Phaser.WEBGL,
      width: sizes.width,
      height: sizes.height,
      canvas: gameCanvas,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true
        }
      },
      scene: [PreStartScene, GameScene, EndScene],
    };


    const game = new Phaser.Game(config);
    game.scene.layout

    setGameState(game);
    console.log(game)

    return () => {
      game.destroy(true);
    };
  }, [sizes]);


  useEffect(() => {
    // console.log(gameState)
    window.addEventListener("resize", () => {
      console.log("window height and width ", window.innerWidth, window.innerHeight)
      setSizes({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    })

    return () => {
      window.removeEventListener("resize")
    }
  }, [])

  const handlePlaceBet = () => {
    sessionStorage.setItem("betAmount", JSON.stringify({
      betAmount
    }));
  }

  useEffect(() => {

    subscribe(updateScore, (data) => {
      console.log("event data", data);
      let finalScore = (+betAmount * data.detail.score)
      setCurrentCoins(pre => pre + finalScore)
    })

    return () => {
      unsubscribe(updateScore);
    }

  }, [])

  return (
    <div className="App">
      <div>
        <h1>Barrel Shooter Game</h1>

        <div>
          <div>
            <h3>Current coin</h3>
            <h4>{currentCoins}</h4>

            <h3>Current Bet</h3>
            <h4>{betAmount}</h4>

            {/* <input type="text" id="myText" />
            <textarea id="area51">SOME TEXT HERE</textarea> */}


          </div>
          <input type="number" placeholder='Enter Bet aMOUNT' value={betAmount} onChange={(e) => {
            setBetAmount(e.target.value)
          }} />
          <button onClick={handlePlaceBet}>Place Bet</button>
        </div>
      </div>
      <canvas id='gameCanvas' ></canvas>

    </div>
  );
  // return <>
  //   <canvas id='gameCanvas'></canvas>
  // </>
}

export default App;
