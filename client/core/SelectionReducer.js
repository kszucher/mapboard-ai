import {mapCollect} from "../map/MapCollect";
import {arrayValuesSame} from "./Utils";
import {getMapData, mapasgn, mapref, pathMerge} from "./MapReducer";

export let selectionState = {
    structSelectedPathList: [],
    cellSelectedPathList: [],
    maxSel: 0,
    maxSelIndex: 0,
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

const initSelectionState = JSON.stringify(selectionState);

let selectionStateCopy = '';
export const pushSelectionState = () => {
    selectionStateCopy = JSON.stringify(selectionState);
}

export const checkPopSelectionState = () => {
    getSelectionContext();
    if (!selectionState.structSelectedPathList.length && !selectionState.cellSelectedPathList.length) {
        selectionState = JSON.parse(selectionStateCopy);
        for (const currPath of selectionState.structSelectedPathList) {
            mapref(currPath).selected = 1;
        }
        for (const currPath of selectionState.cellSelectedPathList) {
            mapref(currPath).selected = 1;
        }
    }
}

export function getSelectionContext() {
    selectionState = JSON.parse(initSelectionState);

    let r = getMapData().r;
    mapCollect.start(r);

    let {
        structSelectedPathList, cellSelectedPathList,
        maxSel, maxSelIndex, scope, lastPath, geomHighPath, geomLowPath,
        haveSameParent, sameParentPath, cellRowSelected, cellRow, cellColSelected, cellCol
    } = selectionState;

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

    selectionState = {...selectionState, ...{
            structSelectedPathList, cellSelectedPathList,
            maxSel, maxSelIndex, scope, lastPath, geomHighPath, geomLowPath,
            haveSameParent, sameParentPath, cellRowSelected, cellRow, cellColSelected, cellCol
        }}

    return selectionState;
}

export function clearSelectionContext() {
    let r = getMapData().r;
    mapCollect.start(r);
    for (let i = 0; i < selectionState.structSelectedPathList.length; i++) {
        mapasgn(pathMerge(selectionState.structSelectedPathList[i], ['selected']), 0);
    }
    for (let i = 0; i < selectionState.cellSelectedPathList.length; i++) {
        mapasgn(pathMerge(selectionState.cellSelectedPathList[i], ['selected']), 0);
    }
}
