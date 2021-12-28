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
import { mapPrint } from '../map/MapPrint'

export let mapState = {
    data: [],
    dataIndex: 0,
};

export function mapDispatch(action, payload) {
    console.log('MAPDISPATCH: ' + action);
    mapReducer(action, payload);
    if (['initMapState', 'undo', 'redo'].includes(action)) {
        recalc();
    }
}

function mapReducer(action, payload) {
    switch (action) {
        case 'initMapState': {
            mapState.data = [mapAssembly(payload.mapStorage)];
            mapState.dataIndex = 0;
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

const getMapData = () => {
    return mapState.data[mapState.dataIndex];
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
    initDomHash();
    let m = mapref(['m']);
    for (let i = 0; i < mapref(['r']).length; i++) {
        let cr = mapref(['r', i]);
        mapVisualizeSvg.start(m, cr);
        mapVisualizeDiv.start(m, cr);
    }
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
    if (JSON.stringify(mapState.data[mapState.dataIndex]) ===
        JSON.stringify(mapState.data[mapState.dataIndex - 1])) {
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
