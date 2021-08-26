import { keyMap } from "../utils/screen";
import { easeIn } from "../utils/animation";

let state = {
  pos: { x: 0, y: 0 },
  r: 0,
  c: 0,
  pressedKeys: [],
  keyPressed: false,
  moving: false
};

export const update = () => {};

export const draw = ({ ctx }) => {
  ctx.fillStyle = "rgba(255, 255, 0, .5)";
  const { x, y } = state.pos;
  ctx.fillRect(x, y, state.w, state.h);
};

export const init = (gameState) => {
  state = {
    ...state,
    w: 25,
    h: 25
  };

  gameState.player = state;

  const keydown = ({ keyCode }) => {
    // debugging stuff
    if (keyCode === 90) {
      // z was clicked
      gameState.showMap = true;
      return;
    }
    if (keyCode === 88) {
      // x was clicked
      gameState.showMap = false;
      return;
    }

    const key = keyMap[keyCode];

    if (!key || state.moving || state.pressedKey) {
      return;
    }

    state.pressedKey = key;

    // if (!state.pressedKey || key !== state.pressedKey) {
    //   state.pressedKey = key;
    //   // state.cancelAnimation?.(true);
    //   // state.cancelAnimation = null;
    // }

    let prevSquare = [state.r, state.c];
    switch (key) {
      case "left":
        state.r -= 1;
        break;
      case "right":
        state.r += 1;
        break;
      case "up":
        state.c -= 1;
        break;
      case "down":
        state.c += 1;
        break;
      default:
        break;
    }

    if (state.r > 9 || state.r < 0) {
      state.r = prevSquare[0];
      console.log("Wall...");
      return;
    }
    if (state.c > 2 || state.c < 0) {
      state.c = prevSquare[1];
      console.log("Wall...");
      return;
    }

    state.moving = true;
    const flatIndex = 10 * state.c + state.r;
    const { x, y, contains } = gameState.tiles[flatIndex];
    gameState.animate(
      state.pos,
      { x, y },
      150,
      easeIn,
      () => {
        state.moving = false;
        if (contains) {
          if (contains === 'debris') {
            gameState.debrisTile = gameState.tiles[flatIndex];
          }
          console.log("Landed on", contains);
        }
      }
    );
  };

  const keyup = ({ keyCode }) => {
    const key = keyMap[keyCode];
    if (key && state.pressedKey === key) {
      state.pressedKey = "";
      // state.moving = false;
    }
  };

  const freeSpaces = gameState.tiles.filter(({ contains }) => !contains);
  const startTile = freeSpaces[Math.floor(Math.random() * freeSpaces.length)];
  state.r = startTile.col;
  state.c = startTile.row;
  state.pos = { x: startTile.x, y: startTile.y };

  window.addEventListener("keydown", keydown, false);
  window.addEventListener("keyup", keyup, false);

  gameState.drawBatches[1].push(draw);
};
