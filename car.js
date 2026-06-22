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

        // 1. Draw Wheels (beneath the body)
        // Wheels size: width 6px, height 12px
        const wheelW = 6;
        const wheelH = 12;
        const wheelColor = "#1e293b";
        const hubColor = "#64748b";

        // Rear Wheels (fixed straight)
        // Rear Left
        ctx.fillStyle = wheelColor;
        ctx.fillRect(-this.width / 2 - wheelW / 3, this.height / 4 - wheelH / 2, wheelW, wheelH);
        ctx.fillStyle = hubColor;
        ctx.fillRect(-this.width / 2 - wheelW / 3 + 2, this.height / 4 - wheelH / 2 + 2, wheelW - 4, wheelH - 4);

        // Rear Right
        ctx.fillStyle = wheelColor;
        ctx.fillRect(this.width / 2 - wheelW * 2 / 3, this.height / 4 - wheelH / 2, wheelW, wheelH);
        ctx.fillStyle = hubColor;
        ctx.fillRect(this.width / 2 - wheelW * 2 / 3 + 2, this.height / 4 - wheelH / 2 + 2, wheelW - 4, wheelH - 4);

        // Front Wheels (rotate left/right based on steering controls)
        let frontWheelAngle = 0;
        if (this.controls.left) {
            frontWheelAngle = -0.3;
        } else if (this.controls.right) {
            frontWheelAngle = 0.3;
        }

        // Front Left Wheel
        ctx.save();
        ctx.translate(-this.width / 2 + wheelW / 2, -this.height / 4);
        ctx.rotate(frontWheelAngle);
        ctx.fillStyle = wheelColor;
        ctx.fillRect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);
        ctx.fillStyle = hubColor;
        ctx.fillRect(-wheelW / 2 + 2, -wheelH / 2 + 2, wheelW - 4, wheelH - 4);
        ctx.restore();

        // Front Right Wheel
        ctx.save();
        ctx.translate(this.width / 2 - wheelW / 2, -this.height / 4);
        ctx.rotate(frontWheelAngle);
        ctx.fillStyle = wheelColor;
        ctx.fillRect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);
        ctx.fillStyle = hubColor;
        ctx.fillRect(-wheelW / 2 + 2, -wheelH / 2 + 2, wheelW - 4, wheelH - 4);
        ctx.restore();

        // 2. Draw Car Body (Chassis)
        ctx.fillStyle = "#3b82f6";    // Vibrant blue
        ctx.strokeStyle = "#1d4ed8";  // Dark outline
        ctx.lineWidth = 2;

        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 8);
        } else {
            ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        ctx.fill();
        ctx.stroke();

        // 3. Engine Hood detail lines
        ctx.strokeStyle = "#174bd9ff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-this.width / 4, -this.height / 2 + 6);
        ctx.lineTo(-this.width / 4, -this.height / 4);
        ctx.lineTo(this.width / 4, -this.height / 4);
        ctx.lineTo(this.width / 4, -this.height / 2 + 6);
        ctx.stroke();

        // 4. Draw Cabin & Windows
        const cabL = -this.width * 0.35;
        const cabR = this.width * 0.35;
        const cabT = -this.height * 0.15;
        const cabB = this.height * 0.3;

        // Cabin structure outline
        ctx.fillStyle = "#1e293b"; // Dark carbon cabin frame
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(cabL, cabT, cabR - cabL, cabB - cabT, 4);
        } else {
            ctx.rect(cabL, cabT, cabR - cabL, cabB - cabT);
        }
        ctx.fill();

        // Glass color (translucent bright cyan-blue glow)
        const glassColor = "rgba(165, 243, 252, 0.94)";
        ctx.fillStyle = glassColor;

        // Curved Windshield (Windscreen)
        ctx.beginPath();
        ctx.moveTo(cabL + 1, cabT + 6);
        ctx.lineTo(cabL + 2.5, cabT + 1);
        ctx.lineTo(cabR - 2.5, cabT + 1);
        ctx.lineTo(cabR - 1, cabT + 6);
        ctx.quadraticCurveTo(0, cabT + 4, cabL + 1, cabT + 6);
        ctx.fill();

        // Side Windows (Left and Right)
        // Left side window
        ctx.fillRect(cabL + 0.5, cabT + 8, 2, 12);
        // Right side window
        ctx.fillRect(cabR - 2.5, cabT + 8, 2, 12);

        // Rear Window
        ctx.beginPath();
        ctx.moveTo(cabL + 2, cabB - 1);
        ctx.lineTo(cabR - 2, cabB - 1);
        ctx.lineTo(cabR - 3.5, cabB - 4);
        ctx.lineTo(cabL + 3.5, cabB - 4);
        ctx.closePath();
        ctx.fill();

        // 5. Draw Headlights (Bright yellow/white)
        ctx.fillStyle = "#fef08afe";

        // Left headlight
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(-this.width / 2 + 2, -this.height / 2, 5, 4, [2, 2, 0, 0]);
        } else {
            ctx.rect(-this.width / 2 + 2, -this.height / 2, 5, 4);
        }
        ctx.fill();

        // Right headlight
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(this.width / 2 - 7, -this.height / 2, 5, 4, [2, 2, 0, 0]);
        } else {
            ctx.rect(this.width / 2 - 7, -this.height / 2, 5, 4);
        }
        ctx.fill();

        // 6. Draw Taillights (Vibrant red)
        // Make them glow brighter when braking (reverse key is pressed or slowing down)
        const isBraking = this.controls.reverse || (this.speed > 0 && this.currentAccel < 0);
        ctx.fillStyle = isBraking ? "#ef4444" : "#991b1b";

        // Left taillight
        ctx.fillRect(-this.width / 2 + 2, this.height / 2 - 3, 5, 3);
        // Right taillight
        ctx.fillRect(this.width / 2 - 7, this.height / 2 - 3, 5, 3);

        // 7. Spoiler / Rear Wing
        ctx.fillStyle = "#1e293b";
        // Wing main bar
        ctx.fillRect(-this.width / 2 - 2, this.height / 2 - 1, this.width + 4, 3);
        // Left wing support mount
        ctx.fillRect(-this.width / 3, this.height / 2 - 3, 2, 2);
        // Right wing support mount
        ctx.fillRect(this.width / 3 - 2, this.height / 2 - 3, 2, 2);

        ctx.restore();
    }
}
