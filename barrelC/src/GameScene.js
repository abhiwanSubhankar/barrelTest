import Phaser from "phaser";
import {publish} from "./CustomEvents/events";
import {updateScore} from "./CustomEvents/eventKeys";
import CtrlButton from "./gameObj/ControllButton";

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: "GameScene"});
        //  game Lavel
        this.weightedAverageScore = localStorage.getItem("weightedAverageScore");
        this.gameLevel =
            Math.floor(JSON.parse(localStorage.getItem("weightedAverageScore")) * 10) + 1 <= 7
                ? 3
                : Math.floor(JSON.parse(localStorage.getItem("weightedAverageScore")) * 10) + 1;
        this.gamePreviousLevel = this.gameLevel;
        this.gameSpeed = 1 + this.gameLevel / 10;
        this.spawnSpeed = this.gameLevel < 6 ? 850 : this.gameLevel > 6 || this.gameLevel < 9 ? 600 : 450; // fall of rate
        this.setVelocityY = this.gameLevel < 6 ? 80 : this.gameLevel > 6 || this.gameLevel < 9 ? 120 : 160;
        this.decayRate = 0;
        this.playerVelocity = 375;
        this.keyD;
        this.keyA;
        this.textS; // store score text
        this.levelText;
        this.gameEnd = false;
        this.lastSpawnX = null;
        this.minSpawnDistance = 80;

        // cashpod
        this.barrelsBlustAfterMinReqLevel = false;
        this.cashPotAppendLevel = [8, 12, 16, 18, 21, 24, 27, 29, 33, 35];
        this.cashPotAppendCurrentLevel = null;

        // Cooldown bar setup
        this.cooldown = 100;
        this.cooldownTimer = 0;
        this.shooting = false;
        this.shootingInterval = 200;
        // implementing auto fire mode
        this.autoMode = false;
        this.holdThreshold = 200;
        this.spaceBarHeldDuration = 0;

        // Variables for shooting and magazine management
        this.magazineSize = 25; // Starting magazine size
        this.bulletsRemaining = this.magazineSize; // Current bullets available
        this.bulletsRemainingText;
        this.canShoot = true; // Whether the player can shoot
        this.reloadSpeed = 1; // Speed of reload (adjust as needed)
        this.reloadDelay = 1000; // Delay before starting reload (1 second)
        this.lastShotTime = 0; // To track when the last shot was fired
        this.isReloading = false; // To track if the player is reloading

        // Player score and balance
        this.score = 0;
        this.multiplier = 0;
        this.balance = 100; // Example initial balance
        this.spawnObject; // storing the timer function for spawning barrel,bobmb,cashpod

        // others
        this.gameMode = sessionStorage.getItem("gameMode") || "practice";

        // Flags to track whether CtrlButtons are being held down
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.deviceType = window.matchMedia("(min-width: 1025px)").matches ? "desktop" : "mobile";
        this.betAmount = JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount || 0;
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
        this.load.image("cannonImg", "player2.svg");
        this.load.image("cannonShadow", "cannonShadow.png");
        this.load.image("bullet", "bullet1.svg");
        this.load.image("cashpot", "cashPot.svg");
        this.load.image("bomb", "bomb.svg");
        this.load.image("multiPlayerValue", "/multiplayer.svg");
        this.load.image("showScore", "/score.svg");
        this.load.image("bgGround", "/ground.svg");
        this.load.image("betAmount", "/betAmount.svg");
        this.load.image("wheel", "/wheel.png");

        //  adding spiteSheets
        this.load.spritesheet(
            "explosion", // spiteSheet name
            "/bigboom1.png", // spite sheet asset path
            {
                frameWidth: 200, // Width of each frame
                frameHeight: 200, // Height of each frame
                // endFrame: 23, // Total frames in the sprite sheet
            } // info for the spiteSheet.
        );
        this.load.spritesheet(
            "groundExplosion", // spiteSheet name
            "/groundBoom.png", // spite sheet asset path
            {
                frameWidth: 200, // Width of each frame
                frameHeight: 200, // Height of each frame
                // endFrame: 23, // Total frames in the sprite sheet
            } // info for the spiteSheet.
        );

        // buttons
        this.load.image("blueButton1", "/blue_button02.png");
        this.load.image("blueButton2", "/blue_button03.png");

        // game sounds
        this.load.audio("explosion", "/sounds/BarrelBlasting.wav");
        this.load.audio("shoot", "/sounds/cannonFire.mp3");
        this.load.audio("wheel", "/sounds/CannonWheel.mp3");
        this.load.audio("cashPot", "/sounds/cashpot.mp3");
        this.load.audio("woodenBarrelHitGround", "/sounds/wooden-barrel-hit-ground.mp3");

        // controll Buttons
        this.load.image("shootBtn", "/shootBtn.svg");
        this.load.image("leftAro", "/leftAro.svg");
        this.load.image("rightAro", "/rightAro.svg");
    }

    create() {
        if (this.deviceType === "mobile") {
            let gamestate = localStorage.getItem("gameState");
            if (gamestate === "gameover") {
                this.scene.start("End");
            }
        }
        localStorage.setItem("gameState", "playing");
        // Create sound objects
        this.explosionSound = this.sound.add("explosion");
        this.woodenBarrelHitGroundSound = this.sound.add("woodenBarrelHitGround");
        this.shootSound = this.sound.add("shoot");
        this.cashPotSound = this.sound.add("cashPot", {
            loop: false, // Set to true if you want the background music to loop
            // volume: 0.5, // Adjust the volume
        });
        this.wheelSound = this.sound.add("wheel", {
            loop: false,
            // volume: 0.5,
        });

        this.background = this.add.image(0, 0, "bg").setOrigin(0, 0);

        // set Display size is make the backgroung spread to full height and width
        this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.bgImageGround = this.physics.add
        .image(0, this.game.config.height - Math.floor((this.game.config.height * 15) / 100), "bgGround")
        .setOrigin(0, 0)
        .setDepth(-1)
        .setImmovable(true);
        // .setScale(this.deviceType === "mobile" ? 0.8 : 1);

        // add score text and img > game info
        this.add
        .image(this.game.config.width - 130, 25, "showScore")
        .setOrigin(0, 0)
        .setScale(0.75)
        .setDepth(1);

        this.textS = this.add
        .text(this.game.config.width - 70, 35, `${this.score} X`, {
            font: `bold ${this.deviceType === "mobile" ? 20 : 25}px Arial`,
            fill: "white",
            fontStyle: "bold",
        })
        .setOrigin(0, 0)
        .setDepth(1);

        let localGameMode = sessionStorage.getItem("gameMode") || "practice";

        // multiplayer text and image
        if (localGameMode !== "practice") {
            this.add
            .image(this.game.config.width - 130, 65, "multiPlayerValue")
            .setOrigin(0, 0)
            .setScale(0.75)
            .setDepth(1);

            this.textM = this.add
            .text(this.game.config.width - 70, 65, `$${this.score}`, {
                font: `bold ${this.deviceType === "mobile" ? 20 : 25}px Arial`,
                fill: "green",
                fontStyle: "bold",
            })
            .setOrigin(0, 0)
            .setDepth(1);

            // add betAmount img and text
            this.add
            .image(this.game.config.width - 130, 95, "betAmount")
            .setOrigin(0, 0)
            .setScale(this.deviceType === "mobile" ? 0.6 : 0.75)
            .setDepth(1);

            let bet = JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount;

            this.textBetAmount = this.add
            .text(this.game.config.width - 70, 100, `$${bet}`, {
                font: `bold ${this.deviceType === "mobile" ? 20 : 25}px Arial`,
                // fontSize: "16px",
                fill: "gray",
                fontStyle: "bold",
            })
            .setOrigin(0, 0)
            .setDepth(1);

            // add level text
            // this.levelText = this.add
            // .text(this.game.config.width - 120, 140, `Lavel :- ${this.gameLevel}`, {
            //     font: `bold ${this.deviceType === "mobile" ? 20 : 25}px Arial`,
            //     fill: "red",
            //     fontStyle: "bold",
            // })
            // .setOrigin(0, 0)
            // .setDepth(1);
        }

        this.anims.create({
            key: "explode", // this create animation key not the pre load invock key.
            frames: this.anims.generateFrameNumbers(
                "explosion"
                // {start: 0, end: 7}
            ),
            frameRate: 20,
            hideOnComplete: true,
            // repeat: -1,
            // duration: 2000,
        });

        this.anims.create({
            key: "groundExplode", // this create animation key not the pre load invock key.
            frames: this.anims.generateFrameNumbers("groundExplosion", {start: 0, end: 76}),
            frameRate: 20,
            hideOnComplete: true,
            // repeat: -1,
            // duration: 2000,
        });

        // Create the magazine bar
        this.magazineBar = this.add.graphics().setDepth(1).fillStyle(0xff8c00).fillRect(2, 2, 200, 20);

        this.bulletsRemainingText = this.add
        .text(80, 3, `${this.bulletsRemaining}`, {
            font: "bold 15px Arial",
            fill: "white",
            fontStyle: "bold",
        })
        .setOrigin(0, 0)
        .setDepth(1);

        // Add player container
        this.cannonImg = this.add.image(0, 0, "cannonImg").setDepth(2);
        this.cannonShadow = this.add.image(this.cannonImg.x, this.cannonImg.y + 90, "cannonShadow").setDepth(2);

        this.wheel1 = this.add
        .image(this.cannonImg.x - 20, this.cannonImg.y + 60, "wheel")
        // .setScale(0.9)
        .setDepth(3);
        this.wheel2 = this.add
        .image(this.cannonImg.x + 20, this.cannonImg.y + 60, "wheel")
        // .setScale(0.9)
        .setDepth(1);

        this.player = this.add
        .container(
            this.game.config.width - this.game.config.width / 2,
            this.game.config.height - Math.floor((this.game.config.height * 20) / 100),
            [this.cannonShadow, this.wheel2, this.cannonImg, this.wheel1]
        )
        .setDepth(2);
        // Enable physics for the container (not individual objects)
        this.physics.world.enable(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(false);
        this.player.setScale(this.deviceType === "mobile" ? 0.4 : 0.8);
        // this.player.setCircle(this.player.width / 2 - 17, 10, 58);
        this.player.body.setOffset(-35, -60);

        // Create barrel,cashpot, bomb group
        this.barrels = this.physics.add.group();
        this.cashPots = this.physics.add.group();
        this.bombs = this.physics.add.group();
        // Setup bullets
        this.bullets = this.physics.add.group().setOrigin(0, 0);

        // Add controls
        // for arrow keys , shift , ctrl
        this.cursors = this.input.keyboard.createCursorKeys();
        // spacebar, A nad D buttons
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // create time event to check for reload bullets
        this.time.addEvent({
            delay: 100, // Check every 100ms
            loop: true,
            callback: this.checkReload,
            callbackScope: this,
        });

        this.shootTimer = this.time.addEvent({
            delay: this.shootingInterval, // Fire rate
            callback: this.shootBullet, // Function to call
            callbackScope: this,
            loop: true, // Keep repeating while spacebar is held
            paused: true, // Start the timer paused / will active in auto mode
        });

        // Barrels, cashpod and bombs falling logic
        this.spawnObject = this.time.addEvent({
            delay: this.spawnSpeed, //delay of appring barrel/cp/bomb as needed in ms
            callback: this.spawnEntry,
            callbackScope: this,
            loop: true,
        });

        if (this.deviceType === "mobile") {
            // controll buttons
            // shootbutton
            this.shootBtn = new CtrlButton(
                this,
                // this.buttonX,
                this.game.config.width - 50,
                // this.buttonY,
                this.game.config.height - 90,
                "shootBtn",
                "SHOOT"
            );
            this.shootBtn.setDepth(5);
            this.shootBtn.button.on("pointerdown", () => {
                this.spaceBar.isDown = true;
                this.spaceBar.isUp = false;
            });

            this.shootBtn.button.on("pointerup", () => {
                this.spaceBar.isDown = false;
                this.spaceBar.isUp = true;
            });

            // leftAro
            this.moveLeft = new CtrlButton(
                this,
                // this.buttonX,
                60,
                // this.buttonY,
                this.game.config.height - 90,
                "leftAro"
            );
            this.moveLeft.setDepth(5);

            this.moveLeft.button.on("pointerdown", () => {
                this.isMovingLeft = true;
            });

            this.moveLeft.button.on("pointerup", () => {
                this.isMovingLeft = false;
            });

            // rightAro
            this.moveRight = new CtrlButton(
                this,
                // this.buttonX,
                130,
                // this.buttonY,
                this.game.config.height - 90,
                "rightAro"
            );
            this.moveRight.setDepth(5);

            this.moveRight.button.on("pointerdown", () => {
                this.isMovingRight = true;
            });

            this.moveRight.button.on("pointerup", () => {
                this.isMovingRight = false;
            });
        }

        // Shooting and collision / overlap logic
        this.physics.add.overlap(this.bullets, this.barrels, this.hitBarrel, null, this);
        this.physics.add.overlap(this.bullets, this.cashPots, this.hitCashPot, null, this);
        this.physics.add.overlap(this.bullets, this.bombs, this.hitBomb, null, this);

        this.physics.add.collider(this.player, this.barrels, this.gameOver, null, this);
        this.physics.add.collider(this.player, this.cashPots, this.gameOver, null, this);
        this.physics.add.collider(this.player, this.bombs, this.gameOver, null, this);

        // destroy objects if they hit floor
        this.physics.add.collider(this.bgImageGround, this.barrels, this.destroyObj, null, this);
        this.physics.add.collider(this.bgImageGround, this.cashPots, this.destroyObj, null, this);
        this.physics.add.collider(this.bgImageGround, this.bombs, this.destroyObj, null, this);

        this.loadGameState();
    }

    update(time, delta) {
        // description time and delta
        /*
       @Time (time parameter) The time parameter represents the current time in milliseconds since the Phaser game started. This value is incremented every time the update method is called, which is usually every frame (i.e., every time the game renders a new frame). You can think of time as a timestamp that indicates the current moment in the game's lifetime.

        @Delta (delta parameter) The delta parameter, on the other hand, represents the time difference in milliseconds between the current frame and the previous frame. In other words, it's the time elapsed since the last update call. This value is useful for creating smooth animations and movements, as it allows you to update your game objects based on the time that has passed since the last update.
       */
        // console.log("spawn Speed", this.spawnSpeed, this.setVelocityY, this.weightedAverageScore);

        // Player movement
        if (this.cursors.left.isDown || this.keyA.isDown || this.isMovingLeft) {
            this.player.body.setVelocityX(-this.playerVelocity);
            !this.gameEnd && this.rotateWheels(-1);

            if (!this.wheelSound.isPlaying && !this.gameEnd) {
                this.wheelSound.play();
            }
        } else if (this.cursors.right.isDown || this.keyD.isDown || this.isMovingRight) {
            this.player.body.setVelocityX(this.playerVelocity);
            !this.gameEnd && this.rotateWheels(1);

            if (!this.wheelSound.isPlaying && !this.gameEnd) {
                this.wheelSound.play();
            }
        } else {
            this.player.body.setVelocityX(0);
            if (this.wheelSound.isPlaying) {
                this.wheelSound.stop();
            }
        }

        // When spacebar is pressed down
        if (this.spaceBar.isDown && !this.shooting) {
            this.shooting = true;
            this.spaceBarHeldDuration = 0; // Reset hold duration counter
        }

        // If spacebar is still being held
        if (this.spaceBar.isDown && this.shooting) {
            this.spaceBarHeldDuration += delta; // Track how long the spacebar is held

            // If held longer than the threshold, activate auto mode
            if (this.spaceBarHeldDuration > this.holdThreshold && !this.autoMode) {
                this.autoMode = true;
                this.shootTimer.paused = false; // Start auto shooting
            }
        }

        // When spacebar is released
        if (this.spaceBar.isUp && this.shooting) {
            // If not in auto mode, shoot once (single shot)
            if (!this.autoMode) {
                this.shootBullet(); // Fire a single bullet on key release if it wasn't held long
            }

            // Reset shooting state
            this.shooting = false;
            this.autoMode = false;
            this.shootTimer.paused = true; // Pause auto shooting
        }

        // Update the position of the strength text to follow each barrel
        this.barrels.children.iterate((barrel) => {
            if (barrel && barrel.strengthText) {
                barrel.strengthText.x = barrel.x;
                barrel.strengthText.y = this.deviceType === "mobile" ? barrel.y - 4 : barrel.y;
            }
        });

        // updating the text position for the every cash pod
        this.cashPots.children.iterate((cashpod) => {
            if (cashpod && cashpod.strengthText) {
                cashpod.strengthText.x = cashpod.x - (cashpod.value > 10 ? 17 : 15);
                cashpod.strengthText.y = cashpod.y + 4;
            }
        });

        this.textS.setText(`${this.score.toFixed(2)}x`);
        this.bulletsRemainingText.setText(`${this.bulletsRemaining}`);

        let betAmount = JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount;

        let localGameMode = sessionStorage.getItem("gameMode") || "practice";

        if (localGameMode !== "practice") {
            let multiplayerTextValue = this.score * betAmount;
            this.textM.setText(`$${multiplayerTextValue.toFixed(2)}`);
            // this.levelText.setText(`Lavel :- ${this.gameLevel}`);
        }
    }

    rotateWheels(direction) {
        // The direction argument will be 1 or -1, affecting the rotation direction
        var rotationSpeed = 0.3 * direction;

        // for normal object
        // this.wheel1.rotation += rotationSpeed;
        // this.wheel2.rotation += rotationSpeed;

        //  for the container object
        // wheels are the second and fourth children in the container
        this.player.list[1].rotation += rotationSpeed;
        this.player.list[3].rotation += rotationSpeed;
    }

    scaleBackground() {
        const {width, height} = this.scale.gameSize;
        console.log("gameWindowSize", this.scale.gameSize);
        this.background.setDisplaySize(width, height);
    }

    destroyObj(floor, obj) {
        this.explosion = this.add.sprite(obj.x, obj.y, "groundExplosion");

        if (this.woodenBarrelHitGroundSound.isPlaying) {
            this.woodenBarrelHitGroundSound.stop();
        }

        this.woodenBarrelHitGroundSound.play();
        this.explosion.play("groundExplode");
        this.explosion.setScale(this.deviceType === "mobile" ? 0.4 : 0.7);
        if (obj.strengthText) obj.strengthText.destroy();
        obj.destroy();
    }

    shootBullet() {
        if (this.bulletsRemaining > 0 && this.canShoot) {
            this.shootSound.play();
            this.bulletsRemaining -= 1;
            this.updateMagazineBar();

            let bullet = this.bullets.create(this.player.x - 4, this.player.y - 30, "bullet").setDepth(1);
            bullet.setVelocityY(-400); // Adjust speed
            if (this.deviceType === "mobile") {
                bullet.setScale(0.5, 0.5);
            }
        }

        if (this.bulletsRemaining <= 0) {
            this.canShoot = false;
        }

        // Update the last shot time
        this.lastShotTime = this.time.now;
        this.isReloading = false;
    }

    checkReload() {
        if (this.time.now - this.lastShotTime > this.reloadDelay && !this.isReloading) {
            this.isReloading = true;
        }

        // Reload bullets if we're in the reloading state
        if (this.isReloading && this.bulletsRemaining < this.magazineSize) {
            this.bulletsRemaining += this.reloadSpeed;
            this.bulletsRemaining = Math.min(this.bulletsRemaining, this.magazineSize); // Max limit is the magazine size
            this.updateMagazineBar();

            if (this.bulletsRemaining > 0) {
                this.canShoot = true;
            }
        }
    }

    calculateWeightedAvgScore() {
        let totalBetSizes = localStorage.getItem("totalBetSizes");
        let betAmount = JSON.parse(sessionStorage.getItem("betAmount"))?.betAmount;
        let weightedAvgScore = (betAmount * this.score) / totalBetSizes;
        console.log("weightedAvgScore", weightedAvgScore);
    }

    spawnEntry() {
        let width = this.game.config.width - 50;
        // let baseLevel = +localStorage.getItem("baseLevel");

        // between 1 to 10 getting 1 is 10% chance
        let spawnCashPot = Phaser.Math.Between(1, 25); // 95% chance
        let spawnBomb = Phaser.Math.Between(1, 5);

        // this.calculateWeightedAvgScore();

        if (spawnBomb === 1) {
            this.spawnBomb(width);
        } else if (
            spawnCashPot === 1 &&
            this.barrelsBlustAfterMinReqLevel &&
            this.cashPotAppendLevel.includes(this.gameLevel) &&
            this.cashPots.getChildren().length < 1
        ) {
            this.spawnCashPot(width);
        } else {
            this.spawnBarrel(width);
        }

        // save game state to use after reload.
        this.saveGameState();
    }

    adjustDifficulty() {
        const percentageChange = Math.floor(this.score * 10) / 10;
        const levelMultiplier = 1 + percentageChange;

        // // const levelMultiplier = 1 + percentageChange * currentLevel;
        // this.spawnSpeed = this.spawnSpeed / levelMultiplier; // Decrease spawn interval
        // // this.setVelocityY = this.setVelocityY * levelMultiplier; // Increase falling speed
        // // this.shootingInterval = this.shootingInterval / levelMultiplier;

        // this.setVelocityY += 3 * this.gameLevel;
        // this.shootingInterval -= this.gameLevel * 3;

        // -----------------------

        if (this.weightedAverageScore < 0.92) {
            // Easier difficulty: spawn interval decreases at a slower rate
            this.spawnSpeed = this.spawnSpeed / (levelMultiplier * 0.9);
        } else {
            // Harder difficulty: spawn interval decreases more quickly
            this.spawnSpeed = this.spawnSpeed / (levelMultiplier * 1.2);
        }

        this.setVelocityY += this.gameLevel * (this.weightedAverageScore < 0.92 ? 2 : 4);
        this.shootingInterval -= this.gameLevel * (this.weightedAverageScore < 0.92 ? 2 : 4);
    }

    updateLevel() {
        const score = this.score;
        const baseLevel = Math.floor(JSON.parse(localStorage.getItem("weightedAverageScore")) * 10) + 1;
        this.gameLevel = baseLevel + (Math.floor(score * 10) + 1);

        if (this.gameLevel !== this.gamePreviousLevel) {
            //  increasing game speed and spawning object by game lavel.
            // this.spawnSpeed -= this.gameSpeed * this.gameLevel;
            // set fall velocity
            // this.setVelocityY += this.gameSpeed * this.gameLevel;
            // this.setVelocityY += 5 * this.gameLevel;
            // this.shootingInterval -= this.gameLevel * 5;
            this.adjustDifficulty(this.gameLevel);

            // update the exesting falling objects velocity
            this.updateExistingBarrelCashpotBombsVelocityY();
            console.log("level cahnge called");

            if (this.playerVelocity < 500) {
                let incVel = this.gameLevel * 3;
                this.playerVelocity += incVel;
            }

            if (this.spawnSpeed > 100) {
                this.spawnObject.delay = this.spawnSpeed;
            }

            if (this.shootingInterval > 50) {
                this.shootTimer.delay = this.shootingInterval;
            }

            if (this.gameLevel - this.gamePreviousLevel <= 3) {
                this.gameLevel = this.gamePreviousLevel + 1;
            }

            this.gamePreviousLevel = this.gameLevel;
            console.log("lavels>>>>>", this.gameLevel, this.gamePreviousLevel, this.spawnObject.delay);
        }
    }

    updateExistingBarrelCashpotBombsVelocityY() {
        this.barrels.getChildren().map((barrel) => {
            barrel.setVelocityY(this.setVelocityY);
        });
        this.bombs.getChildren().map((bomb) => {
            bomb.setVelocityY(this.setVelocityY);
        });
        this.cashPots.getChildren().map((cashPot) => {
            cashPot.setVelocityY(this.setVelocityY);
        });
    }

    spawnCashPot(width) {
        let x = Phaser.Math.Between(30, width);
        let isOverlaped = false;

        if (this.lastSpawnX !== null && Math.abs(x - this.lastSpawnX) < this.minSpawnDistance) {
            isOverlaped = true;
        }

        if (!isOverlaped) {
            let cashPot = this.cashPots.create(x, -20, "cashpot");
            cashPot.setVelocityY(this.setVelocityY); // Adjust falling speed

            this.lastSpawnX = x;
            cashPot.setCircle(30, cashPot.width / 2 - 30, cashPot.height / 2 - 15);
            cashPot.setScale(this.deviceType === "mobile" ? 0.5 : 1);

            let values = [];
            function getCashPotValuesForLevel(level) {
                if (level <= 7) {
                    return [2];
                } else if (level <= 9) {
                    return [2, 3, 5];
                } else if (level <= 12) {
                    return [2, 3, 5, 8, 10, 15];
                } else {
                    // Higher levels, allow a few high values
                    return [2, 3, 5, 8, 10, 15, 25, 40, 75, 100];
                }
            }

            values = getCashPotValuesForLevel(this.gameLevel);

            // function getRandomNumber() {
            //     // Generate a random number between 0 and 1
            //     let randomNum = Math.random();

            //     // Scale it to the range [0.01, 0.25]
            //     return (0.01 + randomNum * (0.25 - 0.01)).toFixed(2);
            // }

            function getRandomNumber() {
                let randomNum = Math.random();
                return Math.floor(0 + randomNum * values.length);
            }

            // let cashPotValue = getRandomNumber();
            let cashPotValue = values[getRandomNumber()];
            // let cashPotValue = multiplier;

            cashPot.strength = cashPotValue;
            cashPot.value = cashPotValue;
            cashPot.strengthText = this.add.text(
                cashPot.x - (cashPot.value > 10 ? 17 : 15),
                cashPot.y + 4,
                `${cashPot.strength}x`,
                {
                    fontSize: `${this.deviceType === "mobile" ? 20 : 24}px`,
                    fill: "black",
                    fontStyle: "bold",
                }
            );
            cashPot.strengthText.setDepth(1);
            this.barrelsBlustAfterMinReqLevel = false;
        }
    }

    spawnBomb(width) {
        let x = Phaser.Math.Between(30, width);
        let isOverlaped = false;

        if (this.lastSpawnX !== null && Math.abs(x - this.lastSpawnX) < this.minSpawnDistance) {
            // If too close, adjust the position by adding the minimum distance
            // x += this.minSpawnDistance;
            // // Ensure it doesn't go beyond the game bounds
            // if (x > width) x = width;
            isOverlaped = true;
        }

        if (!isOverlaped) {
            // Create the bomb
            let bomb = this.bombs.create(x, -20, "bomb");
            bomb.setVelocityY(this.setVelocityY); // Adjust falling speed
            // bomb.setScale(this.deviceType === "mobile" ? 0.7 : 1);
            // bomb.setCircle(bomb.width / 2);
            bomb.setCircle(
                26, //width
                bomb.width / 2 - 32, // offSetX
                bomb.height / 2 - (this.deviceType === "mobile" ? 15 : 20) // offSetY
            );
            this.lastSpawnX = x;
            if (this.deviceType === "mobile") {
                bomb.setScale(0.7, 0.7);
            } else {
                bomb.setScale(1.3, 1);
            }
            // this.barrelsBlustAfterMinReqLevel = false;
        }
    }

    spawnBarrel(width) {
        let x = Phaser.Math.Between(30, width);
        let isOverlaped = false;

        if (this.lastSpawnX !== null && Math.abs(x - this.lastSpawnX) < this.minSpawnDistance) {
            // If too close, adjust the position by adding the minimum distance
            // x += this.minSpawnDistance;
            // if (x > width) x = width;
            console.log("overlapped");
            isOverlaped = true;
        }

        if (!isOverlaped) {
            // Create the barrel
            let barrel = this.barrels.create(x, -20, "barrel");
            barrel.setVelocityY(this.setVelocityY); // Adjust falling speed
            // barrel.setOffset(-5,-10)
            barrel.setCircle(26, barrel.width / 2 - 25, barrel.height / 2 - (this.deviceType === "mobile" ? 15 : 20));
            // barrel.setScale(this.deviceType === "mobile" ? 0.8 : 1.2);

            this.lastSpawnX = x;

            if (this.deviceType === "mobile") {
                barrel.setScale(0.7, 0.7);
            } else {
                barrel.setScale(1.3, 1);
            }

            function getRandomNumber() {
                let randomNum = Math.random();
                return 0.01 + randomNum * (0.25 - 0.01);
            }

            let barrelStrength = getRandomNumber().toFixed(2);
            barrel.strength = barrelStrength;
            barrel.value = barrelStrength;
            // Create a text object to display the strength
            barrel.strengthText = this.add
            .text(barrel.x, barrel.y, `${isOverlaped ? "##" : barrel.strength}x`, {
                fontSize: this.deviceType === "mobile" ? "8px" : "15px",
                fill: "#ffffff",
            })
            .setOrigin(0.5, this.deviceType === "mobile" ? 2.6 : 2.4);
            barrel.strengthText.setDepth(1);
        }
    }

    hitBarrel(bullet, barrel) {
        bullet.destroy();
        barrel.strength = (barrel.strength - 0.01).toFixed(2);
        barrel.strengthText.setText(`${barrel.strength}x`);

        // Check if the barrel should be destroyed
        if (barrel.strength <= 0) {
            if (!this.barrelsBlustAfterMinReqLevel && this.cashPotAppendLevel.includes(this.gameLevel)) {
                if (this.cashPotAppendCurrentLevel == null || this.cashPotAppendCurrentLevel !== this.gameLevel) {
                    this.barrelsBlustAfterMinReqLevel = true;
                }
            }
            this.updateScore(barrel.value);
            // Destroy the barrel and the text
            barrel.destroy();
            barrel.strengthText.destroy();
            this.explosionSound.play();
            this.explosion = this.add.sprite(barrel.x, barrel.y, "explosion");
            this.explosion.play("explode");
            this.explosion.setScale(this.deviceType === "mobile" ? 0.4 : 0.8);

            let gameMode = sessionStorage.getItem("gameMode");
            gameMode !== "practice" && this.updateLevel();
        }
    }

    hitCashPot(bullet, cashPot) {
        this.updateScore(cashPot.value);
        this.cashPotSound.play();

        // play blust animation
        this.explosion = this.add.sprite(cashPot.x, cashPot.y, "explosion");
        this.explosion.play("explode");
        this.explosion.setScale(this.deviceType === "mobile" ? 0.4 : 0.8);

        let cashPotHits = JSON.parse(localStorage.getItem("cashPotHits")) || [];
        cashPotHits = [...cashPotHits, cashPot.value];
        localStorage.setItem("cashPotHits", JSON.stringify(cashPotHits));

        cashPot.destroy();
        bullet.destroy();
        cashPot.strengthText.destroy();
        let gameMode = sessionStorage.getItem("gameMode");
        gameMode !== "practice" && this.updateLevel();

        this.spawnSpeed = 10;
        this.spawnObject.delay = this.spawnSpeed;
    }

    hitBomb(bullet, bomb) {
        this.explosionSound.play();
        this.explosion = this.add.sprite(bomb.x, bomb.y, "explosion");
        this.explosion.play("explode");
        this.explosion.setScale(this.deviceType === "mobile" ? 0.4 : 0.8);
        this.gameOver();
    }

    updateMagazineBar() {
        // Clear previous graphics
        this.magazineBar.clear();
        // Calculate the width of the bar based on the remaining bullets
        // Full width 200px
        let barWidth = 200 * (this.bulletsRemaining / this.magazineSize);
        let barHeight = 20;

        // Draw the magazine bar background (empty state)
        this.magazineBar.fillStyle(0x808080); // Grey background
        this.magazineBar.fillRect(2, 2, 200, barHeight);

        // Draw the magazine bar (filled state)
        this.magazineBar.fillStyle(0xff8c00); // yellow for remaining bullets
        this.magazineBar.fillRect(2, 2, barWidth, barHeight);
    }

    updateScore(updatedScore) {
        this.score += Number((+updatedScore).toFixed(2));
    }

    gameOver() {
        //  if want to show the reason of game over add reason to paramiter and show reasonText.
        // reason = "Reason of game over..."
        // Restart the game or show "Game Over" screen

        // const reasonText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, reason, {
        //     fontSize: "32px",
        //     fill: "#ff0000",
        // });
        // reasonText.setOrigin(0.5, 0.5);
        this.gameEnd = true;
        this.physics.pause(); // Disable game controls (optional)
        this.spawnObject.remove(); // stop spawning barrels.

        // wait for 2s for the user to see the reason of game over.
        this.time.delayedCall(2000, () => {
            // reasonText.destroy();
            console.log("publish update score fn called");

            // dispatch game over event
            publish(updateScore, {
                score: this.score,
                level: this.gameLevel,
            });

            this.scene.start("End", {totalScore: this.score});

            // this.scene.pause("GameScene"); // Pause the main game scene
            // this.scene.launch("EndPopup", {totalScore: this.score});

            sessionStorage.setItem(
                "gameOver",
                JSON.stringify({
                    score: this.score,
                })
            );

            this.resetGameState();
        });

        // starting the game again
        // this.scene.restart();
    }

    resetGameState() {
        this.score = 0;
        this.magazineSize = 25;
        this.bulletsRemaining = this.magazineSize;
        this.canShoot = true;
        this.lastShotTime = 0;
        this.isReloading = false;
        this.shootingInterval = 200;
        this.playerVelocity = 375;

        // resetting game Lavel
        this.weightedAverageScore = localStorage.getItem("weightedAverageScore");
        // this.weightedAverageScore = 1;
        this.gameLevel =
            Math.floor(JSON.parse(localStorage.getItem("weightedAverageScore")) * 10) + 1 <= 7
                ? 3
                : Math.floor(JSON.parse(localStorage.getItem("weightedAverageScore")) * 10) + 1;
        this.gamePreviousLevel = this.gameLevel - 1;
        this.gameSpeed = 1 + this.gameLevel / 10;
        this.spawnSpeed = this.gameLevel < 6 ? 850 : this.gameLevel > 6 || this.gameLevel < 9 ? 600 : 450; // fall of rate
        this.setVelocityY = this.gameLevel < 6 ? 80 : this.gameLevel > 6 || this.gameLevel < 9 ? 120 : 160;
        // this.spawnSpeed = 850 / this.gameSpeed; // fall of rate
        // this.setVelocityY = 80 * this.gameSpeed;

        this.gameEnd = false;
        this.barrelsBlustAfterMinReqLevel = false;
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
            barrelsBlustAfterMinReqLevel: this.barrelsBlustAfterMinReqLevel,
            playerVelocity: this.playerVelocity,
        };

        // console.log("barrel bomb, cashpot", gameState, this.cashPots, this.barrels, this.bombs);

        sessionStorage.setItem("phaserGameState", JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = sessionStorage.getItem("phaserGameState");

        if (savedState) {
            const gameState = JSON.parse(savedState);

            this.player.setPosition(gameState.playerPosition.x, this.game.config.height - 150);
            this.playerVelocity = gameState.playerVelocity;
            this.score = gameState.score;
            this.gameLevel = gameState.gameLevel;
            this.bulletsRemaining = gameState.bulletsRemaining;
            this.setVelocityY = gameState.gameVelocity;
            this.barrelsBlustAfterMinReqLevel = gameState.barrelsBlustAfterMinReqLevel;

            //  create every object with the saved value.

            gameState.bombs.forEach((bombData) => {
                const bomb = this.bombs.create(bombData.x, bombData.y, "bomb");
                bomb.setVelocityY(bombData.velocityY); // Adjust falling speed
                bomb.setCircle(
                    26, //width
                    bomb.width / 2 - 32, // offSetX
                    bomb.height / 2 - (this.deviceType === "mobile" ? 15 : 20) // offSetY
                );

                if (this.deviceType === "mobile") {
                    bomb.setScale(0.7, 0.7);
                } else {
                    bomb.setScale(1.3, 1);
                }
            });

            gameState.barrels.forEach((barrelData) => {
                let barrel = this.barrels.create(barrelData.x, barrelData.y, "barrel");
                barrel.setVelocityY(barrelData.velocityY);
                barrel.setCircle(
                    26,
                    barrel.width / 2 - 25,
                    barrel.height / 2 - (this.deviceType === "mobile" ? 15 : 20)
                );

                barrel.strength = barrelData.strength;
                barrel.value = barrelData.value;
                barrel.strengthText = this.add
                .text(barrel.x, barrel.y, `${barrel.strength}x`, {
                    fontSize: this.deviceType === "mobile" ? "8px" : "15px",
                    fill: "#ffffff",
                    fontStyle: "bold",
                })
                .setOrigin(0.5, this.deviceType === "mobile" ? 2.6 : 2.4);
                barrel.strengthText.setDepth(1);

                if (this.deviceType === "mobile") {
                    barrel.setScale(0.7, 0.7);
                } else {
                    barrel.setScale(1.3, 1);
                }
            });

            gameState.cashPots.forEach((cashPotData) => {
                let cashPot = this.cashPots.create(cashPotData.x, cashPotData.y, "cashpot");
                cashPot.setVelocityY(cashPotData.velocityY);
                cashPot.setCircle(30, cashPot.width / 2 - 30, cashPot.height / 2 - 15);
                cashPot.strength = cashPotData.value; // Random value
                cashPot.value = cashPotData.value;
                cashPot.strengthText = this.add.text(
                    cashPot.x - (cashPot.value > 10 ? 17 : 15),
                    cashPot.y + 4,
                    `${cashPot.strength}x`,
                    {
                        fontSize: `${this.deviceType === "mobile" ? 20 : 24}px`,
                        fill: "black",
                        fontStyle: "bold",
                    }
                );
                cashPot.strengthText.setDepth(1);
                cashPot.setScale(this.deviceType === "mobile" ? 0.5 : 1);
            });
        }
    }
}

export default GameScene;
