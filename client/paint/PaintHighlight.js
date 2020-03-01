export function paintHighlight(canvasContext, borderColor, fillColor, lineWidth, inputVec) {

    //    m-(t)- - - - - - - -n
    //    |                   |
    //   (s)                  |
    //    |                   |
    //    |                   |
    //    |                   |
    //    |                   |
    //    |                   |
    //     - - - - - - - - - -

    let modifVec = [];

    for (let i = 0; i < inputVec.length; i++) {
        let a;                                  a = inputVec[i];
        let b;
        if (i === inputVec.length - 1) {        b = inputVec[0];       }
        else {                                  b = inputVec [i + 1]   }
        let c;
        if (i === inputVec.length - 2) {        c = inputVec[0]        }
        else if (i === inputVec.length - 1) {   c = inputVec[1]        }
        else {                                  c = inputVec[i + 2]    }

        // https://math.stackexchange.com/questions/175896/finding-a-point-along-a-line-a-certain-distance-away-from-another-point/2109383#2109383

        let d = 14;

        let dist_ba = Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
        let dist_bc = Math.sqrt(Math.pow(b[0] - c[0], 2) + Math.pow(b[1] - c[1], 2));

        let s = [b[0] - d*(b[0] - a[0])/dist_ba, b[1] - d*(b[1] - a[1])/dist_ba];
        let t = [b[0] - d*(b[0] - c[0])/dist_bc, b[1] - d*(b[1] - c[1])/dist_bc];

        modifVec.push({m: b, s: s, t: t})
    }

    canvasContext.beginPath();

    let firstP = modifVec[0];

    canvasContext.moveTo(               firstP.s[0], firstP.s[1]);

    for (let i = 0; i < modifVec.length ; i++) {
        let currP = modifVec[i];
        let nextP = i === modifVec.length - 1? modifVec[0]: modifVec[i + 1];

        canvasContext.bezierCurveTo(    currP.m[0], currP.m[1],
                                        currP.m[0], currP.m[1],
                                        currP.t[0], currP.t[1]);
        canvasContext.lineTo(           nextP.s[0], nextP.s[1]);
    }

    canvasContext.closePath();
    canvasContext.lineWidth = lineWidth;
    canvasContext.strokeStyle = borderColor;
    canvasContext.stroke();
    canvasContext.fillStyle = fillColor;
    canvasContext.fill();
    canvasContext.shadowColor = '#999';
    canvasContext.shadowBlur = 0;
    canvasContext.shadowOffsetX = 0;
    canvasContext.shadowOffsetY = 0;
}
