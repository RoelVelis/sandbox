import * as ex from 'excalibur';
import { loader } from './resources'; // Assuming you have a resource loader
import { MainMenu } from './mainmenu';
import { Game } from './game';
import Config from './config';

async function waitForFontLoad(font: string, timeout = 2000, interval = 100) {
    return new Promise((resolve, reject) => {
        const poller = setInterval(async () => {
            try {
                await document.fonts.load(font);
            } catch (err) {
                reject(err);
            }
            if (document.fonts.check(font)) {
                clearInterval(poller);
                resolve(true);
            }
        }, interval);
        setTimeout(() => clearInterval(poller), timeout);
    });
}

const engine = new ex.Engine({
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
engine.add('mainmenu', new MainMenu());
engine.add('game', new Game());
engine.goToScene('mainmenu');

// Game events to handle
engine.on('hidden', () => {
    console.log('pause');
    engine.stop();
});
engine.on('visible', () => {
    console.log('start');
    engine.start();
});

engine.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
    if (evt.key === ex.Input.Keys.P) {
      engine.toggleDebug();
    }
});

waitForFontLoad("normal 30px Open Sans").then(() => {
    engine.start(loader).then(() => {
        console.log("Game Resources Loaded");
    });
});
