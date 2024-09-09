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
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
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
      <h1>Barrel Shooter Game</h1>
      <div id="phaser-game" />
    </div>
  );
}

export default App;
