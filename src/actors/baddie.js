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
exports.Baddie = void 0;
var ex = require("excalibur");
var resources_1 = require("../resources");
var config_1 = require("../config");
var bullet_1 = require("./bullet");
var animation_manager_1 = require("./animation-manager");
var stats_1 = require("../stats");
var Baddie = /** @class */ (function (_super) {
    __extends(Baddie, _super);
    function Baddie(x, y, width, height) {
        var _this = _super.call(this, {
            pos: new ex.Vector(x, y),
            width: width,
            height: height,
        }) || this;
        _this.fireAngle = Math.random() * Math.PI * 2;
        // Passive recieves collision events but does not participate in resolution
        _this.body.collisionType = ex.CollisionType.Passive;
        // Enemy groups does not collide with itself
        _this.body.group = Baddie.group;
        // Setup listeners
        _this.on('precollision', function (evt) { return _this.onPreCollision(evt); });
        return _this;
    }
    // OnInitialize is called before the 1st actor update
    Baddie.prototype.onInitialize = function (engine) {
        // Initialize actor
        var _this = this;
        // Setup visuals
        this.anim = ex.Animation.fromSpriteSheet(resources_1.gameSheet, [9, 10, 11], 100, ex.AnimationStrategy.Loop);
        this.anim.scale = new ex.Vector(4, 4);
        this.graphics.use(this.anim);
        this.explode = ex.Animation.fromSpriteSheet(resources_1.explosionSpriteSheet, ex.range(0, resources_1.explosionSpriteSheet.sprites.length - 1), 40, ex.AnimationStrategy.End);
        this.explode.scale = new ex.Vector(3, 3);
        // Setup patrolling behavior
        this.actions.repeatForever(function (ctx) {
            return ctx.moveTo(_this.pos.x, _this.pos.y + 800, config_1.default.enemySpeed)
                .moveTo(_this.pos.x + 800, _this.pos.y, config_1.default.enemySpeed)
                .moveTo(_this.pos.x + 800, _this.pos.y + 800, config_1.default.enemySpeed)
                .moveTo(_this.pos.x, _this.pos.y, config_1.default.enemySpeed);
        });
        // Setup firing timer, repeats forever
        this.fireTimer = new ex.Timer({
            fcn: function () { _this.fire(engine); },
            interval: config_1.default.enemyFireInterval,
            repeats: true,
            numberOfRepeats: -1
        });
        engine.addTimer(this.fireTimer);
        this.fireTimer.start();
    };
    // Fires before excalibur collision resoulation
    Baddie.prototype.onPreCollision = function (evt) {
        // only kill a baddie if it collides with something that isn't a baddie or a baddie bullet
        if (!(evt.other instanceof Baddie) &&
            !ex.Util.contains(Baddie.Bullets, evt.other)) {
            if (this.explode) {
                animation_manager_1.animManager.play(this.explode, this.pos);
            }
            stats_1.stats.score += 100;
            if (this.fireTimer) {
                this.fireTimer.cancel();
            }
            this.kill();
        }
    };
    Baddie.prototype.fire = function (engine) {
        this.fireAngle += Math.PI / 20;
        var bulletVelocity = new ex.Vector(config_1.default.enemyBulletVelocity * Math.cos(this.fireAngle), config_1.default.enemyBulletVelocity * Math.sin(this.fireAngle));
        var bullet = new bullet_1.Bullet(this.pos.x, this.pos.y, bulletVelocity.x, bulletVelocity.y, Baddie.group);
        Baddie.Bullets.push(bullet);
        engine.add(bullet);
    };
    Baddie.group = ex.CollisionGroupManager.create('enemy');
    // All bullets belonging to baddies
    Baddie.Bullets = [];
    return Baddie;
}(ex.Actor));
exports.Baddie = Baddie;
