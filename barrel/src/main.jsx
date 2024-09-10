// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import Phaser, { Physics } from "phaser";

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


const sizes = {
  width: 500,
  height: 500,
};

// this is considered as gravity speed.
const speedDown = 300;

// game Scene
let palne = new Image(20, 20);
palne.src = "/assets/plane.png";


class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game")
    this.player
    this.cursor
    this.playerSpeed = speedDown + 50
    this.target;
    this.points = 0;
    this.textScore
    this.keyD
    this.keyA
    this.bullets
  }

  // load the assets for start the game.

  preload() {
    this.load.image("bg", "/assets/bg2.png")
    this.load.image("plane", "/assets/basket.png")
    this.load.image("barrel", "/assets/apple.png")
    this.load.image("bulet", "/assets/apple.png")
  }

  // create the game with the preloaded assets
  create() {
    //        (x,y,frame)
    this.add.image(0, 0, "bg").setOrigin(0, 0)
    this.player = this.physics.add.image(200, sizes.height - 100, "plane").setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    // this.player.setSize(this.player.width / 4, this.player.height / 4).setOffset(this.player.width / 10, this.player.height / 10)

    this.target = this.physics.add.image(0, 0, "barrel").setOrigin(0, 0)
    this.target.setMaxVelocity(0, speedDown);
    // this.target.setSize(this.target.width / 4, this.target.height / 4).setOffset(this.target.width / 10, this.target.height / 10)

    // todo : have to read about colition logic and overlap function.

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.cursor = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.bullets = this.physics.add.group();

    console.log("keyboard...>>>>", this.input.keyboard.addCapture())
  }

  // update the  game continiously according to the action
  update() {
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX())
    }

    const { left, right, } = this.cursor;

    // console.log("cursor......>>>>>", this.cursor)
    if (left.isDown || this.keyA.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown || this.keyD.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

  }

  getRandomX() {
    return Math.floor(Math.random() * 480);
  }


  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
  }


}


const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas ,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true
    }
  },
  scene: [GameScene]
}


const game = new Phaser.Game(config);


