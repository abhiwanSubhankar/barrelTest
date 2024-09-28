import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';
import EndScene from './scenes/gameOver';
import "./App.css";
import { subscribe, unsubscribe } from './CustomEvents/events';
import { endGame, startGame, updateScore } from './CustomEvents/eventKeys';
import PreStartScene from './scenes/preStart';


function App() {
  const [gameState, setGameState] = useState();

  const [currentCoins, setCurrentCoins] = useState(500);
  const [betAmount, setBetAmount] = useState(JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount || 0);

  const [gameMode, setGameMode] = useState(sessionStorage.getItem("gameMode") || "practice");
  const [started, setStarted] = useState(false);





  // game window size
  const [sizes, setSizes] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {

    let game;

    // if (gameMode === "practice") {
    //   let gameCanvas = document.getElementById("gameCanvas");
    //   //  document.querySelector(".App>canvas")
    //   const config = {
    //     type: Phaser.WEBGL,
    //     width: sizes.width,
    //     height: sizes.height,
    //     canvas: gameCanvas,
    //     physics: {
    //       default: 'arcade',
    //       arcade: {
    //         gravity: { y: 0 },
    //         debug: true
    //       }
    //     },
    //     scene: [PreStartScene, PracticeGameScene, EndScene],
    //   };
    //    game = new Phaser.Game(config);
    // } else {

    let gameCanvas = document.getElementById("gameCanvas");
    //  document.querySelector(".App>canvas")
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
    game = new Phaser.Game(config);
    // }

    // setGameState(game);
    // console.log(game)

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
    // custom event listiner for update the score.

    subscribe(updateScore, (data) => {
      console.log("event data", data);

      if (gameMode !== "practice") {
        let finalScore = ((+betAmount) * data.detail.score)
        setCurrentCoins(pre => pre + finalScore);
        console.count("score",)
        console.log(betAmount, finalScore);
      }
    })
    subscribe(startGame, (data) => {
      setStarted(true);
    })
    subscribe(endGame, (data) => {
      setStarted(false);
    })

    return () => {
      unsubscribe(updateScore);
      unsubscribe(startGame);
      unsubscribe(endGame);
    }

  }, [betAmount])

  useEffect(() => {
    if (!gameMode) {
      setGameMode("practice");
      sessionStorage.setItem("gameMode", "practice")

    }
  }, [gameMode])

  return (
    <div className="App">
      <div>
        <div>
          <img src="/lOGO.svg" alt="logo" width={"80%"} />
        </div>

        <div>
          <div>
            <h3>Balance</h3>
            <h4 className='balance'>{currentCoins}</h4>
            <br />
            {gameMode !== "practice" && <h3>Bet Size</h3>}

            {gameMode !== "practice" && <div className='betAmountWrapper'>

              <button className='incdecButton' disabled={started} onClick={() => {
                betAmount > 0 && setBetAmount((pre) => pre - 1)
              }}>
                <img src="/minus.svg" alt="plus" />
              </button>

              <input type="number" className='balance' placeholder='Enter Bet aMOUNT' disabled={started} value={betAmount} onChange={(e) => {
                setBetAmount(e.target.value)
              }} />

              <button className='incdecButton' disabled={started} onClick={() => {
                setBetAmount((pre) => +pre + 1)
              }}>
                <img src="/plus.svg" alt="plus" />
              </button>
            </div>}

          </div>

          <br />
          {gameMode !== "practice" && <button onClick={handlePlaceBet} className='button' disabled={started}>Place Bet</button>}

          <button onClick={handlePlaceBet} className='button'>connect wallet</button>

          <div>
            <h4>Selected Game Mode :- {gameMode}</h4>
            <select name="" id="" className='balance'
              disabled={started}
              value={gameMode}
              onChange={(e) => {
                setGameMode(e.target.value)
                sessionStorage.setItem("gameMode", e.target.value);
              }}>
              <option value="">Selet Game mode</option>
              <option value="practice"> practice</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>
      </div>

      <canvas id='gameCanvas' width={sizes.width} height={sizes.height}></canvas>

    </div>
  );
  // return <>
  //   <canvas id='gameCanvas'></canvas>
  // </>
}

export default App;
