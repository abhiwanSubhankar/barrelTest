import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';

function App() {
  const [gameState, setGameState] = useState()

  const sizes = {
    height: 500,
    width: 500,
  }

  useEffect(() => {

    const config = {
      type: Phaser.WEBGL,
      width: sizes.height,
      height: sizes.width,
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

    setGameState(game);
    console.log(game)

    return () => {
      game.destroy(true);
    };
  }, []);


  // useEffect(()=>{
  //   console.log(gameState)

  // },[gameState])

  console.log(gameState?.score);

  return (<>
    <h1>Barrel Shooter Game</h1>
    <canvas id='gameCanvas'></canvas>
    {/* <div id="phaser-scene" /> */}
    {/* <div className="App">
     </div> */}
  </>
  );
  // return <>
  //   <canvas id='gameCanvas'></canvas>
  // </>
}

export default App;
