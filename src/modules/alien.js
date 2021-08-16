import { keyMap, lerp } from './utils';

const state = {
  x: 0,
  y: 0,
  r: 0,
  c: 0,
  w: 18,
  h: 18,
  waitTime: 3000, // ms
};

const tileOffset = 25 / 2 - state.w / 2
let elapsedTime = 0;
let movement;

const moveToTile = (tile, percent, offset = {x: 0, y: 0}) => {
  state.x = lerp(state.x, tile.x + offset.x, percent);
  state.y = lerp(state.y, tile.y + offset.y, percent);
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const findNewTile = (tiles) => {
  state.r = clamp(state.r + Math.floor(Math.random() * 5) - 2, 0, 9)
  state.c = clamp(state.c + Math.floor(Math.random() * 5) - 2, 0, 2)
  const formula = 10 * state.c + state.r;
  debugger;
  return tiles[formula];
};

const createMove = (destinationTile) => {
  let et = 0;
  let mt = 4000;

  return (dt) => {
    et += dt;
    let t = et / mt;

    t = t > .4 ? 1 : t;
    moveToTile(destinationTile, t, {x: tileOffset, y: tileOffset});
    if (t === 1) {
      elapsedTime = 0;
      state.isMoving = false;
    }
  }
}

export const update = (dt, gameState) => {
  elapsedTime += dt;
  if (elapsedTime > state.waitTime && !state.isMoving) {
    movement = createMove(findNewTile(gameState.tiles));
    state.isMoving = true;
  }
  
  if (state.isMoving) {
    movement(dt);
  }
}

export const draw = ({ ctx }) => {
  ctx.fillStyle = 'green';
  ctx.fillRect(state.x, state.y, state.w, state.h);
};

export const init = (gameState) => {
  const startTile = gameState.tiles[Math.floor(Math.random() * gameState.tiles.length)]
  state.r = startTile.col;
  state.c = startTile.row;
  moveToTile(startTile, 1, {x: tileOffset, y: tileOffset});

  gameState.drawBatches[2].push(draw);
};