import * as ex from "excalibur";

import fighterFile from '../res/fighter.png';
import enemyFile  from '../res/enemy.png';
import spriteexplosionFile from '../res/spriteexplosion.png';
import gameSheetFile from '../res/gameSheet.png';



const Images: { [key: string]: ex.ImageSource } = {
    fighter: new ex.ImageSource(fighterFile),
    enemyPink: new ex.ImageSource(enemyFile),
    explosion: new ex.ImageSource(spriteexplosionFile),
    sheet: new ex.ImageSource(gameSheetFile),
};



const explosionSpriteSheet = ex.SpriteSheet.fromImageSource({ 
    image: Images.explosion,
    grid: {
        rows: 5,
        columns: 5,
        spriteWidth: 45,
        spriteHeight: 45
    }
});
const gameSheet = ex.SpriteSheet.fromImageSource({
    image: Images.sheet, 
    grid: {
        rows: 10,
        columns: 10,
        spriteWidth: 32, 
        spriteHeight: 32
    }
});

const loader = new ex.Loader();
const allResources = {...Images};
for (const res in allResources) {
    loader.addResource(allResources[res]);
}

export { Images, loader, explosionSpriteSheet, gameSheet };