import Phaser from "phaser";
import Button from "../gameObj/Button";
// import { submitScore } from '../Api/LeaderboardApi';

export default class EndScenePopup extends Phaser.Scene {
    constructor() {
        super({key: "EndPopup"});
    }

    init(data) {
        console.log("init", data);
        this.score = data.totalScore;

        // clearing the localstorage for removing the reload data
        // localStorage.clear();
        sessionStorage.removeItem("phaserGameState");
    }

    preload() {
        this.load.image("game-over", "/game-end.jpeg");
    }

    create() {
        // this.model = this.sys.game.globals.model;
        // submitScore(this.model.userName, this.score);

        // this.layout = {
        //     x: 0,
        //     y: 0,
        //     width: 200,
        //     height: 600,
        // };

        // this.bgImage = this.add.image(0, 0, "game-over").setOrigin(0, 0);

        // // this.bgImage.setScale(1.4);
        // this.bgImage.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.add.text(120, 50, `Your Score : ${this.score}`, {fontSize: 18});

        // this.add.text(150, 200, `Game Over`, {fontSize: 38});

        this.returnBtn = new Button(
            this,
            this.game.config.width / 2,
            this.game.config.height / 2,
            "blueButton1",
            "blueButton2",
            "Reload",
            "Start",
            "restart"
        );

        // this.TitleButton = new Button(this, 250, 510, 'blueButton1', 'blueButton2', 'Menu', 'Title');
        // this.LeaderBoardButton = new Button(this, 550, 510, 'blueButton1', 'blueButton2', 'High Score', 'Leaderboard');

        this.add.rectangle(200, 300, this.game.config.width*2, this.game.config.height*2, 0x000000, 0.5);

        // this.bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Add game over text
        this.add.text(400, 300, "Game Over", {fontSize: "48px", fill: "#fff"}).setOrigin(0.5);

        // Add a button to restart the game
        this.add
        .text(400, 400, "Click to Restart", {fontSize: "32px", fill: "#fff"})
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
            // this.scene.stop("GameOverScene"); // Stop game over scene
            // this.scene.resume("MainGameScene"); // Resume the main game scene
            this.scene.start("Start");
        });
    }
}

//   export default GameOverPopup;
