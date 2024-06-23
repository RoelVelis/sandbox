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
exports.Bullet = void 0;
var ex = require("excalibur");
var config_1 = require("../config");
var resources_1 = require("../resources");
var baddie_1 = require("./baddie");
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(x, y, dx, dy, collisiongGroup) {
        var _this = _super.call(this, {
            pos: new ex.Vector(x, y),
            vel: new ex.Vector(dx, dy),
            width: config_1.default.bulletSize,
            height: config_1.default.bulletSize,
        }) || this;
        _this.body.collisionType = ex.CollisionType.Passive;
        _this.body.group = collisiongGroup;
        return _this;
    }
    Bullet.prototype.onInitialize = function (engine) {
        var _this = this;
        this.on('precollision', function (evt) { return _this.onPreCollision(evt); });
        // Clean up on exit viewport
        this.on('exitviewport', function () { return _this.killAndRemoveFromBullets(); });
        var anim = ex.Animation.fromSpriteSheet(resources_1.gameSheet, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100, ex.AnimationStrategy.Loop);
        anim.scale = new ex.Vector(2, 2);
        this.graphics.use(anim);
    };
    Bullet.prototype.onPreCollision = function (evt) {
        if (!(evt.other instanceof Bullet)) {
            this.killAndRemoveFromBullets();
        }
    };
    Bullet.prototype.killAndRemoveFromBullets = function () {
        this.kill();
        ex.Util.removeItemFromArray(this, baddie_1.Baddie.Bullets);
    };
    return Bullet;
}(ex.Actor));
exports.Bullet = Bullet;
