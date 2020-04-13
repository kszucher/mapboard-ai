export function paintConnection (canvasContext, color, x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2) {
    canvasContext.beginPath();
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = 1;
    canvasContext.moveTo(x1, y1);
    canvasContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    canvasContext.stroke();
}

// TOOD
// másrészt, a paintSelection lefty megcsinálható szépen rounded rect path segítségével!!!
// továbbá, egy cellát tartalmazó struct SOHASEM fog svg line-t tartalmazni, és mivel a két dolog diszjunkt, ezért beleillik a rendszerbe
// tehát rename svgPath to svg, aztán

// létrehozom szépen a lefty cuccokat is
// illetve, maradnak még a dolgok belsejei is... azt is path-osítani kell