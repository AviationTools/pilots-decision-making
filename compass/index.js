// Pixi.js code
const app = new PIXI.Application({
  width: 400,
  height: 400,
  backgroundColor: 0xffffff,
});
document.getElementById('compass-container').appendChild(app.view);

const graphics = new PIXI.Graphics();

// Draw the compass
graphics.lineStyle(2, 0x000000);
graphics.drawCircle(app.renderer.width / 2, app.renderer.height / 2, 150);
graphics.moveTo(app.renderer.width / 2, app.renderer.height / 2);
graphics.lineTo(app.renderer.width / 2, app.renderer.height / 2 - 140);

// Add labels
const labelPositions = [
  { angle: 0, text: 'N' },
  { angle: 90, text: 'E' },
  { angle: 180, text: 'S' },
  { angle: 270, text: 'W' },
];
const labelStyle = new PIXI.TextStyle({ fill: 0x000000 });
labelPositions.forEach(({ angle, text }) => {
  const x = app.renderer.width / 2 + Math.cos(angle * Math.PI / 180) * 130;
  const y = app.renderer.height / 2 + Math.sin(angle * Math.PI / 180) * 130;
  const label = new PIXI.Text(text, labelStyle);
  label.anchor.set(0.5);
  label.position.set(x, y);
  app.stage.addChild(label);
});

// Draw arrow
const arrow = new PIXI.Graphics();
arrow.lineStyle(2, 0xff0000);
arrow.moveTo(0, 0);
arrow.lineTo(0, -100);
arrow.position.set(app.renderer.width / 2, app.renderer.height / 2);
app.stage.addChild(arrow);

// Slider for rotation control
const slider = document.getElementById('rotation-slider');
slider.addEventListener('input', () => {
  const rotation = parseInt(slider.value);
  arrow.rotation = rotation * (Math.PI / 180);
});

// Initial rotation setup
arrow.rotation = parseInt(slider.value) * (Math.PI / 180);
