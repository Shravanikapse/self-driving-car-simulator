/**
 * Self-Driving Car Simulator - Script Entry Point
 * ---------------------------------------------
 * This file handles the canvas initialization, animation loop, and 
 * coordinates state rendering for the road, car, and neural network display.
 */

// 1. Get the canvas element and its 2D rendering context
const canvas = document.getElementById("carCanvas");
const ctx = canvas.getContext("2d");

// 2. Configure canvas dimensions
// Typically, vertical-scrolling driving games use a narrower portrait viewport
canvas.width = 200;
canvas.height = 400;

// Initialize the road at the center of the canvas with a width of 150px
const road = new Road(canvas.width / 2, 200);

// Initialize the car centered on the road horizontally (canvas.width / 2)
// and positioned near the bottom vertically (300px), with a width of 30px and height of 50px
const car = new Car(canvas.width / 2, 300, 30, 50);

// Get telemetry DOM elements
const speedVal = document.getElementById("speedVal");
const engineVal = document.getElementById("engineVal");
const frictionVal = document.getElementById("frictionVal");
const dragVal = document.getElementById("dragVal");
const accelVal = document.getElementById("accelVal");
const angleVal = document.getElementById("angleVal");

/**
 * Main animation / physics loop
 * This function will run at ~60fps using requestAnimationFrame.
 */
function animate() {
    // 1. Update positions / physics
    car.update();

    // 2. Update telemetry dashboard
    if (speedVal) speedVal.textContent = car.speed.toFixed(2);
    if (engineVal) engineVal.textContent = car.currentEngineForce.toFixed(2);
    if (frictionVal) frictionVal.textContent = (-car.currentFriction).toFixed(2);
    if (dragVal) dragVal.textContent = (-car.currentDrag).toFixed(2);
    if (accelVal) accelVal.textContent = car.currentAccel.toFixed(2);
    
    // Normalize display angle: steered right is positive, steered left is negative
    const angleDeg = ((-car.angle * 180) / Math.PI) % 360;
    if (angleVal) angleVal.textContent = `${angleDeg.toFixed(1)}°`;

    // 3. Clear the canvas on each frame to redraw objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 4. Save canvas state and translate vertically to keep the camera focused on the car
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    // 5. Draw updated elements
    road.draw(ctx);
    car.draw(ctx);

    // Restore canvas state to prevent translation compounding in the next frame
    ctx.restore();

    // Request the next animation frame
    requestAnimationFrame(animate);
}

// 3. Start the animation loop
animate();

console.log("Simulator canvas initialized successfully.");
