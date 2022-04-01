import { cellBlockDeleteReselect, structDeleteReselect } from '../node/NodeDelete'
import { cellInsert, structInsert } from '../node/NodeInsert'
import { nodeMove, nodeMoveMouse, setClipboard } from '../node/NodeMove'
import { nodeNavigate } from '../node/NodeNavigate'
import { transposeArray } from './Utils'
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
import { mapCollect } from '../map/MapCollect'
import { mapVisualizeSvg } from '../map/MapVisualizeSvg'
import { mapVisualizeDiv } from '../map/MapVisualizeDiv'

const clearSelection = _ => {
    for (let i = 0; i < mapref(['r']).length; i++) {
        let cr = mapref(['r', i])
        mapChangeProp.start(cr, {selected: 0, selection: 's'}, '', false)
    }
}

const mapReducer = (action, payload) => {
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
            Object.assign(lm, {contentType: 'text', content: payload, isDimAssigned: 0})
            break
        }
        case 'insertElinkFromClipboardAsNode': {
            Object.assign(lm, {contentType: 'text', content: payload, linkType: 'external', link: payload, isDimAssigned: 0})
            break
        }
        case 'insertEquationFromClipboardAsNode': {
            Object.assign(lm, {contentType: 'equation', content: payload, isDimAssigned: 0})
            break
        }
        case 'insertImageFromLinkAsNode': {
            const {width, height} = payload.imageSize
            Object.assign(lm, {contentType: 'image', content: payload.imageId, imageW: width, imageH: height})
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
            const {
                density, alignment,
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
                    lineWidth, lineType, lineColor,
                    [cm.selection === 's' ? 'sBorderWidth' : 'fBorderWidth'] : borderWidth,
                    [cm.hasCell ? 'cBorderColor' : cm.selection === 's' ? 'sBorderColor' : 'fBorderColor'] : borderColor,
                    [cm.selection === 's' ? 'sFillColor' : 'fFillColor'] : fillColor,
                    sTextFontSize: textFontSize, sTextColor: textColor
                    // TODO taskStatus
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
                cm.sTextColor = [
                    '#222222',
                    '#999999', '#bbbbbb', '#dddddd',
                    '#d5802a', '#1c8e1c', '#8e1c8e',
                    '#990000', '#000099', '#ffffff'][payload.currColor]
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
        mapCollect.start(m, cr)
        // mapPrint.start(m, cr)
    }
    updateSelectionState()
}

export const redraw = (colorMode) => {
    flagDomData()
    let m = mapref(['m'])
    for (let i = 0; i < mapref(['r']).length; i++) {
        let cr = mapref(['r', i])
        mapVisualizeSvg.start(m, cr, colorMode)
        mapVisualizeDiv.start(m, cr, colorMode)
    }
    updateDomData()
}

export const mapDispatch = (action, payload) => {
    console.log('NODE_DISPATCH: ' + action)
    mapReducer(action, payload)
    recalc()
    document.getElementById("mapHolderDiv").focus()
}
