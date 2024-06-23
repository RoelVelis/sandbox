import * as ex from 'excalibur';

export class MainMenu extends ex.Scene {
    constructor() {
        super();
    }

    onInitialize(engine: ex.Engine) {
        const startButton = new ex.Label({
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

        engine.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
            if (evt.key === ex.Input.Keys.K) {
                engine.goToScene('game');
            }
        });
    }
}
