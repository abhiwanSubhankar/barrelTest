import React, { useState, useEffect } from "react";
import Phaser from "phaser";

const Game = () => {
  const [balance, setBalance] = useState(866);
  const [betSize, setBetSize] = useState(100);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: "phaser-example",
      cannvas:gamecanvas,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 200 },
          debug: true,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image("background", "/bg2.png");
      this.load.image("platform", "/blue_button02.png");
      this.load.image("player", "/player.svg");
    }

    function create() {
      this.add.image(400, 300, "background");

      this.player = this.physics.add.sprite(100, 450, "player");
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);

      this.platforms = this.physics.add.staticGroup();

      this.platforms.create(400, 568, "platform").setScale(2).refreshBody();
      this.platforms.create(600, 400, "platform");
      this.platforms.create(50, 250, "platform");
      this.platforms.create(750, 220, "platform");

      this.physics.add.collider(this.player, this.platforms);

      this.cursors = this.input.keyboard.createCursorKeys();
    }

    function update() {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
      } else {
        this.player.setVelocityX(0);
      }

      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
      }
    }
  }, []);

  const handleBetChange = (e) => {
    setBetSize(parseInt(e.target.value, 10));
  };

  const handlePlaceBet = () => {
    if (balance >= betSize) {
      setBalance(balance - betSize);
    }
  };

  return (
    <div>
      <div className="side-panel">
        <h2>Balance</h2>
        <p>{balance}</p>

        <label htmlFor="bet-size">Bet Size:</label>
        <input
          type="number"
          id="bet-size"
          value={betSize}
          onChange={handleBetChange}
        />

        <button onClick={handlePlaceBet} disabled={balance < betSize}>
          Place Bet
        </button>

        <div className="game-stats">
          <p>Average Score: 0.95</p>
          <p>Std. Deviation: 0.45</p>
          <p>Game Difficulty: 51.7</p>
        </div>
      </div>
      <div id="phaser-example" ></div>
      <canvas id="gamecanvas"></canvas>
    </div>
  );
};

export default Game;