import "./App.css";
import Phaser from 'phaser';
import GameScene from './GameScene';
import EndScene from './scenes/gameOver';
import BetMenuM from './components/BetMenuM';
import PreStartScene from './scenes/preStart';
import GameSceneM from './Mobile/GameSceneM.jsx';
import toast, { Toaster } from 'react-hot-toast';
import SplashScreen from './components/SplashScreen';
import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import ConnectWallet from './components/modals/ConnectWallet.jsx';
import { publish, subscribe, unsubscribe } from './CustomEvents/events';
import { endGame, startGame, updateScore } from './CustomEvents/eventKeys';
import { connectCreateWallet, getAvgScore, placeBet, saveScore } from './Api/api.js';


function App() {
  let game;
  const navigate = useNavigate();
  const [deviceType, setDevicType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [gameMode, setGameMode] = useState(sessionStorage.getItem("gameMode") || "");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")) || null);
  const [currentCoins, setCurrentCoins] = useState(userData?.balance || 500);
  const [started, setStarted] = useState(JSON.parse(sessionStorage.getItem("phaserGameState")) ? true : false);
  const [betAmount, setBetAmount] = useState({
    betAmount: JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount || 0,
    status: JSON.parse(sessionStorage.getItem("betAmount"))?.status || false
  });
  const [sizes, setSizes] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });// game window size

  const handleCloaseConnectModal = () => {
    setShowConnectModal(false);
    sessionStorage.setItem("isOpenConnectModal", false)
  }

  const handleShowConnectModal = () => {
    setShowConnectModal(true);
    sessionStorage.setItem("isOpenConnectModal", true)
  }

  const updateLocalUserBalance = useCallback((type, amount) => {
    console.log("update local user ballance called");
    if (userData) {
      let updatedUserData = { ...userData, balance: type === "add" ? userData.balance + amount : userData.balance - amount };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    }
  }, [userData]);

  const connectWallet = async (walletAddress) => {
    console.log(walletAddress);

    let response = await connectCreateWallet(walletAddress);
    console.log(response);

    setUserData(response?.data.data);
    localStorage.setItem("userData", JSON.stringify(response?.data.data));
    setCurrentCoins(response?.data.data.balance);
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
    if (val === '0') {
      // Prevent a single '0' from being input
      setBetAmount({
        ...betAmount,
        betAmount: ""
      });
    } else {
      // Strip any leading zeros
      setBetAmount({
        ...betAmount,
        betAmount: val.replace(/^0+/, '')
      });
    }
    console.log(betAmount)
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

    if (gameMode !== "practice") {

      if (betAmount.betAmount < 1) {
        toast.error("Bet Amount should be more than 1 or 1");
        return;
      }

      if (betAmount.betAmount > currentCoins) {
        toast.error("You don't have sufficient balance to Place the bet !");
        return;
      }

      if (!userData) {
        toast.error("Wallet is not Connected! please connect before Bet.")
        return
      }

      // let betData ={userId, betAmount}
      setIsLoading(true);
      let toastId = toast.loading("Payment is under process. please Don't close or reload tab.");


      getAvgScore().then((res) => {

        console.log("baselevel", res.data.data.averageScore, Math.floor(res.data.data.averageScore * 10) + 1);
        localStorage.setItem("baseLevel", Math.floor(res.data.data.averageScore * 10) + 1);
        localStorage.setItem("totalBetSizes", res.data.data.betSizes);
        localStorage.setItem("weightedAverageScore", res.data.data.weightedAverageScore);

        console.log("placeBEt", betAmount);


        placeBet(userData._id, betAmount.betAmount).then(() => {
          toast.success("Bet Placed Successfully!..", { id: toastId });
          sessionStorage.setItem("betAmount", JSON.stringify({
            ...betAmount,
            status: true
          }));
          setBetAmount({
            ...betAmount,
            status: true
          })
        }).catch((er) => {
          toast.error("Bet Placed Unsuccessfull...", { id: toastId })
          console.log(er);
        }).finally(() => {
          setIsLoading(false);
        })

      }).catch((er) => {
        toast.error("Bet Placed Unsuccessfull...", { id: toastId })
        console.log(er);
      })
      // console.log(userData);
    }


    publish(startGame, {
      started: true,
    });

    if (deviceType === "mobile") {
      navigate("/loading")
    }
  }



  const updateScoreCB = useCallback((data) => {
    console.log(data);
    if (gameMode !== "practice") {
      let {
        score,
        level,
      } = data.detail;

      let localCashPotHits = JSON.parse(localStorage.getItem("cashPotHits"));

      let toBeSavedData = {
        userId: userData._id,
        level,
        betAmount: betAmount.betAmount,
        score,
        cashPotHits: localCashPotHits || []
      }

      saveGameScore(toBeSavedData)

      let finalScore = ((+betAmount.betAmount) * score).toFixed(2);
      setCurrentCoins(pre => pre + +finalScore);
      updateLocalUserBalance("add", +finalScore);
      localStorage.removeItem("cashPotHits")
      console.log("score", toBeSavedData)
      console.log(betAmount, finalScore);
    } else {
      localStorage.removeItem("cashPotHits")
    }

    // if (deviceType === "mobile") {
    //   navigate("/");
    //   sessionStorage.removeItem("phaserGameState");
    // };

  }, [gameMode, betAmount, setCurrentCoins, userData, updateLocalUserBalance])

  const startGameCB = useCallback((data) => {
    console.log("start event data", data);
    if (!showConnectModal) {
      setStarted(true);
      if (gameMode !== "practice") {
        setCurrentCoins((pre) => pre - betAmount.betAmount);
        updateLocalUserBalance("substract", betAmount.betAmount);
      }
    }
  }, [betAmount, updateLocalUserBalance, gameMode, showConnectModal])

  const endGameCB = useCallback((data) => {
    console.log("end event data", data);

    setStarted(false);
    // sessionStorage.removeItem("betAmount");
    sessionStorage.setItem("betAmount", JSON.stringify({
      betAmount: betAmount.betAmount,
      status: false
    }));
    setBetAmount({
      betAmount: betAmount.betAmount,
      status: false
    });

    if (deviceType === "mobile") {
      navigate("/");
      sessionStorage.removeItem("phaserGameState");
    };

  }, [deviceType, navigate, betAmount, setBetAmount])

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
              <h4 className='balance'>{+currentCoins.toFixed(2)}</h4>
              <br />
              {gameMode !== "practice" && <h3>BET SIZE</h3>}

              {gameMode !== "practice" && <div className='betAmountWrapper'>

                <button
                  className='incdecButton'
                  disabled={started || betAmount.status}
                  onClick={() => {
                    betAmount.betAmount > 0 && setBetAmount((pre) => { return { ...betAmount, betAmount: +pre.betAmount - 1 } })
                  }}>
                  <img src="/minus.svg" alt="minus" />
                </button>

                <input
                  type="number"
                  id={"numberInput"}
                  className='balance'
                  placeholder='Enter Bet Amount'
                  min={1}
                  max={10000000}
                  disabled={started || betAmount.status}
                  value={betAmount.betAmount}
                  step="1"
                  onKeyDown={(e) => {
                    // Prevent the 'e' key from being typed
                    if (e.key === 'e' || e.key === 'E' || e.key === "-" || e.key === ".") {
                      e.preventDefault();
                    }

                  }}
                  onChange={(e) => handleChange(e)}
                />

                <button className='incdecButton' disabled={started || betAmount.status} onClick={() => {
                  setBetAmount((pre) => { return { ...betAmount, betAmount: +pre.betAmount + 1 } })
                }}>
                  <img src="/plus.svg" alt="plus" />
                </button>
              </div>}

            </div>

            <br />
            {gameMode !== "practice" && <button onClick={handlePlaceBet} className='button' disabled={started || isLoading || betAmount.status}>{isLoading ? "Placing Bet..." : "PLACE BET"}</button>}

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

        <canvas id='gameCanvas' width={sizes.width} height={sizes.height} ></canvas>



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
          userData={userData}
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
