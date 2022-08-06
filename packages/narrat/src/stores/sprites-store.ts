import { warning } from '@/utils/error-handling';
import { getImage } from '@/utils/images-loader';
import { randomId } from '@/utils/randomId';
import { defineStore } from 'pinia';
import { useVM } from './vm-store';

export interface SpriteState {
  id: string;
  x: number;
  y: number;
  anchor: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  image: string;
  opacity: number;
  scale: number;
  layer: number;
  onClick?: string;
}

export interface SpriteStoreState {
  sprites: SpriteState[];
}

export type SpriteStoreSave = {
  sprites: SpriteState[];
};

export const useSprites = defineStore('sprites', {
  state: () =>
    ({
      sprites: [],
    } as SpriteStoreState),
  actions: {
    createSprite(image: string, x: number, y: number) {
      const id = randomId();
      const sprite: SpriteState = {
        id,
        x,
        y,
        anchor: {
          x: 0.5,
          y: 0.5,
        },
        image,
        opacity: 1,
        scale: 1,
        layer: 0,
        width: 1,
        height: 1,
      };
      this.sprites.push(sprite);
      getImage(image).then((image) => {
        const newSprite = this.getSprite(sprite.id)!;
        if (newSprite) {
          newSprite.width = image.width;
          newSprite.height = image.height;
        }
      });
      return sprite;
    },
    getSprite(id: string) {
      return this.sprites.find((sprite) => sprite.id === id);
    },
    deleteSprite(sprite: SpriteState) {
      const index = this.sprites.indexOf(sprite);
      if (index === -1) {
        warning(`Sprite ${sprite.id} not found in sprites store`);
        return;
      }
      this.sprites.splice(index, 1);
    },
    clickSprite(sprite: SpriteState) {
      if (sprite.onClick) {
        useVM().jumpToLabel(sprite.onClick);
      }
    },
    generateSaveData(): SpriteStoreSave {
      return {
        sprites: this.sprites,
      };
    },
    loadSaveData(data: SpriteStoreSave) {
      this.sprites = data.sprites;
    },
    reset() {
      this.sprites = [];
    },
  },
});