"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ex = require("excalibur");
var resources_1 = require("./resources"); // Assuming you have a resource loader
var mainmenu_1 = require("./mainmenu");
var game_1 = require("./game");
function waitForFontLoad(font_1) {
    return __awaiter(this, arguments, void 0, function (font, timeout, interval) {
        var _this = this;
        if (timeout === void 0) { timeout = 2000; }
        if (interval === void 0) { interval = 100; }
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var poller = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, document.fonts.load(font)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_1 = _a.sent();
                                    reject(err_1);
                                    return [3 /*break*/, 3];
                                case 3:
                                    if (document.fonts.check(font)) {
                                        clearInterval(poller);
                                        resolve(true);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }, interval);
                    setTimeout(function () { return clearInterval(poller); }, timeout);
                })];
        });
    });
}
var engine = new ex.Engine({
    backgroundColor: ex.Color.Black,
    pixelRatio: 2,
    width: 1000,
    height: 800,
    displayMode: ex.DisplayMode.FitScreen
});
engine.debug.entity.showName = true;
engine.backgroundColor = ex.Color.Black;
engine.setAntialiasing(false);
// Setup game scenes
engine.add('mainmenu', new mainmenu_1.MainMenu());
engine.add('game', new game_1.Game());
engine.goToScene('mainmenu');
// Game events to handle
engine.on('hidden', function () {
    console.log('pause');
    engine.stop();
});
engine.on('visible', function () {
    console.log('start');
    engine.start();
});
engine.input.keyboard.on('press', function (evt) {
    if (evt.key === ex.Input.Keys.P) {
        engine.toggleDebug();
    }
});
waitForFontLoad("normal 30px Open Sans").then(function () {
    engine.start(resources_1.loader).then(function () {
        console.log("Game Resources Loaded");
    });
});
