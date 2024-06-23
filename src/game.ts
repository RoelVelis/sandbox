import * as ex from 'excalibur';
import { Ship } from './actors/ship';
import { HealthBar } from './actors/health-bar';
import { stats as gameStats } from './stats'; // Alias stats to avoid naming conflict
import { Baddie } from './actors/baddie';
import Config from './config';
import { animManager } from './actors/animation-manager';

export class Game extends ex.Scene {
    random = new ex.Random(1337); // seeded random
    private gameOverText!: ex.Label;
    private restartButton!: ex.Label;
    private highScore: number = 0;
    private player1?: Ship;
    private player2?: Ship;
    private healthBar1?: HealthBar;
    private healthBar2?: HealthBar;
    private scoreText!: ex.Label;
    private baddieTimer!: ex.Timer;
    private stats = gameStats; // Declare stats property and assign the imported stats object
    private isMultiplayer: boolean = false;

    constructor() {
        super();
    }

    onInitialize(engine: ex.Engine) {
        engine.add(animManager);

        this.scoreText = new ex.Label({
            text: "Score: " + this.stats.score,
            pos: ex.vec(80, 50)
        });
        this.scoreText.font.quality = 4;
        this.scoreText.font.size = 30;
        this.scoreText.font.unit = ex.FontUnit.Px;
        this.scoreText.font.family = "Open Sans";
        this.scoreText.transform.coordPlane = ex.CoordPlane.Screen;
        this.scoreText.color = ex.Color.Azure;
        this.scoreText.on('preupdate', () => {
            this.scoreText.text = "Score: " + this.stats.score;
        });
        engine.add(this.scoreText);

        const highscoreText = new ex.Label({
            text: "High Score: " + this.highScore,
            pos: ex.vec(80, 100)
        });
        highscoreText.font.quality = 4;
        highscoreText.font.size = 20;
        highscoreText.font.unit = ex.FontUnit.Px;
        highscoreText.font.family = "Open Sans";
        highscoreText.transform.coordPlane = ex.CoordPlane.Screen;
        highscoreText.color = ex.Color.Yellow;
        engine.add(highscoreText);

        this.gameOverText = new ex.Label({ text: "Game Over", pos: ex.vec(engine.halfDrawWidth - 300, engine.halfDrawHeight) });
        this.gameOverText.font.quality = 4;
        this.gameOverText.font.size = 60;
        this.gameOverText.color = ex.Color.LightGray.clone();
        this.gameOverText.scale = new ex.Vector(2, 2);

        this.restartButton = new ex.Label({
            text: "Press 'K' to Restart",
            pos: ex.vec(engine.halfDrawWidth, engine.halfDrawHeight + 100),
            font: new ex.Font({
                size: 24,
                unit: ex.FontUnit.Px,
                family: 'Arial',
                textAlign: ex.TextAlign.Center
            }),
            color: ex.Color.White.clone()
        });
        this.restartButton.actions.blink(500, 500, 200);

        this.baddieTimer = new ex.Timer({
            fcn: () => {
                var bad = new Baddie(this.random.floating(this.camera.viewport.left, this.camera.viewport.right), -100, 80, 80);
                engine.add(bad);
            },
            interval: Config.spawnTime,
            repeats: true,
            numberOfRepeats: -1
        });

        engine.addTimer(this.baddieTimer);
        this.baddieTimer.start();

        engine.on('preupdate', () => {
            if (this.stats.gameOver) {
                engine.add(this.gameOverText);
                engine.add(this.restartButton);
                this.highScore = Math.max(this.highScore, this.stats.score);
                highscoreText.text = "High Score: " + this.highScore;
                this.baddieTimer.stop();  // Stop spawning baddies when game is over
            }
        });

        // Start game based on key press
        engine.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
            if (evt.key === ex.Input.Keys.K as ex.Input.Keys) {
                this.isMultiplayer = false;
                this.startGame(engine);
            } else if (evt.key === ex.Input.Keys.M as ex.Input.Keys) {
                this.isMultiplayer = true;
                this.startGame(engine);
            } else if (evt.key === ex.Input.Keys.K as ex.Input.Keys) {
                this.resetGame(engine);
                console.log("Restarting scene...");
            }
        });
    }

    private startGame(engine: ex.Engine) {
        // Reset stats
        this.stats.reset();
        this.stats.score = 0;
        this.stats.gameOver = false;

        // Remove game over text and restart button
        engine.remove(this.gameOverText);
        engine.remove(this.restartButton);

        // Add player 1
        this.player1 = new Ship(engine.halfDrawWidth - 100, 800, 80, 80, {
            up: ex.Input.Keys.W,
            down: ex.Input.Keys.S,
            left: ex.Input.Keys.A,
            right: ex.Input.Keys.D,
            fire: ex.Input.Keys.Space
        });
        engine.add(this.player1);

        if (this.isMultiplayer) {
            // Add player 2
            this.player2 = new Ship(engine.halfDrawWidth + 100, 800, 80, 80, {
                up: ex.Input.Keys.Up,
                down: ex.Input.Keys.Down,
                left: ex.Input.Keys.Left,
                right: ex.Input.Keys.Right,
                fire: ex.Input.Keys.Enter
            });
            engine.add(this.player2);
        }

        // Add health bars
        this.healthBar1 = new HealthBar();
        engine.add(this.healthBar1);

        if (this.isMultiplayer) {
            this.healthBar2 = new HealthBar();
            engine.add(this.healthBar2);
        }

        // Restart baddie timer
        this.baddieTimer.start();
    }

    private resetGame(engine: ex.Engine) {
        // Reset game variables to initial state
        this.stats.score = 0;
        this.stats.gameOver = false;
        this.highScore = Math.max(this.highScore, this.stats.score);
        this.scoreText.text = "Score: " + this.stats.score;

        // Remove game over label and restart button
        engine.remove(this.gameOverText);
        engine.remove(this.restartButton);

        // Remove existing players
        if (this.player1) {
            this.player1.kill();
            this.player1 = undefined;
        }
        if (this.isMultiplayer && this.player2) {
            this.player2.kill();
            this.player2 = undefined;
        }

        // Remove existing health bars
        if (this.healthBar1) {
            this.healthBar1.kill();
            this.healthBar1 = undefined;
        }
        if (this.isMultiplayer && this.healthBar2) {
            this.healthBar2.kill();
            this.healthBar2 = undefined;
        }

        // Start new game
        this.startGame(engine);
    }
}
