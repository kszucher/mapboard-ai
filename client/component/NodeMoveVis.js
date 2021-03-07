import React, {useContext, useEffect} from 'react';
import {Context} from '../core/Store';
import {mapMem} from "../map/Map";

export function NodeMoveVis () {
    const [state, dispatch] = useContext(Context);

    useEffect(() => {

    }, []);

    let winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (
        <svg
            viewBox={'0 0 ' + (2*winWidth+ mapMem.mapWidth) + ' ' + (2*winHeight + mapMem.mapHeight)}
            x={winWidth+0.5}
            y={winHeight+0.5}>
            <rect
                x={0}
                y={0}
                rx={10}
                ry={10}
                width={50}
                height={50}
                fill={'#fbfafc'}
                stroke={'#5f0a87'}
                // strokeWidth={2}
            />
        </svg>
    );
}

// // move line
// if (cm.moveLine.length) {
//     let x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2;
//     let deltaX = cm.moveLine[2] - cm.moveLine[0];
//     let deltaY = cm.moveLine[3] - cm.moveLine[1];
//
//     x1 =    cm.moveLine[0];                 y1 =    cm.moveLine[1];
//     cp1x =  cm.moveLine[0] + deltaX / 4;    cp1y =  cm.moveLine[1];
//     cp2x =  cm.moveLine[0] + deltaX / 4;    cp2y =  cm.moveLine[1] + deltaY;
//     x2 =    cm.moveLine[2];                 y2 =    cm.moveLine[3];
//
//     svgElementData['moveLine'] = {
//         type: 'path',
//         path: "M" + x1 + ',' + y1 + ' ' +
//             "C" + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + x2 + ',' + y2,
//         color: '#5f0a87',
//         preventTransition: 1,
//     }
// }
//
// // move rect
// if (cm.moveRect.length) {
//     svgElementData.moveRect = {
//         type: 'rect',
//         x: cm.moveRect[0] - 10,
//         y: cm.moveRect[1] - 10,
//         rx: 8,
//         ry: 8,
//         width: 20,
//         height: 20
//     };
// }
