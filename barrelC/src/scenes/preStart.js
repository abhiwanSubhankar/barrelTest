import Phaser from "phaser";
import Button from "../gameObj/Button";
// import { submitScore } from '../Api/LeaderboardApi';

export default class PreStartScene extends Phaser.Scene {
    constructor() {
        super("Start");
        this.buttonX = 400;
        this.buttonY = 545;
    }

    init(data) {
        this.bet = data.bet;
    }

    preload() {
        // this.load.image("player", "player.svg");
        this.load.image("player", "player.svg");
        this.load.image("bg", "/bg.svg");

        // buttons
        this.load.image("blueButton1", "/blue_button02.png");
        this.load.image("blueButton2", "/blue_button03.png");
    }

    create() {
        // this.model = this.sys.game.globals.model;
        // submitScore(this.model.userName, this.score);
        this.bgImage = this.add.image(0, -80, "bg").setOrigin(0, 0).setScale(0.95);

        // Add player sprite
        this.player = this.physics.add
        .image(this.game.config.width - this.game.config.width / 2, this.game.config.height - 150, "player")
        .setScale(0.70)
        .setCollideWorldBounds(true);

        this.player.setCircle(this.player.width/2);
        // this.player.setCircle(28, this.player.width / 2 - 26, this.player.height / 2 - 26);

        this.startButton = new Button(
            this,
            this.buttonX,
            this.buttonY,
            "blueButton1",
            "blueButton2",
            "Start Game",
            "GameScene",
            "startScene"
        );

        // this.TitleButton = new Button(this, 250, 510, 'blueButton1', 'blueButton2', 'Menu', 'Title');
        // this.LeaderBoardButton = new Button(this, 550, 510, 'blueButton1', 'blueButton2', 'High Score', 'Leaderboard');
    }
    cb = function () {
        let betAmount = JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount;
        if (betAmount) {
            this.scene.start("GameScene");
        } else {
            console.log("cb this", this);

            this.add.text(this.buttonX, this.buttonY - 100, `Please Enter a valid BetAmount First.`, {
                fontSize: 38,
                fill: "red",
            });
        }
    };
}
