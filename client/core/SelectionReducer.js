import {mapCollect} from "../map/MapCollect";
import {arrayValuesSame} from "./Utils";
import {getMapData, mapasgn, mapref, pathMerge} from "./MapReducer";

export let selectionReducer = {
    structSelectedPathList: [],
    cellSelectedPathList: [],
    maxSel: 0,
    scope: '',
    lastPath: [],
    geomHighPath: [],
    geomLowPath: [],
    cellRowSelected: 0,
    cellRow: 0,
    cellColSelected: 0,
    cellCol: 0,
    haveSameParent: 0,
    sameParentPath: [],
}

let selectionStateCopy = '';
export const pushSelectionState = () => {
    selectionStateCopy = JSON.stringify(selectionReducer);
}

export const checkPopSelectionState = () => {
    getSelectionContext();
    if (!selectionReducer.structSelectedPathList.length && !selectionReducer.cellSelectedPathList.length) {
        selectionReducer = JSON.parse(selectionStateCopy);
        for (const currPath of selectionReducer.structSelectedPathList) {
            mapref(currPath).selected = 1;
        }
        for (const currPath of selectionReducer.cellSelectedPathList) {
            mapref(currPath).selected = 1;
        }
    }
}

export function getSelectionContext() {
    let r = getMapData().r;
    mapCollect.start(r);

    let {
        structSelectedPathList, cellSelectedPathList,
        maxSel, scope, lastPath, geomHighPath, geomLowPath,
        haveSameParent, sameParentPath, cellRowSelected, cellRow, cellColSelected, cellCol
    } = selectionReducer;
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

    selectionReducer = {...selectionReducer, ...{
            structSelectedPathList, cellSelectedPathList,
            maxSel, scope, lastPath, geomHighPath, geomLowPath,
            haveSameParent, sameParentPath, cellRowSelected, cellRow, cellColSelected, cellCol
        }}

    return selectionReducer;
}

export function clearSelectionContext() {
    let r = getMapData().r;
    mapCollect.start(r);
    for (let i = 0; i < selectionReducer.structSelectedPathList.length; i++) {
        mapasgn(pathMerge(selectionReducer.structSelectedPathList[i], ['selected']), 0);
    }
    for (let i = 0; i < selectionReducer.cellSelectedPathList.length; i++) {
        mapasgn(pathMerge(selectionReducer.cellSelectedPathList[i], ['selected']), 0);
    }
}

