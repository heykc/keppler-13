export const adjustAspectRatio = ({ canvas, ctx }) => {
  function fix_dpi() {
    const dpi = window.devicePixelRatio;
    const style_height = +getComputedStyle(canvas)
      .getPropertyValue("height").slice(0, -2);
    const style_width = +getComputedStyle(canvas)
      .getPropertyValue("width").slice(0, -2);

    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
  }
  canvas.height = canvas.width / 1.5;
  fix_dpi();
  ctx.scale(canvas.width / 120, canvas.width / 120);
};

export const keyMap = {
  39: 'right',
  37: 'left',
  38: 'up',
  40: 'down'
};