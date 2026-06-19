class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        // Physics settings
        this.speed = 0;
        this.maxSpeed = 5;
        this.angle = 0;

        // Realistic Physics Coefficients
        this.enginePower = 0.15;       // Forward acceleration force per frame
        this.reversePower = 0.08;      // Reverse acceleration force per frame
        this.rollingResistance = 0.03; // Constant tire friction
        this.dragCoefficient = 0.005;  // Aerodynamic drag coefficient (air resistance)

        // Telemetry state
        this.currentEngineForce = 0;
        this.currentFriction = 0;
        this.currentDrag = 0;
        this.currentAccel = 0;

        // Instantiate controls
        this.controls = new Controls();
    }

    /**
     * Update the car's physics and position based on controls
     */
    update() {
        // 1. Calculate Engine Force (Tractive Force)
        this.currentEngineForce = 0;
        if (this.controls.forward) {
            // Engine force drops off slightly at high speeds to model RPM/power limitations
            const speedRatio = Math.abs(this.speed) / this.maxSpeed;
            this.currentEngineForce = this.enginePower * (1 - speedRatio * 0.35);
        }
        if (this.controls.reverse) {
            this.currentEngineForce = -this.reversePower;
        }

        // 2. Calculate Resistance Forces (Friction + Drag)
        this.currentFriction = 0;
        this.currentDrag = 0;

        if (this.speed !== 0) {
            const direction = Math.sign(this.speed);
            
            // Rolling resistance opposes direction of travel
            this.currentFriction = direction * this.rollingResistance;
            
            // Drag is proportional to speed squared and opposes direction of travel
            this.currentDrag = direction * this.dragCoefficient * (this.speed * this.speed);
        }

        // Total net resistance force
        const totalResistance = this.currentFriction + this.currentDrag;
        
        // Net force (net acceleration, assuming mass = 1)
        this.currentAccel = this.currentEngineForce - totalResistance;

        // Update velocity (speed)
        this.speed += this.currentAccel;

        // 3. Stop completely if the speed is extremely low and no controls are pressed
        // This prevents the car from creeping or sliding back-and-forth indefinitely
        if (!this.controls.forward && !this.controls.reverse && Math.abs(this.speed) < 0.05) {
            this.speed = 0;
            this.currentAccel = 0;
            this.currentFriction = 0;
            this.currentDrag = 0;
        }

        // Cap speed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        // 4. Steer the car
        if (this.speed !== 0) {
            const flip = this.speed > 0 ? 1 : -1;
            
            // Rate of rotation is proportional to speed (Ackerman steering logic)
            // so steering is naturally inactive when stationary and becomes responsive with speed
            const turnRate = 0.015 * Math.abs(this.speed);
            const maxTurnRate = 0.04;
            const finalTurnRate = Math.min(turnRate, maxTurnRate);

            if (this.controls.left) {
                this.angle += finalTurnRate * flip;
            }
            if (this.controls.right) {
                this.angle -= finalTurnRate * flip;
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
