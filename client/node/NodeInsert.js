import {mapref} from "../map/Map";
import {getDefaultNode} from "./Node";

export function structInsert(lm, direction) {
    let parentRef = mapref(lm.parentPath);
    if (direction === 'up') {
        parentRef.s.splice(lm.index, 0, getDefaultNode({
            selected: 1,
            taskStatus: parentRef.taskStatus,
            parentNodeEndXFrom: parentRef.nodeEndX,
            parentNodeEndYFrom: parentRef.nodeEndY,
            twoStepAnimationRequested: 1,
        }))
    } else if (direction === 'down') {
        parentRef.s.splice(lm.index + 1, 0, getDefaultNode({
            selected: 1,
            taskStatus: parentRef.taskStatus,
            parentNodeEndXFrom: parentRef.nodeEndX,
            parentNodeEndYFrom: parentRef.nodeEndY,
            twoStepAnimationRequested: 1,
        }));
    } else if (direction === 'right') {
        lm.s.splice(lm.s.length, 0, getDefaultNode({
            selected: 1,
            taskStatus: lm.taskStatus,
            parentNodeEndXFrom: lm.nodeEndX,
            parentNodeEndYFrom: lm.nodeEndY,
            twoStepAnimationRequested: 1,
        }));
    }
}

export function cellInsert (lastPath, direction) {
    let lm = mapref(lastPath);
    let parentRef = mapref(lm.parentPath);

    // NOTE: itt egy rekurzív svg eltávoltítás és újracsinálás szerepelt, nemtudni hogy ez kell-e még

    let currRow = lm.index[0];
    let currCol = lm.index[1];
    let rowLen = parentRef.c.length;
    let colLen = parentRef.c[0].length;

    switch (direction) {
        case 'ArrowDown': {
            let newRow = new Array(colLen);
            for (let i = 0; i < colLen; i++) {
                newRow[i] = getDefaultNode({s: [getDefaultNode()]});
            }
            parentRef.c.splice(currRow + 1, 0, newRow);
            break;
        }
        case 'ArrowRight': {
            for (let i = 0; i < rowLen; i++) {
                parentRef.c[i].splice(currCol + 1, 0, getDefaultNode({s: [getDefaultNode()]}));
            }
            break;
        }
        case 'ArrowUp': {
            let newRow = new Array(colLen);
            for (let i = 0; i < colLen; i++) {
                newRow[i] = getDefaultNode({s: [getDefaultNode()]});
            }
            parentRef.c.splice(currRow, 0, newRow);
            break;
        }
        case 'ArrowLeft': {
            for (let i = 0; i < rowLen; i++) {
                parentRef.c[i].splice(currCol, 0, getDefaultNode({s: [getDefaultNode()]}));
            }
            break;
        }
        default:
            break;
    }
}
