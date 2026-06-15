class Road {
    constructor(x, width) {
        this.x = x;
        this.width = width;
        this.left = x - width / 2;
        this.right = x + width / 2;
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
