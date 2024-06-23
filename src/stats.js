"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stats = void 0;
const config_1 = __importDefault(require("./config"));
class Stats {
    constructor() {
        this.hp = config_1.default.totalHp;
        this.gameOver = false;
        this.score = 0;
    }
    reset() {
        this.hp = config_1.default.totalHp;
        this.gameOver = false;
        this.score = 0;
    }
}
const stats = new Stats();
exports.stats = stats;
//# sourceMappingURL=stats.js.map