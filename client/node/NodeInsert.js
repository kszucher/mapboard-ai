import {mapref} from "../map/Map";
import {getDefaultNode} from "./Node";

export function structInsert(lm, mode) {
    let parentRef;
    if (mode === 'siblingUp') {
        parentRef = mapref(lm.parentPath);
        parentRef.s.splice(lm.index, 0, getDefaultNode({
            selected: 1,
            task: parentRef.task,
            taskStatus: parentRef.taskStatus,
            parentNodeEndXFrom: parentRef.nodeEndX,
            parentNodeEndYFrom: parentRef.nodeEndY,
            parentNodeStartXFrom: parentRef.nodeStartX,
            parentNodeStartYFrom: parentRef.nodeStartY,
            twoStepAnimationRequested: 1,
        }))
    } else if (mode === 'siblingDown') {
        parentRef = mapref(lm.parentPath);
        parentRef.s.splice(lm.index + 1, 0, getDefaultNode({
            selected: 1,
            task: parentRef.task,
            taskStatus: parentRef.taskStatus,
            parentNodeEndXFrom: parentRef.nodeEndX,
            parentNodeEndYFrom: parentRef.nodeEndY,
            parentNodeStartXFrom: parentRef.nodeStartX,
            parentNodeStartYFrom: parentRef.nodeStartY,
            twoStepAnimationRequested: 1,
        }));
    } else if (mode === 'child') {
        parentRef = lm.isRoot? lm.d[0] : lm;
        parentRef.s.splice(parentRef.s.length, 0, getDefaultNode({
            selected: 1,
            task: parentRef.task,
            taskStatus: parentRef.taskStatus,
            parentNodeEndXFrom: parentRef.nodeEndX,
            parentNodeEndYFrom: parentRef.nodeEndY,
            parentNodeStartXFrom: parentRef.nodeStartX,
            parentNodeStartYFrom: parentRef.nodeStartY,
            twoStepAnimationRequested: 1,
        }));
    }
}

export function cellInsert (lastPath, direction) {
    let lm = mapref(lastPath);
    let parentRef = mapref(lm.parentPath);
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
