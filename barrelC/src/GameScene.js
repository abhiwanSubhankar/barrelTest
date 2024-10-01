import Phaser from "phaser";
import axios from "axios";
import {publish} from "./CustomEvents/events";
import {updateScore} from "./CustomEvents/eventKeys";
import CtrlButton from "./gameObj/ControllButton";

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
        this.gamePreviousLevel = 1;
        this.gameSpeed = 50;
        this.spawnSpeed = 1000;
        this.spawnObject; // storing the timer function for spawning barrel,bobmb,cashpod

        // others
        this.gameMode = sessionStorage.getItem("gameMode") || "practice";

        // Flags to track whether CtrlButtons are being held down
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }
    init(data) {
        console.log("init data", data);

        this.betAmount = data.betAmount;
        this.currentCoins = data.currentCoins;
        this.setGameCurrentCoins = data.setGameCurrentCoins;
    }
    preload() {
        // Load game objects assets here
        this.load.image("bg", "/bg.svg");
        this.load.image("barrel", "barrel.svg");
        this.load.image("player", "player.svg");
        // this.load.image("player", "player.svg");
        this.load.image("bullet", "bullet1.svg");
        this.load.image("cashpot", "cashPot.svg");
        this.load.image("bomb", "bomb.svg");
        this.load.image("multiPlayerValue", "/multiplayer.svg");
        this.load.image("showScore", "/score.svg");

        this.load.image("bgGround", "/ground.svg");

        //  adding spiteSheets
        this.load.spritesheet(
            "explosion", // spiteSheet name
            "/explosion.png", // spite sheet asset path
            {
                frameWidth: 16, // Width of each frame
                frameHeight: 16, // Height of each frame
                // endFrame: 23, // Total frames in the sprite sheet
            } // info for the spiteSheet.
        );
        this.load.spritesheet(
            "wheelFront", // spiteSheet name
            "/front.png", // spite sheet asset path
            {
                frameWidth: 56, // Width of each frame
                frameHeight: 76, // Height of each frame
                // endFrame: 23, // Total frames in the sprite sheet
            } // info for the spiteSheet.
        );
        // this.load.spritesheet(
        //     "wheelBack", // spiteSheet name
        //     "/back.png", // spite sheet asset path
        //     {
        //         frameWidth: 16, // Width of each frame
        //         frameHeight: 16, // Height of each frame
        //         // endFrame: 23, // Total frames in the sprite sheet
        //     } // info for the spiteSheet.
        // );

        // buttons
        this.load.image("blueButton1", "/blue_button02.png");
        this.load.image("blueButton2", "/blue_button03.png");

        // game sounds
        this.load.audio("explosion", "/sounds/BarrelBlasting.wav");
        this.load.audio("shoot", "/sounds/cannonFire.mp3");
        this.load.audio("wheel", "/sounds/CannonWheel.mp3");
        this.load.audio("cashPot", "/sounds/cashpot.mp3");

        // controll Buttons

        this.load.image("shootBtn", "/shootBtn.svg");
        this.load.image("leftAro", "/leftAro.svg");
        this.load.image("rightAro", "/rightAro.svg");
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
        // this.loadGameState();

        //add sound to the game

        // Create sound objects
        this.explosionSound = this.sound.add("explosion");
        this.shootSound = this.sound.add("shoot");
        this.cashPotSound = this.sound.add("cashPot", {
            loop: false, // Set to true if you want the background music to loop
            // volume: 0.5, // Adjust the volume
        });
        this.wheelSound = this.sound.add("wheel", {
            loop: true,
            // volume: 0.5, // Adjust the volume
        });

        this.background = this.add.image(0, 0, "bg").setOrigin(0, 0);

        this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // this.background = this.add.image(0, -80, "bg").setOrigin(0, 0).setScale(0.95);

        // this.bgImageGround = this.add.image(0, this.game.config.height - 140, "bgGround").setOrigin(0, 0);

        // this.scale.on("resize", this.scaleBackground, this);
        // this.userNameField = document.getElementById("txtName");
        // this.userNameField.style.display = "block";

        // add score text and img
        // img
        this.add
        .image(this.game.config.width - 160, 25, "showScore")
        .setOrigin(0, 0)
        .setScale(0.75);

        this.textS = this.add
        .text(this.game.config.width - 100, 35, `${this.score} X`, {
            font: "bold 25px Arial",
            fontSize: "16px",
            fill: "red",
            fontStyle: "bold",
        })
        .setOrigin(0, 0)
        .setDepth(1);

        // multiplayer text and image
        if (this.gameMode !== "practice") {
            this.add
            .image(this.game.config.width - 140, 75, "multiPlayerValue")
            .setOrigin(0, 0)
            .setScale(0.75);

            this.textM = this.add
            .text(this.game.config.width - 90, 75, `${this.score} X`, {
                font: "bold 25px Arial",
                fontSize: "16px",
                fill: "red",
                fontStyle: "bold",
            })
            .setOrigin(0, 0)
            .setDepth(1);

            // // add score text
            this.levelText = this.add
            .text(this.game.config.width - 120, 120, `Lavel :- ${this.gameLevel}`, {
                font: "bold 25px Arial",
                fill: "red",
                fontStyle: "bold",
            })
            .setOrigin(0, 0)
            .setDepth(1);
        }

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
        this.anims.create({
            key: "rotateWheel", // this create animation key not the pre load invock key.
            frames: this.anims.generateFrameNumbers(
                "wheelFront"
                // {start: 0, end: 23}
            ),
            frameRate: 15,
            hideOnComplete: true,
            // repeat: 0,
            // duration: 2000,
        });

        // Create the magazine bar
        this.magazineBar = this.add.graphics().setDepth(1).fillStyle(0xff8c00).fillRect(2, 2, 200, 20);

        // Add player sprite
        this.player = this.physics.add
        .image(this.game.config.width - this.game.config.width / 2, this.game.config.height - 150, "player")
        .setScale(0.7)
        .setCollideWorldBounds(true);

        this.player.setCircle(this.player.width / 2 - 7);

        // this.player.body.setCircle(this.player.width / 2 - 7, 40, 30);
        // this.player.setCircle(48, this.player.width / 2 - 26, this.player.height / 2 - 26);

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
        this.spawnObject = this.time.addEvent({
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

        // controll buttons
        // shootbutton
        this.shootBtn = new CtrlButton(
            this,
            // this.buttonX,
            this.game.config.width - 200,
            // this.buttonY,
            this.game.config.height - 50,
            "shootBtn",
            "SHOOT"
        );
        this.shootBtn.setDepth(5);

        this.shootBtn.button.on("pointerdown", () => {
            console.log("shoot Btn clicked");
            this.shootBullet();
            this.cooldown -= 10; // Adjust cooldown
            this.shooting = true;
        });

        this.shootBtn.button.on("pointerup", () => {
            console.log("shoot Btn pointer up");
            this.shooting = false;
        });

        // leftAro
        this.moveLeft = new CtrlButton(
            this,
            // this.buttonX,
            50,
            // this.buttonY,
            this.game.config.height - 50,
            "leftAro"
        );
        this.moveLeft.setDepth(5);

        this.moveLeft.button.on("pointerdown", () => {
            // this.player.setVelocityX(-this.playerVelocity);

            // if (!this.wheelSound.isPlaying) {
            //     this.wheelSound.play();
            // }
            this.isMovingLeft = true;
        });

        this.moveLeft.button.on("pointerup", () => {
            // this.player.setVelocityX(0);
            // if (this.wheelSound.isPlaying) {
            //     this.wheelSound.stop();
            // }

            this.isMovingLeft = false;
        });

        // rightAro
        this.moveRight = new CtrlButton(
            this,
            // this.buttonX,
            150,
            // this.buttonY,
            this.game.config.height - 50,
            "rightAro"
        );
        this.moveRight.setDepth(5);

        this.moveRight.button.on("pointerdown", () => {
            // this.player.setVelocityX(this.playerVelocity);
            // if (!this.wheelSound.isPlaying) {
            //     this.wheelSound.play();
            // }
            this.isMovingRight = true;
        });

        this.moveRight.button.on("pointerup", () => {
            this.isMovingRight = false;
            // this.player.setVelocityX(0);
            // if (this.wheelSound.isPlaying) {
            //     this.wheelSound.stop();
            // }
        });

        //adding mobile gusture event

        // let swipeStartX = 0;

        // this.input.on("pointerdown", (pointer) => {
        //     swipeStartX = pointer.x; // Record the starting x position of the touch
        // });

        // this.input.on("pointerup", (pointer) => {
        //     const deltaX = pointer.x - swipeStartX;

        //     // Check the horizontal swipe distance
        //     if (deltaX > 50) {
        //         // Swiped right
        //         moveRight(); // Replace with your move right function
        //     } else if (deltaX < -50) {
        //         // Swiped left
        //         moveLeft(); // Replace with your move left function
        //     } else {
        //         this.player.setVelocityX(0);
        //         if (this.wheelSound.isPlaying) {
        //             this.wheelSound.stop();
        //         }
        //     }
        // });

        // function moveLeft() {
        //     console.log("Player moves left");
        //     // Add your logic for moving left
        //     this.player.setVelocityX(-this.playerVelocity);

        //     if (!this.wheelSound.isPlaying) {
        //         this.wheelSound.play();
        //     }
        // }

        // function moveRight() {
        //     console.log("Player moves right");
        //     // Add your logic for moving right
        //     this.player.setVelocityX(this.playerVelocity);
        //     if (!this.wheelSound.isPlaying) {
        //         this.wheelSound.play();
        //     }
        // }

        // gusture event end

        // Shooting and collision / overlap logic
        this.physics.add.overlap(this.bullets, this.barrels, this.hitBarrel, null, this);

        this.physics.add.overlap(this.bullets, this.cashPots, this.hitCashPot, null, this);
        this.physics.add.overlap(this.bullets, this.bombs, this.hitBomb, null, this);

        this.physics.add.collider(this.player, this.barrels, this.gameOver, null, this);
        this.physics.add.collider(this.player, this.cashPots, this.gameOver, null, this);
        this.physics.add.collider(this.player, this.bombs, this.gameOver, null, this);

        this.loadGameState();
    }

    update() {
        // console.log(">>>>>>>>>>>>>>>>>>>>>",this.game.config);

        // this.moveLeft.button.on("pointerdown", () => {
        //     this.player.setVelocityX(-this.playerVelocity);

        //     if (!this.wheelSound.isPlaying) {
        //         this.wheelSound.play();
        //     }
        // });

        // Player movement
        if (this.cursors.left.isDown || this.keyA.isDown || this.isMovingLeft) {
            this.player.setVelocityX(-this.playerVelocity);

            if (!this.wheelSound.isPlaying) {
                this.wheelSound.play();
            }
        } else if (this.cursors.right.isDown || this.keyD.isDown || this.isMovingRight) {
            this.player.setVelocityX(this.playerVelocity);
            if (!this.wheelSound.isPlaying) {
                this.wheelSound.play();
            }
        } else {
            this.player.setVelocityX(0);
            if (this.wheelSound.isPlaying) {
                this.wheelSound.stop();
            }
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

        this.textS.setText(`${this.score.toFixed(2)}x`);
        let betAmount = JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount;

        if (this.gameMode !== "practice") {
            let multiplayerTextValue = this.score * betAmount;

            this.textM.setText(`${multiplayerTextValue.toFixed(2)}x`);
            this.levelText.setText(`Lavel :- ${this.gameLevel}`);
        }
    }

    scaleBackground() {
        const {width, height} = this.scale.gameSize;
        console.log("gameWindowSize", this.scale.gameSize);
        this.background.setDisplaySize(width, height);
    }
    // trying for in canvas form
    // textAreaChanged() {
    //     var text = this.formUtil.getTextAreaValue("area51");
    //     console.log(text);
    // }

    shootBullet() {
        if (this.bulletsRemaining > 0 && this.canShoot) {
            this.shootSound.play();
            this.bulletsRemaining -= 1;
            this.updateMagazineBar();

            let bullet = this.bullets.create(this.player.x - 8, this.player.y - 70, "bullet");
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

        console.log("spawn speed", this.spawnSpeed);
        let spawnCashPot = Phaser.Math.Between(1, 15);

        let width = this.game.config.width - 100;

        // Bomb has appear more friquent than cashpods
        let spawnBomb = Phaser.Math.Between(1, 5);

        if (spawnBomb === 1) {
            this.spawnBomb(width);
        } else if (spawnCashPot === 1) {
            this.spawnCashPot(width);
        } else {
            this.spawnBarrel(width);
        }

        // save game state to use after reload.
        this.saveGameState();
    }

    updateLavel() {
        console.log("level updated");

        const score = this.score;

        // Dynamic game level calculation
        this.gameLevel = Math.floor(score * 10) + 1;

        if (this.gameLevel !== this.gamePreviousLevel) {
            //  increasing game speed and spawning object by game lavel.
            this.spawnSpeed -= this.gameSpeed * this.gameLevel;

            // set fall velocity
            // this.setVelocityY += this.gameSpeed * this.gameLevel;
            this.setVelocityY += 5 * this.gameLevel;

            if (this.spawnSpeed > 200) {
                this.spawnObject.delay = this.spawnSpeed;
                //= Math.max(this.spawnObject.delay - 100, 50); // Ensures delay does not go negative
            }
            this.gamePreviousLevel = this.gameLevel;
            console.log("lavels>>>>>", this.gameLevel, this.gamePreviousLevel, this.spawnObject.delay);
        }
    }

    spawnCashPot(width) {
        let x = Phaser.Math.Between(30, width);

        // Create the cashPot
        let cashPot = this.cashPots.create(x, 0, "cashpot");
        cashPot.setVelocityY(this.setVelocityY); // Adjust falling speed

        // this.cashPotSound.play();

        cashPot.setCircle(27);
        cashPot.setCircle(30, cashPot.width / 2 - 27, cashPot.height / 2 - 27);

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
        // bomb.setScale(0.7)
        // bomb.setCircle(bomb.width / 2);
        bomb.setCircle(30, bomb.width / 2 - 38, bomb.height / 2 - 25);
        // bomb.setOffset(1, 3);
    }

    spawnBarrel(width) {
        let x = Phaser.Math.Between(30, width);

        // Create the barrel
        let barrel = this.barrels.create(x, 0, "barrel");
        barrel.setVelocityY(this.setVelocityY); // Adjust falling speed
        // barrel.setScale(0.9,0.8);
        // barrel.setOffset(-5,-10)
        // this.player.setSize(this.player.width / 4, this.player.height / 4).setOffset(this.player.width / 10, this.player.height / 10)
        // barrel.setCircle(25, 75);
        barrel.setCircle(30, barrel.width / 2 - 30, barrel.height / 2 - 25);

        function getRandomNumber() {
            // Generate a random number between 0 and 1
            let randomNum = Math.random();
            // Scale it to the range [0.01, 0.25]
            return 0.01 + randomNum * (0.25 - 0.01);
        }

        let barrelStrength = getRandomNumber().toFixed(2);

        // Phaser.Math.Between(0.01, 0.25);
        barrel.strength = barrelStrength; // Random strength between 0.01 and 0.25
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
            this.explosionSound.play();
            barrel.strengthText.destroy();

            // Optional: Display an explosion  added effect
            // this.add.text(barrel.x, barrel.y, "Boom!", {fontSize: "32px", color: "#FF0000"});

            // this.wheelFront = this.add.sprite(barrel.x, barrel.y, "wheelFront");
            // this.wheelFront.play("rotateWheel");

            this.explosion = this.add.sprite(barrel.x, barrel.y, "explosion");
            this.explosion.play("explode");

            let gameMode = sessionStorage.getItem("gameMode");
            gameMode !== "practice" && this.updateLavel();
            // console.log("barre game mode",gameMode)

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

        this.cashPotSound.play();

        // removing all the element from canvas
        cashPot.destroy();
        bullet.destroy();
        cashPot.strengthText.destroy();
        let gameMode = sessionStorage.getItem("gameMode");
        gameMode !== "practice" && this.updateLavel();

        // console.log("cash Pod game mode",gameMode)
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

        publish(updateScore, {score: this.score});

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

    saveGameState() {
        const bombsData = this.bombs.getChildren().map((bomb) => ({
            x: bomb.x,
            y: bomb.y,
            velocityX: bomb.body.velocity.x,
            velocityY: bomb.body.velocity.y,
        }));
        const cashpotData = this.cashPots.getChildren().map((cashPot) => ({
            x: cashPot.x,
            y: cashPot.y,
            velocityX: cashPot.body.velocity.x,
            velocityY: cashPot.body.velocity.y,
            value: cashPot.value,
        }));

        const barrelsData = this.barrels.getChildren().map((barrel) => ({
            x: barrel.x,
            y: barrel.y,
            velocityX: barrel.body.velocity.x,
            velocityY: barrel.body.velocity.y,
            value: barrel.value,
            strength: barrel.strength,
        }));

        const gameState = {
            playerPosition: {
                x: this.player.x,
                y: this.player.y,
            },
            score: this.score,
            gameLevel: this.gameLevel,
            bulletsRemaining: this.bulletsRemaining,
            gameVelocity: this.setVelocityY,
            barrels: barrelsData,
            bombs: bombsData,
            cashPots: cashpotData,
        };

        // console.log("barrel bomb, cashpot", gameState, this.cashPots, this.barrels, this.bombs);

        sessionStorage.setItem("phaserGameState", JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = sessionStorage.getItem("phaserGameState");

        if (savedState) {
            const gameState = JSON.parse(savedState);

            this.player.setPosition(gameState.playerPosition.x, this.game.config.height - 150);

            this.score = gameState.score;
            this.gameLevel = gameState.gameLevel;
            this.bulletsRemaining = gameState.bulletsRemaining;

            this.setVelocityY = gameState.gameVelocity;

            //  create every barrel with the saved value.

            gameState.bombs.forEach((bombData) => {
                const bomb = this.bombs.create(bombData.x, bombData.y, "bomb");
                // bomb.body.setVelocity(bombData.velocityX, bombData.velocityY);

                bomb.setVelocityY(bombData.velocityY); // Adjust falling speed

                // bomb.setCircle(26);
                // bomb.setCircle(26, bomb.width / 2 - 26, bomb.height / 2 - 26);
                // bomb.setOffset(10, 3);

                bomb.setCircle(30, bomb.width / 2 - 38, bomb.height / 2 - 25);
            });

            gameState.barrels.forEach((barrelData) => {
                let barrel = this.barrels.create(barrelData.x, barrelData.y, "barrel");
                barrel.setVelocityY(barrelData.velocityY);
                // barrel.setCircle(25);
                // barrel.setCircle(25, barrel.width / 2 - 25, barrel.height / 2 - 25);
                barrel.setCircle(30, barrel.width / 2 - 30, barrel.height / 2 - 25);

                barrel.strength = barrelData.strength;
                barrel.value = barrelData.value;
                barrel.strengthText = this.add
                .text(barrel.x, barrel.y, barrel.strength, {
                    fontSize: "20px",
                    fill: "#ffffff",
                    fontStyle: "bold",
                })
                .setOrigin(0.5);

                // Store the text object inside the barrel for easy updating
                barrel.strengthText.setDepth(1);
            });

            gameState.cashPots.forEach((cashPotData) => {
                let cashPot = this.cashPots.create(cashPotData.x, cashPotData.y, "cashpot");
                cashPot.setVelocityY(cashPotData.velocityY);

                cashPot.setCircle(27);
                cashPot.setCircle(30, cashPot.width / 2 - 27, cashPot.height / 2 - 27);

                cashPot.strength = cashPotData.value; // Random value
                cashPot.value = cashPotData.value;
                cashPot.strengthText = this.add
                .text(cashPot.x, cashPot.y, cashPot.strength, {
                    fontSize: "16px",
                    fill: "#ffffff",
                    fontStyle: "bold",
                })
                .setOrigin(0.5);

                // Ensures the text appears on top of the barrel
                cashPot.strengthText.setDepth(1);
            });

            console.log("game bomb obj", gameState.bombs);
        }
    }
}

export default GameScene;
