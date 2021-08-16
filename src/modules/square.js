import { keyMap, lerp, easeIn } from './utils';

let state = {
  x: 0,
  y: 0,
  r: 0, 
  c: 0,
  pressedKeys: [],
  keyPressed: false,
  moving: false,
};

const moveTime = 800; // ms
let elapsedTime = 0;

const moveToTile = (tile, percent) => {
  state.x = lerp(state.x, tile.x, percent);
  state.y = lerp(state.y, tile.y, percent);
};

export const update = (dt, gameState) => {
  if (state.moving) {
    const formula = 10 * state.c + state.r;
    const tile = gameState.tiles[formula];
    elapsedTime += dt;
    let percent = elapsedTime / moveTime;
    percent = percent > .4 ? 1 : percent;
    moveToTile(tile, percent);
    if (percent === 1) {
      state.moving = false;
      elapsedTime = 0;
      if (tile.contains) {
        console.log('Landed on', tile.contains);
      }
    }
  }
};

export const draw = ({ ctx }) => {
  ctx.fillStyle = 'rgba(255, 255, 0, .5)';
  ctx.fillRect(state.x, state.y, state.w, state.h);
};

export const init = (gameState) => {
  state = {
    ...state,
    w: 25,
    h: 25,
  };

  gameState.player = state;

  const keydown = ({ keyCode }) => {
    // debugging stuff
    if (keyCode === 90) { // z was clicked
      gameState.showMap = true;
      return;
    }
    if (keyCode === 88) { // x was clicked
      gameState.showMap = false;
      return;
    }
    
    const key = keyMap[keyCode];
    if (!key || state.moving) {
      return;
    }

    state.pressedKey = key;

    let prevSquare = [state.r, state.c];
    switch (key) {
      case 'left': 
        state.r -= 1;
        break;
      case 'right': 
        state.r += 1;
        break;
      case 'up': 
        state.c -= 1;
        break;
      case 'down': 
        state.c += 1;
        break;
      default:
        break;
    }

    if (state.r > 9 || state.r < 0) {
      state.r = prevSquare[0];
      console.log('Wall...');
      return;
    }
    if (state.c > 2 || state.c < 0) {
      state.c = prevSquare[1];
      console.log('Wall...');
      return;
    }
    state.moving = true;
  };
  
  const keyup = ({ keyCode }) => {
    const key = keyMap[keyCode];
    if (key && state.pressedKey === key) {
      state.pressedKey = '';
      // state.moving = false;
    }
  };

  const freeSpaces = gameState.tiles
    .filter(({ contains }) => !contains);
  const startTile = freeSpaces[Math.floor(Math.random() * freeSpaces.length)]
  state.r = startTile.col;
  state.c = startTile.row;
  moveToTile(startTile, 1);
  
  window.addEventListener("keydown", keydown, false);
  window.addEventListener("keyup", keyup, false);

  gameState.drawBatches[1].push(draw);
};