import {copy, subsref, subsasgn} from "../src/Utils"
import {mapAssembly} from "./MapAssembly";
import {mapChain} from './MapChain'
import {mapCollect} from './MapCollect'
import {mapDisassembly, nodeCopyList} from "./MapDisassembly";
import {mapDivVisualize} from './MapDivVisualize'
import {mapInit} from './MapInit'
import {mapMeasure} from './MapMeasure'
import {mapNodePropRemove} from "./MapNodePropRemove";
import {mapPlace} from './MapPlace'
import {mapTaskCalc} from './MapTaskCalc';
import {mapTaskColor} from './MapTaskColor'
import {taskCanvasVisualize} from "../task/TaskCanvasVisualize";
import {mapSvgVisualize} from "./MapSvgVisualize";

export let mapMem = {};
export let mapStorageOut = {};

let isMapLoaded = 0;
let isMapBuilt = 0;

export function checkMapBuilt() {
    return isMapBuilt;
}

let mapSaveNever = [
    'defaultH',
    'sLineDeltaXDefault',
    'padding',
    'filter',
    'deepestSelectablePath',
    'div',
    'divData',
    'svgData',
    'canvas',
    'canvasContext'
];

export function loadMap(mapStorage) {

    if (isMapLoaded === 1) {
        // clearCanvas();
        clearDivs();
        clearSvgs();
    }

    mapMem = {
        // saveOptional
        data: mapAssembly((mapStorage.data)),
        density: copy(mapStorage.density),
        task: copy(mapStorage.task),

        // saveNever
        sLineDeltaXDefault: mapStorage.density === 'large'? 30:20,
        padding: mapStorage.density === 'large'? 8:3,
        defaultH: mapStorage.density === 'large'? 30:20, // 30 = 14 + 2*8, 20 = 14 + 2*3
        filter: [],
        deepestSelectablePath: [],
        divData: [],
        svgData: [],
    };

    isMapLoaded = 1;
    isMapBuilt = 0;
}

export function rebuild() {
    mapInit.start();
    mapChain.start();
    mapMeasure.start();
    mapPlace.start();

    if (mapMem.task) {
        mapTaskCalc.start();
        mapTaskColor.start();
    }

    mapCollect.start();

    isMapBuilt = 1;
}

export function redraw() {
    // clearCanvas();
    mapDivVisualize.start();
    mapSvgVisualize.start();

    if (mapMem.task) {
        taskCanvasVisualize();
    }
}

export function clearDiv(divId) {
    let currDiv = document.getElementById(divId);
    currDiv.parentNode.removeChild(currDiv);
    delete mapMem.divData[divId];
}

export function clearDivs() {
    let currKeys = Object.keys(mapMem.divData);
    for (let i = 0; i < currKeys.length; i++) {
        let divId = currKeys[i];
        let currDiv = document.getElementById(divId);
        currDiv.parentNode.removeChild(currDiv);
        delete mapMem.divData[divId];
    }
}

export function clearSvg(svgId) {
    let currSvg = document.getElementById(svgId);
    currSvg.parentNode.removeChild(currSvg);
    delete mapMem.svgData[svgId];
}

export function clearSvgs() {
    let currKeys = Object.keys(mapMem.svgData);
    for (let i = 0; i < currKeys.length; i++) {
        let svgId = currKeys[i];
        let currSvg = document.getElementById(svgId);
        currSvg.parentNode.removeChild(currSvg);
        delete mapMem.svgData[svgId];
    }
}

export function clearCanvas() {
    let canvas =            document.getElementById('mapCanvas');
    let canvasContext =     document.getElementById('mapCanvas').getContext('2d');

    canvasContext.save();
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.restore();
}

export function mapref(path) {
    return subsref(mapMem.data, path)
}

export function mapasgn(path, value) {
    subsasgn(mapMem.data, path, value)
}

export function pathMerge(path1, path2) {
    let retPath = path1.slice();
    for (let i = 0; i < Object.keys(path2).length; i++) {
        retPath.push(path2[i]);
    }
    return retPath;
}

export function saveMap () {

    mapStorageOut = JSON.parse(JSON.stringify(mapMem));

    // genMapNodePropRemove
    let cm = mapStorageOut.data.s[0];
    let cml = JSON.parse(JSON.stringify(cm));
    mapNodePropRemove.start(cml);
    mapDisassembly.start(cml);

    mapStorageOut.data = nodeCopyList;

    // genMapPropRemove
    for (let i = 0; i < mapSaveNever.length; i++) {
        delete mapStorageOut[mapSaveNever[i]];
    }
}
