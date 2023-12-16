// Initialize Pixi.js
const app = new PIXI.Application({
  width: 800,
  height: 400,
  backgroundColor: 0xffffff
});
document.body.appendChild(app.view);

// Global Variables
let altitudeData = [{ time: 0, altitude: 0 }];
let isTickerRunning = true;
let ticker;
let calculatedAltitude = 30000;
let sliderValue = 0;

// Create a graphics object
const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

function drawScala() {
  drawAltitudeLabels();
  drawTimeLabels()

  const scala = new PIXI.Graphics();
  app.stage.addChild(scala);

  // Grid
  scala.lineStyle(2, 0x000000);
  scala.moveTo(app.renderer.width - 50, app.renderer.height - 50);
  scala.lineTo(50, app.renderer.height - 50);
  scala.lineTo(50, 50);

  // X-axis label
  const xLabel = new PIXI.Text('Time', { fontWeight: 'bold', fontSize: 16 });
  xLabel.x = app.renderer.width - 50;
  xLabel.y = app.renderer.height - 20;
  xLabel.anchor.set(1, 0.5);
  app.stage.addChild(xLabel);

  // Y-axis label
  const yLabel = new PIXI.Text('Altitude', { fontWeight: 'bold', fontSize: 16 });
  yLabel.x = 30;
  yLabel.y = 30;
  yLabel.anchor.set(0, 0.5);
  app.stage.addChild(yLabel);
}

// Ticker function to add new altitude data
function startTicker() {
  const interval = 30;
  let elapsed = 0;
  let i = 0;
  let lastX, lastY; 
  
  graphics.lineStyle(2, 0x000000);
  graphics.moveTo(50, ((calculatedAltitude / 40000) * (app.renderer.height - 100)) - 100);
  
  ticker = app.ticker.add((delta) => {
    
    elapsed += delta;
    if (elapsed >= interval && isTickerRunning) {

      calculatedAltitude = Math.ceil(calculatedAltitude + (sliderValue / 60));
      
      showAltitude.innerText = calculatedAltitude + ' ALT';

      const x = i + 50;
      const y = - ((app.renderer.height - ((calculatedAltitude / 40000) * (app.renderer.height - 100))) * -1) -50;

      graphics.moveTo(lastX, lastY);
      graphics.lineTo(x, y);

      altitudeData.push({ time: i, altitude: calculatedAltitude });
      lastX = x, lastY = y;

      elapsed -= interval;
      i++;
    }
  });
}

// Create a slider for controlling altitude
const altitudeSlider = document.createElement('input');
const sliderName = document.createElement('span');
const showAltitude = document.createElement('p');
sliderName.innerText = '0 V/S'
altitudeSlider.id = 'altitudeSlider';
altitudeSlider.type = 'range';
altitudeSlider.min = '-5000';
altitudeSlider.max = '5000';
altitudeSlider.step = '100';
altitudeSlider.style.width = '200px';
document.body.appendChild(altitudeSlider);
document.body.appendChild(sliderName);
document.body.appendChild(showAltitude);

// Event listener for slider input change
altitudeSlider.addEventListener('input', () => {
  sliderName.innerText = altitudeSlider.value + ' V/S';
  sliderValue = altitudeSlider.value;
});

function drawAltitudeLabels() {
  const labelContainer = new PIXI.Container();
  app.stage.addChild(labelContainer);

  const increment = 5000;
  const maxAltitude = 40000;
  const labelStyle = { fontFamily: 'Arial', fontSize: 10, fill: 0x000000 };

  for (let altitude = increment; altitude <= maxAltitude; altitude += increment) {
    const y = app.renderer.height - ((altitude / maxAltitude) * (app.renderer.height - 100)) - 50;
    const labelText = altitude.toString() + ' ft';
    const label = new PIXI.Text(labelText, labelStyle);
    label.x = 5;
    label.y = y - 7;
    labelContainer.addChild(label);
  }
}

function drawTimeLabels() {
  const labelContainer = new PIXI.Container();
  app.stage.addChild(labelContainer);

  const maxTime = 800; // Adjust as needed
  const timeIncrement = 60;
  const labelStyle = { fontFamily: 'Arial', fontSize: 10, fill: 0x000000 };

  for (let time = 0; time <= maxTime; time += timeIncrement) {
    const x = ((time / maxTime) * (app.renderer.width - 100)) + 50;
    const labelText = time / 60 + ' min';
    const label = new PIXI.Text(labelText, labelStyle);
    label.x = x - 10; // Adjust the label position as needed
    label.y = app.renderer.height - 45;
    labelContainer.addChild(label);
  }
}

function stopTicker() {
  isTickerRunning = false;
}

function resetGraph() {
  altitudeData = [{ time: 0, altitude: 0 }];
  isTickerRunning = true;
  startTicker();
}

drawScala();
startTicker();