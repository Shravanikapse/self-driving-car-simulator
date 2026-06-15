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
const road = new Road(canvas.width / 2, 150);

// Initialize the car centered on the road horizontally (canvas.width / 2)
// and positioned near the bottom vertically (300px), with a width of 30px and height of 50px
const car = new Car(canvas.width / 2, 300, 30, 50);

/**
 * Main animation / physics loop
 * This function will run at ~60fps using requestAnimationFrame.
 */
function animate() {
    // Clear the canvas on each frame to redraw objects in their updated positions
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the road
    road.draw(ctx);

    // Draw the car on the road
    car.draw(ctx);

    // Request the next animation frame
    requestAnimationFrame(animate);
}

// 3. Start the animation loop
animate();

console.log("Simulator canvas initialized successfully.");
