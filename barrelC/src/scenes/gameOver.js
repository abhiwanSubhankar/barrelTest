import Phaser from "phaser";
import Button from "../gameObj/Button";

export default class EndScene extends Phaser.Scene {
    constructor() {
        super("End");
        this.deviceType = window.matchMedia("(min-width: 1025px)").matches ? "desktop" : "mobile";
    }

    init(data) {
        console.log("init", data);
        this.score = data.totalScore || JSON.parse(sessionStorage.getItem("gameOver"))?.score;
        this.betAmount = JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount || 0;
        this.gameMode = sessionStorage.getItem("gameMode") || "practice";

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
        localStorage.setItem("gameState", "gameover");
        this.layout = {
            x: 0,
            y: 0,
            width: 200,
            height: 600,
        };
        this.bgImage = this.add.image(0, 0, "game-over").setOrigin(0, 0);
        // this.bgImage.setScale(1.4);
        this.bgImage.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        // this.add.text(120, 50, `Your Score : ${this.score}`, {fontSize: 18});
        let gm = sessionStorage.getItem("gameMode") || "practice";
        this.add.text(
            this.game.config.width / 2 - (this.deviceType === "mobile" ? 130 : 350),
            this.game.config.height / 2 - 120,
            gm === "practice"
                ? `You have won ${this.deviceType === "mobile" ? "\n" : ""} $0.00`
                : `You have won ${this.deviceType === "mobile" ? "\n" : ""} $${(this.betAmount * this.score).toFixed(
                      2
                  )}.`,
            {
                fontSize: `${this.deviceType === "mobile" ? 35 : 65}px`,
                fill: "#FFE358",
                fontStyle: "bold",
                align: "center",
            }
        );

        this.returnBtn = new Button(
            this,
            this.game.config.width / 2,
            this.game.config.height / 2,
            "yellowButton1",
            "yellowButton2",
            "Play Again",
            "Start",
            "restart"
        );
    }
}
