export const lerp = (start, end, t) => start + t * (end - start);

export const easeIn = (t, e = 2) => t ** e;

/**
 * Function that creates an animation and adds it to the animations Map that will run every frame
 * returns a function that allows you to cancel animation early if desired.
 *
 * @param {Vector2} start - start position
 * @param {Vector2} end - end position
 * @param {number} speed - length of time for animation (ms)
 * @param {Function|null} easing - the type of ease to put on animation
 * @param {Function|undefined} callback - callback to run when animation finishes
 * @returns {Function} - cancels animation early when ran
 */
export function animate(start, end, speed, easing, callback) {
  const origin = { ...start };
  let elapsedTime = 0;
  const ease =
    easing ||
    function (p) {
      return p;
    };
  const id = Math.floor(Math.random() * 100000);

  const cancelAnimation = (finish) => {
    if (finish) {
      start.x = end.x;
      start.y = end.y;
    }
    this.animations.delete(id);
    callback(id);
  };

  const anim = (dt, animations) => {
    elapsedTime += dt;
    let percent = elapsedTime / speed;
    percent = percent >= 1 ? 1 : percent;

    start.x = lerp(origin.x, end.x, ease(percent));
    start.y = lerp(origin.y, end.y, ease(percent));

    if (percent === 1 && animations.has(id)) {
      cancelAnimation();
    }
  };

  this.animations.set(id, anim);
  return cancelAnimation;
}
