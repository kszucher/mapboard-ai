import {genHash} from "./Utils";

export let mapDivData = [];
export let mapSvgData = [];
export let keepHash = '';

export function initDomData() {
    mapDivData = [];
    mapSvgData = [];
}

export function initDomHash() {
    keepHash = genHash(8);
}

export function updateDomData() {
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
