import { cellBlockDeleteReselect, structDeleteReselect } from '../node/NodeDelete'
import { cellInsert, structInsert } from '../node/NodeInsert'
import { nodeMove, nodeMoveMouse, setClipboard } from '../node/NodeMove'
import { nodeNavigate } from '../node/NodeNavigate'
import { setEndOfContenteditable, transposeArray } from './Utils'
import { initSelectionState, selectionState, updateSelectionState } from './SelectionFlow'
import { flagDomData, updateDomData } from './DomFlow'
import { mapref } from './MapStackFlow'
import { nodeProps } from './DefaultProps'
import { mapChangeProp } from '../map/MapChangeProp'
import { mapFindById } from '../map/MapFindById'
import { mapAlgo } from '../map/MapAlgo'
import { mapInit } from '../map/MapInit'
import { mapChain } from '../map/MapChain'
import { mapTaskCheck } from '../map/MapTaskCheck'
import { mapMeasure } from '../map/MapMeasure'
import { mapPlace } from '../map/MapPlace'
import { mapTaskCalc } from '../map/MapTaskCalc'
import { mapTaskColor } from '../map/MapTaskColor'
import { mapCollect } from '../map/MapCollect'
import { mapVisualizeSvg } from '../map/MapVisualizeSvg'
import { mapVisualizeDiv } from '../map/MapVisualizeDiv'

let mutationObserver
export let isEditing = 0

function clearSelection() {
    for (let i = 0; i < mapref(['r']).length; i++) {
        let cr = mapref(['r', i])
        mapChangeProp.start(cr, {selected: 0, selection: 's'}, '', false)
    }
}

function mapReducer(action, payload) {
    let sc = selectionState
    let lm = mapref(sc.lastPath)
    switch (action) {
        // MAP ---------------------------------------------------------------------------------------------------------
        case 'setIsResizing': {
            let m = mapref(['m'])
            m.isResizing = true
            break
        }
        // NODE SELECT -------------------------------------------------------------------------------------------------
        case 'clearSelection': {
            clearSelection()
            break
        }
        case 'selectStruct': {
            let m = mapref(['m'])
            lm = mapref(m.deepestSelectablePath)
            clearSelection()
            lm.selected = 1
            lm.selection = 's'
            break
        }
        case 'selectStructFamily': {
            let m = mapref(['m'])
            lm = mapref(m.deepestSelectablePath)
            if (lm.path.length === 2) {
                lm.selected = 0
                if (lm.d[0].selected === 1) {
                    lm.d[0].selected = 0
                    lm.d[1].selected = 1
                    lm.d[1].selection = 'f'
                } else {
                    lm.d[1].selected = 0
                    lm.d[0].selected = 1
                    lm.d[0].selection = 'f'
                }
            } else {
                if (lm.s.length > 0) {
                    clearSelection()
                    lm.selected = 1
                    lm.selection = 'f'
                }
            }
            break
        }
        case 'selectStructToo': {
            let m = mapref(['m'])
            mapref(m.deepestSelectablePath).selected = sc.maxSel + 1
            break
        }
        case 'select_all': {
            for (let i = 0; i < mapref(['r']).length; i++) {
                let cr = mapref(['r', i])
                mapChangeProp.start(cr, {selected: 1}, 'struct', false)
            }
            break
        }
        case 'selectDescendantsOut': {
            if (lm.path.length === 2) {
                lm.selected = 0
                if (payload.keyCode === 'ArrowRight') {
                    lm.d[0].selected = 1
                    lm.d[0].selection = 'f'
                } else if (payload.keyCode === 'ArrowLeft') {
                    lm.d[1].selected = 1
                    lm.d[1].selection = 'f'
                }
            } else if (
                lm.path[3] === 0 && payload.keyCode === 'ArrowRight' ||
                lm.path[3] === 1 && payload.keyCode === 'ArrowLeft') {
                lm.selection = 'f'
            } else if (
                lm.path[3] === 0 && payload.keyCode === 'ArrowLeft' ||
                lm.path[3] === 1 && payload.keyCode === 'ArrowRight') {
                lm.selection = 's'
            }
            break
        }
        case 'select_S_F_M': {
            if (lm.hasCell) {
                console.log('DISZ')
                clearSelection()
                let toPath = [...sc.lastPath, 'c', 0, 0]
                mapref(toPath).selected = 1
                mapref(toPath).s[0].selected = 1
            }
            break
        }
        case 'select_CCRCC_B_S': {
            clearSelection()
            mapref(mapref(lm.parentPath).path).selected = 1
            break
        }
        case 'select_M_BB_S': {
            clearSelection()
            mapref(mapref(mapref(lm.parentPath).parentPath).path).selected = 1
            break
        }
        case 'select_M_F_S': {
            clearSelection()
            lm.selected = 1
            break
        }
        case 'select_CRCC_F_M': {
            clearSelection()
            lm.selected = 1
            lm.s[0].selected = 1
            break
        }
        case 'select_S_B_M': {
            for (let i = lm.path.length - 2; i > 0; i--) {
                if (Number.isInteger(lm.path[i]) &&
                    Number.isInteger(lm.path[i + 1])) {
                    clearSelection()
                    let toPath = lm.path.slice(0, i + 2)
                    mapref(toPath).selected = 1
                    mapref(toPath).s[0].selected = 1
                    break
                }
            }
            break
        }
        case 'select_first_M': {
            clearSelection()
            let toPath = mapref(mapref(sc.geomHighPath).parentPath).path
            mapref(toPath).selected = 1
            mapref(toPath).s[0].selected = 1
            break
        }
        case 'select_D_M': {
            clearSelection()
            let toPath = nodeNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'cell2cell', 'ArrowDown')
            mapref(toPath).selected = 1
            mapref(toPath).s[0].selected = 1
            break
        }
        case 'select_O_M': {
            clearSelection()
            let toPath = nodeNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'cell2cell', lm.path[3] ? 'ArrowLeft' : 'ArrowRight')
            mapref(toPath).selected = 1
            mapref(toPath).s[0].selected = 1
            break
        }
        case 'selectNeighborStruct': {
            clearSelection()
            let fromPath = sc.lastPath
            if (payload.keyCode === 'ArrowUp') fromPath = sc.geomHighPath
            if (payload.keyCode === 'ArrowDown') fromPath = sc.geomLowPath
            let toPath = nodeNavigate(fromPath, 'struct2struct', payload.keyCode)
            mapref(toPath).selected = 1
            break
        }
        case 'selectNeighborStructToo': {
            let toPath = nodeNavigate(sc.lastPath, 'struct2struct', payload.keyCode)
            mapref(toPath).selected = sc.maxSel + 1
            break
        }
        case 'selectNeighborMixed': {
            clearSelection()
            let toPath = nodeNavigate(sc.lastPath.slice(0, sc.lastPath.length - 2), 'cell2cell', payload.keyCode)
            mapref(toPath).selected = 1
            mapref(toPath).s[0].selected = 1
            break
        }
        case 'select_CR': {
            clearSelection()
            let parentRef = mapref(lm.parentPath)
            let parentParentRef = mapref(parentRef.parentPath)
            let currRow = parentRef.index[0]
            let colLen = parentParentRef.c[0].length
            for (let i = 0; i < colLen; i++) {
                parentParentRef.c[currRow][i].selected = 1
            }
            break
        }
        case 'select_CC': {
            clearSelection()
            let parentRef = mapref(lm.parentPath)
            let parentParentRef = mapref(parentRef.parentPath)
            let currCol = parentRef.index[1]
            let rowLen = parentParentRef.c.length
            for (let i = 0; i < rowLen; i++) {
                parentParentRef.c[i][currCol].selected = 1
            }
            break
        }
        case 'select_CRCC': {
            if (payload.keyCode === 'ArrowLeft' && sc.cellColSelected ||
                payload.keyCode === 'ArrowRight' && sc.cellColSelected ||
                payload.keyCode === 'ArrowUp' && sc.cellRowSelected ||
                payload.keyCode === 'ArrowDown' && sc.cellRowSelected) {
                clearSelection()
                for (let i = 0; i < sc.cellSelectedPathList.length; i++) {
                    let currPath = sc.cellSelectedPathList[i]
                    let toPath = nodeNavigate(currPath, 'cell2cell', payload.keyCode)
                    mapref(toPath).selected = 1
                }
            }
            break
        }
        case 'select_R': {
            clearSelection()
            let cr = mapref(['r', 0]) // TODO multi r rethink
            cr.selected = 1
            break
        }
        // NODE INSERT -------------------------------------------------------------------------------------------------
        case 'insert_U_S': {
            if (!lm.isRoot) {
                clearSelection()
                structInsert(lm, 'siblingUp')
            }
            break
        }
        case 'insert_D_S': {
            if (!lm.isRoot) {
                clearSelection()
                structInsert(lm, 'siblingDown')
            }
            break
        }
        case 'insert_O_S': {
            clearSelection()
            structInsert(lm, 'child')
            break
        }
        case 'insert_M_CRCC': {
            cellInsert(sc.lastPath.slice(0, sc.lastPath.length - 2), payload.keyCode)
            break
        }
        case 'insert_CX_CRCC': {
            cellInsert(sc.lastPath, payload.keyCode)
            break
        }
        // NODE DELETE -------------------------------------------------------------------------------------------------
        case 'delete_S': {
            structDeleteReselect(sc)
            break
        }
        case 'delete_CRCC': {
            cellBlockDeleteReselect(sc)
            break
        }
        // NODE MOVE ---------------------------------------------------------------------------------------------------
        case 'move_S': {
            nodeMove(sc, 'struct2struct', payload.keyCode)
            break
        }
        case 'move_CRCC': {
            nodeMove(sc, 'cellBlock2CellBlock', payload.keyCode)
            break
        }
        case 'transpose': {
            if (lm.hasCell) {
                lm.c = transposeArray(lm.c)
            }
            break
        }
        case 'copySelection': {
            nodeMove(sc, 'struct2clipboard', '', 'COPY')
            break
        }
        case 'cutSelection': {
            nodeMove(sc, 'struct2clipboard', '', 'CUT')
            structDeleteReselect(sc)
            break
        }
        case 'moveSelection': {
            nodeMoveMouse(sc)
            break
        }
        case 'cellifyMulti': {
            nodeMove(sc, 'struct2cell', '', 'multiRow')
            break
        }
        case 'insertTextFromClipboardAsText': {
            document.execCommand("insertHTML", false, payload)
            break
        }
        case 'insertTextFromClipboardAsNode': {
            lm.contentType = 'text'
            lm.content = payload
            lm.isDimAssigned = 0
            break
        }
        case 'insertElinkFromClipboardAsNode': {
            lm.contentType = 'text'
            lm.content = payload
            lm.linkType = 'external'
            lm.link = payload
            lm.isDimAssigned = 0
            break
        }
        case 'insertEquationFromClipboardAsNode': {
            lm.contentType = 'equation'
            lm.content = payload
            lm.isDimAssigned = 0
            break
        }
        case 'insertImageFromLinkAsNode': {
            lm.contentType = 'image'
            lm.content = payload.imageId
            lm.imageW = payload.imageSize.width
            lm.imageH = payload.imageSize.height
            break
        }
        case 'insertMapFromClipboard': {
            clearSelection()
            setClipboard(JSON.parse(payload))
            nodeMove(sc, 'clipboard2struct', '', 'PASTE')
            break
        }
        // NODE FORMAT -------------------------------------------------------------------------------------------------
        case 'applyMapParams': {
            const {density, alignment,
                lineWidth, lineType, lineColor,
                borderWidth, borderColor,
                fillColor,
                textFontSize, textColor,
            } = payload
            let m = mapref(['m'])
            if (m.density !== density) {
                m.density = density
                m.shouldCenter = true
                for (let i = 0; i < mapref(['r']).length; i++) {
                    let cr = mapref(['r', i])
                    mapChangeProp.start(cr, { isDimAssigned: 0 }, '', false)
                }
            }
            if (m.alignment !== alignment) {
                m.alignment = alignment
                m.shouldCenter = true
            }
            for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                const cm = mapref(sc.structSelectedPathList[i])
                const props = {
                    lineWidth,
                    lineType,
                    [cm.selection === 's' ? 'sBorderWidth' : 'fBorderWidth'] : borderWidth,
                    sTextFontSize: textFontSize,
                    lineColor,
                    [cm.hasCell ? 'cBorderColor' : cm.selection === 's' ? 'sBorderColor' : 'fBorderColor'] : borderColor,
                    [cm.selection === 's' ? 'sFillColor' : 'fFillColor'] : fillColor,
                    sTextColor: textColor
                }
                for (const prop in props) {
                    if (props[prop] !== undefined) {
                        const assignment = {}
                        assignment[prop] = props[prop] === 'clear' ? nodeProps.saveOptional[prop] : props[prop]
                        if (prop === 'sTextFontSize') {assignment.isDimAssigned =  0}
                        if (cm.selection === 's' || ['fBorderWidth', 'fBorderColor', 'fFillColor'].includes(prop)) {
                            Object.assign(cm, assignment)
                        } else {
                            mapChangeProp.start(cm, assignment, '', true)
                        }
                    }
                }
            }
            break
        }
        case 'applyColorFromKey': {
            for (let i = 0; i < sc.structSelectedPathList.length; i++) {
                let cm = mapref(sc.structSelectedPathList[i])
                switch (payload.currColor) {
                    case 0: cm.sTextColor = '#222222'; break
                    case 1: cm.sTextColor = '#999999'; break
                    case 2: cm.sTextColor = '#bbbbbb'; break
                    case 3: cm.sTextColor = '#dddddd'; break
                    case 4: cm.sTextColor = '#d5802a'; break
                    case 5: cm.sTextColor = '#1c8e1c'; break
                    case 6: cm.sTextColor = '#8e1c8e'; break
                    case 7: cm.sTextColor = '#990000'; break
                    case 8: cm.sTextColor = '#000099'; break
                    case 9: cm.sTextColor = '#ffffff'; break
                }
            }
            break
        }
        case 'setTaskStatus': {
            let m = mapref(['m'])
            let cm = mapref(mapFindById.start(m, mapref(['r', 0]), payload.nodeId)) // TODO multi r rethink
            cm.taskStatus = payload.taskStatus
            cm.taskStatusInherited = -1
            break
        }
        case 'toggleTask': {
            mapChangeProp.start(lm, {task: !lm.task, taskStatus: -1}, '', false)
            break
        }
        // NODE EDIT ---------------------------------------------------------------------------------------------------
        case 'eraseContent': {
            if (!lm.hasCell) {
                lm.content = ''
                let holderElement = document.getElementById(`${lm.nodeId}_div`)
                holderElement.innerHTML = ''
            }
            break
        }
        case 'startEdit': {
            if (!lm.hasCell) {
                if (lm.contentType === 'equation') {
                    lm.contentType = 'text'
                    lm.isDimAssigned = 0
                    redraw()
                }
                let holderElement = document.getElementById(`${lm.nodeId}_div`)
                holderElement.contentEditable = 'true'
                setEndOfContenteditable(holderElement)
                isEditing = 1
                lm.isEditing = 1
                const callback = function (mutationsList) {
                    for (let mutation of mutationsList) {
                        if (mutation.type === 'characterData') {
                            mapDispatch('typeText')
                            redraw()
                        }
                    }
                }
                mutationObserver = new MutationObserver(callback)
                mutationObserver.observe(holderElement, {
                    attributes: false,
                    childList: false,
                    subtree: true,
                    characterData: true
                })
            }
            break
        }
        case 'typeText': {
            let holderElement = document.getElementById(`${lm.nodeId}_div`)
            lm.content = holderElement.innerHTML
            lm.isDimAssigned = 0
            break
        }
        case 'finishEdit': {
            mutationObserver.disconnect()
            let holderElement = document.getElementById(`${lm.nodeId}_div`)
            holderElement.contentEditable = 'false'
            lm.isEditing = 0
            isEditing = 0
            if (lm.content.substring(0, 2) === '\\[') {
                lm.contentType = 'equation'
                lm.isDimAssigned = 0
            } else if (lm.content.substring(0, 1) === '=') {
                lm.contentCalc = lm.content
                lm.isDimAssigned = 0
            }
            break
        }
    }
}

export function mapDispatch(action, payload) {
    console.log('NODEDISPATCH: ' + action)
    // eraseContent, startEdit, typeText and finishEdit related side-effects could be moved here as quasi-middleware
    mapReducer(action, payload)
    recalc()
    if (!['startEdit', 'typeText'].includes(action)) {
        document.getElementById("mapHolderDiv").focus()
    }
}

export const recalc = () => {
    initSelectionState()
    let m = mapref(['m'])
    for (let i = 0; i < mapref(['r']).length; i++) {
        let cr = mapref(['r', i])
        mapAlgo.start(m, cr)
        mapInit.start(m, cr)
        mapChain.start(m, cr, i)
        mapTaskCheck.start(m, cr)
        mapMeasure.start(m, cr)
        mapPlace.start(m, cr)
        mapTaskCalc.start(m, cr)
        mapTaskColor.start(m, cr)
        mapCollect.start(m, cr)
        // mapPrint.start(m, cr)
    }
    updateSelectionState()
}

export const redraw = () => {
    flagDomData()
    let m = mapref(['m'])
    for (let i = 0; i < mapref(['r']).length; i++) {
        let cr = mapref(['r', i])
        mapVisualizeSvg.start(m, cr)
        mapVisualizeDiv.start(m, cr)
    }
    updateDomData()
}
