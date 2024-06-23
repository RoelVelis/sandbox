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
exports.Ship = void 0;
var ex = require("excalibur");
var resources_1 = require("../resources");
var config_1 = require("../config");
var bullet_1 = require("./bullet");
var baddie_1 = require("./baddie");
var animation_manager_1 = require("./animation-manager");
var stats_1 = require("../stats");
var throttle = function (func, throttle) {
    var _this = this;
    var lastTime = Date.now();
    var throttle = throttle;
    return function (engine) {
        var currentTime = Date.now();
        if (currentTime - lastTime > throttle) {
            var val = func.apply(_this, [engine]);
            lastTime = currentTime;
            return val;
        }
    };
};
var Ship = /** @class */ (function (_super) {
    __extends(Ship, _super);
    function Ship(x, y, width, height, controls) {
        var _this = _super.call(this, {
            pos: new ex.Vector(x, y),
            width: width,
            height: height,
        }) || this;
        _this.flipBarrel = false;
        _this.stopRegisteringFireThrottleEvent = function () {
            _this.throttleFire = undefined;
        };
        _this.fire = function (engine) {
            var bullet = new bullet_1.Bullet(_this.pos.x + (_this.flipBarrel ? -40 : 40), _this.pos.y - 20, 0, config_1.default.playerBulletVelocity, Ship.group);
            _this.flipBarrel = !_this.flipBarrel;
            engine.add(bullet);
        };
        _this.handleKeyEvent = function (engine, evt) {
            var dir = ex.Vector.Zero.clone();
            if (evt.key === _this.controls.fire) {
                _this.throttleFire ? _this.throttleFire(engine) : null;
                if (_this.vel.x !== 0 || _this.vel.y !== 0) {
                    dir = _this.vel.normalize();
                }
            }
            if (evt.key === _this.controls.up) {
                dir.y += -1;
            }
            if (evt.key === _this.controls.left) {
                dir.x += -1;
            }
            if (evt.key === _this.controls.right) {
                dir.x += 1;
            }
            if (evt.key === _this.controls.down) {
                dir.y += 1;
            }
            if (dir.x !== 0 || dir.y !== 0) {
                _this.vel = dir.normalize().scale(config_1.default.playerSpeed);
            }
        };
        _this.controls = controls;
        _this.body.collisionType = ex.CollisionType.Passive;
        _this.body.group = Ship.group;
        return _this;
    }
    Ship.prototype.onInitialize = function (engine) {
        var _this = this;
        this.throttleFire = throttle(this.fire, config_1.default.playerFireThrottle);
        this.on('precollision', function (evt) { return _this.onPreCollision(evt); });
        // Keyboard
        engine.input.keyboard.on('hold', function (evt) { return _this.handleKeyEvent(engine, evt); });
        engine.input.keyboard.on('release', function (evt) {
            if (evt.key !== _this.controls.fire) {
                _this.vel = ex.Vector.Zero.clone();
            }
        });
        // Get animation
        var anim = ex.Animation.fromSpriteSheet(resources_1.gameSheet, [0, 1, 2], 100, ex.AnimationStrategy.Loop);
        anim.scale = new ex.Vector(4, 4);
        this.graphics.use(anim);
        this.explode = ex.Animation.fromSpriteSheet(resources_1.explosionSpriteSheet, ex.range(0, resources_1.explosionSpriteSheet.sprites.length - 1), 40, ex.AnimationStrategy.End);
        this.explode.scale = new ex.Vector(3, 3);
    };
    Ship.prototype.onPreCollision = function (evt) {
        if (evt.other instanceof baddie_1.Baddie || ex.Util.contains(baddie_1.Baddie.Bullets, evt.other)) {
            this.actions.blink(300, 300, 3);
            stats_1.stats.hp -= config_1.default.enemyDamage;
            if (stats_1.stats.hp <= 0) {
                stats_1.stats.gameOver = true;
                this.kill();
                this.stopRegisteringFireThrottleEvent();
            }
        }
    };
    Ship.prototype.onPostUpdate = function (engine, delta) {
        if (stats_1.stats.hp <= 0 && this.explode) {
            animation_manager_1.animManager.play(this.explode, this.pos);
            this.kill();
        }
        // Keep player in the viewport
        if (this.pos.x < 0)
            this.pos.x = 0;
        if (this.pos.y < 0)
            this.pos.y = 0;
        if (this.pos.x > engine.drawWidth - this.width)
            this.pos.x = (engine.drawWidth - this.width);
        if (this.pos.y > engine.drawHeight - this.height)
            this.pos.y = (engine.drawHeight - this.height);
    };
    Ship.group = ex.CollisionGroupManager.create('player');
    return Ship;
}(ex.Actor));
exports.Ship = Ship;
