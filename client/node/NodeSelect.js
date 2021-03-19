import {mapref, mapasgn, pathMerge, getMapData} from "../map/Map";
import {mapCollect} from "../map/MapCollect";
import {arrayValuesSame} from "../core/Utils";
import {selectionState} from "../core/SelectionState";

export function getSelectionContext () {
    let r = getMapData().r;
    mapCollect.start(r);

    let {structSelectedPathList, cellSelectedPathList,
        maxSel, scope, lastPath, geomHighPath, geomLowPath,
        haveSameParent, sameParentPath, cellRowSelected, cellRow, cellColSelected, cellCol} = selectionState;
    let maxSelIndex = 0;

    // INDICATORS
    if (structSelectedPathList.length && cellSelectedPathList.length) {
        lastPath = structSelectedPathList[0];
        geomHighPath = lastPath;
        geomLowPath = lastPath;
    } else if (structSelectedPathList.length) {
        for (let i = 0; i < structSelectedPathList.length; i++) {
            let currSelectedNumber = mapref(structSelectedPathList[i]).selected;
            if (currSelectedNumber > maxSel) {
                maxSel = currSelectedNumber;
                maxSelIndex = i;
            }
        }
        lastPath = structSelectedPathList[maxSelIndex];
        geomHighPath = structSelectedPathList[0];
        geomLowPath = structSelectedPathList[structSelectedPathList.length - 1];
    } else if (cellSelectedPathList.length) {
        for (let i = 0; i < cellSelectedPathList.length; i++) {
            let currSelectedNumber = mapref(cellSelectedPathList[i]).selected;
            if (currSelectedNumber > maxSel) {
                maxSel = currSelectedNumber;
                maxSelIndex = i;
            }
        }
        lastPath = cellSelectedPathList[maxSelIndex];
    } else {
        console.log('no selection');
        return;
    }

    // INTERRELATIONS
    if (structSelectedPathList.length && !cellSelectedPathList.length) {
        [haveSameParent, sameParentPath] = arrayValuesSame(structSelectedPathList.map(path => JSON.stringify(mapref(path).parentPath)));
    } else if (!structSelectedPathList.length && cellSelectedPathList.length) {
        [haveSameParent, sameParentPath] = arrayValuesSame(cellSelectedPathList.map(path => JSON.stringify(mapref(path).parentPath)));
        if (haveSameParent) {
            let [haveSameRow, sameRow] = arrayValuesSame(cellSelectedPathList.map(path => path[path.length - 2]));
            let [haveSameCol, sameCol] = arrayValuesSame(cellSelectedPathList.map(path => path[path.length - 1]));
            let sameParent = mapref(sameParentPath);
            if (haveSameRow && cellSelectedPathList.length === sameParent.c[0].length) {
                cellRowSelected = 1;
                cellRow = sameRow;
            }
            if (haveSameCol && cellSelectedPathList.length === sameParent.c.length) {
                cellColSelected = 1;
                cellCol = sameCol;
            }
        }
    }

    // SCOPE
    if (structSelectedPathList.length && cellSelectedPathList.length) {
        scope = 'm';
    } else if (structSelectedPathList.length) {
        scope = 's';
    } else if (cellSelectedPathList.length) {
        scope = 'c';
        if (cellRowSelected) scope = 'cr';
        if (cellColSelected) scope = 'cc';
    }

    return {
        structSelectedPathList, cellSelectedPathList,
        maxSel, scope, lastPath, geomHighPath, geomLowPath,
        haveSameParent, sameParentPath, cellRowSelected, cellRow, cellColSelected, cellCol
    };
}

export function clearStructSelectionContext () {
    let r = getMapData().r;
    mapCollect.start(r);
    for (let i = 0; i < selectionState.structSelectedPathList.length; i++) {
        mapasgn(pathMerge(selectionState.structSelectedPathList[i], ['selected']), 0);
    }
}

export function clearCellSelectionContext () {
    let r = getMapData().r;
    mapCollect.start(r);
    for (let i = 0; i < selectionState.cellSelectedPathList.length; i++) {
        mapasgn(pathMerge(selectionState.cellSelectedPathList[i], ['selected']), 0);
    }
}
