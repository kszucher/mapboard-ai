import {mapMem, mapref, mapasgn, pathMerge} from "../map/Map";
import {mapCollect} from "../map/MapCollect";
import {arrayValuesSame} from "../src/Utils";

export function getSelectionContext () {

    mapCollect.start();
    let filter = mapMem.filter;

    let maxSel = 0;
    let maxSelIndex = undefined;
    let scope = '';

    let lastPath = [];
    let geomHighPath = [];
    let geomLowPath = [];

    if (filter.structSelectedPathList.length === 0 && filter.cellSelectedPathList.length === 0) {
        console.log('no selection');
    }
    else if (filter.structSelectedPathList.length === 1 && filter.cellSelectedPathList.length === 1) {
        scope = 'm';

        lastPath =      filter.structSelectedPathList[0]; // this should be equal to the only cell selected as well
        geomHighPath =  lastPath;
        geomLowPath =   lastPath;
    }
    else if (filter.structSelectedPathList.length !== 0) {
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
    else if (filter.cellSelectedPathList.length !== 0) {
        scope = 'c';
        for (let i = 0; i < filter.cellSelectedPathList.length; i++) {
            let currSelectedNumber = mapref(filter.cellSelectedPathList[i]).selected;
            if (currSelectedNumber > maxSel) {
                maxSel = currSelectedNumber;
                maxSelIndex = i;
            }
        }
        lastPath = filter.cellSelectedPathList[maxSelIndex];
    }
    else {
        console.log('ambivalent selection');
        console.log(filter)
    }

    return {
        'maxSel':                   maxSel,
        'scope':                    scope,
        'lastPath':                 lastPath,
        'lm':                       mapref(lastPath),
        'geomHighPath':             geomHighPath,
        'geomHighRef':              mapref(geomHighPath),
        'geomLowPath':              geomLowPath,
        'geomLowRef':               mapref(geomLowPath),
        'structSelectedPathList':   filter.structSelectedPathList,
        'cellSelectedPathList':     filter.cellSelectedPathList,
    }
}

export function clearCellSelection () {
    mapCollect.start();
    let filter = mapMem.filter;

    for (let i = 0; i < filter.cellSelectedPathList.length; i++) {
        mapasgn(pathMerge(filter.cellSelectedPathList[i], ['selected']), 0);
    }
}

export function clearStructSelection () {
    mapCollect.start();
    let filter = mapMem.filter;

    for (let i = 0; i < filter.structSelectedPathList.length; i++) {
        mapasgn(pathMerge(filter.structSelectedPathList[i], ['selected']), 0);
    }
}

export function checkSelection (parentRef) {
    mapCollect.start();
    let filter = mapMem.filter;

    let rowSelected = false;
    let colSelected = false;

    let rowLen = parentRef.c.length;
    let colLen = parentRef.c[0].length;
    let selectionRows = [];
    let selectionCols = [];

    for (let i = 0; i < filter.cellSelectedPathList.length; i++) {
        selectionRows.push(mapref(filter.cellSelectedPathList[i]).index[0]);
        selectionCols.push(mapref(filter.cellSelectedPathList[i]).index[1]);
    }

    if (selectionRows.length === colLen && arrayValuesSame(selectionRows)) { // warning: arrayValuesSame has changed!!!
        rowSelected = true;
    }

    if (selectionCols.length === rowLen && arrayValuesSame(selectionCols)) {
        colSelected = true;
    }

    return [rowSelected, colSelected];
}

export function applyMixedSelection(toPath) {
    clearStructSelection();
    clearCellSelection();

    let toRef = mapref(toPath);
    toRef.selected = 1;
    toRef.s[0].selected = 1;
}

export function applyStructSelection(toPath) {
    clearStructSelection();
    clearCellSelection(); // because of mouse selection

    let toRef = mapref(toPath);
    toRef.selected = 1;
}
