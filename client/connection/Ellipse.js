export function paintSelection(canvasContext, centerX, centerY, selfW, selfH, color, mode) {

    let arcDiameter =   20/2;
    let curveRatio =    0.75;

    //     c - d - - - - d - c
    //    b                   b
    //    |                   |
    //    a                   a
    //    |    centerPoint    |
    //    a                   a
    //    |                   |
    //    b                   b
    //     c - d - - - - d - c

    let bezierControl = {
        lT : {
            a : [- selfW/2,                                      - selfH/2 + arcDiameter                     ],
            b : [- selfW/2,                                      - selfH/2 + arcDiameter * (1 - curveRatio)  ],
            c : [- selfW/2 + arcDiameter * (1 - curveRatio),     - selfH/2                                   ],
            d : [- selfW/2 + arcDiameter,                        - selfH/2                                   ],
        },
        rT : {
            a : [+ selfW/2,                                      - selfH/2 + arcDiameter                     ],
            b : [+ selfW/2,                                      - selfH/2 + arcDiameter * (1 - curveRatio)  ],
            c : [+ selfW/2 + arcDiameter * (curveRatio - 1),     - selfH/2                                   ],
            d : [+ selfW/2 - arcDiameter,                        - selfH/2                                   ],
        },
        lB : {
            a : [- selfW/2,                                      + selfH/2 - arcDiameter                     ],
            b : [- selfW/2,                                      + selfH/2 + arcDiameter * (curveRatio - 1)  ],
            c : [- selfW/2 + arcDiameter * (1 - curveRatio),     + selfH/2                                   ],
            d : [- selfW/2 + arcDiameter,                        + selfH/2                                   ],
        },
        rB : {
            a : [+ selfW/2,                                      + selfH/2 - arcDiameter                     ],
            b : [+ selfW/2,                                      + selfH/2 + arcDiameter * (curveRatio - 1)  ],
            c : [+ selfW/2 + arcDiameter * (curveRatio - 1),     + selfH/2                                   ],
            d : [+ selfW/2 - arcDiameter,                        + selfH/2                                   ],
        }
    };

    let bezierControlFields = Object.keys(bezierControl);

    canvasContext.beginPath();
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = 1;

    for (let i = 0; i < 4; i++) {

        bezierControl[bezierControlFields[i]].a[0] += centerX + 0.5;
        bezierControl[bezierControlFields[i]].b[0] += centerX;
        bezierControl[bezierControlFields[i]].c[0] += centerX;
        bezierControl[bezierControlFields[i]].d[0] += centerX + 0.5;

        bezierControl[bezierControlFields[i]].a[1] += centerY;
        bezierControl[bezierControlFields[i]].b[1] += centerY;
        bezierControl[bezierControlFields[i]].c[1] += centerY;
        bezierControl[bezierControlFields[i]].d[1] += centerY;

        let a = bezierControl[bezierControlFields[i]].a;
        let b = bezierControl[bezierControlFields[i]].b;
        let c = bezierControl[bezierControlFields[i]].c;
        let d = bezierControl[bezierControlFields[i]].d;

        if (mode === 'lefty' && (i === 1 || i === 3)) {

        }
        else {
            canvasContext.moveTo(a[0], a[1]);
            canvasContext.bezierCurveTo(b[0], b[1], c[0], c[1], d[0], d[1]);

        }
    }

    if (mode === 'lefty') {

    }
    else {

        canvasContext.moveTo(bezierControl.lT.d[0], bezierControl.lT.d[1]);
        canvasContext.lineTo(bezierControl.rT.d[0], bezierControl.rT.d[1]);

        canvasContext.moveTo(bezierControl.rT.a[0], bezierControl.rT.a[1]);
        canvasContext.lineTo(bezierControl.rB.a[0], bezierControl.rB.a[1]);

        canvasContext.moveTo(bezierControl.rB.d[0], bezierControl.rB.d[1]);
        canvasContext.lineTo(bezierControl.lB.d[0], bezierControl.lB.d[1]);

        if (mode === 'full') {
            canvasContext.moveTo(bezierControl.lB.a[0], bezierControl.lB.a[1]);
            canvasContext.lineTo(bezierControl.lT.a[0], bezierControl.lT.a[1]);
        }
    }

    canvasContext.stroke();
}



export function paintPolygon(canvasContext, borderColor, fillColor, lineWidth, inputVec) {

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


    // canvasContext.shadowColor = '#999';
    // canvasContext.shadowBlur = 0.5;
    // canvasContext.shadowOffsetX = 0.5;
    // canvasContext.shadowOffsetY = 0.5;



    canvasContext.fill();


    canvasContext.shadowColor = '#999';
    canvasContext.shadowBlur = 0;
    canvasContext.shadowOffsetX = 0;
    canvasContext.shadowOffsetY = 0;



}

// TODO
// - inspect visszahozása
// - a megfelelő feltétel alapján megcsinálni szépen, hogy a jó karaktersorozat adódjon át, és akkor már faszák vagyunk, beszínezni kívül-belül és örülni