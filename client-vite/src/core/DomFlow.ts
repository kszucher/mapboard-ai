// @ts-nocheck

import { getLatexString, isChrome } from './Utils'
import katex from 'katex/dist/katex.mjs'

let mapDivData = [];
let mapSvgData = [[],[],[],[],[],[]];

const renderContent = (contentType, content) => {
    switch (contentType) {
        case 'text':
            return content;
        case 'equation':
            return katex.renderToString(getLatexString(content), {throwOnError: false});
        case 'image':
            let imageLink = 'https://mapboard.io/file/';
            return '<img src="' + imageLink + content + '" alt="" id="img">';
    }
}

const checkSvgField = (field) => {
    return (field && field !== '') ? field: 'none'
}

export const initDomData = () => {
    mapDivData = []
    mapSvgData = [[],[],[],[],[],[]]
}

export const flagDomData = () => {
    for (let i = 0; i < mapDivData.length; i++) {
        let currDivData = mapDivData[i]
        currDivData.op = 'delete'
    }
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < mapSvgData[i].length; j++) {
            let currSvgData = mapSvgData[i][j]
            currSvgData.op = 'delete'
        }
    }
}

export const updateMapDivData = ( nodeId, contentType, content, path, isEditing, styleData ) => {
    const divId = `${nodeId}_div`
    let el = mapDivData.find(el => el.divId === divId)
    let shouldInnerHTMLUpdate = false
    let shouldStyleUpdate = {}
    if (el) {
        if (!isEditing) {
            shouldInnerHTMLUpdate = el.params.contentType !== contentType || el.params.content !== content
        }
        for (const style in styleData) {
            shouldStyleUpdate[style] = el.params.styleData[style] !== styleData[style]
        }
    }
    let params = { contentType, content, styleData, shouldInnerHTMLUpdate, shouldStyleUpdate }
    if (el) {
        if (!shouldInnerHTMLUpdate && !shouldStyleUpdate) {
            el.op = 'keep'
        } else {
            el.op = 'update'
            el.params = params
        }
    } else {
        const op = 'create'
        mapDivData.push({ divId, params, op })
    }
}

export const updateMapSvgData = ( nodeId, name, params ) => {
    let layer, type
    switch (name) {
        case 'backgroundRect':          layer = 0; type = 'rect'; break
        case 'moveLine':                layer = 5; type = 'path'; break
        case 'moveRect':                layer = 5; type = 'rect'; break
        case 'selectionRect':           layer = 5; type = 'rect'; break
        case 'branchFill':              layer = 1; type = 'path'; break
        case 'nodeFill':                layer = 2; type = 'path'; break
        case 'branchBorder':            layer = 3; type = 'path'; break
        case 'nodeBorder':              layer = 3; type = 'path'; break
        case 'line':                    layer = 3; type = 'path'; break
        case 'tableFrame':              layer = 3; type = 'path'; break
        case 'tableGrid':               layer = 3; type = 'path'; break
        case 'taskLine':                layer = 3; type = 'path'; break
        case 'taskCircle0':             layer = 3; type = 'circle'; break
        case 'taskCircle1':             layer = 3; type = 'circle'; break
        case 'taskCircle2':             layer = 3; type = 'circle'; break
        case 'taskCircle3':             layer = 3; type = 'circle'; break
        case 'selectionBorder':         layer = 4; type = 'path'; break
    }
    const svgId = `${nodeId}_svg_${name}`
    let el = mapSvgData[layer].find(el => el.svgId === svgId)
    if (el) {
        if (JSON.stringify(el.params) === JSON.stringify(params)) {
            el.op = 'keep'
        } else {
            el.op = 'update'
            el.params = params
        }
    } else {
        const op = 'create'
        mapSvgData[layer].push({ svgId, type, params, op })
    }
}

export function updateDomData() {
    for (let i = mapDivData.length - 1; i >=0; i--) {
        const currDivData = mapDivData[i]
        const { op, divId, params } = currDivData
        const { contentType, content, styleData, shouldInnerHTMLUpdate, shouldStyleUpdate } = params
        switch (op) {
            case 'create': {
                let div = document.createElement('div')
                div.id = divId
                div.contentEditable = false
                div.spellcheck = false
                div.appendChild(document.createTextNode(''))
                document.getElementById('mapDiv').appendChild(div)
                for (const style in styleData) {
                    div.style[style] = styleData[style]
                }
                div.innerHTML = renderContent(contentType, content)
                break
            }
            case 'update': {
                let div = document.getElementById(divId)
                if (div) {
                    if (shouldInnerHTMLUpdate) {
                        div.innerHTML = renderContent(contentType, content);
                    }
                    for (const style in styleData) {
                        if (shouldStyleUpdate[style]) {
                            div.style[style] = styleData[style]
                        }
                    }
                }
                break
            }
            case 'delete': {
                let currDiv = document.getElementById(divId);
                currDiv.parentNode.removeChild(currDiv);
                mapDivData.splice(i, 1)
                break
            }
        }
    }
    for (let i = 0; i < 6; i++) {
        for (let j = mapSvgData[i].length - 1; j >= 0; j--) {
            const currSvgData = mapSvgData[i][j]
            const { svgId, type, params, op } = currSvgData
            switch (op) {
                case 'create': {
                    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", type)
                    svgElement.setAttribute("id", svgId)
                    switch (type) {
                        case 'path': {
                            const {path, fill, stroke, strokeWidth, preventTransition} = params
                            svgElement.setAttribute("d", path)
                            svgElement.setAttribute("fill", checkSvgField(fill))
                            svgElement.setAttribute("stroke", checkSvgField(stroke))
                            svgElement.setAttribute("stroke-width", strokeWidth)
                            svgElement.setAttribute("vector-effect", "non-scaling-stroke")
                            svgElement.style.transition = preventTransition ? '' : 'all 0.3s'
                            svgElement.style.transitionTimingFunction = preventTransition ? '' : 'cubic-bezier(0.0,0.0,0.58,1.0)'
                            svgElement.style.transitionProperty = 'd, fill, stroke-width'
                            if (!isChrome) {
                                let svgElementAnimate = document.createElementNS("http://www.w3.org/2000/svg", 'animate')
                                svgElementAnimate.setAttribute("attributeName", "d")
                                svgElementAnimate.setAttribute("attributeType", "XML")
                                svgElementAnimate.setAttribute("dur", "0.3s")
                                svgElementAnimate.setAttribute("calcMode", "spline")
                                svgElementAnimate.setAttribute("keySplines", "0 0 0.58 1")
                                svgElementAnimate.setAttribute("keyTimes", "0;1")
                                svgElement.appendChild(svgElementAnimate)
                            }
                            break
                        }
                        case 'circle': {
                            const {cx, cy, r, fill} = params
                            svgElement.setAttribute("cx", cx)
                            svgElement.setAttribute("cy", cy)
                            svgElement.setAttribute("r", r)
                            svgElement.setAttribute("fill", fill)
                            svgElement.setAttribute("vector-effect", "non-scaling-stroke")
                            svgElement.style.transition = '0.3s ease-out'
                            break
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
                            svgElement.style.transition = preventTransition ? '' : '0.3s ease-out'
                            break
                        }
                    }
                    let parentG = document.getElementById('layer' + i)
                    parentG.appendChild(svgElement)
                    break
                }
                case 'update': {
                    let svgElement = document.getElementById(svgId)
                    if (svgElement) {
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
                                break
                            }
                            case 'circle': {
                                let { cx, cy, r, fill } = params
                                svgElement.setAttribute("cx", cx)
                                svgElement.setAttribute("cy", cy)
                                svgElement.setAttribute("r", r)
                                svgElement.setAttribute("fill", fill)
                                break
                            }
                            case 'rect': {
                                let { x, y, width, height, fill } = params
                                svgElement.setAttribute("x", x)
                                svgElement.setAttribute("y", y)
                                svgElement.setAttribute("width", width)
                                svgElement.setAttribute("height", height)
                                svgElement.setAttribute("fill", fill)
                                break
                            }
                        }
                    }
                    break
                }
                case 'delete': {
                    let svgElement = document.getElementById(svgId)
                    svgElement.parentNode.removeChild(svgElement)
                    mapSvgData[i].splice(j, 1)
                    break
                }
            }
        }
    }
}
