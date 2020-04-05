import {mapMem, mapref} from '../map/Map'
import {getDim} from "../src/Dim";

export let sphereRadius = 10;
export let sphereLut = [];

export function taskCanvasVisualize() {

    let filter = mapMem.filter;
    let canvasContext = document.getElementById('mapCanvas').getContext('2d');

    sphereLut = [];

    for (let i = 0; i < filter.taskEndPathList.length; i++) {
        let currTaskEndPath = filter.taskEndPathList[i];

        let cm = mapref(currTaskEndPath);
        let startX = getDim().mw - 136;

        canvasContext.beginPath();
        canvasContext.strokeStyle = '#eeeeee';
        canvasContext.lineWidth = 1;
        canvasContext.moveTo(cm.nodeEndX, cm.nodeEndY);
        canvasContext.lineTo(startX, cm.nodeEndY);
        canvasContext.stroke();

        let sphereOffset = 32;
        for (let j = 0; j < 4; j++) {
            let centerX = startX + j*sphereOffset;
            let centerY = cm.nodeEndY;

            let sphereColor;
            if (cm.taskStatus === j) {
                switch (j) {
                    case 0: sphereColor = '#eeeeee'; break;
                    case 1: sphereColor = '#2c9dfc'; break;
                    case 2: sphereColor = '#d5802a'; break;
                    case 3: sphereColor = '#25bf25'; break;
                }
            }
            else {
                switch (j) {
                    case 0: sphereColor = '#eeeeee'; break;
                    case 1: sphereColor = '#e5f3fe'; break;
                    case 2: sphereColor = '#f6e5d4'; break;
                    case 3: sphereColor = '#e5f9e5'; break;
                }
            }

            canvasContext.beginPath();
            canvasContext.arc(centerX, centerY, sphereRadius, 0, 2 * Math.PI, false);
            canvasContext.fillStyle = sphereColor;
            canvasContext.fill();
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = sphereColor;
            canvasContext.stroke();

            sphereLut.push({
                path: currTaskEndPath,
                centerX: centerX,
                centerY: centerY,
                column: j,
            })
        }
    }
}
