// get html elements
const canvas_back = document.getElementById('canvas_back');
const canvas_draw = document.getElementById('canvas_draw');
const canvas_move = document.getElementById('canvas_move');
const fpsDisplay = document.getElementById('fps');
const inpsDisplay = document.getElementById('inps');
const inpre = document.getElementById('inpre');
const inpim = document.getElementById('inpim');
const restartBtn = document.getElementById('restart');

// canvas contexts
const ctx_back = canvas_back.getContext('2d');
const ctx_draw = canvas_draw.getContext('2d');
const ctx_move = canvas_move.getContext('2d');

// define constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const X_CENTER = CANVAS_WIDTH / 2;
const Y_CENTER = CANVAS_HEIGHT / 2;
const SCALE = 100;

const CALC_COUNT = 10000;
const CALC_DRAW = 10000;

// declaration
let dt = 1/60;
let speed = 1;
let cnt;
let inx;
let iny;
let oldx;
let oldy;
let t_prev;

// start
window.onload = windowload;
restartBtn.onclick = restart;

function windowload() {
  restart();
  animationLoop();
}

function restart() {
  const reval = validate(inpre.value, 0.5);
  const imval = validate(inpim.value, 0);
  cnt = 0;
  inx = parseFloat(reval);
  iny = parseFloat(imval);
  oldx = 0;
  oldy = 0;
  t_prev = Date.now();
  clearGrid(ctx_back);
  clearCanvas(ctx_draw);
}

function validate(val, def) {
  const num = Number(val);
  let result = def;
  if (val.trim() !== "" && !Number.isNaN(num)) {
    result = num;
  }
  return result;
}

// frame task
function taskPerFrame() {

  let startx = 0;
  let starty = 0;

  for (let n = 1; n < CALC_COUNT; n++) {
    let sgn = (n% 2 === 0) ? -1 : 1;
    let size = Math.pow(n, -inx);
    let armx = size * Math.cos (-iny * Math.log(n)) * sgn;
    let army = size * Math.sin(-iny * Math.log(n)) * sgn;
    let endx = startx + armx;
    let endy = starty + army;

    if (n< CALC_DRAW) {
      drawRealLine (ctx_move, startx, starty, endx, endy, 'blue');
    }

    startx = endx;
    starty = endy;
  }
  if (cnt > 0) {
    drawRealLine (ctx_draw, oldx, oldy, startx, starty, 'green');
  }

  // display input s
  inpsDisplay.textContent = `s = ${inx.toFixed(2)} + ${iny.toFixed(2)}i`;

  oldx = startx;
  oldy = starty;
  cnt++;
  iny += dt * speed;

}

function drawLine(startx, starty, endx, endy, color, lineWidth, ctx) {
  // draw line
  ctx.beginPath();
  ctx.moveTo(startx, starty);
  ctx.lineTo(endx, endy);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function clearCanvas (ctx) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function clearGrid (ctx) {
  clearCanvas (ctx);
  drawLine(0, Y_CENTER, CANVAS_WIDTH, Y_CENTER, 'gray', 1, ctx);
  drawLine(X_CENTER, 0, X_CENTER, CANVAS_HEIGHT, 'gray', 1, ctx);

  for (let dp=SCALE; dp<CANVAS_WIDTH/2; dp+=SCALE) {
    drawLine(0, Y_CENTER+dp, CANVAS_WIDTH, Y_CENTER+dp, '#e0e0e0', 1, ctx);
    drawLine(0, Y_CENTER-dp, CANVAS_WIDTH, Y_CENTER-dp, '#e0e0e0', 1, ctx);
    drawLine(X_CENTER+dp, 0, X_CENTER+dp, CANVAS_HEIGHT, '#e0e0e0', 1, ctx);
    drawLine(X_CENTER-dp, 0, X_CENTER-dp, CANVAS_HEIGHT, '#e0e0e0', 1, ctx);
  }
}

function drawRealLine (ctx, x1, y1, x2, y2, color, lineWidth=1) {
  drawLine(
    X_CENTER + SCALE * x1,
    Y_CENTER - SCALE * y1,
    X_CENTER + SCALE * x2,
    Y_CENTER - SCALE * y2,
    color,
    lineWidth,
    ctx
  );
}

function animationLoop() {

  // calc FPS
  if (cnt % 60 === 0 && cnt > 0) {
    let t_now = Date.now();
    let fps = 60 / ((t_now - t_prev) / 1000);
    fpsDisplay.textContent = `FPS: ${fps.toFixed(2)}`;
    t_prev=t_now;
  }

  // draw arm
  clearCanvas (ctx_move);
  taskPerFrame();

  // request next frame
  requestAnimationFrame(animationLoop);
}
