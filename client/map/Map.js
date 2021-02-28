import {copy, subsref, subsasgn, genHash} from "../core/Utils"
import {mapAssembly} from "./MapAssembly";
import {mapChain} from './MapChain'
import {mapDisassembly} from "./MapDisassembly";
import {mapDivVisualize} from './MapDivVisualize'
import {mapInit} from './MapInit'
import {mapMeasure} from './MapMeasure'
import {mapDeinit} from "./MapDeinit";
import {mapPlace} from './MapPlace'
import {mapTaskCalc} from './MapTaskCalc';
import {mapTaskColor} from './MapTaskColor'
import {mapSvgVisualize} from "./MapSvgVisualize";
import {mapRestore} from "./MapRestore";

export let mapMem = {};
export let mapDivData = [];
export let mapSvgData = [];
export let keepHash = '';

export function initDomData() {
    mapDivData = [];
    mapSvgData = [];
}

export function loadMap(mapStorage) {
    mapMem = {
        dataIndex: 0,
        data: [mapAssembly((mapStorage.data))],

        density: '',
        alignment: '',

        taskLeft: 0,
        taskRight: 0,

        filter: [],
        deepestSelectablePath: [],

        isNodeClicked: false,
        isMouseDown: false,
        shouldMove: false,
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
}

export const getMapData = () => {
    return mapMem.data[mapMem.dataIndex];
};

export function recalc() {
    let r = getMapData().r;
    mapRestore.start(r);
    mapInit.start(r);
    mapChain.start(r);
    mapMeasure.start(r);
    mapPlace.start(r);
    mapTaskCalc.start(r);
    mapTaskColor.start(r);
}

export function redraw() {
    keepHash = genHash(8);

    let r = getMapData().r;
    mapDivVisualize.start(r);
    mapSvgVisualize.start(r);

    for (const divId in mapDivData) {
        if (mapDivData[divId].keepHash !== keepHash) {
            let currDiv = document.getElementById(divId);
            currDiv.parentNode.removeChild(currDiv);
            delete mapDivData[divId];
        }
    }

    for (const svgId in mapSvgData) {
        if (mapSvgData[svgId].keepHash !== keepHash) {
            let currSvg = document.getElementById(svgId);
            currSvg.parentNode.removeChild(currSvg);
            delete mapSvgData[svgId];
        }
    }
}

export function push() {
    if (mapMem.data.length > mapMem.dataIndex + 1) {
        mapMem.data.length = mapMem.dataIndex + 1;
    }
    mapMem.data.push(JSON.parse(JSON.stringify(getMapData())));
    mapMem.dataIndex++;
}

export function checkPop() {
    if (JSON.stringify(mapMem.data[mapMem.dataIndex]) === JSON.stringify(mapMem.data[mapMem.dataIndex - 1])) {
        mapMem.data.length--;
        mapMem.dataIndex--;
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

export function saveMap () {
    let cm = copy(getMapData());
    mapDeinit.start(cm);
    return mapDisassembly.start(cm);
}

export function getDefaultMap (mapName) {
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
