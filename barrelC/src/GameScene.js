import Phaser from "phaser";
import axios from "axios";

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: "GameScene"});
        this.setVelocityY = 100;
        this.playerVelocity = 200;
        this.keyD;
        this.keyA;
        this.textS; // store score text

        // Cooldown bar setup
        this.cooldown = 100;
        this.shooting = false;
        this.cooldownTimer = 0;

        // Variables for shooting and magazine management
        this.magazineSize = 100; // Starting magazine size
        this.bulletsRemaining = this.magazineSize; // Current bullets available
        this.canShoot = true; // Whether the player can shoot
        this.reloadSpeed = 5; // Speed of reload (adjust as needed)

        // Player score and balance
        this.score = 0;
        this.multiplier = 0;
        this.balance = 100; // Example initial balance
    }

    preload() {
        // Load game objects assets here
        this.load.image("bg", "/bg2.png");
        this.load.image("barrel", "barrel.svg");
        this.load.image("player", "player.svg");
        this.load.image("bullet", "bullet.svg");
        this.load.image("cashpot", "cash.svg");
        this.load.image("bomb", "bomb.svg");
    }

    create() {
        // add score text
        this.textS = this.add
        .text(0, 25, `Score :- ${this.score}`, {
            fontSize: "16px",
            fill: "red",
            fontStyle: "bold",
        })
        .setOrigin(0, 0)
        .setDepth(1);

        // Create the magazine bar
        this.magazineBar = this.add.graphics().setDepth(1).fillStyle(0xff8c00).fillRect(2, 2, 200, 20);

        // add Background
        this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(1);

        // Add player sprite
        this.player = this.physics.add.image(200, 500, "player").setCollideWorldBounds(true);

        this.player.setCircle(26);
        this.player.setCircle(28, this.player.width / 2 - 26, this.player.height / 2 - 26);

        // Create barrel group
        this.barrels = this.physics.add.group();

        // .setSize(this.barrels.width / 4, this.barrels.height / 4)
        // .setOffset(this.barrels.width / 10, this.barrels.height / 10);

        // Create cash pot group
        this.cashPots = this.physics.add.group();

        // Create bomb group
        this.bombs = this.physics.add.group();

        // Add controls
        // for arrow keys , shift , ctrl
        this.cursors = this.input.keyboard.createCursorKeys();

        // spacebar, A nad D buttons
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Setup bullets
        this.bullets = this.physics.add.group().setOrigin(0, 0);

        // Barrels, cashpod and bombs falling logic
        this.time.addEvent({
            delay: 1000, // Adjust the delay of appring barrel/cp/bomb as needed in ms
            callback: this.spawnEntry,
            callbackScope: this,
            loop: true,
        });

        // Shooting and collision / overlap logic
        this.physics.add.overlap(this.bullets, this.barrels, this.hitBarrel, null, this);
        this.physics.add.collider(this.player, this.barrels, this.gameOver, null, this);
        this.physics.add.overlap(this.bullets, this.cashPots, this.hitCashPot, null, this);
        this.physics.add.overlap(this.bullets, this.bombs, this.hitBomb, null, this);
    }

    update() {
        // Player movement
        if (this.cursors.left.isDown || this.keyA.isDown) {
            this.player.setVelocityX(-this.playerVelocity);
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
            this.player.setVelocityX(this.playerVelocity);
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

        // updating the text position for the every cash pod
        this.cashPots.children.iterate((cashpod) => {
            if (cashpod && cashpod.strengthText) {
                cashpod.strengthText.x = cashpod.x;
                cashpod.strengthText.y = cashpod.y;
            }
        });
    }

    shootBullet() {
        if (this.bulletsRemaining > 0 && this.canShoot) {
            this.bulletsRemaining -= 1;
            this.updateMagazineBar();

            let bullet = this.bullets.create(this.player.x, this.player.y - 20, "bullet");
            bullet.setVelocityY(-400); // Adjust speed
        }

        if (this.bulletsRemaining <= 0) {
            this.canShoot = false;
        }
    }

    // spawnBarrel() {
    //     let x = Phaser.Math.Between(50, 750);
    //     let barrel = this.barrels.create(x, 0, "barrel");
    //     barrel.setVelocityY(200); // Speed increases over time

    //     barrel.strength = Phaser.Math.Between(1, 5);

    //     barrel.multiplier = Phaser.Math.FloatBetween(0.1, 0.25); // Random multiplier
    // }

    spawnEntry() {
        // between 1 to 10 getting 1 is 10% chance
        //  if want to increase the chance modyfy the range accordingly
        let spawnCashPot = Phaser.Math.Between(1, 10);

        // Bomb has appear more friquent than cashpods
        let spawnBomb = Phaser.Math.Between(1, 5);

        if (spawnCashPot === 1) {
            this.spawnCashPot();
        } else if (spawnBomb === 1) {
            this.spawnBomb();
        } else {
            this.spawnBarrel();
        }
    }

    spawnCashPot() {
        let x = Phaser.Math.Between(50, 450);

        // Create the cashPot
        let cashPot = this.cashPots.create(x, 0, "cashpot");
        cashPot.setVelocityY(this.setVelocityY); // Adjust falling speed

        cashPot.setCircle(27);
        cashPot.setCircle(27, cashPot.width / 2 - 27, cashPot.height / 2 - 27);

        function getRandomNumber() {
            // Generate a random number between 0 and 1
            let randomNum = Math.random();

            // Scale it to the range [0.01, 0.25]
            return 0.01 + randomNum * (0.25 - 0.01);
        }

        // Phaser.Math.Between(0.01, 0.25);
        let cashPotValue = getRandomNumber().toFixed(2);

        cashPot.strength = cashPotValue; // Random value
        cashPot.value = cashPotValue;
        cashPot.multiplier = Phaser.Math.FloatBetween(0.1, 0.25); // Random multiplier between 0.1x and 0.25x

        // Create a text object to display the strength
        // Store the text object inside the cashPot for easy updating
        cashPot.strengthText = this.add
        .text(cashPot.x, cashPot.y, cashPot.strength, {
            fontSize: "16px",
            fill: "#ffffff",
            fontStyle: "bold",
        })
        .setOrigin(0.5);

        // Ensures the text appears on top of the barrel
        cashPot.strengthText.setDepth(1);
    }

    spawnBomb() {
        let x = Phaser.Math.Between(50, 450);

        // Create the bomb
        let bomb = this.bombs.create(x, 0, "bomb");
        bomb.setVelocityY(this.setVelocityY); // Adjust falling speed

        bomb.setCircle(26);
        bomb.setCircle(26, bomb.width / 2 - 26, bomb.height / 2 - 26);
        bomb.setOffset(10, 3);
    }

    spawnBarrel() {
        let x = Phaser.Math.Between(50, 450);

        // Create the barrel
        let barrel = this.barrels.create(x, 0, "barrel");
        barrel.setVelocityY(this.setVelocityY); // Adjust falling speed
        // barrel.setScale(0.9,0.8);
        // barrel.setOffset(-5,-10)
        // this.player.setSize(this.player.width / 4, this.player.height / 4).setOffset(this.player.width / 10, this.player.height / 10)
        barrel.setCircle(25);
        barrel.setCircle(25, barrel.width / 2 - 25, barrel.height / 2 - 25);

        function getRandomNumber() {
            // Generate a random number between 0 and 1
            let randomNum = Math.random();

            // Scale it to the range [0.01, 0.25]
            return 0.01 + randomNum * (0.25 - 0.01);
        }

        let barrelStrength = getRandomNumber().toFixed(2);

        // Phaser.Math.Between(0.01, 0.99);
        barrel.strength = barrelStrength; // Random strength between 0.01 and 0.99
        barrel.value = barrelStrength;
        barrel.multiplier = Phaser.Math.FloatBetween(0.1, 0.25); // Random multiplier between 0.1x and 0.25x

        // Create a text object to display the strength
        barrel.strengthText = this.add
        .text(barrel.x, barrel.y, barrel.strength, {
            fontSize: "20px",
            fill: "#ffffff",
            fontStyle: "bold",
        })
        .setOrigin(0.5);

        // Store the text object inside the barrel for easy updating
        barrel.strengthText.setDepth(1); // Ensures the text appears on top of the barrel
    }

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
        barrel.strength = (barrel.strength - 0.01).toFixed(2);

        // Update the strength text
        barrel.strengthText.setText(barrel.strength);

        // Check if the barrel should be destroyed
        if (barrel.strength <= 0) {
            // Add barrel's multiplier to player's score
            // this.score += +barrel.value;
            // this.textS.setText(this.score);

            this.updateScore(barrel.value);

            // Destroy the barrel and the text
            barrel.destroy();
            barrel.strengthText.destroy();

            // Optional: Display an explosion or multiplier added effect
            this.add.text(barrel.x, barrel.y, "Boom!", {fontSize: "32px", color: "#FF0000"});

            // try {
            //     // {
            //     //     method: "POST",
            //     //     headers: {
            //     //         "Content-Type": "application/json",
            //     //     },
            //     //     body: JSON.stringify({message: "Boom!"})

            //     axios
            //     .post("http://localhost:8080", {data: "boom"})
            //     // .then((res) => res.json())
            //     .then((res) => {
            //         console.log("return data", res);
            //     })
            //     .catch((er) => {
            //         console.log(er);
            //     });
            // } catch (error) {
            //     console.log(error);
            // }
        }
    }

    hitCashPot(bullet, cashPot) {
        // this.score += Phaser.Math.FloatBetween(0.5, 1.0); // Add to score

        // add and update the score
        // this.score += +cashPot.value;
        // this.textS.setText(this.score);
        this.updateScore(cashPot.value);

        // removing all the element from canvas
        cashPot.destroy();
        bullet.destroy();
        cashPot.strengthText.destroy();
    }

    hitBomb(bullet, bomb) {
        // End game logic

        this.gameOver();
    }

    // Update the visual representation of the magazine bar
    updateMagazineBar() {
        // Clear previous graphics
        this.magazineBar.clear();

        // Calculate the width of the bar based on the remaining bullets
        let barWidth = 200 * (this.bulletsRemaining / this.magazineSize); // Full width is 200px
        let barHeight = 20;

        // Draw the magazine bar background (empty state)
        this.magazineBar.fillStyle(0x808080); // Grey background
        this.magazineBar.fillRect(2, 2, 200, barHeight);

        // Draw the magazine bar (filled state)
        this.magazineBar.fillStyle(0xff8c00); // Green for remaining bullets
        this.magazineBar.fillRect(2, 2, barWidth, barHeight);
    }

    updateScore(updatedScore) {
        this.score += Number((+updatedScore).toFixed(2));
        this.textS.setText(`Score :- ${this.score}`);
    }

    gameOver() {
        this.scene.restart(); // Restart the game or show "Game Over" screen
    }
}

export default GameScene;
