import Phaser from "phaser";
import Button from "../gameObj/Button";
// import { submitScore } from '../Api/LeaderboardApi';

export default class EndScene extends Phaser.Scene {
    constructor() {
        super("End");
    }

    init(data) {
        this.score = data.totalScore;
    }

    preload() {
        this.load.image("game-over", "/game-end.jpeg");
    }

    create() {
        // this.model = this.sys.game.globals.model;
        // submitScore(this.model.userName, this.score);
        this.bgImage = this.add.image(0, -150, 'game-over').setOrigin(0,0);

        this.add.text(120, 50, `Your Score : ${this.score}`, {fontSize: 18});

        this.add.text(150, 200, `Game Over`, {fontSize: 38});

        this.returnBtn = new Button(this, 400, 545, "blueButton1", "blueButton2", "Reload", "GameScene");

        // this.TitleButton = new Button(this, 250, 510, 'blueButton1', 'blueButton2', 'Menu', 'Title');
        // this.LeaderBoardButton = new Button(this, 550, 510, 'blueButton1', 'blueButton2', 'High Score', 'Leaderboard');
    }
}
