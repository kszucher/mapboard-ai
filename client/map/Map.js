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
        density: copy(mapStorage.density),
        taskLeft: 0,
        taskRight: 0,

        getData: () => {
            return mapMem.data[mapMem.dataIndex];
        },

        filter: [],
        deepestSelectablePath: [],

        isLocked: true,
    };

    setMapDensity(mapStorage.density);
    setMapIsLocked(true);
}

export const setMapDensity = (density) => {
    mapMem.density = density;
    mapMem.sLineDeltaXDefault = density === 'large'? 30:20;
    mapMem.padding = density === 'large'? 8:3;
    mapMem.defaultH = density === 'large'? 30:20; // 30 = 14 + 2*8, 20 = 14 + 2*3
};

export const setMapIsLocked = (isLocked) => {
    mapMem.isLocked = isLocked;
};

export const setMapAlignment = () => {
    if (mapMem.isLocked) {
        let mapHolderDiv = document.getElementById('mapHolderDiv');
        mapHolderDiv.scrollLeft = (window.innerWidth + mapMem.mapWidth) / 2;
        mapHolderDiv.scrollTop = window.innerHeight - 48 * 2;
    }
};

export function recalc() {
    mapRestore.start();
    mapInit.start();
    mapChain.start();
    mapMeasure.start();
    mapPlace.start();
    mapTaskCalc.start();
    mapTaskColor.start();
}

export function redraw() {
    keepHash = genHash(8);

    mapDivVisualize.start();
    mapSvgVisualize.start();

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
    mapMem.data.push(JSON.parse(JSON.stringify(mapMem.getData())));
    mapMem.dataIndex++;
}

export function checkPop() {
    if (JSON.stringify(mapMem.data[mapMem.dataIndex]) === JSON.stringify(mapMem.data[mapMem.dataIndex - 1])) {
        mapMem.data.length--;
        mapMem.dataIndex--;
    }
}

export function mapref(path) {
    return subsref(mapMem.getData(), path)
}

export function mapasgn(path, value) {
    subsasgn(mapMem.getData(), path, value)
}

export function pathMerge(path1, path2) {
    let retPath = path1.slice();
    for (let i = 0; i < Object.keys(path2).length; i++) {
        retPath.push(path2[i]);
    }
    return retPath;
}

export function saveMap () {
    let cm = copy(mapMem.getData());
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
