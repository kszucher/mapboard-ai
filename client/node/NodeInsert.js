import {clearStructSelection}                           from "./NodeSelect";
import {mapref}                                         from "../map/Map";
import {getDefaultNode}                                 from "./Node";

export function structInsert(lm, direction) {
    clearStructSelection();
    let parentRef = mapref(lm.parentPath);
    if (direction === 'up') {
        parentRef.s.splice(lm.index, 0, getDefaultNode({
            'selected': 1,
            'taskStatus': parentRef.taskStatus
        }))
    }
    if (direction === 'down') {
        parentRef.s.splice(lm.index + 1, 0, getDefaultNode({
            'selected': 1,
            'taskStatus': parentRef.taskStatus
        }));
    }
    else if (direction === 'right') {
        lm.s.splice(lm.s.length, 0, getDefaultNode({
            'selected': 1,
            'taskStatus': lm.taskStatus
        }));
    }
}

export function cellInsert (lastPath, direction) {
    let lm =       mapref(lastPath);
    let parentRef =     mapref(lm.parentPath);

    let currRow =       lm.index[0];
    let currCol =       lm.index[1];
    let rowLen =        parentRef.c.length;
    let colLen =        parentRef.c[0].length;

    if (direction === 'ArrowDown') {
        let newRow = new Array(colLen);
        for (let i = 0; i < colLen; i++) {
            newRow[i] = getDefaultNode({s:[getDefaultNode()]});
        }
        parentRef.c.splice(currRow + 1, 0, newRow);
    }
    else if (direction === 'ArrowRight') {
        for (let i = 0; i < rowLen; i++) {
            parentRef.c[i].splice(currCol + 1, 0, getDefaultNode({s:[getDefaultNode()]}));
        }
    }
    else if (direction === 'ArrowUp') {
        let newRow = new Array(colLen);
        for (let i = 0; i < colLen; i++) {
            newRow[i] = getDefaultNode({s:[getDefaultNode()]});
        }
        parentRef.c.splice(currRow, 0, newRow);
    }
    else if (direction === 'ArrowLeft') {
        for (let i = 0; i < rowLen; i++) {
            parentRef.c[i].splice(currCol, 0, getDefaultNode({s:[getDefaultNode()]}));
        }
    }
}
