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
exports.animManager = exports.AnimationManager = void 0;
var ex = require("excalibur");
var AnimationManager = /** @class */ (function (_super) {
    __extends(AnimationManager, _super);
    function AnimationManager() {
        var _this = _super.call(this, {
            pos: ex.Vector.Zero,
            width: 0,
            height: 0,
            collisionType: ex.CollisionType.PreventCollision,
        }) || this;
        _this.animations = [];
        _this.graphics.onPostDraw = function (ctx) { return _this.drawAnimations(ctx); };
        return _this;
    }
    AnimationManager.prototype.play = function (animation, pos) {
        this.animations.push({
            anim: animation.clone(),
            pos: pos.clone()
        });
    };
    AnimationManager.prototype.onPostUpdate = function (engine, elapsed) {
        this.animations.forEach(function (a) { return a.anim.tick(elapsed, engine.stats.currFrame.id); });
        this.animations = this.animations.filter(function (a) { return !a.anim.done; });
    };
    AnimationManager.prototype.drawAnimations = function (ctx /*, delta: number */) {
        for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
            var node = _a[_i];
            node.anim.draw(ctx, node.pos.x - node.anim.width / 2, node.pos.y - node.anim.height / 2);
        }
    };
    return AnimationManager;
}(ex.Actor));
exports.AnimationManager = AnimationManager;
var animManager = new AnimationManager();
exports.animManager = animManager;
