import Phaser from "phaser";
import Button from "../gameObj/Button";
// import { submitScore } from '../Api/LeaderboardApi';

export default class EndScene extends Phaser.Scene {
    constructor() {
        super("End");

        //  devise type
        this.deviceType = window.matchMedia("(min-width: 1025px)").matches ? "desktop" : "mobile";
    }

    init(data) {
        console.log("init", data);
        this.score = data.totalScore;

        // clearing the localstorage for removing the reload data
        sessionStorage.removeItem("phaserGameState");
    }

    preload() {
        this.load.image("game-over", "/game-end.png");

        // yellow buttons
        this.load.image("yellowButton1", "/yellowButton1.png");
        this.load.image("yellowButton2", "/yellowButton2.png");
    }

    create() {
        // this.model = this.sys.game.globals.model;
        // submitScore(this.model.userName, this.score);

        this.layout = {
            x: 0,
            y: 0,
            width: 200,
            height: 600,
        };

        this.bgImage = this.add.image(0, 0, "game-over").setOrigin(0, 0);

        // this.bgImage.setScale(1.4);
        this.bgImage.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.add.text(120, 50, `Your Score : ${this.score}`, {fontSize: 18});

        this.add.text(
            this.game.config.width / 2 - (this.deviceType === "mobile" ? 130 : 180),
            this.game.config.height / 2 - 120,
            `Game Over`,
            {
                fontSize: `${this.deviceType === "mobile" ? 48 : 65}px`,
                fill: "#FFE358",
                fontStyle: "bold",
            }
        );
        this.returnBtn = new Button(
            this,
            this.game.config.width / 2,
            this.game.config.height / 2,
            "yellowButton1",
            "yellowButton2",
            "Reload",
            "Start",
            "restart"
        );

        // this.TitleButton = new Button(this, 250, 510, 'blueButton1', 'blueButton2', 'Menu', 'Title');
        // this.LeaderBoardButton = new Button(this, 550, 510, 'blueButton1', 'blueButton2', 'High Score', 'Leaderboard');
    }
}
