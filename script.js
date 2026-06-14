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

/**
 * Main animation / physics loop
 * This function will run at ~60fps using requestAnimationFrame.
 */
function animate() {
    // Clear the canvas on each frame to redraw objects in their updated positions
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // [FUTURE STATE] Draw road here
    // [FUTURE STATE] Update and draw car here

    // Request the next animation frame
    requestAnimationFrame(animate);
}

// 3. Start the animation loop
animate();

console.log("Simulator canvas initialized successfully.");
