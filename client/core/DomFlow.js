import { genHash, isChrome } from './Utils'

export let mapDivData = [];
export let mapSvgData = [[],[],[],[],[],[]];
export let keepHash = '';

export function initDomData() {
    mapDivData = [];

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < mapSvgData[i].length; i++) {
            const currSvgData = mapSvgData[i][j]
            currSvgData.op = 'delete'
        }
    }
}

export function initDomHash() {
    keepHash = genHash(8);
}

const checkSvgField = (field) => {
    return (field && field !== '') ? field: 'none'
}

export function updateDomData() {
    for (const nodeId in mapDivData) {
        if (mapDivData[nodeId].keepHash !== keepHash) {
            let currDiv = document.getElementById(nodeId);
            currDiv.parentNode.removeChild(currDiv);
            delete mapDivData[nodeId];
        }
    }

    for (let i = 0; i < 6; i++) {
        for (let j = mapSvgData[i].length - 1; j >= 0; j--) {
            const currSvgData = mapSvgData[i][j]
            const { svgId, type, params, op } = currSvgData
            switch (op) {
                case 'create': {
                    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", type);
                    svgElement.setAttribute("id", svgId);
                    switch (type) {
                        case 'path': {
                            const {path, fill, stroke, strokeWidth, preventTransition} = params
                            svgElement.setAttribute("d", path)
                            svgElement.setAttribute("fill", checkSvgField(fill))
                            svgElement.setAttribute("stroke", checkSvgField(stroke))
                            svgElement.setAttribute("stroke-width", strokeWidth)
                            svgElement.setAttribute("vector-effect", "non-scaling-stroke")
                            svgElement.style.transition = preventTransition ? '' : 'all 0.5s'
                            svgElement.style.transitionTimingFunction = preventTransition ? '' : 'cubic-bezier(0.0,0.0,0.58,1.0)'
                            svgElement.style.transitionProperty = 'd, fill, stroke-width'
                            if (!isChrome) {
                                let svgElementAnimate = document.createElementNS("http://www.w3.org/2000/svg", 'animate')
                                svgElementAnimate.setAttribute("attributeName", "d")
                                svgElementAnimate.setAttribute("attributeType", "XML")
                                svgElementAnimate.setAttribute("dur", "0.5s")
                                svgElementAnimate.setAttribute("calcMode", "spline")
                                svgElementAnimate.setAttribute("keySplines", "0 0 0.58 1")
                                svgElementAnimate.setAttribute("keyTimes", "0;1")
                                svgElement.appendChild(svgElementAnimate)
                            }
                            break;
                        }
                        case 'circle': {
                            const {cx, cy, r, fill} = params
                            svgElement.setAttribute("cx", cx)
                            svgElement.setAttribute("cy", cy)
                            svgElement.setAttribute("r", r)
                            svgElement.setAttribute("fill", fill)
                            svgElement.setAttribute("vector-effect", "non-scaling-stroke")
                            svgElement.style.transition = '0.5s ease-out'
                            break;
                        }
                        case 'rect': {
                            const {x, y, width, height, rx, ry, fill, fillOpacity, stroke, strokeWidth, preventTransition} = params
                            svgElement.setAttribute("x", x)
                            svgElement.setAttribute("y", y)
                            svgElement.setAttribute("width", width)
                            svgElement.setAttribute("height", height)
                            svgElement.setAttribute("rx", rx)
                            svgElement.setAttribute("ry", ry)
                            svgElement.setAttribute("fill", fill)
                            svgElement.setAttribute("fill-opacity", fillOpacity)
                            svgElement.setAttribute("stroke", checkSvgField(stroke))
                            svgElement.setAttribute("stroke-width", strokeWidth)
                            svgElement.style.transition = preventTransition ? '' : '0.5s ease-out'
                            break;
                        }
                    }
                    let parentG = document.getElementById('layer' + i)
                    // can I just use .parentNode.appendChild ??
                    parentG.appendChild(svgElement)
                    break
                }
                case 'update': {
                    let svgElement = document.getElementById(svgId)
                    if (svgElement) { // this is used for handling the situation where it changes before even created
                        switch (type) {
                            case 'path': {
                                const { path, fill, stroke, strokeWidth } = params
                                const prevPath = svgElement.getAttribute('d')
                                svgElement.setAttribute("d", path)
                                svgElement.setAttribute("fill", checkSvgField(fill))
                                svgElement.setAttribute("stroke", stroke)
                                svgElement.setAttribute("stroke-width", strokeWidth)
                                if (!isChrome) {
                                    svgElement.lastChild.setAttribute("from", prevPath)
                                    svgElement.lastChild.setAttribute("to", path)
                                    svgElement.lastChild.beginElement()
                                }
                                break;
                            }
                            case 'circle': {
                                let { cx, cy, r, fill } = params
                                svgElement.setAttribute("cx", cx);
                                svgElement.setAttribute("cy", cy);
                                svgElement.setAttribute("r", r);
                                svgElement.setAttribute("fill", fill);
                                break;
                            }
                            case 'rect': {
                                let { x, y, width, height } = params
                                svgElement.setAttribute("x", x);
                                svgElement.setAttribute("y", y);
                                svgElement.setAttribute("width", width);
                                svgElement.setAttribute("height", height);
                                break;
                            }
                        }
                    }
                    break
                }
                case 'delete': {
                    let svgElement = document.getElementById(currSvgData.svgId)

                    console.log('delete???')

                    svgElement.parentNode.removeChild(svgElement)
                    mapSvgData[i].splice(j, 1) // probably this does the job??
                    break
                }
            }
        }
    }
}
