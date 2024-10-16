import { useCallback, useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';
import EndScene from './scenes/gameOver';
import "./App.css";
import { publish, subscribe, unsubscribe } from './CustomEvents/events';
import { endGame, startGame, updateScore } from './CustomEvents/eventKeys';
import PreStartScene from './scenes/preStart';
import BetMenuM from './components/BetMenuM';
import SplashScreen from './components/SplashScreen';
import toast, { Toaster } from 'react-hot-toast';


import { Routes, Route, useNavigate } from "react-router-dom";
import GameSceneM from './Mobile/GameSceneM.jsx';
import ConnectWallet from './components/modals/ConnectWallet.jsx';
import { connectCreateWallet, placeBet, saveScore } from './Api/api.js';
// import EndScenePopup from './scenes/gameOverPopup.js';


function App() {
  // const [gameState, setGameState] = useState();

  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")) || null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [deviceType, setDevicType] = useState("");
  const [currentCoins, setCurrentCoins] = useState(userData?.ballance || 500);
  const [betAmount, setBetAmount] = useState(JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount || 0);
  const [gameMode, setGameMode] = useState(sessionStorage.getItem("gameMode") || "");
  const [started, setStarted] = useState(JSON.parse(sessionStorage.getItem("phaserGameState")) ? true : false);
  // game window size
  const [sizes, setSizes] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const navigate = useNavigate();

  function showTost(type) {



    toast('Hello World', {
      duration: 2000,
      position: 'top-center',

      // Styling
      style: {},
      className: '',

      // Custom Icon
      icon: '👏',

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: '#000',
        secondary: '#fff',
      },

      // Aria
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    });
  }

  const handleCloaseConnectModal = () => {
    setShowConnectModal(false);
  }
  const handleShowConnectModal = () => {
    setShowConnectModal(true);
  }

  const updateLocalUserBalance = useCallback((type, amount) => {

    if (userData) {
      let updatedUserData = { ...userData, ballance: type === "add" ? userData.ballance + amount : userData.ballance - amount };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    }

  }, [userData])

  // api functions

  const connectWallet = async (walletAddress) => {
    console.log(walletAddress);

    let response = await connectCreateWallet(walletAddress);
    console.log(response);

    setUserData(response?.data.data);
    localStorage.setItem("userData", JSON.stringify(response?.data.data));
    setCurrentCoins(response?.data.data.ballance);
    handleCloaseConnectModal();
    toast.success("wallet Connected Successfully!");
  }


  const saveGameScore = (data) => {


    saveScore(data)
      .then((res) => {
        console.log(res);


      })
      .catch((er) => {
        console.log(er);

        toast.error(data.message);

      });

  }

  const handleChange = (e) => {

    let val = e.target.value;
    console.log("val.startsWith('0')", val.startsWith('0'))

    if (val === '0') {
      setBetAmount(''); // Prevent a single '0' from being input
    } else {
      setBetAmount(val.replace(/^0+/, '')); // Strip any leading zeros
    }
  }


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

    if (betAmount > 0 || gameMode === "practice") {

      if (betAmount > currentCoins) {
        toast.error("You don't have sufficient balance to Place the bet !");
        return;
      }

      if (!userData) {

        toast.error("Wallet is not Connected! please connect before Bet.")
        return
      }

      // let betData ={userId, betAmount}

      placeBet(userData._id, betAmount).then((res) => {

        console.log(res);

        toast.success("Bet Placed Successfully!..");

        sessionStorage.setItem("betAmount", JSON.stringify({
          betAmount
        }));

        publish(startGame, {
          started: true,
        });

        if (deviceType === "mobile") {
          navigate("/loading")
        }


      }).catch((er) => {

        toast.error("Bet Placed Unsuccessfull...")
        console.log(er);


      })

      // console.log(userData);

    } else {
      toast.error("Bet Amount should be more than 1 or 1");
    }
  }



  const updateScoreCB = useCallback((data) => {
    console.log(data);
    if (gameMode !== "practice") {
      let {
        score,
        level,
      } = data?.detail;

      let toBeSavedData = {
        userId: userData._id,
        level,
        betAmount,
        score
      }

      saveGameScore(toBeSavedData)

      let finalScore = ((+betAmount) * score).toFixed(2);
      setCurrentCoins(pre => pre + +finalScore);
      updateLocalUserBalance("add", finalScore);
      console.count("score",)
      console.log(betAmount, finalScore);
    }

    // if (deviceType === "mobile") {
    //   navigate("/");
    //   sessionStorage.removeItem("phaserGameState");
    // };

  }, [gameMode, betAmount, setCurrentCoins, userData, updateLocalUserBalance])

  const startGameCB = useCallback((data) => {
    console.log("start event data", data);
    setStarted(true);
    setCurrentCoins((pre) => pre - betAmount);
    updateLocalUserBalance("substract", betAmount);
  }, [betAmount, updateLocalUserBalance])

  const endGameCB = useCallback((data) => {
    console.log("end event data", data);

    setStarted(false);
    sessionStorage.removeItem("betAmount");
    setBetAmount(0);

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


        <div className='sidebar'>
          <div>
            <img src="/lOGO.svg" alt="logo" width={"80%"} draggable={false} />
          </div>

          <div>
            <div>
              <h3>BALANCE</h3>
              <h4 className='balance'>{currentCoins}</h4>
              <br />
              {gameMode !== "practice" && <h3>BET SIZE</h3>}

              {gameMode !== "practice" && <div className='betAmountWrapper'>

                <button className='incdecButton' disabled={started} onClick={() => {
                  betAmount > 0 && setBetAmount((pre) => pre - 1)
                }}>
                  <img src="/minus.svg" alt="plus" />
                </button>

                <input
                  type="number"
                  id={"numberInput"}
                  className='balance'
                  placeholder='Enter Bet Amount'
                  min={1}
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
                  onChange={(e) => handleChange(e)}
                />

                <button className='incdecButton' disabled={started} onClick={() => {
                  setBetAmount((pre) => +pre + 1)
                }}>
                  <img src="/plus.svg" alt="plus" />
                </button>
              </div>}

            </div>

            <br />
            {gameMode !== "practice" && <button onClick={handlePlaceBet} className='button' disabled={started}>PLACE BET</button>}

            <button
              onClick={handleShowConnectModal}
              className='button' disabled={userData}>CONNECT WALLET</button>

            <div>
              <h4>SELECTED GAME MODE :- {gameMode === "normal" ? "NORMAL" : "PRACTICE"}</h4>
              <select name="" id="" className='balance'
                disabled={started}
                value={gameMode}
                onChange={(e) => {
                  setGameMode(e.target.value)
                  sessionStorage.setItem("gameMode", e.target.value);
                }}>
                <option value="">SELECT GAME MODE</option>
                <option value="practice"> PRACTICE </option>
                <option value="normal">NORMAL</option>
              </select>
            </div>
          </div>
        </div>

        <canvas id='gameCanvas' width={sizes.width} height={sizes.height}></canvas>



        {showConnectModal && <ConnectWallet isOpen={showConnectModal} onClose={handleCloaseConnectModal} connectWallet={connectWallet} />}
        <Toaster />
      </div>
    );
  }


  // if in mobile show the routes
  return <div className="App">
    <Toaster />
    {showConnectModal && <ConnectWallet isOpen={showConnectModal} onClose={handleCloaseConnectModal} connectWallet={connectWallet} />}

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
          handleChange={handleChange}
          handleShowConnectModal={handleShowConnectModal}
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
