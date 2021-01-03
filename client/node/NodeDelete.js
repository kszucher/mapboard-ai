import {mapref} from "../map/Map";
import {arrayValuesSame} from "../core/Utils";

export function structDeleteReselect(sc) {
    let lm = sc.lm;

    if (lm.isRoot) return;
    for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
        let currRef = mapref(sc.structSelectedPathList[i]);
        if (currRef.isRoot) {
            return;
        }
    }

    let lastParentRef = mapref(lm.parentPath);

    // if (lastParentRef.type !== 'cell' || (lastParentRef.type === 'cell' && lastParentRef.s.length > 1)) {
        // calculate jumpback
        let lastParentRefChildLen = lastParentRef.s.length;
        let lastParentRefDelChildLen = 0;
        for (let i = lm.index; i > -1; i--) {
            if (lastParentRef.s[i].selected > 0) {
                lastParentRefDelChildLen++;
            }
        }

        // delete
        for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
            let currRef = mapref(sc.structSelectedPathList[i]);
            let currParentRef = mapref(currRef.parentPath);
            currParentRef.taskStatus = currRef.taskStatus;
            currParentRef.taskStatusInherited = 0;
            currParentRef.s.splice(currRef.index, 1);
        }

        // reselect on jumpback
        if (lastParentRefChildLen === lastParentRefDelChildLen) {
            if (lastParentRef.isRootChild) {
                mapref(['r']).selected = 1;
            } else {
                lastParentRef.selected = 1;
            }
        } else {
            if (lm.index === 0) {
                if (lastParentRef.s.length > 0) {
                    lastParentRef.s[0].selected = 1;
                } else {
                    if (lastParentRef.isRootChild) {
                        mapref(['r']).selected = 1;
                    } else {
                        lastParentRef.selected = 1;
                    }
                }
            } else {
                if (lm.index - lastParentRefDelChildLen >= 0) {
                    lastParentRef.s[lm.index - lastParentRefDelChildLen].selected = 1;
                } else {
                    lastParentRef.s[0].selected = 1;
                }
            }
        }
    // }
}

export function cellBlockDeleteReselect(sc) {
    const {cellSelectedPathList} = sc;
    let [haveSameParentPath, sameParentPath] = arrayValuesSame(cellSelectedPathList.map(path => JSON.stringify(mapref(path).parentPath)));
    if (haveSameParentPath) {
        let [haveSameRow, sameRow] = arrayValuesSame(cellSelectedPathList.map(path => path[path.length - 2]));
        let [haveSameCol, sameCol] = arrayValuesSame(cellSelectedPathList.map(path => path[path.length - 1]));
        let sameParent = mapref(JSON.parse(sameParentPath));
        if (haveSameRow && cellSelectedPathList.length === sameParent.c[0].length) {
            sameParent.c.splice(sameRow, 1);
            sameParent.selected = 1;
        }
        if (haveSameCol && cellSelectedPathList.length === sameParent.c.length) {
            for (let i = 0; i < sameParent.c.length; i++) {
                sameParent.c[i].splice(sameCol, 1);
            }
            sameParent.selected = 1;
        }

    }
}
