import {mapref}                                         from "./Map";
import {mapNodePropChange}                              from "./MapNodePropChange";
import {clearStructSelection}                           from "./NodeSelect";
import {getDefaultNode}                                 from "./Node";
import {structDeleteReselect}                           from "./NodeDelete";
import {arrayValuesSame, copy, transpose}               from "./Utils";

let clipboard = [];

export function setClipboard(clipboardIn) {
    clipboard = clipboardIn;
}

export function structMove(sc, target, mode) {
    let parentPathList = [];
    for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        parentPathList.push(mapref(sc.structSelectedPathList[i]).parentPath);
    }
    if (target === 'struct2struct' || target === 'struct2cell') {
        if (arrayValuesSame(parentPathList) && sc.lastRef.isRoot === 0) {
            let currParentPath = parentPathList[0];
            let currParentRef = mapref(currParentPath);

            if (target === 'struct2struct') {
                if (mode === 'ArrowLeft') {
                    if (currParentRef.isRoot === 0) {
                        let currParentParentPath = mapref(currParentPath).parentPath;
                        let currParentParentRef = mapref(currParentParentPath);
                        for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
                            let currRef = mapref(sc.structSelectedPathList[i]);
                            currParentRef.s.splice(currRef.index, 1);
                            currParentParentRef.s.splice(currParentRef.index + 1, 0, copy(currRef));
                        }
                    }
                }
                else if (mode === 'ArrowRight') {
                    if (sc.geomHighRef.index > 0) {
                        let upperSibling = currParentRef.s[sc.geomHighRef.index - 1];
                        for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
                            let currRef = mapref(sc.structSelectedPathList[i]);
                            currParentRef.s.splice(currRef.index, 1);
                            upperSibling.s.splice(upperSibling.s.length - sc.structSelectedPathList.length + i + 1, 0, copy(currRef));
                        }
                    }
                }
                else if (mode === 'ArrowUp') {
                    if (sc.geomHighRef.index > 0) {
                        for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                            let currRef = mapref(sc.structSelectedPathList[i]);
                            currParentRef.s.splice(currRef.index, 1);
                            currParentRef.s.splice(currRef.index - 1, 0, copy(currRef));
                        }
                    }
                    else {
                        for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
                            let currRef = mapref(sc.structSelectedPathList[i]);
                            currParentRef.s.splice(currRef.index, 1);
                            currParentRef.s.splice(currParentRef.s.length - sc.structSelectedPathList.length + i + 1, 0, copy(currRef));
                        }
                    }
                }
                else if (mode === 'ArrowDown') {
                    if (sc.geomLowRef.index !== currParentRef.s.length - 1) {
                        for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
                            let currRef = mapref(sc.structSelectedPathList[i]);
                            currParentRef.s.splice(currRef.index, 1);
                            currParentRef.s.splice(currRef.index + 1, 0, copy(currRef));
                        }
                    }
                    else {
                        for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                            let currRef = mapref(sc.structSelectedPathList[i]);
                            currParentRef.s.splice(currRef.index, 1);
                            currParentRef.s.splice(i, 0, copy(currRef));
                        }
                    }
                }
            }
            else if (target === 'struct2cell') {
                currParentRef.s.splice(sc.geomLowRef.index + 1, 0, getDefaultNode());
                let newCellRef = currParentRef.s[sc.geomLowRef.index + 1];

                if (mode === 'multiRow') {
                    for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
                        let currRef = mapref(sc.structSelectedPathList[i]);
                        newCellRef.c[0].push(getDefaultNode({s: [copy(currRef)]}));
                        currParentRef.s.splice(currRef.index, 1);
                    }
                    newCellRef.c = transpose([([].concat(...newCellRef.c))]);
                    newCellRef.c = newCellRef.c.reverse();
                }
            }
        }
    }
    else if (target === 'struct2clipboard') {
        if (mode === 'CUT' && sc.lastRef.isRoot !== 1 ||
            mode === 'COPY') {
            clipboard = [];
            for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
                let currRef = mapref(sc.structSelectedPathList[i]);
                clipboard.splice(0, 0, copy(currRef));
                for (let j = 0; j < clipboard.length; j++) {
                    mapNodePropChange.start(clipboard[j], 'isDivAssigned', 0);
                    mapNodePropChange.start(clipboard[j], 'isTextAssigned', 0);
                }
            }

            navigator.permissions.query({name: "clipboard-write"}).then(result => {
                if (result.state === "granted" || result.state === "prompt") {
                    navigator.clipboard.writeText(JSON.stringify(clipboard, undefined, 4))
                        .then(() => {
                            console.log('Text copied to clipboard');
                        })
                        .catch(err => {
                            console.error('Could not copy text: ', err);
                        });
                }
            });

            if (mode === 'CUT') {
                structDeleteReselect(sc);
            }
        }
    }
    else if (target === 'clipboard2struct') {

        console.log(clipboard)

        clearStructSelection();
        let toIndex = sc.lastRef.s.length;
        for (let i = 0; i < clipboard.length; i++) {
            sc.lastRef.s.splice(toIndex + i, 0, copy(clipboard[i]));
        }
    }
}
