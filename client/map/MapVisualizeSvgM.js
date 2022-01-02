import { COLORS } from '../core/Utils'

export const createMapSvgElementData = (m, cm, svgElementData) => {
    const {nodeId} = cm
    if (cm.isRoot) { // this will change
        svgElementData[0][nodeId].backgroundRect = {
            type: 'rect',
            x: 0,
            y: 0,
            width: m.mapWidth,
            height: m.mapHeight,
            rx: 32,
            ry: 32,
            fill: COLORS.MAP_BACKGROUND,
        };
    }
    if (cm.moveData.length) {
        let x1, y1, c1x, c1y, c2x, c2y, x2, y2;
        let deltaX = cm.moveData[2] - cm.moveData[0];
        let deltaY = cm.moveData[3] - cm.moveData[1];
        // the elegant solution would be the inheritance of the target line type
        x1 = cm.moveData[0];
        y1 = cm.moveData[1];
        c1x = cm.moveData[0] + deltaX / 4;
        c1y = cm.moveData[1];
        c2x = cm.moveData[0] + deltaX / 4;
        c2y = cm.moveData[1] + deltaY;
        x2 = cm.moveData[2];
        y2 = cm.moveData[3];
        svgElementData[5][nodeId].moveLine = {
            type: 'path',
            path: `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`,
            stroke: '#5f0a87',
            strokeWidth: 1,
            preventTransition: 1,
        }
        svgElementData[5][nodeId].moveRect = {
            type: 'rect',
            x: cm.moveData[2] - 10,
            y: cm.moveData[3] - 10,
            width: 20,
            height: 20,
            rx: 8,
            ry: 8,
            fill: COLORS.MAP_BACKGROUND,
            fillOpacity: 1,
            stroke: '#5f0a87',
            strokeWidth: 5,
            preventTransition: 1,
        };
    }
    if (cm.selectionRect.length) {
        svgElementData[5][nodeId].selectionRect = {
            type: 'rect',
            x: cm.selectionRect[0],
            y: cm.selectionRect[1],
            width: cm.selectionRect[2],
            height: cm.selectionRect[3],
            rx: 8,
            ry: 8,
            fill: '#5f0a87',
            fillOpacity: 0.05,
            strokeWidth: 2,
            preventTransition: 1,
        };
    }
}
