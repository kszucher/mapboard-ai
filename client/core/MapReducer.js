import {mapAssembly} from "../map/MapAssembly";
import {copy, subsasgn, subsref} from "./Utils";
import {mapRestore} from "../map/MapRestore";
import {mapInit} from "../map/MapInit";
import {mapChain} from "../map/MapChain";
import {mapTaskCheck} from "../map/MapTaskCheck";
import {mapMeasure} from "../map/MapMeasure";
import {mapPlace} from "../map/MapPlace";
import {mapTaskCalc} from "../map/MapTaskCalc";
import {mapTaskColor} from "../map/MapTaskColor";
import {mapDeinit} from "../map/MapDeinit";
import {mapDisassembly} from "../map/MapDisassembly";
import {initDomHash, updateDomData} from "./DomReducer";
import {mapDivVisualize} from "../map/MapDivVisualize";
import {mapSvgVisualize} from "../map/MapSvgVisualize";

export let mapState = {
    isLoading: true,

    dataIndex: 0,
    data: [],

    density: '', // inherit
    sLineDeltaXDefault: 0,
    padding: 0,
    defaultH: 0,

    alignment: '', // inherit

    taskLeft: 0,
    taskRight: 0,

    mapWidth: 0,
    mapHeight: 0,

    deepestSelectablePath: [],

    isNodeClicked: false,
    isTaskClicked: false,
    shouldCenter: false,

    moveTarget: {
        path: [],
        index: 0,
    },

    margin: 32,
    taskConfig: {
        n: 4,
        d: 24,
        gap: 4,
        width: 0,
    },
};

const initMapState = JSON.stringify(mapState);

export function mapDispatch(action, payload) {
    console.log('MAPDISPATCH: ' + action);
    mapReducer(action, payload);
    if (['setDensity', 'setAlignment', 'setTaskConfigWidth', 'undo', 'redo'].includes(action)) {
        recalc();
    }
}

function mapReducer(action, payload) {
    switch (action) {
        case 'setData':
            mapState = JSON.parse(initMapState);
            mapState.data = [mapAssembly(payload)];
            break;
        case 'setDensity':
            mapState.density = payload;
            mapState.sLineDeltaXDefault = payload === 'large'? 30:20;
            mapState.padding = payload === 'large'? 8:3;
            mapState.defaultH = payload === 'large'? 30:20; // 30 = 14 + 2*8, 20 = 14 + 2*3
            mapState.taskConfig.d = payload === 'large'? 24 : 20;
            break;
        case 'setAlignment':
            mapState.alignment = payload;
            break;
        case 'setTaskConfigWidth':
            let {n, d, gap} = mapState.taskConfig;
            mapState.taskConfig.width = n*d + (n-1)*gap;
            break;
        case 'undo':
            if (mapState.dataIndex > 0) {
                mapState.dataIndex--;
            }
            break;
        case 'redo':
            if (mapState.dataIndex < mapState.data.length - 1) {
                mapState.dataIndex++;
            }
            break;
    }
}

export const getMapData = () => {
    return mapState.data[mapState.dataIndex];
};

export function recalc() {
    let r = getMapData().r;
    mapRestore.start(r);
    mapInit.start(r);
    mapChain.start(r);
    mapTaskCheck.start(r);
    mapMeasure.start(r);
    mapPlace.start(r);
    mapTaskCalc.start(r);
    mapTaskColor.start(r);
}

export function redraw() {
    initDomHash();
    let r = getMapData().r;
    mapDivVisualize.start(r);
    mapSvgVisualize.start(r);
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

export function mapasgn(path, value) {
    subsasgn(getMapData(), path, value)
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

export function getDefaultMap(mapName) {
    return [
        {
            path: ['r'],
            content: mapName,
            selected: 1
        },
        {
            path: ['r', 'd', 0],
        },
        {
            path: ['r', 'd', 1],
        },
    ]
}
