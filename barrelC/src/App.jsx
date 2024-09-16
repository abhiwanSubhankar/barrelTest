import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';
import EndScene from './scenes/gameOver';

function App() {
  const [gameState, setGameState] = useState();




  const [sizes, setSizes] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {

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
      scene: [GameScene]
    };
    const game = new Phaser.Game(config);
    game.scene.add("End", EndScene);

    setGameState(game);
    console.log(game)

    return () => {
      game.destroy(true);
    };
  }, []);


  useEffect(() => {
    // console.log(gameState)

  }, [])
  window.addEventListener("resize", () => {
    console.log("window height and width ", window.innerWidth, window.innerHeight)
    setSizes({
      height: window.innerHeight - 500,
      width: window.innerWidth - 500,
    })
  })

  console.log("game State>>>>", gameState);

  return (<div>
    {/* <h1>Barrel Shooter Game</h1> */}
    <canvas id='gameCanvas'></canvas>
    {/* <div id="phaser-scene" /> */}
    {/* <div className="App">
     </div> */}
  </div>
  );
  // return <>
  //   <canvas id='gameCanvas'></canvas>
  // </>
}

export default App;
