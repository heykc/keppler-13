import { adjustAspectRatio } from "./utils/screen";
import { animate } from "./utils/animation";
import * as Square from "./modules/square";
import * as Ship from "./modules/ship";
import * as Alien from "./modules/alien";

const gameObjects = [Ship, Square, Alien];

const state = {
  drawBatches: [[], [], []],
  showMap: false,
  done: false,
  animations: new Map()
};

const update = (dt, state) => {
  gameObjects.forEach(({ update: objUpdate }) => objUpdate(dt, state));
  [...state.animations.values()].forEach((anim) => {
    anim(dt, state.animations);
  });
};

const draw = (state) => {
  const { width, height } = state.canvas;
  const margin = 5;
  const { a, d, e, f } = state.ctx.getTransform();
  const xOffset = state.player.pos.x + state.player.w / 2 - width / 2 / a;
  const yOffset = state.player.pos.y + state.player.h / 2 - height / 2 / d;

  state.ctx.clearRect(-5, -5, state.canvas.width + 5, state.canvas.height + 5);
  if (
    !(
      Math.abs(e - -xOffset * a) < margin && Math.abs(f - -yOffset * d) < margin
    )
  ) {
    state.ctx.translate(-xOffset - e / a, -yOffset - f / d);
  }
  state.drawBatches.flat().forEach((func) => func(state));
};

const init = () => {
  let lastRender = 0;
  state.canvas = document.getElementById("game");
  state.ctx = state.canvas.getContext("2d");
  state.animate = animate;

  const loop = (t) => {
    let dt = t - lastRender;
    lastRender = t;

    update(dt, state);
    draw(state);

    window.requestAnimationFrame(loop);
  };

  adjustAspectRatio(state);
  gameObjects.forEach(({ init: objInit }) => objInit(state));
  window.onresize = () => adjustAspectRatio(state);
  window.requestAnimationFrame(loop);
};

init();
