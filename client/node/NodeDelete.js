import {arrayValuesSameSimple} from "../core/Utils";
import {mapref} from "../core/MapStateFlow";

export function structDeleteReselect(sc) {
    let lm = mapref(sc.lastPath);
    let crIndex = lm.path[1];
    for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        let cm = mapref(sc.structSelectedPathList[i]);
        if (cm.isRoot) return;
    }
    // calculate jumpback
    let im = lm;
    for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        let cm = mapref(sc.structSelectedPathList[i]);
        if (cm.path.length < lm.path.length && arrayValuesSameSimple(cm.path.slice(0, lm.path.length), lm.path)) {
            im = cm;
        }
    }
    let imParent = mapref(im.parentPath);
    let imParentChildLen = imParent.s.length;
    let imParentChildDelLen = 0;
    for (let i = im.index; i > -1; i--) {
        if (imParent.s[i].selected > 0) {
            imParentChildDelLen++;
        }
    }
    // delete
    for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
        let cm = mapref(sc.structSelectedPathList[i]);
        let cmParent = mapref(cm.parentPath);
        cmParent.taskStatus = cm.taskStatus;
        cmParent.taskStatusInherited = 0;
        cmParent.s.splice(cm.index, 1);
    }
    // reselect on jumpback
    if (imParentChildLen === imParentChildDelLen) {
        if (imParent.isRootChild) {
            let cr = mapref(['r', crIndex]);
            cr.selected = 1;
        } else {
            imParent.selected = 1;
        }
    } else {
        if (im.index === 0) {
            if (imParent.s.length > 0) {
                imParent.s[0].selected = 1;
            } else {
                if (imParent.isRootChild) {
                    let cr = mapref(['r', crIndex]);
                    cr.selected = 1;
                } else {
                    imParent.selected = 1;
                }
            }
        } else {
            if (im.index - imParentChildDelLen >= 0) {
                imParent.s[im.index - imParentChildDelLen].selected = 1;
            } else {
                imParent.s[0].selected = 1;
            }
        }
    }
}

export function cellBlockDeleteReselect(sc) {
    const {lastPath, cellRowSelected, cellRow, cellColSelected, cellCol, sameParentPath} = sc;
    let sameParent = mapref(sameParentPath);
    let lm = mapref(lastPath);
    if (cellRowSelected && mapref(lm.parentPath).c.length === 1 ||
        cellColSelected && mapref(lm.parentPath).c[0].length === 1) {
        let sameParentParent = mapref(sameParent.parentPath);
        sameParentParent.s.splice(sameParent.index, 1);
        sameParentParent.selected = 1;
        return;
    }
    if (cellRowSelected) {
        sameParent.c.splice(cellRow, 1);
        sameParent.selected = 1;
    }
    if (cellColSelected) {
        for (let i = 0; i < sameParent.c.length; i++) {
            sameParent.c[i].splice(cellCol, 1);
        }
        sameParent.selected = 1;
    }
}
