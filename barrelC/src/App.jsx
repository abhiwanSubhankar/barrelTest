import { useCallback, useEffect, useState } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';
import EndScene from './scenes/gameOver';
import "./App.css";
import { publish, subscribe, unsubscribe } from './CustomEvents/events';
import { endGame, startGame, updateScore } from './CustomEvents/eventKeys';
import PreStartScene from './scenes/preStart';
import BetMenuM from './components/BetMenuM';
import SplashScreen from './components/SplashScreen';


import { Routes, Route, useNavigate } from "react-router-dom";
import GameSceneM from './Mobile/GameSceneM.jsx';
// import EndScenePopup from './scenes/gameOverPopup.js';


function App() {
  // const [gameState, setGameState] = useState();

  const [deviceType, setDevicType] = useState("");

  const [currentCoins, setCurrentCoins] = useState(500);
  const [betAmount, setBetAmount] = useState(JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount || 0);
  const [gameMode, setGameMode] = useState(sessionStorage.getItem("gameMode") || "");
  const [started, setStarted] = useState(false);
  // game window size
  const [sizes, setSizes] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const navigate = useNavigate();


  useEffect(() => {

    function isDesktop() {
      return window.matchMedia("(min-width: 1025px)").matches;
    }

    function isMobileOrTablet() {
      return window.matchMedia("(max-width: 1024px)").matches;
    }

    // Usage example
    if (isDesktop()) {
      console.log("Device is a desktop/laptop");
      setDevicType("desktop");
    } else if (isMobileOrTablet()) {
      console.log("Device is a mobile/tablet");
      setDevicType("mobile");
    }
  }, []);

  useEffect(() => {

    let game;
    
    if (deviceType === "desktop") {

      let gameCanvas = document.getElementById("gameCanvas");
  
      const config = {
        type: Phaser.WEBGL,
        width: sizes.width,
        height: sizes.height,
        canvas: gameCanvas,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        // scene: [PreStartScene, GameScene, EndScenePopup],
        scene: [PreStartScene, GameScene, EndScene],
      };
      game = new Phaser.Game(config);    

      return () => {
        game.destroy(true);
      };
    }
  }, [sizes, deviceType]);

  // set window size by device window
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

    if (deviceType === "mobile") {
      navigate("/loading")

      publish(startGame, {
        started: true,
      });
    }
  }

  const updateScoreCB = useCallback((data) => {
    console.log(data);
    if (gameMode !== "practice") {
      let finalScore = ((+betAmount) * data.detail.score).toFixed(2);
      setCurrentCoins(pre => pre + +finalScore);
      console.count("score",)
      console.log(betAmount, finalScore);
    }

    // if (deviceType === "mobile") {
    //   navigate("/");
    //   sessionStorage.removeItem("phaserGameState");
    // };


  }, [gameMode, betAmount, setCurrentCoins])

  const startGameCB = useCallback((data) => {
    console.log("start event data", data);
    setStarted(true);
    setCurrentCoins((pre) => pre - betAmount)
  }, [betAmount])

  const endGameCB = useCallback((data) => {
    console.log("end event data", data);
    setStarted(false);

    if (deviceType === "mobile") {
      navigate("/");
      sessionStorage.removeItem("phaserGameState");
    };

  }, [deviceType, navigate])

  useEffect(() => {
    // custom event listiner for update the score.
    subscribe(updateScore, updateScoreCB);
    subscribe(startGame, startGameCB);
    subscribe(endGame, endGameCB)

    return () => {
      unsubscribe(updateScore, updateScoreCB);
      unsubscribe(startGame, startGameCB);
      unsubscribe(endGame, endGameCB);
    }

  }, [updateScoreCB, startGameCB, endGameCB])

  useEffect(() => {
    if (!gameMode) {
      setGameMode("practice");
      sessionStorage.setItem("gameMode", "practice")
    }
  }, [gameMode])


  if (deviceType === "desktop") {
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

                <input
                  type="number"
                  className='balance'
                  placeholder='Enter Bet Amount'
                  min={0}
                  max={10000000}
                  disabled={started}
                  value={betAmount}
                  onKeyDown={(e) => {
                    // Prevent the 'e' key from being typed
                    if (e.key === 'e' || e.key === 'E' || e.key === "-") {
                      e.preventDefault();
                    }
                    // console.log(e.key);

                  }}
                  onChange={(e) => {

                    let val = +e.target.value;

                    if (val > 0 && val < 1000000) {
                      setBetAmount(val)
                    }

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
  }


  // if in mobile show the routes
  return <div className="App">

    <Routes>
      <Route path='/' element={
        <BetMenuM
          currentCoins={currentCoins}
          gameMode={gameMode}
          started={started}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          handlePlaceBet={handlePlaceBet}
          setGameMode={setGameMode}
          deviceType={deviceType}
        ></BetMenuM>
      }></Route>

      <Route path='/loading' element={
        <SplashScreen />
      }></Route>

      <Route path='/game' element={
        <GameSceneM />
      }></Route>


    </Routes>

  </div>
}

export default App;
