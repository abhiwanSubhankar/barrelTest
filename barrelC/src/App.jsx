import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';

function App() {

  const sizes = {
    height: 500,
    width: 500,
  }                                                                                                 


  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: sizes.height,
      height: sizes.width,
      // canvas: gameCanvas,
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

    return () => {
      game.destroy(true);
    };
  }, []);



  return (
    <div className="App">
      {/* <h1>Barrel Shooter Game</h1> */}
      <canvas id='gameCanvas'></canvas>
      <div id="phaser-scene" />
    </div>
  );
}

export default App;
