"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stats = void 0;
var config_1 = require("./config");
var Stats = /** @class */ (function () {
    function Stats() {
        this.hp = config_1.default.totalHp;
        this.gameOver = false;
        this.score = 0;
    }
    Stats.prototype.reset = function () {
        this.hp = config_1.default.totalHp;
        this.gameOver = false;
        this.score = 0;
    };
    return Stats;
}());
var stats = new Stats();
exports.stats = stats;
