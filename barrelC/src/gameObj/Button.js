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
        if (key1 === "yellowButton1") this.button.setScale(0.7);
        if (key1 === "blueButton1") this.button.setScale(1.5);
        this.text = this.scene.add.text(0, 0, text, {fontSize: "30px", fill: "white", fontStyle: "bold"});
        Phaser.Display.Align.In.Center(this.text, this.button);

        this.add(this.button);
        this.add(this.text);

        this.button.on("pointerdown", () => {
            let isModalOpen = JSON.parse(sessionStorage.getItem("isOpenConnectModal"));
            // console.log(isModalOpen, "modal");

            (isModalOpen
                ? () => {}
                : () => {
                      if (cb === "startScene") {
                          let betAmount = JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount;
                          let betStatus = JSON.parse(sessionStorage.getItem("betAmount"))?.status;

                          let gameMode = sessionStorage.getItem("gameMode");

                          // if (!sessionStorage.getItem("isOpenConnectModal")) return;

                          if (gameMode === "practice") {
                              this.scene.scene.start(targetScene);
                              publish(startGame, {
                                  started: true,
                              });
                          } else if (betStatus) {
                              if (betAmount && +betAmount >= 1) {
                                  // publish(startGame, {
                                  //     started: true,
                                  // });
                                  this.scene.scene.start(targetScene);
                              } else {
                                  // this.scene.scene.start(targetScene);
                                  this.errortext = this.scene.add.text(-200, -70, "Please enter a valid BetAmount", {
                                      fontSize: "20px",
                                      fill: "red",
                                      fontWidth: 900,
                                  });

                                  this.add(this.errortext);
                              }
                          } else {
                              this.errortext = this.scene.add.text(
                                  -200,
                                  -70,
                                  "Please place the bet before start the Game.",
                                  {
                                      fontSize: "20px",
                                      fill: "red",
                                      fontWidth: 900,
                                  }
                              );

                              this.add(this.errortext);
                          }
                      } else if (cb === "restart") {
                          // sessionStorage.clear();

                          this.scene.scene.start(targetScene);
                          localStorage.removeItem("gameState");
                          publish(endGame, {
                              started: false,
                          });
                      } else {
                          this.scene.scene.start(targetScene);
                      }
                  })();
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
