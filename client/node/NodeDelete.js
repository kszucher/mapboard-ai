import {mapref} from "../map/Map";
import {mapDivRemove} from "../map/MapDivRemove";
import {checkSelection} from "./NodeSelect";
import {mapSvgRemove} from "../map/MapSvgRemove";

export function structDeleteReselect(sc) {
    // calculate jumpback
    let lm = sc.lm;
    let lastParentRef = mapref(lm.parentPath);
    let lastParentRefChildCntr = lastParentRef.s.length;
    let lastParentRefDelChildCntr = 0;
    for (let i = lm.index; i > - 1; i--) {
        if (lastParentRef.s[i].selected > 0) {
            lastParentRefDelChildCntr++;
        }
    }

    // delete
    for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
        let currRef = mapref(sc.structSelectedPathList[i]);
        if (currRef.isRoot === 0) {
            let currParentRef = mapref(currRef.parentPath);
            currParentRef.taskStatus = currRef.taskStatus;
            currParentRef.taskStatusInherited = 0;
            mapDivRemove.start(currParentRef.s[currRef.index]);
            mapSvgRemove.start(currParentRef.s[currRef.index]);
            currParentRef.s.splice(currRef.index, 1);
        }
    }

    // reselect on jumpback
    if (lm.isRoot === 0) {
        if (lastParentRefChildCntr === lastParentRefDelChildCntr) {
            lastParentRef.selected = 1;
        }
        else {
            if (lm.index === 0) {
                if (lastParentRef.s.length > 0) {
                    lastParentRef.s[0].selected = 1;
                } else {
                    lastParentRef.selected = 1;
                }
            } else {
                lastParentRef.s[lm.index - lastParentRefDelChildCntr].selected = 1;
            }
        }
    }
}

export function cellBlockDeleteReselect(lm) {
    let lastParentRef = mapref(lm.parentPath);
    let rcSelected = checkSelection(lastParentRef); // we could store this info in the cell holder struct instead
    if (rcSelected[0]) {
        for (let i = 0; i < lastParentRef.c[0].length; i++) {
            mapDivRemove.start(lastParentRef.c[lm.index[0]][i]);
            mapSvgRemove.start(lastParentRef.c[lm.index[0]][i]);
        }
        lastParentRef.c.splice(lm.index[0], 1);
    }
    if (rcSelected[1]) {
        for (let i = 0; i < lastParentRef.c.length; i++) {
            mapDivRemove.start(lastParentRef.c[i][lm.index[1]]);
            mapSvgRemove.start(lastParentRef.c[i][lm.index[1]]);
        }
        for (let i = 0; i < lastParentRef.c.length; i++) {
            lastParentRef.c[i].splice(lm.index[1], 1);
        }
    }
    lastParentRef.selected = 1;
}
