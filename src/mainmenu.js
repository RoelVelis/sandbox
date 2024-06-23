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
exports.MainMenu = void 0;
var ex = require("excalibur");
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        return _super.call(this) || this;
    }
    MainMenu.prototype.onInitialize = function (engine) {
        var startButton = new ex.Label({
            text: 'Press K to Start Game',
            pos: ex.vec(engine.halfDrawWidth, engine.halfDrawHeight),
            font: new ex.Font({
                size: 40,
                unit: ex.FontUnit.Px,
                family: 'Arial',
                textAlign: ex.TextAlign.Center
            })
        });
        startButton.color = ex.Color.Azure.clone();
        this.add(startButton);
        engine.input.keyboard.on('press', function (evt) {
            if (evt.key === ex.Input.Keys.K) {
                engine.goToScene('game');
            }
        });
    };
    return MainMenu;
}(ex.Scene));
exports.MainMenu = MainMenu;
