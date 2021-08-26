import { easeIn } from "../utils/animation";

const state = {
  pos: { x: 0, y: 0 },
  r: 0,
  c: 0,
  w: 18,
  h: 18,
  waitTime: 3000, // ms
  angle: null,
  state: 'thinking',
  action: null,
  speed: .02,
  runSpeed: .05,
  multiplier: 1,
};

const tileOffset = 25 / 2 - state.w / 2

// const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const didPassTile = (destination, prevPos) => {
  const newDx = Math.abs(destination.x + tileOffset - state.pos.x);
  const newDy = Math.abs(destination.y + tileOffset - state.pos.y)
  const didPass = Math.abs(destination.x + tileOffset - state.pos.x) > prevPos.x
    && Math.abs(destination.y + tileOffset - state.pos.y) > prevPos.y;
  return [didPass, {x: newDx, y: newDy}]
}

const moveTowardTile = (destination) => {
  const dx = destination.x + tileOffset - state.pos.x;
  const dy = destination.y + tileOffset - state.pos.y;
  state.angle = Math.atan2(dy, dx);
  let prevPos = {x: Math.abs(dx), y: Math.abs(dy)};

  state.action = function (dt) {
    const [didPass, newPos] = didPassTile(destination, prevPos);
    if (!didPass) {
      prevPos = newPos;
      this.pos.x += Math.cos(state.angle) * state.speed * state.multiplier * dt;
      this.pos.y += Math.sin(state.angle) * state.speed * state.multiplier * dt;
    } else {
      state.state = 'thinking';
      state.action = null;
    }
  }
}

const runTowardTile = (destination) => {
  const dx = destination.x + tileOffset - state.pos.x;
  const dy = destination.y + tileOffset - state.pos.y;
  state.angle = Math.atan2(dy, dx);
  let prevPos = {x: Math.abs(dx), y: Math.abs(dy)};

  state.action = function (dt) {
    const [didPass, newPos] = didPassTile(destination, prevPos);
    if (!didPass) {
      prevPos = newPos;
      this.pos.x += Math.cos(state.angle) * state.runSpeed * state.multiplier * dt;
      this.pos.y += Math.sin(state.angle) * state.runSpeed * state.multiplier * dt;
    } else {
      state.state = 'thinking';
      state.action = null;
    }
  }
}

const createThink = () => {
  const timeToThink = (Math.floor(Math.random() * 3000) + 1000);
  let elapsedTime = 0;

  state.action = function (dt) {
    elapsedTime += dt;
    if (elapsedTime > timeToThink) { 
      state.state = 'moving';
      state.action = null;
    }
  }
}

export const update = (dt, gameState) => {
  if (gameState.debrisTile) {
    runTowardTile(gameState.debrisTile)
    state.multiplier += .8;
    gameState.debrisTile = null;
  }

  if (!state.action) {
    switch (state.state) {
      case 'thinking':
        return createThink(gameState);
      case 'moving':
        const randomTile = gameState.tiles[Math.floor(Math.random() * gameState.tiles.length)];
        return moveTowardTile(randomTile);
      default:
       return createThink(gameState);
    }
  }
  
  state.action(dt);
}

export const draw = ({ ctx }) => {
  ctx.fillStyle = 'green';
  ctx.fillRect(state.pos.x, state.pos.y, state.w, state.h);
};

export const init = (gameState) => {
  const startTile = gameState.tiles[Math.floor(Math.random() * gameState.tiles.length)]
  state.r = startTile.col;
  state.c = startTile.row;
  state.pos = {
    x: startTile.x + tileOffset,
    y: startTile.y + tileOffset,
  };
  
  gameState.drawBatches[2].push(draw);
};