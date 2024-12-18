import Phaser from "phaser";

export default class CtrlButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key1, text) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.button = this.scene.add.sprite(0, 0, key1).setInteractive({useHandCursor: true});
        this.button.setScale(0.7);
        this.text = this.scene.add.text(0, 0, text, {
            font: "bold 20px Arial",
            fill: "#000",
        });
        Phaser.Display.Align.In.Center(this.text, this.button);

        this.add(this.button);
        this.add(this.text);

        this.scene.add.existing(this);
    }
}
