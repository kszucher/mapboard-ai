import { genHash, isChrome } from './Utils'

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
            for (const i of [0,1,2,3,4,5]) {
                let currSvg = document.getElementById(svgId + i);
                currSvg.parentNode.removeChild(currSvg);
                delete mapSvgData[svgId];
            }
        }
    }
}

const checkSvgField = (field) => {
    return (field && field !== '') ? field: 'none'
}

const svgElementNameList = [
    ['backgroundRect'],
    ['branchFill'],
    ['nodeFill'],
    [
        'line', 'branchBorder', 'nodeBorder',
        'tableFrame', 'tableGrid', 'tableCellFrame',
        'taskLine', 'taskCircle0', 'taskCircle1', 'taskCircle2', 'taskCircle3'
    ],
    ['selectionBorder', 'selectionBorderTable'],
    ['moveLine', 'moveRect', 'selectionRect'],
];

export const updateSvgDom = (svgId, path, svgElementData) => {
    let svgGroupList = [];
    if (!mapSvgData.hasOwnProperty(svgId) ||
        ((mapSvgData.hasOwnProperty(svgId) && mapSvgData[svgId].keepHash === keepHash))) {
        if (svgId === '') {
            svgId = 'svg' + genHash(8);
        }
        for (const i of [0,1,2,3,4,5]) {
            mapSvgData[svgId] = {
                svgElementData: [{},{},{},{},{},{}],
                path: [],
            };
            svgGroupList.push(document.createElementNS("http://www.w3.org/2000/svg", "g"));
            svgGroupList[i].setAttribute("id", svgId + i);
            let parentG = document.getElementById('layer' + i);
            parentG.appendChild(svgGroupList[i]);
        }
    } else {
        for (const i of [0,1,2,3,4,5]) {
            svgGroupList.push(document.getElementById(svgId + i));
        }
    }
    for (const i of [0,1,2,3,4,5]) {
        for (const svgElementName of svgElementNameList[i]) {
            let hadBefore = mapSvgData[svgId].svgElementData[i].hasOwnProperty(svgElementName);
            let hasNow = svgElementData[i].hasOwnProperty(svgElementName);
            let op = '';
            if (hadBefore === false && hasNow === true) op = 'init';
            if (hadBefore === true && hasNow === false) op = 'delete';
            if (hadBefore === true && hasNow === true) {
                if (JSON.stringify(svgElementData[i][svgElementName]) !==
                    JSON.stringify(mapSvgData[svgId].svgElementData[i][svgElementName])) {
                    op = 'update';
                }
            }
            switch (op) {
                case 'init': {
                    let {type} = svgElementData[i][svgElementName]
                    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", type);
                    svgElement.setAttribute("id", svgElementName);
                    switch (type) {
                        case 'path': {
                            let {path, fill, stroke, strokeWidth, preventTransition} = svgElementData[i][svgElementName];
                            svgElement.setAttribute("d", path);
                            svgElement.setAttribute("fill", checkSvgField(fill));
                            svgElement.setAttribute("stroke", checkSvgField(stroke));
                            svgElement.setAttribute("stroke-width", strokeWidth);
                            svgElement.setAttribute("vector-effect", "non-scaling-stroke");
                            svgElement.style.transition = preventTransition ? '' : 'all 0.5s';
                            svgElement.style.transitionTimingFunction = preventTransition ? '' : 'cubic-bezier(0.0,0.0,0.58,1.0)';
                            svgElement.style.transitionProperty = 'd, fill, stroke-width';
                            if (!isChrome) {
                                let svgElementAnimate = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
                                svgElementAnimate.setAttribute("attributeName", "d");
                                svgElementAnimate.setAttribute("attributeType", "XML");
                                svgElementAnimate.setAttribute("dur", "0.5s");
                                svgElementAnimate.setAttribute("calcMode", "spline");
                                svgElementAnimate.setAttribute("keySplines", "0 0 0.58 1");
                                svgElementAnimate.setAttribute("keyTimes", "0;1");
                                svgElement.appendChild(svgElementAnimate);
                            }
                            break;
                        }
                        case 'circle': {
                            let {cx, cy, r, fill} = svgElementData[i][svgElementName];
                            svgElement.setAttribute("cx", cx);
                            svgElement.setAttribute("cy", cy);
                            svgElement.setAttribute("r", r);
                            svgElement.setAttribute("fill", fill);
                            svgElement.setAttribute("vector-effect", "non-scaling-stroke");
                            svgElement.style.transition = '0.5s ease-out';
                            break;
                        }
                        case 'rect': {
                            let {x, y, width, height, rx, ry, fill, fillOpacity, stroke, strokeWidth, preventTransition} = svgElementData[i][svgElementName];
                            svgElement.setAttribute("x", x);
                            svgElement.setAttribute("y", y);
                            svgElement.setAttribute("width", width);
                            svgElement.setAttribute("height", height);
                            svgElement.setAttribute("rx", rx);
                            svgElement.setAttribute("ry", ry);
                            svgElement.setAttribute("fill", fill);
                            svgElement.setAttribute("fill-opacity", fillOpacity);
                            svgElement.setAttribute("stroke", checkSvgField(stroke));
                            svgElement.setAttribute("stroke-width", strokeWidth);
                            svgElement.style.transition = preventTransition ? '' : '0.5s ease-out';
                            break;
                        }
                    }
                    svgGroupList[i].appendChild(svgElement);
                    break;
                }
                case 'update': {
                    let {type} = svgElementData[i][svgElementName];
                    let svgElement = svgGroupList[i].querySelector('#' + svgElementName);
                    switch (type) {
                        case 'path': {
                            let {path, fill, stroke, strokeWidth} = svgElementData[i][svgElementName];
                            let prevPath = svgElement.getAttribute('d')
                            svgElement.setAttribute("d", path);
                            svgElement.setAttribute("fill", checkSvgField(fill));
                            svgElement.setAttribute("stroke", stroke);
                            svgElement.setAttribute("stroke-width", strokeWidth);
                            if (!isChrome) {
                                svgElement.lastChild.setAttribute("from", prevPath);
                                svgElement.lastChild.setAttribute("to", path);
                                svgElement.lastChild.beginElement();
                            }
                            break;
                        }
                        case 'circle': {
                            let {cx, cy, r, fill} = svgElementData[i][svgElementName];
                            svgElement.setAttribute("cx", cx);
                            svgElement.setAttribute("cy", cy);
                            svgElement.setAttribute("r", r);
                            svgElement.setAttribute("fill", fill);
                            break;
                        }
                        case 'rect': {
                            let {x, y, width, height} = svgElementData[i][svgElementName];
                            svgElement.setAttribute("x", x);
                            svgElement.setAttribute("y", y);
                            svgElement.setAttribute("width", width);
                            svgElement.setAttribute("height", height);
                            break;
                        }
                    }
                    break;
                }
                case 'delete': {
                    let svgElement = svgGroupList[i].querySelector('#' + svgElementName);
                    svgElement.parentNode.removeChild(svgElement);
                    break;
                }
            }
        }
    }
    Object.assign(mapSvgData[svgId], {keepHash, svgElementData, path})
}
