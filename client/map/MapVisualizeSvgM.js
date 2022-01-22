import { COLORS } from '../core/Utils'
import { updateMapSvgData } from '../core/DomFlow'
import { getBezierPath } from './MapVisualizeSvgUtils'

export const createMapSvgElementData = (m) => {
    const {nodeId} = m
    updateMapSvgData(nodeId, 'backgroundRect', {
        x: 0,
        y: 0,
        width: m.mapWidth,
        height: m.mapHeight,
        rx: 32,
        ry: 32,
        fill: COLORS.MAP_BACKGROUND,
    })
    if (m.moveData?.length) {
        let x1, y1, c1x, c1y, c2x, c2y, x2, y2;
        let deltaX = m.moveData[2] - m.moveData[0];
        let deltaY = m.moveData[3] - m.moveData[1];
        // the elegant solution would be the inheritance of the target line type
        x1 = m.moveData[0];
        y1 = m.moveData[1];
        c1x = m.moveData[0] + deltaX / 4;
        c1y = m.moveData[1];
        c2x = m.moveData[0] + deltaX / 4;
        c2y = m.moveData[1] + deltaY;
        x2 = m.moveData[2];
        y2 = m.moveData[3];
        updateMapSvgData(nodeId, 'moveLine', {
            path: getBezierPath('M', [x1, y1, c1x, c1y, c2x, c2y, x2, y2]),
            stroke: '#5f0a87',
            strokeWidth: 1,
            preventTransition: 1,
        })
        updateMapSvgData(nodeId, 'moveRect', {
            x: m.moveData[2] - 10,
            y: m.moveData[3] - 10,
            width: 20,
            height: 20,
            rx: 8,
            ry: 8,
            fill: COLORS.MAP_BACKGROUND,
            fillOpacity: 1,
            stroke: '#5f0a87',
            strokeWidth: 5,
            preventTransition: 1,
        })
    }
    if (m.selectionRect?.length) {
        updateMapSvgData(nodeId, 'selectionRect', {
            x: m.selectionRect[0],
            y: m.selectionRect[1],
            width: m.selectionRect[2],
            height: m.selectionRect[3],
            rx: 8,
            ry: 8,
            fill: '#5f0a87',
            fillOpacity: 0.05,
            strokeWidth: 2,
            preventTransition: 1,
        })
    }
}
