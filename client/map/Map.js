import {copy, subsref, subsasgn, genHash} from "../core/Utils"
import {mapAssembly} from "./MapAssembly";
import {mapChain} from './MapChain'
import {mapDisassembly, nodeCopyList} from "./MapDisassembly";
import {mapDivVisualize} from './MapDivVisualize'
import {mapInit} from './MapInit'
import {mapMeasure} from './MapMeasure'
import {mapDeinit} from "./MapDeinit";
import {mapPlace} from './MapPlace'
import {mapTaskCalc} from './MapTaskCalc';
import {mapTaskColor} from './MapTaskColor'
import {mapSvgVisualize} from "./MapSvgVisualize";
import {getDefaultNode} from "../node/Node";

// algo
// IF path === s,0 --> rename it to r
// ELSE add r to the beginning

export let mapMem = {};
export let mapStorageOut = {};
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
        task: copy(mapStorage.task),

        getData: () => {
            return mapMem.data[mapMem.dataIndex];
        },

        // saveNever
        sLineDeltaXDefault:     mapStorage.density === 'large'? 30:20,
        padding:                mapStorage.density === 'large'? 8:3,
        defaultH:               mapStorage.density === 'large'? 30:20, // 30 = 14 + 2*8, 20 = 14 + 2*3
        filter: [],
        deepestSelectablePath: [],
    };

    mapMem.flow = mapStorage.hasOwnProperty('flow')? copy(mapStorage.flow) : 'right';
    // TODO: figure out the relation between changing map props and undo redo
}

export function recalc() {
    mapInit.start();
    mapChain.start();
    mapMeasure.start();
    mapPlace.start();

    if (mapMem.task) {
        mapTaskCalc.start();
        mapTaskColor.start();
    }
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
    let cm = JSON.parse(JSON.stringify(mapMem.getData())).s[0];
    let cml = JSON.parse(JSON.stringify(cm));
    mapDeinit.start(cml);
    mapDisassembly.start(cml);
    mapStorageOut ={
        data: nodeCopyList,
        density: mapMem.density,
        task: mapMem.task,
        flow: mapMem.flow,
    };
}
