import {mapref} from "../map/Map";

export function structDeleteReselect(sc) {
    let lm = sc.lm;
    let lastParentRef = mapref(lm.parentPath);

    if (lastParentRef.type !== 'cell' || (lastParentRef.type === 'cell' && lastParentRef.s.length > 1)) {
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
            if (currRef.isRoot === 0) {
                let currParentRef = mapref(currRef.parentPath);
                currParentRef.taskStatus = currRef.taskStatus;
                currParentRef.taskStatusInherited = 0;
                currParentRef.s.splice(currRef.index, 1);
            }
        }

        // reselect on jumpback
        if (lm.isRoot === 0) {
            if (lastParentRefChildLen === lastParentRefDelChildLen) {
                lastParentRef.selected = 1;
            } else {
                if (lm.index === 0) {
                    if (lastParentRef.s.length > 0) {
                        lastParentRef.s[0].selected = 1;
                    } else {
                        lastParentRef.selected = 1;
                    }
                } else {
                    if (lm.index - lastParentRefDelChildLen >= 0) {
                        lastParentRef.s[lm.index - lastParentRefDelChildLen].selected = 1;
                    } else {
                        lastParentRef.s[0].selected = 1;
                    }
                }
            }
        }
    }
}

export function cellBlockDeleteReselect(sc) {
    if (sc.haveSameParent) {
        let parentRef = mapref(sc.sameParentPath);
        if (sc.cellColDetected) {
            parentRef.c.splice(sc.firstParentRowIndex, 1);
            parentRef.selected = 1;
        } else if (sc.cellRowDetected) {
            for (let i = 0; i < parentRef.c.length; i++) {
                parentRef.c[i].splice(sc.firstParentColIndex, 1);
            }
            parentRef.selected = 1;
        }
    }
}
