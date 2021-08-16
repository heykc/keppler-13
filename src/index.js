import { adjustAspectRatio } from './modules/utils';
import * as Square from './modules/square';
import * as Ship from './modules/ship';

const gameObjects = [
  Ship,
  Square,

];

const state = {
  drawBatches: [
    [],
    [],
    [],
  ],
  showMap: true,
  done: false,
};

const update = (dt, state) => {
  gameObjects.forEach(({ update: objUpdate }) => objUpdate(dt, state));
};

const draw = (state) => {
  const { width, height } = state.canvas;
  const margin = 5;
  const {a, d, e, f} = state.ctx.getTransform();
  const xOffset = state.player.x + (state.player.w / 2) - (width / 2 / a);
  const yOffset = state.player.y + (state.player.h / 2) - (height / 2 / d);
  debugger;
  
  state.ctx.clearRect(-5, -5, state.canvas.width + 5, state.canvas.height + 5);
  if (!(Math.abs(e - -xOffset * a) < margin && Math.abs(f - -yOffset * d) < margin )) {
    state.ctx.translate(-xOffset - (e / a), -yOffset - (f / d));
  }
  state.drawBatches.flat().forEach((func) => func(state));
};

const init = () => {
  let lastRender = 0;
  state.canvas = document.getElementById('game');
  state.ctx = state.canvas.getContext('2d');

  const loop = (t) => {
    let dt = t - lastRender;

    update(dt, state);
    draw(state);

    lastRender = t;
    window.requestAnimationFrame(loop);
  };

  adjustAspectRatio(state);
  gameObjects.forEach(({ init: objInit }) => objInit(state));
  window.onresize = () => adjustAspectRatio(state);
  window.requestAnimationFrame(loop);
};

init();
