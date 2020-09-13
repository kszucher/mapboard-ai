import {mapMem, mapref, mapasgn, pathMerge} from "../map/Map";
import {mapCollect} from "../map/MapCollect";
import {copy, objectsSame} from "../core/Utils";

export function getSelectionContext () {
    mapCollect.start();
    let filter = mapMem.filter;

    let maxSel = 0;
    let maxSelIndex = undefined;
    let scope = '';

    let lastPath = [];
    let geomHighPath = [];
    let geomLowPath = [];

    let haveSameParent = false;
    let sameParentPath = [];

    let haveSameRow = false;
    let firstParentRowIndex = 0;
    let haveSameCol = false;
    let firstParentColIndex = 0;

    let cellRowDetected = false;
    let cellColDetected = false;

    if (filter.structSelectedPathList.length && filter.cellSelectedPathList.length) {
        scope = 'm';
        lastPath =      filter.structSelectedPathList[0];
        geomHighPath =  lastPath;
        geomLowPath =   lastPath;
    }
    else if (filter.structSelectedPathList.length) {
        scope = 's';
        for (let i = 0; i < filter.structSelectedPathList.length; i++) {
            let currSelectedNumber = mapref(filter.structSelectedPathList[i]).selected;
            if (currSelectedNumber > maxSel) {
                maxSel = currSelectedNumber;
                maxSelIndex = i;
            }
        }
        lastPath =      filter.structSelectedPathList[maxSelIndex];
        geomHighPath =  filter.structSelectedPathList[0];
        geomLowPath =   filter.structSelectedPathList[filter.structSelectedPathList.length - 1];
    }
    else if (filter.cellSelectedPathList.length) {
        scope = 'c';
        let firstParentPath = filter.cellSelectedPathList[0].slice(0, -3);
        firstParentRowIndex = filter.cellSelectedPathList[0].slice(-2)[0];
        firstParentColIndex = filter.cellSelectedPathList[0].slice(-1)[0];
        for (let i = 0; i < filter.cellSelectedPathList.length; i++) {
            let currParentPath = filter.cellSelectedPathList[i].slice(0, -3);
            let currParentRowIndex = filter.cellSelectedPathList[i].slice(-2)[0];
            let currParentColIndex = filter.cellSelectedPathList[i].slice(-1)[0];
            if (objectsSame(firstParentPath, currParentPath)) {
                haveSameParent = true;
                if (firstParentRowIndex === currParentRowIndex) {
                    haveSameRow = true;
                }
                if (firstParentColIndex === currParentColIndex) {
                    haveSameCol = true;
                }
            }
            let currSelectedNumber = mapref(filter.cellSelectedPathList[i]).selected;
            if (currSelectedNumber > maxSel) {
                maxSel = currSelectedNumber;
                maxSelIndex = i;
            }
        }
        lastPath = filter.cellSelectedPathList[maxSelIndex];
        if (haveSameParent) {
            sameParentPath = copy(firstParentPath);
            if (haveSameRow && filter.cellSelectedPathList.length === mapref(firstParentPath).c.length) {
                cellRowDetected = true;
            }
            if (haveSameCol && filter.cellSelectedPathList.length === mapref(firstParentPath).c[0].length) {
                cellColDetected = true;
            }
        }
    }
    else {
        console.log('no selection');
    }

    return {
        maxSel:                 maxSel,
        scope:                  scope,
        lastPath:               lastPath,
        lm:                     mapref(lastPath),
        geomHighPath:           geomHighPath,
        geomHighRef:            mapref(geomHighPath),
        geomLowPath:            geomLowPath,
        geomLowRef:             mapref(geomLowPath),
        structSelectedPathList: filter.structSelectedPathList,
        cellSelectedPathList:   filter.cellSelectedPathList,
        haveSameParent:         haveSameParent,
        sameParentPath:         sameParentPath,
        cellColDetected:        cellColDetected,
        cellRowDetected:        cellRowDetected,
        firstParentRowIndex:    firstParentRowIndex,
        firstParentColIndex:    firstParentColIndex,
    }
}

export function clearStructSelectionContext () {
    mapCollect.start();
    let filter = mapMem.filter;
    for (let i = 0; i < filter.structSelectedPathList.length; i++) {
        mapasgn(pathMerge(filter.structSelectedPathList[i], ['selected']), 0);
    }
}

export function clearCellSelectionContext () {
    mapCollect.start();
    let filter = mapMem.filter;
    for (let i = 0; i < filter.cellSelectedPathList.length; i++) {
        mapasgn(pathMerge(filter.cellSelectedPathList[i], ['selected']), 0);
    }
}
