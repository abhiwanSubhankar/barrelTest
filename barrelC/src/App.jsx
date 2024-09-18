import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';
import EndScene from './scenes/gameOver';
import "./App.css";

function App() {
  const [gameState, setGameState] = useState();

  const [currentCoins, setCurrentCoins] = useState(524);
  const [betAmount, setBetAmount] = useState(0);
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
      scene: [GameScene, EndScene],
      init: {
        betAmount: betAmount,
        currentCoins: currentCoins,
        setGameCurrentCoins: function (score) {
          setCurrentCoins(pre => pre + score)
        }
      }
    };

    const game = new Phaser.Game(config);


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

  useEffect(() => {
    let gameOverObj = JSON.parse(sessionStorage.getItem("gameOver"));

    console.log("score", gameOverObj);
    if (gameOverObj?.score) {
      let updatedCoin = +gameOverObj.score * betAmount;
      setCurrentCoins(pre => pre + updatedCoin);

      sessionStorage.removeItem("gameOver");
    }
    
  }, [JSON.parse(sessionStorage.getItem("gameOver"))])

  const handlePlaceBet = () => {

    sessionStorage.setItem("betAmount", JSON.stringify({
      betAmount
    }))

  }


  console.log("game State>>>>", gameState);

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


          </div>
          <input type="number" placeholder='Enter Bet aMOUNT' onChange={(e) => {
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
