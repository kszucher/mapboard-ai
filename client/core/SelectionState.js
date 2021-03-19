import {getSelectionContext} from "../node/NodeSelect";
import {mapref} from "../map/Map";

export let selectionState = {
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

export const setSelectionState = (payload) => {
    selectionState = {...selectionState, ...payload}
}
