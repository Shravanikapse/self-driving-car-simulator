class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;
    }

    /**
     * Get the horizontal center coordinate of a specific lane (0-indexed from left to right)
     * @param {number} laneIndex 
     */
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        const safeLaneIndex = Math.min(Math.max(0, laneIndex), this.laneCount - 1);
        return this.left + laneWidth / 2 + safeLaneIndex * laneWidth;
    }

    /**
     * Draw the road on the canvas context
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} carY
     */
    draw(ctx, carY = 0) {
        // Define viewport rendering boundaries around the car to draw grass and curbs efficiently
        const viewportHeight = 600; // Safe viewport vertical range
        const viewTop = carY - viewportHeight * 0.7;
        const viewBottom = carY + viewportHeight * 0.3;

        // 1. Draw alternating light/dark green grass bands on both sides of the road
        const grassStripeHeight = 80;
        const grassStartY = Math.floor(viewTop / grassStripeHeight) * grassStripeHeight;
        for (let y = grassStartY; y < viewBottom; y += grassStripeHeight) {
            const isLight = (Math.floor(y / grassStripeHeight) % 2 === 0);
            ctx.fillStyle = isLight ? "#2d8a4e" : "#247540"; // Premium organic grass greens
            
            // Left grass side (extends far to the left)
            ctx.fillRect(this.left - 1000, y, 1000, grassStripeHeight);
            // Right grass side (extends far to the right)
            ctx.fillRect(this.right, y, 1000, grassStripeHeight);
        }

        // 2. Draw the main road asphalt lane pavement (modern dark slate gray)
        ctx.fillStyle = "#242526";
        ctx.fillRect(this.left, this.top, this.width, this.bottom - this.top);

        // 3. Draw alternating red-and-white curbs on both edges of the road
        const curbWidth = 6;
        const curbHeight = 40;
        const curbStartY = Math.floor(viewTop / curbHeight) * curbHeight;
        for (let y = curbStartY; y < viewBottom; y += curbHeight) {
            const isRed = (Math.floor(y / curbHeight) % 2 === 0);
            ctx.fillStyle = isRed ? "#e74c3c" : "#ffffff";
            
            // Left curb (just outside left border)
            ctx.fillRect(this.left - curbWidth, y, curbWidth, curbHeight);
            // Right curb (just outside right border)
            ctx.fillRect(this.right, y, curbWidth, curbHeight);
        }

        // 4. Draw lane divider lines
        // Set line properties for road borders (white solid line)
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffffff";
        ctx.setLineDash([]);

        // Draw left road border line
        ctx.beginPath();
        ctx.moveTo(this.left, this.top);
        ctx.lineTo(this.left, this.bottom);
        ctx.stroke();

        // Draw right road border line
        ctx.beginPath();
        ctx.moveTo(this.right, this.top);
        ctx.lineTo(this.right, this.bottom);
        ctx.stroke();

        // Draw inner lane dividers (vibrant yellow dashed lines)
        ctx.strokeStyle = "#ffc72c";
        ctx.lineWidth = 3;
        for (let i = 1; i < this.laneCount; i++) {
            // Linear interpolation to find the X position of this lane divider
            const x = lerp(this.left, this.right, i / this.laneCount);
            
            // Set dash pattern: 20px solid line, 20px empty gap
            ctx.setLineDash([20, 20]);

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }
}

/**
 * Linear interpolation function (lerp)
 * Estimates a value between A and B based on percentage factor t (from 0 to 1)
 */
function lerp(A, B, t) {
    return A + (B - A) * t;
}
