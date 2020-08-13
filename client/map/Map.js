import {copy, subsref, subsasgn} from "../core/Utils"
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
import {mapSvgVisualize} from "./MapSvgVisualize";

export let mapMem = {};
export let mapStorageOut = {};

let isMapLoaded = 0;
let isMapBuilt = 0;

export function checkMapBuilt() {
    return isMapBuilt;
}

export function loadMap(mapStorage) {

    if (isMapLoaded === 1) {
        clearDivs();
        clearSvgs();
    }

    mapMem = {
        // saveOptional
        data: [mapAssembly((mapStorage.data))], // TODO: egyelőre ez az egy dolog legyen undo-redo követve!!!
        density: copy(mapStorage.density),
        task: copy(mapStorage.task),

        getData: () => {
            return mapMem.data[0];
        },

        // saveNever
        sLineDeltaXDefault:     mapStorage.density === 'large'? 30:20,
        padding:                mapStorage.density === 'large'? 8:3,
        defaultH:               mapStorage.density === 'large'? 30:20, // 30 = 14 + 2*8, 20 = 14 + 2*3

        filter: [],
        deepestSelectablePath: [],

        // TODO: separate this from mapMem!!! --> very easy, don't overthing, implement and move forward, bug fixing shall drive dev instead!!!
        divData: [],
        svgData: [],
    };

    isMapLoaded = 1;
    isMapBuilt = 0;
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

    mapCollect.start();

    isMapBuilt = 1;
}

export function redraw() {
    mapDivVisualize.start();
    mapSvgVisualize.start();
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
    mapNodePropRemove.start(cml);
    mapDisassembly.start(cml);
    mapStorageOut ={
        data: nodeCopyList,
        density: mapMem.density,
        task: mapMem.task,
    };
}
