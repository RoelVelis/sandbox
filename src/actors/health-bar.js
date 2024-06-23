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
exports.HealthBar = void 0;
var ex = require("excalibur");
var excalibur_1 = require("excalibur");
var config_1 = require("../config");
var stats_1 = require("../stats");
var HealthBar = /** @class */ (function (_super) {
    __extends(HealthBar, _super);
    function HealthBar() {
        var _this = _super.call(this, {
            name: "healthbar",
            color: ex.Color.Green,
            pos: new ex.Vector(20, 20),
        }) || this;
        _this.healthBarWidth = config_1.default.healthBarWidth;
        _this.healthBarHeight = config_1.default.healthBarHeight;
        _this.transform.coordPlane = ex.CoordPlane.Screen;
        _this.body.collisionType = ex.CollisionType.PreventCollision;
        _this.graphics.anchor = excalibur_1.Vector.Zero;
        _this.graphics.use(new ex.Canvas({
            draw: function (ctx) { return _this.draw(ctx); },
            cache: false,
            width: config_1.default.healthBarWidth + 20,
            height: config_1.default.healthBarHeight + 50
        }));
        return _this;
    }
    HealthBar.prototype.onPreUpdate = function () {
        this.healthBarWidth = config_1.default.healthBarWidth * (stats_1.stats.hp / config_1.default.totalHp);
    };
    HealthBar.prototype.draw = function (ctx) {
        ctx.strokeStyle = this.color.toString();
        ctx.fillStyle = this.color.toString();
        ctx.lineWidth = 3;
        ctx.font = 'normal 30px Open Sans';
        ctx.fillText("HP", 0, 30);
        ctx.strokeRect(0, 35, config_1.default.healthBarWidth + 10, config_1.default.healthBarHeight + 10);
        ctx.fillRect(5, 40, this.healthBarWidth, config_1.default.healthBarHeight);
    };
    return HealthBar;
}(ex.Actor));
exports.HealthBar = HealthBar;
