import Phaser from "phaser";
import axios from "axios";
import { publish } from "./CustomEvents/events";
import { updateScore } from "./CustomEvents/eventKeys";

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: "GameScene"});
        this.setVelocityY = 80;
        this.playerVelocity = 300;
        this.keyD;
        this.keyA;
        this.textS; // store score text
        this.levelText;

        // Cooldown bar setup
        this.cooldown = 100;
        this.shooting = false;
        this.cooldownTimer = 0;

        // Variables for shooting and magazine management
        this.magazineSize = 20; // Starting magazine size
        this.bulletsRemaining = this.magazineSize; // Current bullets available
        this.canShoot = true; // Whether the player can shoot
        this.reloadSpeed = 1; // Speed of reload (adjust as needed)
        this.reloadDelay = 1000; // Delay before starting reload (1 second)
        // reload VB
        this.lastShotTime = 0; // To track when the last shot was fired
        this.isReloading = false; // To track if the player is reloading

        // Player score and balance
        this.score = 0;
        this.multiplier = 0;
        this.balance = 100; // Example initial balance

        //  game Lavel
        this.gameLevel = 1;
        this.gameSpeed = 50;
        this.spawnSpeed = 1000;
    }
    init(data) {
        console.log("init data", data);

        this.betAmount = data.betAmount;
        this.currentCoins = data.currentCoins;
        this.setGameCurrentCoins = data.setGameCurrentCoins;
    }
    preload() {
        // Load game objects assets here
        this.load.image("bg", "/bg2.png");
        this.load.image("barrel", "barrel.svg");
        this.load.image("player", "player.svg");
        this.load.image("bullet", "bullet.svg");
        this.load.image("cashpot", "cash.svg");
        this.load.image("bomb", "bomb.svg");
        this.load.spritesheet(
            "explosion", // spiteSheet name
            "/explosion.png", // spite sheet asset path
            {
                frameWidth: 16, // Width of each frame
                frameHeight: 16, // Height of each frame
                // endFrame: 23, // Total frames in the sprite sheet
            } // info for the spiteSheet.
        );

        // buttons
        this.load.image("blueButton1", "/blue_button02.png");
        this.load.image("blueButton2", "/blue_button03.png");
    }

    create() {
        // Creating Form    
        // this.formUtil = new this.formUtil({
        //     scene: this,
        //     rows: 11,
        //     cols: 11,
        // });
        // this.formUtil.showNumbers();
        // this.formUtil.scaleToGameW("myText", 0.3);
        // this.formUtil.placeElementAt(16, "myText", true);
        // this.formUtil.scaleToGameW("area51", 0.8);
        // this.formUtil.scaleToGameH("area51", 0.5);
        // this.formUtil.placeElementAt(60, "area51", true, true);
        // this.formUtil.addChangeCallback("area51", this.textAreaChanged, this);
       
        // Creating Form




        // add Background
        this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(2);

        this.userNameField = document.getElementById("txtName");
        // this.userNameField.style.display = "block";

        // add score text
        this.textS = this.add
        .text(0, 25, `Score :- ${this.score}`, {
            fontSize: "16px",
            fill: "red",
            fontStyle: "bold",
        })
        .setOrigin(0, 0)
        .setDepth(1);

        // // add score text
        this.levelText = this.add
        .text(this.game.config.width - 150, 25, `Lavel :- ${this.gameLevel}`, {
            fontSize: "20px",
            fill: "red",
            fontStyle: "bold",
        })
        .setOrigin(0, 0)
        .setDepth(1);

        //  Creating explosion animation
        // this.add.sprite(400, 300, "explosion").setScale(2).displayHeight = 80;

        this.anims.create({
            key: "explode", // this create animation key not the pre load invock key.
            frames: this.anims.generateFrameNumbers(
                "explosion"
                // {start: 0, end: 23}
            ),
            frameRate: 20,
            hideOnComplete: true,
            // repeat: 0,
            // duration: 2000,
        });

        // Create the magazine bar
        this.magazineBar = this.add.graphics().setDepth(1).fillStyle(0xff8c00).fillRect(2, 2, 200, 20);

        // Add player sprite
        this.player = this.physics.add
        .image(this.game.config.width - this.game.config.width / 2, this.game.config.height - 80, "player")
        .setCollideWorldBounds(true);

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
            delay: this.spawnSpeed, // Adjust the delay of appring barrel/cp/bomb as needed in ms
            callback: this.spawnEntry,
            callbackScope: this,
            loop: true,
        });

        // create time event to check for reload bullets

        this.time.addEvent({
            delay: 100, // Check every 100ms
            loop: true,
            callback: this.checkReload,
            callbackScope: this,
        });

        // Shooting and collision / overlap logic
        this.physics.add.overlap(this.bullets, this.barrels, this.hitBarrel, null, this);
        this.physics.add.collider(this.player, this.barrels, this.gameOver, null, this);
        this.physics.add.overlap(this.bullets, this.cashPots, this.hitCashPot, null, this);
        this.physics.add.overlap(this.bullets, this.bombs, this.hitBomb, null, this);
    }

    update() {
        // console.log(">>>>>>>>>>>>>>>>>>>>>",this.game.config);

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

        this.textS.setText(`Score :- ${this.score}`);
        this.levelText.setText(`Lavel :- ${this.gameLevel}`);

        if (this.spawnSpeed > 200) {
            // console.log(this.spawnSpeed);
            // this.spawnSpeed = this.spawnSpeed;
        }
    }

    textAreaChanged() {
        var text = this.formUtil.getTextAreaValue("area51");
        console.log(text);
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

        // Update the last shot time
        this.lastShotTime = this.time.now;
        this.isReloading = false; // Stop reload if player shootss
    }

    // Check if we need to start reloading
    checkReload() {
        // If 1 second has passed since the last shot and we're not reloading
        if (this.time.now - this.lastShotTime > this.reloadDelay && !this.isReloading) {
            this.isReloading = true; // Start reloading
        }

        // Reload bullets if we're in the reloading state
        if (this.isReloading && this.bulletsRemaining < this.magazineSize) {
            this.bulletsRemaining += this.reloadSpeed; // Gradually reload bullets
            this.bulletsRemaining = Math.min(this.bulletsRemaining, this.magazineSize); // Max limit is the magazine size
            this.updateMagazineBar();

            // Allow shooting again if bullets have been reloaded
            if (this.bulletsRemaining > 0) {
                this.canShoot = true;
            }
        }
    }

    spawnEntry() {
        // between 1 to 10 getting 1 is 10% chance
        //  if want to increase the chance modyfy the range accordingly
        // console.log("spawn speed", this, this.delay);
        let spawnCashPot = Phaser.Math.Between(1, 10);

        let width = this.game.config.width - 100;

        // Bomb has appear more friquent than cashpods
        let spawnBomb = Phaser.Math.Between(1, 5);

        if (spawnCashPot === 1) {
            this.spawnCashPot(width);
        } else if (spawnBomb === 1) {
            this.spawnBomb(width);
        } else {
            this.spawnBarrel(width);
        }
    }

    updateLavel() {
        if (this.score >= 0 && this.score < 0.1) {
            this.gameLevel = 1;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 5;
        } else if (this.score >= 0.1 && this.score < 0.2) {
            this.gameLevel = 2;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 5;
        } else if (this.score >= 0.2 && this.score < 0.3) {
            this.gameLevel = 3;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 5;
        } else if (this.score >= 0.3 && this.score < 0.4) {
            this.gameLevel = 4;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 5;
        } else if (this.score >= 0.4 && this.score < 0.5) {
            this.gameLevel = 5;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 5;
        } else if (this.score >= 0.5 && this.score < 0.6) {
            this.gameLevel = 6;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 5;
        } else if (this.score >= 0.6 && this.score < 0.7) {
            this.gameLevel = 7;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 5;
        } else if (this.score >= 0.7 && this.score < 0.8) {
            this.gameLevel = 8;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 4;
        } else if (this.score >= 0.8 && this.score < 0.9) {
            this.gameLevel = 9;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 4;
        } else if (this.score >= 0.9 && this.score <= 1) {
            this.gameLevel = 10;
            this.setVelocityY += this.gameSpeed;
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel * 4;
        }

        if (this.spawnSpeed > 200) {
            this.spawnSpeed -= this.gameSpeed * this.gameLevel * 5;
        }
    }

    spawnCashPot(width) {
        let x = Phaser.Math.Between(30, width);

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

    spawnBomb(width) {
        let x = Phaser.Math.Between(30, width);

        // Create the bomb
        let bomb = this.bombs.create(x, 0, "bomb");
        bomb.setVelocityY(this.setVelocityY); // Adjust falling speed

        bomb.setCircle(26);
        bomb.setCircle(26, bomb.width / 2 - 26, bomb.height / 2 - 26);
        bomb.setOffset(10, 3);
    }

    spawnBarrel(width) {
        let x = Phaser.Math.Between(30, width);

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
        bullet.destroy();

        // Decrease barrel strength by 1
        barrel.strength = (barrel.strength - 0.01).toFixed(2);

        // Update the strength text
        barrel.strengthText.setText(barrel.strength);

        // Check if the barrel should be destroyed
        if (barrel.strength <= 0) {
            this.updateScore(barrel.value);

            // Destroy the barrel and the text
            barrel.destroy();
            barrel.strengthText.destroy();

            // Optional: Display an explosion  added effect
            this.add.text(barrel.x, barrel.y, "Boom!", {fontSize: "32px", color: "#FF0000"});

            this.explosion = this.add.sprite(barrel.x, barrel.y, "explosion");
            this.updateLavel();
            this.explosion.play("explode");

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
        this.updateLavel();
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
    }

    gameOver() {
        // Restart the game or show "Game Over" screen

        // dispatch game over event

        publish(updateScore,{score:this.score});
         
        //  reset the game screen
        this.scene.start("End", {totalScore: this.score});
        // this.setGameCurrentCoins(50)
        sessionStorage.setItem(
            "gameOver",
            JSON.stringify({
                score: this.score,
            })
        );

        // reset
        this.score = 0;
        // resetting magazine Size.
        this.magazineSize = 20;
        this.bulletsRemaining = this.magazineSize; // Current bullets available
        this.canShoot = true;
        this.lastShotTime = 0; // To track when the last shot was fired
        this.isReloading = false;
        // resetting game Lavel
        this.gameLevel = 1;
        this.gameSpeed = 20;
        this.spawnSpeed = 1000;
        this.setVelocityY = 80;

        // move to game over screen
        // this.scene.restart();
    }
}

export default GameScene;
