// Create Pixi.js application
const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x333333,
});
document.body.appendChild(app.view);

//Variables
const circleRadius = 100;

// Function to create a moving dial
function createMovingDial(radius, lengthRatio) {
    const dial = new PIXI.Graphics();
    const dialColor = 0xFFFFFF; // White color

    const dialLength = radius * lengthRatio; // Dials extend from center to circle circumference

    //Arrow Dial
    const arrow = new PIXI.Graphics();

    // Draw the arrow shape
    arrow.beginFill(dialColor);
    arrow.moveTo(-5, 0);
    arrow.lineTo(5, 0);
    arrow.lineTo(0, - dialLength);
    arrow.endFill();

    arrow.pivot.set(0, 0);
    arrow.position.set(0, 0);

    dial.addChild(arrow);

    // Draw the dial from center to the circumference
    dial.lineStyle(4, dialColor);
    dial.moveTo(0, 0);
    dial.lineTo(0, - dialLength);

    // Set the rotation pivot to the center of the dial line
    dial.pivot.set(0, 0);

    return dial;
}

function createLabels(radius) {
    const labelContainer = new PIXI.Container();
    const totalLabels = 10;
    const labelOffset = 20;
    const collisionPadding = 10; // Padding to prevent labels from touching

    let angle = -Math.PI / 2;

    // Array to keep track of occupied positions
    const occupiedPositions = [];

    for (let i = 0; i < totalLabels; i++) {
        const labelText = new PIXI.Text(`${i}`, {
            fill: 'white',
            fontSize: 20,
        });

        let labelX = 400 + Math.cos(angle) * (radius - labelOffset);
        let labelY = 300 + Math.sin(angle) * (radius - labelOffset);

        // Adjust label positions based on collision detection
        [labelX, labelY] = adjustLabelPosition(labelX, labelY, occupiedPositions, collisionPadding);

        labelText.position.set(labelX, labelY);
        labelText.anchor.set(0.5);

        labelContainer.addChild(labelText);

        occupiedPositions.push({ x: labelX, y: labelY });

        angle += (Math.PI * 2) / totalLabels;
    }

    app.stage.addChild(labelContainer);
}

function adjustLabelPosition(x, y, occupiedPositions, collisionPadding) {
    // Function to adjust label position based on collision detection

    let newX = x;
    let newY = y;
    let attempts = 0;
    const maxAttempts = 100; // Limit attempts to avoid infinite loops

    while (attempts < maxAttempts) {
        let collision = false;

        // Check for collisions with existing labels
        for (const pos of occupiedPositions) {
            const distance = Math.sqrt((pos.x - newX) ** 2 + (pos.y - newY) ** 2);
            if (distance < collisionPadding) {
                collision = true;
                break;
            }
        }

        if (!collision) {
            // If no collision, return the adjusted position
            return [newX, newY];
        } else {
            // If collision detected, adjust label position slightly and retry
            newX += Math.random() * 5 - 2.5; // Adjust X position within a small range
            newY += Math.random() * 5 - 2.5; // Adjust Y position within a small range
        }

        attempts++;

        // Reset position if attempts exceed the maximum limit
        if (attempts === maxAttempts) {
            newX = x;
            newY = y;
        }
    }

    return [newX, newY];
}

// Create a main circle
const mainCircle = new PIXI.Graphics();
const mainCircleColor = 0xFFFFFF; // White color
const mainCircleRadius = circleRadius;
mainCircle.lineStyle(4, mainCircleColor);
mainCircle.drawCircle(400, 300, mainCircleRadius);
app.stage.addChild(mainCircle);

// Create a secondary circle
const secondaryCircle = new PIXI.Graphics();
const secondaryCircleColor = 0xFFFFFF; // White color
const secondaryCircleRadius = circleRadius * 0.6;
secondaryCircle.lineStyle(4, secondaryCircleColor);
secondaryCircle.drawCircle(400, 300, secondaryCircleRadius);
app.stage.addChild(secondaryCircle);

// Create labels around the circle
createLabels(circleRadius);

// Create a longer and shorter dial
const longerDial = createMovingDial(circleRadius, 0.8);
const shorterDial = createMovingDial(circleRadius, 0.5); // Adjust the length ratio as needed

// Position the dials
longerDial.position.set(400, 300);
shorterDial.position.set(400, 300);

// Add the longer dial
const longerDialGraphics = new PIXI.Graphics();
const longerDialLength = circleRadius * 0.8;
longerDialGraphics.lineStyle(4, 0xFFFFFF); // Adjust line style as needed
longerDialGraphics.moveTo(0, 0);
longerDialGraphics.lineTo(0, -longerDialLength);

// Draw an arrowhead at the end of the longer dial
const arrowSizeLonger = 10; // Size of the arrowhead
longerDialGraphics.beginFill(0xFFFFFF); // Adjust arrow fill color
longerDialGraphics.lineStyle(0); // No outline for the arrowhead
longerDialGraphics.moveTo(0, -longerDialLength - arrowSizeLonger);
longerDialGraphics.lineTo(-arrowSizeLonger, -longerDialLength + arrowSizeLonger);
longerDialGraphics.lineTo(arrowSizeLonger, -longerDialLength + arrowSizeLonger);
longerDialGraphics.lineTo(0, -longerDialLength - arrowSizeLonger);

longerDial.addChild(longerDialGraphics);
app.stage.addChild(longerDial);

// Add the shorter dial
const shorterDialGraphics = new PIXI.Graphics();
const shorterDialLength = circleRadius * 0.5;
shorterDialGraphics.lineStyle(4, 0xFFFFFF); // Adjust line style as needed
shorterDialGraphics.moveTo(0, 0);
shorterDialGraphics.lineTo(0, -shorterDialLength);

// Draw an arrowhead at the end of the shorter dial
const arrowSizeShorter = 10; // Size of the arrowhead
shorterDialGraphics.beginFill(0xFFFFFF); // Adjust arrow fill color
shorterDialGraphics.lineStyle(0); // No outline for the arrowhead
shorterDialGraphics.moveTo(0, -shorterDialLength - arrowSizeShorter);
shorterDialGraphics.lineTo(-arrowSizeShorter, -shorterDialLength + arrowSizeShorter);
shorterDialGraphics.lineTo(arrowSizeShorter, -shorterDialLength + arrowSizeShorter);
shorterDialGraphics.lineTo(0, -shorterDialLength - arrowSizeShorter);

shorterDial.addChild(shorterDialGraphics);
app.stage.addChild(shorterDial);

// Create a slider
const slider = document.createElement('input');
slider.type = 'range';
slider.min = '0';
slider.max = '3600';
slider.value = '0';
slider.style.position = 'absolute';
slider.style.top = '20px';
slider.style.left = '20px';
document.body.appendChild(slider);

// Function to update dial rotation based on slider value
function updateDialRotation(rotation) {
    const angle = (rotation * Math.PI) / 180; // Convert degrees to radians
    longerDial.rotation = angle;
    shorterDial.rotation = (angle * 0.1); // Rotates 10% of the longer dial's rotation
}

// Listen for changes in the slider value
slider.addEventListener('input', (event) => {
    const rotationValue = event.target.value;
    updateDialRotation(rotationValue);
});
