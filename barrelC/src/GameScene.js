import Phaser from "phaser";

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: "GameScene"});
    }

    preload() {
        // Load assets here
        this.load.image("bg", "/bg2.png");
        this.load.image("barrel", "/apple.png"); // Replace with actual path
        this.load.image("player", "/player.png");
        this.load.image("bullet", "/bullet.png");
        this.load.image("cashpot", "/cashpot.png");
        this.load.image("bomb", "/bomb.png");
    }

    create() {
        // add Background

        this.add.image(0,0,"bg").setOrigin(0,0)

        // Add player sprite
        this.player = this.physics.add.sprite(400, 550, "player").setCollideWorldBounds(true);

        // Create barrel group
        this.barrels = this.physics.add.group();

        // Create cash pot group
        this.cashPots = this.physics.add.group();

        // Create bomb group
        this.bombs = this.physics.add.group();

        // Add controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Cooldown bar setup
        this.cooldown = 100;
        this.shooting = false;
        this.cooldownTimer = 0;

        // Setup bullets
        this.bullets = this.physics.add.group();

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
    }

    shootBullet() {
        let bullet = this.bullets.create(this.player.x, this.player.y - 20, "bullet");
        bullet.setVelocityY(-400); // Adjust speed
    }    
    
    
    spawnBarrel() {
        let x = Phaser.Math.Between(50, 750);
        let barrel = this.barrels.create(x, 0, "barrel");
        barrel.setVelocityY(200); // Speed increases over time
        barrel.multiplier = Phaser.Math.FloatBetween(0.1, 0.25); // Random multiplier
    }

    hitBarrel(bullet, barrel) {
        this.score += barrel.multiplier; // Add multiplier to score
        barrel.destroy();
        bullet.destroy();
        // Increase difficulty over time
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
