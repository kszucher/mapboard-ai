export function paintSelection(canvasContext, centerX, centerY, selfW, selfH, color, mode) {

    //     c - d - - - - d - c
    //    b                   b
    //    |                   |
    //    a                   a
    //    |    centerPoint    |
    //    a                   a
    //    |                   |
    //    b                   b
    //     c - d - - - - d - c

    let arcDiameter =   20/2;
    let curveRatio =    0.75;

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
