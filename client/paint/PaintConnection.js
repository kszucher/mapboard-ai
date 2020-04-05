export function paintConnection (canvasContext, color, x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2) {
    canvasContext.beginPath();
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = 1;
    canvasContext.moveTo(x1, y1);
    canvasContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    canvasContext.stroke();
}
