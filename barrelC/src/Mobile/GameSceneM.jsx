import { useEffect, useState } from "react";
import Phaser from 'phaser';
import GameScene from "../GameScene";
import GameSceneMobile from "./GameSceneM";
import EndScene from "../scenes/gameOver";

const GameSceneM = () => {

    // game window size
    const [sizes, setSizes] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    useEffect(() => {

        let game;
        let gameCanvas = document.getElementById("gameCanvasMobile");
        //  document.querySelector(".App>canvas")
        const config = {
            type: Phaser.WEBGL,
            width: sizes.width,
            height: sizes.height,
            canvas: gameCanvas,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: true
                }
            },
            scene: [GameScene,EndScene],
        };
        game = new Phaser.Game(config);


        return () => {
            game.destroy(true);
        };

    }, [sizes]);

    return <div className="mobileCanvas">

        <canvas id='gameCanvasMobile' width={sizes.width} height={sizes.height}></canvas>
    </div>;
};

export default GameSceneM;