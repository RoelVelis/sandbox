"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSheet = exports.explosionSpriteSheet = exports.loader = exports.Images = void 0;
var ex = require("excalibur");
var fighter_png_1 = require("../res/fighter.png");
var enemy_png_1 = require("../res/enemy.png");
var spriteexplosion_png_1 = require("../res/spriteexplosion.png");
var gameSheet_png_1 = require("../res/gameSheet.png");
var Images = {
    fighter: new ex.ImageSource(fighter_png_1.default),
    enemyPink: new ex.ImageSource(enemy_png_1.default),
    explosion: new ex.ImageSource(spriteexplosion_png_1.default),
    sheet: new ex.ImageSource(gameSheet_png_1.default),
};
exports.Images = Images;
var explosionSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: Images.explosion,
    grid: {
        rows: 5,
        columns: 5,
        spriteWidth: 45,
        spriteHeight: 45
    }
});
exports.explosionSpriteSheet = explosionSpriteSheet;
var gameSheet = ex.SpriteSheet.fromImageSource({
    image: Images.sheet,
    grid: {
        rows: 10,
        columns: 10,
        spriteWidth: 32,
        spriteHeight: 32
    }
});
exports.gameSheet = gameSheet;
var loader = new ex.Loader();
exports.loader = loader;
var allResources = __assign({}, Images);
for (var res in allResources) {
    loader.addResource(allResources[res]);
}
