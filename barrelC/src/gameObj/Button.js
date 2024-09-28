import Phaser from "phaser";
import {publish} from "../CustomEvents/events";
import {endGame, startGame} from "../CustomEvents/eventKeys";

export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key1, key2, text, targetScene, cb) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.button = this.scene.add.sprite(0, 0, key1).setInteractive({useHandCursor: true});
        this.text = this.scene.add.text(0, 0, text, {fontSize: "30px", fill: "#fff"});
        Phaser.Display.Align.In.Center(this.text, this.button);

        this.add(this.button);
        this.add(this.text);

        this.button.on("pointerdown", () => {
            if (cb === "startScene") {
                // console.log("start scgffgff called.");
                let betAmount = JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount;

                let gameMode = sessionStorage.getItem("gameMode");
                if (gameMode === "practice") {
                    this.scene.scene.start(targetScene);
                } else if (betAmount && +betAmount >= 1) {
                    this.scene.scene.start(targetScene);
                    publish(startGame, {
                        started: true,
                    });
                } else {
                    this.errortext = this.scene.add.text(-200, -50, "Please enter a valid BetAmount", {
                        fontSize: "20px",
                        fill: "red",
                        fontWidth: 900,
                    });

                    this.add(this.errortext);
                }
             
            } else if (cb === "restart") {
                // sessionStorage.clear();
                this.scene.scene.start(targetScene);
                publish(endGame, {
                    started: false,
                });
            } else {
                this.scene.scene.start(targetScene);
            }
        });

        this.button.on("pointerover", () => {
            this.button.setTexture(key2);
        });

        this.button.on("pointerout", () => {
            this.button.setTexture(key1);
        });

        this.scene.add.existing(this);
    }
}
