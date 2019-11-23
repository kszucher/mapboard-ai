import {clearStructSelection}                           from "./NodeSelect";
import {mapref}                                         from "./Map";
import {getDefaultNode}                                 from "./Node";

export function structInsert(lastRef, direction) {
    clearStructSelection();
    let parentRef = mapref(lastRef.parentPath);
    if (direction === 'UP') {
        parentRef.s.splice(lastRef.index, 0, getDefaultNode({
            'selected': 1,
            'taskStatus': parentRef.taskStatus
        }))
    }
    if (direction === 'DOWN') {
        parentRef.s.splice(lastRef.index + 1, 0, getDefaultNode({
            'selected': 1,
            'taskStatus': parentRef.taskStatus
        }));
    }
    else if (direction === 'RIGHT') {
        lastRef.s.splice(lastRef.s.length, 0, getDefaultNode({
            'selected': 1,
            'taskStatus': lastRef.taskStatus
        }));
    }
}

export function cellInsert (lastPath, direction) {
    let lastRef =       mapref(lastPath);
    let parentRef =     mapref(lastRef.parentPath);

    let currRow =       lastRef.index[0];
    let currCol =       lastRef.index[1];
    let rowLen =        parentRef.c.length;
    let colLen =        parentRef.c[0].length;

    if (direction === 'VK_DOWN') {
        let newRow = new Array(colLen);
        for (let i = 0; i < colLen; i++) {
            newRow[i] = getDefaultNode({s:[getDefaultNode()]});
        }
        parentRef.c.splice(currRow + 1, 0, newRow);
    }
    else if (direction === 'VK_RIGHT') {
        for (let i = 0; i < rowLen; i++) {
            parentRef.c[i].splice(currCol + 1, 0, getDefaultNode({s:[getDefaultNode()]}));
        }
    }
    else if (direction === 'VK_UP') {
        let newRow = new Array(colLen);
        for (let i = 0; i < colLen; i++) {
            newRow[i] = getDefaultNode({s:[getDefaultNode()]});
        }
        parentRef.c.splice(currRow, 0, newRow);
    }
    else if (direction === 'VK_LEFT') {
        for (let i = 0; i < rowLen; i++) {
            parentRef.c[i].splice(currCol, 0, getDefaultNode({s:[getDefaultNode()]}));
        }
    }
}
