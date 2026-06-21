class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;
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
     */
    draw(ctx) {
        // Draw the main road lane pavement (dark gray)
        ctx.fillStyle = "#333333";
        ctx.fillRect(this.left, 0, this.width, ctx.canvas.height);

        // Set line properties for road borders
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffffff";

        // Draw inner lane dividers (dashed lines)
        for (let i = 1; i < this.laneCount; i++) {
            // Linear interpolation to find the X position of this lane divider
            const x = lerp(this.left, this.right, i / this.laneCount);
            
            // Set dash pattern: 20px solid line, 20px empty gap
            ctx.setLineDash([20, 20]);

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
            ctx.stroke();
        }

        // Reset line dash to empty (solid line) for the outer road borders
        ctx.setLineDash([]);

        // Draw left road border
        ctx.beginPath();
        ctx.moveTo(this.left, 0);
        ctx.lineTo(this.left, ctx.canvas.height);
        ctx.stroke();

        // Draw right road border
        ctx.beginPath();
        ctx.moveTo(this.right, 0);
        ctx.lineTo(this.right, ctx.canvas.height);
        ctx.stroke();
    }
}

/**
 * Linear interpolation function (lerp)
 * Estimates a value between A and B based on percentage factor t (from 0 to 1)
 */
function lerp(A, B, t) {
    return A + (B - A) * t;
}
