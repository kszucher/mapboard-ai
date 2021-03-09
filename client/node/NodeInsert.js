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
            parentNodeStartXFrom: parentRef.nodeStartX,
            parentNodeYFrom: parentRef.nodeY,
            twoStepAnimationRequested: 1,
        }))
    } else if (mode === 'siblingDown') {
        parentRef = mapref(lm.parentPath);
        parentRef.s.splice(lm.index + 1, 0, getDefaultNode({
            selected: 1,
            task: parentRef.task,
            taskStatus: parentRef.taskStatus,
            parentNodeEndXFrom: parentRef.nodeEndX,
            parentNodeStartXFrom: parentRef.nodeStartX,
            parentNodeYFrom: parentRef.nodeY,
            twoStepAnimationRequested: 1,
        }));
    } else if (mode === 'child') {
        parentRef = lm.isRoot? lm.d[0] : lm;
        parentRef.s.splice(parentRef.s.length, 0, getDefaultNode({
            selected: 1,
            task: parentRef.task,
            taskStatus: parentRef.taskStatus,
            parentNodeEndXFrom: parentRef.nodeEndX,
            parentNodeStartXFrom: parentRef.nodeStartX,
            parentNodeYFrom: parentRef.nodeY,
            twoStepAnimationRequested: 1,
        }));
    }
}

export function cellInsert (lastPath, key) {
    let lm = mapref(lastPath);
    let parentRef = mapref(lm.parentPath);
    let currRow = lm.index[0];
    let currCol = lm.index[1];
    let rowLen = parentRef.c.length;
    let colLen = parentRef.c[0].length;

    let direction;
    if (        key === 'ArrowLeft' && lm.path[2] === 0 || key === 'ArrowRight' && lm.path[2] === 1) {  direction = 'in';
    } else if ( key === 'ArrowLeft' && lm.path[2] === 1 || key === 'ArrowRight' && lm.path[2] === 0) {  direction = 'out';
    } else if ( key === 'ArrowUp') {                                                                    direction = 'up';
    } else if ( key === 'ArrowDown') {                                                                  direction = 'down';
    }

    switch (direction) {
        case 'in': {
            for (let i = 0; i < rowLen; i++) {
                parentRef.c[i].splice(currCol, 0, getDefaultNode({s: [getDefaultNode()]}));
            }
            break;
        }
        case 'out': {
            for (let i = 0; i < rowLen; i++) {
                parentRef.c[i].splice(currCol + 1, 0, getDefaultNode({s: [getDefaultNode()]}));
            }
            break;
        }
        case 'up': {
            let newRow = new Array(colLen);
            for (let i = 0; i < colLen; i++) {
                newRow[i] = getDefaultNode({s: [getDefaultNode()]});
            }
            parentRef.c.splice(currRow, 0, newRow);
            break;
        }
        case 'down': {
            let newRow = new Array(colLen);
            for (let i = 0; i < colLen; i++) {
                newRow[i] = getDefaultNode({s: [getDefaultNode()]});
            }
            parentRef.c.splice(currRow + 1, 0, newRow);
            break;
        }

        default:
            break;
    }
}
