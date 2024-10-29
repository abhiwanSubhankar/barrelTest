import Phaser from "phaser";
import Button from "../gameObj/Button";

export default class PreStartScene extends Phaser.Scene {
    constructor() {
        super("Start");
    }

    init(data) {
        this.bet = data.bet;
    }

    preload() {
        this.load.image("player", "player.svg");
        this.load.image("bg", "/bg.svg");
        this.load.image("bgGround", "/ground.svg");

        // buttons
        this.load.image("blueButton1", "/blue_button02.png");
        this.load.image("blueButton2", "/blue_button03.png");

        // yellow buttons
        this.load.image("yellowButton1", "/yellowButton1.png");
        this.load.image("yellowButton2", "/yellowButton2.png");
    }

    create() {
        this.bgImage = this.add.image(0, -80, "bg").setOrigin(0, 0);
        this.bgImage.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height + 100);
        this.player = this.physics.add
        .image(this.game.config.width - this.game.config.width / 2, this.game.config.height - 150, "player")
        .setScale(0.7);

        let unfinishedGame = JSON.parse(sessionStorage.getItem("phaserGameState"));
        let gameState = localStorage.getItem("gameState");

        this.startButton = new Button(
            this,
            // this.buttonX,
            this.game.config.width / 2,
            // this.buttonY,
            this.game.config.height / 2,
            "blueButton1",
            "blueButton2",
            unfinishedGame || gameState === "gameover" ? "Resume" : "Start Game",
            gameState === "gameover" ? "End" : "GameScene",
            "startScene"
        );
    }
}
