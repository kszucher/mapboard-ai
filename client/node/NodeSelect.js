import {mapMem, mapref, mapasgn, pathMerge} from "../map/Map";
import {mapCollect} from "../map/MapCollect";

export function getSelectionContext () {
    mapCollect.start();
    let filter = mapMem.filter;

    let maxSel = 0;
    let maxSelIndex = undefined;
    let scope = '';

    let lastPath = [];
    let geomHighPath = [];
    let geomLowPath = [];

    const {structSelectedPathList, cellSelectedPathList} = filter;

    if (structSelectedPathList.length && cellSelectedPathList.length) {
        scope = 'm';
        lastPath = structSelectedPathList[0];
        geomHighPath = lastPath;
        geomLowPath = lastPath;
    }
    else if (structSelectedPathList.length) {
        scope = 's';
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
    }
    else if (cellSelectedPathList.length) {
        scope = 'c';
        for (let i = 0; i < cellSelectedPathList.length; i++) {
            let currSelectedNumber = mapref(cellSelectedPathList[i]).selected;
            if (currSelectedNumber > maxSel) {
                maxSel = currSelectedNumber;
                maxSelIndex = i;
            }
        }
        lastPath = cellSelectedPathList[maxSelIndex];
    }
    else {
        console.log('no selection');
    }

    return {
        maxSel,
        scope,
        lastPath,
        lm: mapref(lastPath),
        geomHighPath,
        geomHighRef: mapref(geomHighPath),
        geomLowPath,
        geomLowRef: mapref(geomLowPath),
        structSelectedPathList,
        cellSelectedPathList,
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
