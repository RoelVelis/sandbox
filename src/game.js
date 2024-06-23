"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var ex = require("excalibur");
var ship_1 = require("./actors/ship");
var health_bar_1 = require("./actors/health-bar");
var stats_1 = require("./stats"); // Alias stats to avoid naming conflict
var baddie_1 = require("./actors/baddie");
var config_1 = require("./config");
var animation_manager_1 = require("./actors/animation-manager");
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.random = new ex.Random(1337); // seeded random
        _this.highScore = 0;
        _this.stats = stats_1.stats; // Declare stats property and assign the imported stats object
        _this.isMultiplayer = false;
        return _this;
    }
    Game.prototype.onInitialize = function (engine) {
        var _this = this;
        engine.add(animation_manager_1.animManager);
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
        this.scoreText.on('preupdate', function () {
            _this.scoreText.text = "Score: " + _this.stats.score;
        });
        engine.add(this.scoreText);
        var highscoreText = new ex.Label({
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
            fcn: function () {
                var bad = new baddie_1.Baddie(_this.random.floating(_this.camera.viewport.left, _this.camera.viewport.right), -100, 80, 80);
                engine.add(bad);
            },
            interval: config_1.default.spawnTime,
            repeats: true,
            numberOfRepeats: -1
        });
        engine.addTimer(this.baddieTimer);
        this.baddieTimer.start();
        engine.on('preupdate', function () {
            if (_this.stats.gameOver) {
                engine.add(_this.gameOverText);
                engine.add(_this.restartButton);
                _this.highScore = Math.max(_this.highScore, _this.stats.score);
                highscoreText.text = "High Score: " + _this.highScore;
                _this.baddieTimer.stop(); // Stop spawning baddies when game is over
            }
        });
        // Start game based on key press
        engine.input.keyboard.on('press', function (evt) {
            if (evt.key === ex.Input.Keys.K) {
                _this.isMultiplayer = false;
                _this.startGame(engine);
            }
            else if (evt.key === ex.Input.Keys.M) {
                _this.isMultiplayer = true;
                _this.startGame(engine);
            }
            else if (evt.key === ex.Input.Keys.K) {
                _this.resetGame(engine);
                console.log("Restarting scene...");
            }
        });
    };
    Game.prototype.startGame = function (engine) {
        // Reset stats
        this.stats.reset();
        this.stats.score = 0;
        this.stats.gameOver = false;
        // Remove game over text and restart button
        engine.remove(this.gameOverText);
        engine.remove(this.restartButton);
        // Add player 1
        this.player1 = new ship_1.Ship(engine.halfDrawWidth - 100, 800, 80, 80, {
            up: ex.Input.Keys.W,
            down: ex.Input.Keys.S,
            left: ex.Input.Keys.A,
            right: ex.Input.Keys.D,
            fire: ex.Input.Keys.Space
        });
        engine.add(this.player1);
        if (this.isMultiplayer) {
            // Add player 2
            this.player2 = new ship_1.Ship(engine.halfDrawWidth + 100, 800, 80, 80, {
                up: ex.Input.Keys.Up,
                down: ex.Input.Keys.Down,
                left: ex.Input.Keys.Left,
                right: ex.Input.Keys.Right,
                fire: ex.Input.Keys.Enter
            });
            engine.add(this.player2);
        }
        // Add health bars
        this.healthBar1 = new health_bar_1.HealthBar();
        engine.add(this.healthBar1);
        if (this.isMultiplayer) {
            this.healthBar2 = new health_bar_1.HealthBar();
            engine.add(this.healthBar2);
        }
        // Restart baddie timer
        this.baddieTimer.start();
    };
    Game.prototype.resetGame = function (engine) {
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
    };
    return Game;
}(ex.Scene));
exports.Game = Game;
