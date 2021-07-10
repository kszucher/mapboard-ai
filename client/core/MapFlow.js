import {mapAssembly} from "../map/MapAssembly";
import {copy, subsref} from "./Utils";
import {mapAlgo} from "../map/MapAlgo";
import {mapInit} from "../map/MapInit";
import {mapChain} from "../map/MapChain";
import {mapTaskCheck} from "../map/MapTaskCheck";
import {mapMeasure} from "../map/MapMeasure";
import {mapPlace} from "../map/MapPlace";
import {mapTaskCalc} from "../map/MapTaskCalc";
import {mapTaskColor} from "../map/MapTaskColor";
import {mapDeinit} from "../map/MapDeinit";
import {mapDisassembly} from "../map/MapDisassembly";
import {initDomHash, updateDomData} from "./DomFlow";
import {mapVisualizeDiv} from "../map/MapVisualizeDiv";
import {mapVisualizeSvg} from "../map/MapVisualizeSvg";
import {initSelectionState, updateSelectionState} from "./SelectionFlow";
import {mapCollect} from "../map/MapCollect";

export let mapState = {
    isResizing: false,
    isLoading: false,

    mapId: '',
    dataIndex: 0,
    data: [],

    deepestSelectablePath: [],
    isNodeClicked: false,
    isTaskClicked: false,
    moveTargetPath: [],
    moveTargetIndex: 0,
};

const InitMapState = JSON.stringify(mapState);

export function mapDispatch(action, payload) {
    console.log('MAPDISPATCH: ' + action);
    mapReducer(action, payload);
    if (['setMapStorage', 'isResizing', 'undo', 'redo'].includes(action)) {
        recalc();
    }
}

function mapReducer(action, payload) {
    switch (action) {
        case 'setMapStorage': {
            mapState = JSON.parse(InitMapState);
            mapState.data = [mapAssembly(payload.data)];
            mapState.mapId = payload._id;
            mapState.isLoading = true;
            break;
        }
        case 'setIsResizing': {
            mapState.isResizing = true;
            break;
        }
        case 'undo': {
            if (mapState.dataIndex > 0) {
                mapState.dataIndex--;
            }
            break;
        }
        case 'redo': {
            if (mapState.dataIndex < mapState.data.length - 1) {
                mapState.dataIndex++;
            }
            break;
        }
    }
}

export const getMapData = () => {
    return mapState.data[mapState.dataIndex];
};

export function recalc() {
    initSelectionState();
    let m = getMapData().m;
    let r = getMapData().r;
    mapAlgo.start(m, r);
    mapInit.start(m, r);
    mapChain.start(m, r);
    mapTaskCheck.start(m, r);
    mapMeasure.start(m, r);
    mapPlace.start(m, r);
    mapTaskCalc.start(m, r);
    mapTaskColor.start(m, r);
    mapCollect.start(m, r);
    updateSelectionState();
}

export function redraw() {
    initDomHash();
    let m = getMapData().m;
    let r = getMapData().r;
    mapVisualizeSvg.start(m, r);
    mapVisualizeDiv.start(m, r);
    updateDomData();
}

export function push() {
    if (mapState.data.length > mapState.dataIndex + 1) {
        mapState.data.length = mapState.dataIndex + 1;
    }
    mapState.data.push(JSON.parse(JSON.stringify(getMapData())));
    mapState.dataIndex++;
}

export function checkPop() {
    if (JSON.stringify(mapState.data[mapState.dataIndex]) === JSON.stringify(mapState.data[mapState.dataIndex - 1])) {
        mapState.data.length--;
        mapState.dataIndex--;
    }
}

export function mapref(path) {
    return subsref(getMapData(), path)
}

export function pathMerge(path1, path2) {
    let retPath = path1.slice();
    for (let i = 0; i < Object.keys(path2).length; i++) {
        retPath.push(path2[i]);
    }
    return retPath;
}

export function saveMap() {
    let cm = copy(getMapData());
    mapDeinit.start(cm);
    return mapDisassembly.start(cm);
}
