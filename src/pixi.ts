import * as PIXI from 'pixi.js';
import * as Stats from './stats';

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}
PIXI.utils.sayHello(type);

const colors = [
  0xb92699,
  0xfe802c,
  0xa6ce3a,
  0xff5253,
  0xffdd58,
  0xcbbcb9
];

// Create a Pixi Application
let app = new PIXI.Application({
  antialias: false
});

app.renderer.backgroundColor = 0x19194f;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

const stats = Stats();
document.body.appendChild(stats.dom);

// Lines

const lines: PIXI.Graphics[] = [];

for (let i = 0; i < 6; i++) {
  const line = new PIXI.Graphics();
  line.lineStyle(4, colors[i], 1);
  line.x = i * 100;
  line.y = window.innerHeight / 2 - 2;
  lines.push(line);
  app.stage.addChild(line);
}

app.ticker.add(delta => {
  stats.update();
  appLoop(delta)
});

let ty = 0;
let mx = 0, my = 0;
function appLoop(delta: Number) {
  const x = mx + 1;
  const radians = (ty++ % 360) * (Math.PI / 180);
  const y = Math.sin(radians) * 100;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    line.moveTo(mx, my);
    line.lineTo(x, y);
  }
  mx = x;
  my = y;
}
