class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        // Physics settings
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        // Instantiate controls
        this.controls = new Controls();
    }

    /**
     * Update the car's physics and position based on controls
     */
    update() {
        // 1. Accelerate / Reverse
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // 2. Cap speed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2; // reverse speed is slower
        }

        // 3. Apply friction/drag
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // Stop the car completely if speed is smaller than friction
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // 4. Steer the car (only if the car is moving)
        if (this.speed !== 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        // 5. Update coordinates using trigonometric ratios
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    /**
     * Draw the car on the canvas context, handling rotation
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        // Translate the canvas context center to the car's location
        ctx.translate(this.x, this.y);
        // Rotate the context by the car's angle
        ctx.rotate(-this.angle);

        ctx.fillStyle = "#3b82f6"; // Modern vibrant blue color for the car
        
        ctx.beginPath();
        // Since context is translated to car center, draw centered at (0, 0)
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore(); // Restore context to avoid affecting other drawn objects
    }
}
