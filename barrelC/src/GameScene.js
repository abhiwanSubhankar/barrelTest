import Phaser from "phaser";
import axios from "axios";

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: "GameScene"});
    }

    preload() {
        // Load assets here
        this.load.image("bg", "/bg2.png");
        this.load.image("barrel", "ff/apple.png"); // Replace with actual path
        this.load.image("player", "ff/player1.svg");
        this.load.image("bullet", "ff/bullet.png");
        this.load.image("cashpot", "ff/cashpot.png");
        this.load.image("bomb", "ff/bomb.png");
    }

    create() {
        // add Background

        this.add.image(0, 0, "bg").setOrigin(0, 0);

        // Add player sprite
        this.player = this.physics.add.image(200, 500, "player").setCollideWorldBounds(true).setOrigin(0, 0);

        // Create barrel group
        this.barrels = this.physics.add.group();

        // // Create cash pot group
        // this.cashPots = this.physics.add.group();

        // // Create bomb group
        // this.bombs = this.physics.add.group();

        // Add controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Cooldown bar setup
        this.cooldown = 100;
        this.shooting = false;
        this.cooldownTimer = 0;

        // Setup bullets
        this.bullets = this.physics.add.group().setOrigin(0, 0);

        // Player score and balance
        this.score = 0;
        this.multiplier = 0;
        this.balance = 100; // Example initial balance

        // Barrels falling logic
        this.time.addEvent({
            delay: 1000, // Adjust as needed
            callback: this.spawnBarrel,
            callbackScope: this,
            loop: true,
        });

        // Shooting and collision logic
        this.physics.add.overlap(this.bullets, this.barrels, this.hitBarrel, null, this);
        this.physics.add.overlap(this.player, this.barrels, this.gameOver, null, this);
        this.physics.add.overlap(this.bullets, this.cashPots, this.hitCashPot, null, this);
        this.physics.add.overlap(this.bullets, this.bombs, this.hitBomb, null, this);
    }

    update() {
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        // Shooting logic with cooldown
        if (this.spaceBar.isDown && this.cooldown > 0 && !this.shooting) {
            this.shootBullet();
            this.cooldown -= 10; // Adjust cooldown
            this.shooting = true;
        } else if (this.spaceBar.isUp) {
            this.shooting = false;
        }

        // Refill cooldown over time
        if (this.cooldown < 100 && this.spaceBar.isUp) {
            this.cooldown += 1;
        }

        // Update the position of the strength text to follow each barrel
        this.barrels.children.iterate((barrel) => {
            if (barrel && barrel.strengthText) {
                barrel.strengthText.x = barrel.x;
                barrel.strengthText.y = barrel.y;
            }
        });
    }

    shootBullet() {
        let bullet = this.bullets.create(this.player.x, this.player.y - 20, "bullet");
        bullet.setVelocityY(-400); // Adjust speed
    }

    // spawnBarrel() {
    //     let x = Phaser.Math.Between(50, 750);
    //     let barrel = this.barrels.create(x, 0, "barrel");
    //     barrel.setVelocityY(200); // Speed increases over time

    //     barrel.strength = Phaser.Math.Between(1, 5);

    //     barrel.multiplier = Phaser.Math.FloatBetween(0.1, 0.25); // Random multiplier
    // }
    spawnBarrel() {
        let x = Phaser.Math.Between(50, 750);

        // Create the barrel
        let barrel = this.barrels.create(x, 0, "barrel");
        barrel.setVelocityY(200); // Adjust falling speed
        barrel.strength = Phaser.Math.Between(1, 5); // Random strength between 1 and 5
        barrel.multiplier = Phaser.Math.FloatBetween(0.1, 0.25); // Random multiplier between 0.1x and 0.25x

        // Create a text object to display the strength
        barrel.strengthText = this.add
        .text(barrel.x, barrel.y, barrel.strength, {
            fontSize: "16px",
            fill: "#ffffff",
            fontStyle: "bold",
        })
        .setOrigin(0.5);

        // Store the text object inside the barrel for easy updating
        barrel.strengthText.setDepth(1); // Ensures the text appears on top of the barrel
    }

    // hitBarrel(bullet, barrel) {
    //     this.score += barrel.multiplier; // Add multiplier to score
    //     barrel.destroy();
    //     bullet.destroy();
    //     // Increase difficulty over time
    // }

    hitBarrel(bullet, barrel) {
        // bullet.destroy(); // Destroy the bullet upon collision

        // // Decrease barrel strength by 1
        // barrel.strength -= 1;

        // // Check if barrel's strength has reached 0
        // if (barrel.strength <= 0) {
        //     // Add the barrel's multiplier to the player's score
        //     this.score += barrel.multiplier;

        //     // Destroy the barrel
        //     barrel.destroy();

        //     // Optional: Add explosion animation or effect when barrel is destroyed
        //     this.add.text(barrel.x, barrel.y, "Boom!", {fontSize: "32px", color: "#FF0000"}); // Example visual cue
        // }
        // Destroy the bullet upon collision

        bullet.destroy();

        // Decrease barrel strength by 1
        barrel.strength -= 1;

        // Update the strength text
        barrel.strengthText.setText(barrel.strength);

        // Check if the barrel should be destroyed
        if (barrel.strength <= 0) {
            // Add barrel's multiplier to player's score
            this.score += barrel.multiplier;

            // Destroy the barrel and the text
            barrel.destroy();
            barrel.strengthText.destroy();

            // Optional: Display an explosion or multiplier added effect
            this.add.text(barrel.x, barrel.y, "Boom!", {fontSize: "32px", color: "#FF0000"});

            try {
                // {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify({message: "Boom!"}),
                // })
                axios
                .post("http://localhost:8080", {data: "boom"})
                // .then((res) => res.json())
                .then((res) => {
                    console.log("return data", res);
                })
                .catch((er) => {
                    console.log(er);
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    hitCashPot(bullet, cashPot) {
        this.score += Phaser.Math.FloatBetween(0.5, 1.0); // Add to score
        cashPot.destroy();
        bullet.destroy();
    }

    hitBomb(bullet, bomb) {
        // End game logic
        this.gameOver();
    }

    gameOver() {
        this.scene.restart(); // Restart the game or show "Game Over" screen
    }
}

export default GameScene;
