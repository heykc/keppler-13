import { createTiles } from './keyMapping';
import { createWord } from './secretWord';

export const update = (dt, gameState) => {
}

const drawFloor = ({ ctx, tiles, showMap }) => {
  if(!showMap) {
    return;
  }
  tiles.forEach(({name, w, h, x, y, color}) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = '#323232';
    ctx.font = '15px Arial';
    ctx.fillText(
      name,
      x + 2,
      y + 20);
  });
};

const drawCeiling = ({ ctx }) => {
  ctx.fillStyle = 'green';
  ctx.fillRect(50, 50, 25, 25);
};

export const init = (gameState) => {
  const { tiles, charMap } = createTiles();
  gameState.tiles = tiles;
  gameState.charMap = charMap;

  createWord(gameState);
  gameState.drawBatches[0].push(drawFloor);
  // gameState.drawBatches[2].push(drawCeiling);
};