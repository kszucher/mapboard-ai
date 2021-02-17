import {mapref} from "../map/Map";
import {getDefaultNode} from "./Node";
import {copy, transpose} from "../core/Utils";
import {mapMem} from "../map/Map";

let clipboard = [];

export function setClipboard(clipboardIn) {
    clipboard = clipboardIn;
}

export function nodeMoveMouse (sc) {
    let {structSelectedPathList, sameParent} = sc;
    let nodeTarget = mapref(mapMem.movePath);
    for (let i = 0; i < structSelectedPathList.length; i++) {
        let currRef = mapref(structSelectedPathList[i]);
        nodeTarget.s.splice(nodeTarget.s.length + i, 0, copy(currRef));
        sameParent.s.splice(currRef.index, 1);
    }
}

export function nodeMove(sc, target, key, mode) {
    let {geomHighRef, geomLowRef, structSelectedPathList, lm, haveSameParent, sameParent,
        cellRowSelected, cellRow, cellColSelected, cellCol} = sc;

    let direction = '';
    if (
        key === 'ArrowLeft' && lm.path[2] === 0 && sameParent.isRootChild ||
        key === 'ArrowRight' && lm.path[2] === 1 && sameParent.isRootChild) {
        direction = 'through'
    } else if (
        key === 'ArrowLeft' && lm.path[2] === 0 ||
        key === 'ArrowRight' && lm.path[2] === 1) {
        direction = 'in';
    } else if (
        key === 'ArrowLeft' && lm.path[2] === 1 ||
        key === 'ArrowRight' && lm.path[2] === 0) {
        direction = 'out';
    } else if (
        key === 'ArrowUp') {
        direction = 'up';
    } else if (
        key === 'ArrowDown') {
        direction = 'down';
    }

    if (target === 'struct2struct') {
        if (haveSameParent && !lm.isRoot) {
            if (direction === 'through') {
                let rootRef = mapref(['r']);
                let dir = lm.path[2];
                let revDir = 1 - dir;
                for (let i = structSelectedPathList.length - 1; i > -1; i--) {
                    let currRef = mapref(structSelectedPathList[i]);
                    sameParent.s.splice(currRef.index, 1);
                    rootRef.d[revDir].s.splice(rootRef.d[revDir].s.length, 0, copy(currRef));
                }
            } else if (direction === 'in') {
                let sameParentParent = mapref(sameParent.parentPath);
                for (let i = structSelectedPathList.length - 1; i > -1; i--) {
                    let currRef = mapref(structSelectedPathList[i]);
                    sameParent.s.splice(currRef.index, 1);
                    sameParentParent.s.splice(sameParent.index + 1, 0, copy(currRef));
                }
            } else if (direction === 'out') {
                if (geomHighRef.index > 0) {
                    let upperSibling = sameParent.s[geomHighRef.index - 1];
                    for (let i = structSelectedPathList.length - 1; i > -1; i--) {
                        let currRef = mapref(structSelectedPathList[i]);
                        sameParent.s.splice(currRef.index, 1);
                        upperSibling.s.splice(upperSibling.s.length - structSelectedPathList.length + i + 1, 0, copy(currRef));
                    }
                }
            } else if (direction === 'up') {
                if (geomHighRef.index > 0) {
                    for (let i = 0; i < structSelectedPathList.length; i++) {
                        let currRef = mapref(structSelectedPathList[i]);
                        sameParent.s.splice(currRef.index, 1);
                        sameParent.s.splice(currRef.index - 1, 0, copy(currRef));
                    }
                } else {
                    for (let i = structSelectedPathList.length - 1; i > -1; i--) {
                        let currRef = mapref(structSelectedPathList[i]);
                        sameParent.s.splice(currRef.index, 1);
                        sameParent.s.splice(sameParent.s.length - structSelectedPathList.length + i + 1, 0, copy(currRef));
                    }
                }
            } else if (direction === 'down') {
                if (geomLowRef.index !== sameParent.s.length - 1) {
                    for (let i = structSelectedPathList.length - 1; i > -1; i--) {
                        let currRef = mapref(structSelectedPathList[i]);
                        sameParent.s.splice(currRef.index, 1);
                        sameParent.s.splice(currRef.index + 1, 0, copy(currRef));
                    }
                } else {
                    for (let i = 0; i < structSelectedPathList.length; i++) {
                        let currRef = mapref(structSelectedPathList[i]);
                        sameParent.s.splice(currRef.index, 1);
                        sameParent.s.splice(i, 0, copy(currRef));
                    }
                }
            }
        }
    } else if (target === 'struct2cell') {
        if (haveSameParent && !lm.isRoot) {
            sameParent.s.splice(geomLowRef.index + 1, 0, getDefaultNode());
            let newCellRef = sameParent.s[geomLowRef.index + 1];
            if (mode === 'multiRow') {
                for (let i = structSelectedPathList.length - 1; i > -1; i--) {
                    let currRef = mapref(structSelectedPathList[i]);
                    newCellRef.c[0].push(getDefaultNode({s: [copy(currRef)]}));
                    sameParent.s.splice(currRef.index, 1);
                }
                newCellRef.c = transpose([([].concat(...newCellRef.c))]);
                newCellRef.c = newCellRef.c.reverse();
            }
        }
    } else if (target === 'cellBlock2CellBlock') {
        if (direction === 'up' && cellRowSelected && cellRow > 0) {
            [sameParent.c[cellRow], sameParent.c[cellRow - 1]] = [sameParent.c[cellRow - 1], sameParent.c[cellRow]]
        }
        if (direction === 'down' && cellRowSelected && cellRow < sameParent.c.length - 1) {
            [sameParent.c[cellRow], sameParent.c[cellRow + 1]] = [sameParent.c[cellRow + 1], sameParent.c[cellRow]]
        }
        if (direction === 'in' && cellColSelected && cellCol > 0) {
            for (let i = 0; i < sameParent.c.length; i++) {
                [sameParent.c[i][cellCol], sameParent.c[i][cellCol - 1]] = [sameParent.c[i][cellCol - 1], sameParent.c[i][cellCol]]
            }
        }
        if (direction === 'out' && cellColSelected && cellCol < sameParent.c[0].length - 1) {
            for (let i = 0; i < sameParent.c.length; i++) {
                [sameParent.c[i][cellCol], sameParent.c[i][cellCol + 1]] = [sameParent.c[i][cellCol + 1], sameParent.c[i][cellCol]]
            }
        }
    } else if (target === 'struct2clipboard') {
        if (mode === 'CUT' && lm.isRoot !== 1 || mode === 'COPY') {
            clipboard = [];
            for (let i = structSelectedPathList.length - 1; i > -1; i--) {
                let currRef = mapref(structSelectedPathList[i]);
                clipboard.splice(0, 0, copy(currRef));
            }

            navigator.permissions.query({name: "clipboard-write"}).then(result => {
                if (result.state === "granted" || result.state === "prompt") {
                    navigator.clipboard.writeText(JSON.stringify(clipboard, undefined, 4))
                        .then(() => {
                            console.log('map copied to clipboard');
                        })
                        .catch(err => {
                            console.error('could not copy text: ', err);
                        });
                }
            });
        }
    } else if (target === 'clipboard2struct') {
        let nodeTarget = lm.isRoot? lm.d[0] : lm;
        for (let i = 0; i < clipboard.length; i++) {
            nodeTarget.s.splice(nodeTarget.s.length + i, 0, copy(clipboard[i]));
        }
    }
}
