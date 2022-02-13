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
import {flagDomData, updateDomData} from "./DomFlow";
import {mapVisualizeDiv} from "../map/MapVisualizeDiv";
import {mapVisualizeSvg} from "../map/MapVisualizeSvg";
import {initSelectionState, updateSelectionState} from "./SelectionFlow";
import {mapCollect} from "../map/MapCollect";
import { mapPrint } from '../map/MapPrint'

export let mapStack = {
    data: [],
    dataIndex: 0,
};

export function mapStackDispatch(action, payload) {
    console.log('MAPDISPATCH: ' + action);
    mapStackReducer(action, payload);
    recalc();
}

function mapStackReducer(action, payload) {
    switch (action) {
        case 'initMapState': {
            mapStack.data = [mapAssembly(payload.mapStorage)];
            mapStack.dataIndex = 0;
            break;
        }
        case 'undo': {
            if (mapStack.dataIndex > 0) {
                mapStack.dataIndex--;
            }
            break;
        }
        case 'redo': {
            if (mapStack.dataIndex < mapStack.data.length - 1) {
                mapStack.dataIndex++;
            }
            break;
        }
    }
}

const getMapData = () => {
    return mapStack.data[mapStack.dataIndex];
};

export function recalc() {
    initSelectionState();
    let m = mapref(['m']);
    for (let i = 0; i < mapref(['r']).length; i++) {
        let cr = mapref(['r', i]);
        mapAlgo.start(m, cr);
        mapInit.start(m, cr);
        mapChain.start(m, cr, i);
        mapTaskCheck.start(m, cr);
        mapMeasure.start(m, cr);
        mapPlace.start(m, cr);
        mapTaskCalc.start(m, cr);
        mapTaskColor.start(m, cr);
        mapCollect.start(m, cr);
        // mapPrint.start(m, cr)
    }
    updateSelectionState();
}

export function redraw() {
    flagDomData();
    let m = mapref(['m']);
    for (let i = 0; i < mapref(['r']).length; i++) {
        let cr = mapref(['r', i]);
        mapVisualizeSvg.start(m, cr);
        mapVisualizeDiv.start(m, cr);
    }
    updateDomData();
}

export function push() {
    if (mapStack.data.length > mapStack.dataIndex + 1) {
        mapStack.data.length = mapStack.dataIndex + 1;
    }
    mapStack.data.push(JSON.parse(JSON.stringify(getMapData())));
    mapStack.dataIndex++;
}

export function checkPop(dispatch) {
    if (JSON.stringify(mapStack.data[mapStack.dataIndex]) ===
        JSON.stringify(mapStack.data[mapStack.dataIndex - 1])) {
        mapStack.data.length--;
        mapStack.dataIndex--;
    } else {
        dispatch({ type: 'MAP_STATE_CHANGED' })
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
