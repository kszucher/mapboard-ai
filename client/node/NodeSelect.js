import {mapref, mapasgn, pathMerge, getMapData} from "../map/Map";
import {mapCollect} from "../map/MapCollect";
import {arrayValuesSame} from "../core/Utils";
import {mapMem} from "../core/MapState";

export function getSelectionContext () {
    let r = getMapData().r;
    mapCollect.start(r);

    let maxSel = 0;
    let maxSelIndex = undefined;
    let scope = '';

    let lastPath = [];
    let lm;
    let geomHighPath = [];
    let geomLowPath = [];
    
    let cellRowSelected = 0;
    let cellRow = 0;
    let cellColSelected = 0;
    let cellCol = 0;
    let haveSameParent = 0;
    let sameParent;

    let {structSelectedPathList, cellSelectedPathList} = mapMem.filter;

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
    lm  = mapref(lastPath);

    // INTERRELATIONS
    if (structSelectedPathList.length && !cellSelectedPathList.length) {
        let [haveSameParentPath, sameParentPath] = arrayValuesSame(structSelectedPathList.map(path => JSON.stringify(mapref(path).parentPath)));
        if (haveSameParentPath) {
            haveSameParent = 1;
            sameParent = mapref(JSON.parse(sameParentPath));
        }
    } else if (!structSelectedPathList.length && cellSelectedPathList.length) {
        let [haveSameParentPath, sameParentPath] = arrayValuesSame(cellSelectedPathList.map(path => JSON.stringify(mapref(path).parentPath)));
        if (haveSameParentPath) {
            let [haveSameRow, sameRow] = arrayValuesSame(cellSelectedPathList.map(path => path[path.length - 2]));
            let [haveSameCol, sameCol] = arrayValuesSame(cellSelectedPathList.map(path => path[path.length - 1]));
            haveSameParent = 1;
            sameParent = mapref(JSON.parse(sameParentPath));
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
        maxSel,
        scope,
        lastPath,
        lm,
        geomHighPath,
        geomHighRef: mapref(geomHighPath),
        geomLowPath,
        geomLowRef: mapref(geomLowPath),
        structSelectedPathList,
        cellSelectedPathList,
        haveSameParent,
        sameParent,
        cellRowSelected,
        cellRow,
        cellColSelected,
        cellCol,
    }
}

export function clearStructSelectionContext () {
    let r = getMapData().r;
    mapCollect.start(r);
    let filter = mapMem.filter;
    for (let i = 0; i < filter.structSelectedPathList.length; i++) {
        mapasgn(pathMerge(filter.structSelectedPathList[i], ['selected']), 0);
    }
}

export function clearCellSelectionContext () {
    let r = getMapData().r;
    mapCollect.start(r);
    let filter = mapMem.filter;
    for (let i = 0; i < filter.cellSelectedPathList.length; i++) {
        mapasgn(pathMerge(filter.cellSelectedPathList[i], ['selected']), 0);
    }
}
