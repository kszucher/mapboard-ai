// @ts-nocheck

import {nodeProps} from './DefaultProps'
import {flagDomData, updateDomData} from './DomFlow'
import {store} from "./EditorFlow"
import {copy, subsref, transposeArray} from './Utils'
import {mapFindById} from '../map/MapFindById'
import {mapAlgo} from '../map/MapAlgo'
import {mapInit} from '../map/MapInit'
import {mapChain} from '../map/MapChain'
import {mapDeInit} from '../map/MapDeInit'
import {mapDiff} from "../map/MapDiff"
import {mapDisassembly} from '../map/MapDisassembly'
import {mapExtractFormatting} from "../map/MapExtractFormatting"
import {mapExtractSelection} from '../map/MapExtractSelection'
import {mapMeasure} from '../map/MapMeasure'
import {mapPlace} from '../map/MapPlace'
import {mapSetProp} from '../map/MapSetProp'
import {mapTaskCalc} from '../map/MapTaskCalc'
import {mapTaskCheck} from '../map/MapTaskCheck'
import {mapVisualizeDiv} from '../map/MapVisualizeDiv'
import {mapVisualizeSvg} from '../map/MapVisualizeSvg'
import {cellBlockDeleteReselect, structDeleteReselect} from '../node/NodeDelete'
import {cellInsert, structInsert} from '../node/NodeInsert'
import {nodeMove, nodeMoveMouse, setClipboard} from '../node/NodeMove'
import {nodeNavigate} from '../node/NodeNavigate'

export const getEditedPath = () => {
  return store.getState().editedPath
}

export const getTempMap = () => {
  return store.getState().tempMap
}

export const getMap = () => {
  const mapStackData = store.getState().mapStackData
  const mapStackDataIndex = store.getState().mapStackDataIndex
  return mapStackData[mapStackDataIndex]
}

export const getMapData = (m: any, path: any) => {
  // note: can not use getMap as the source of truth is not always the store
  return subsref(m, path)
}

export const getSavedMapData = (m: any) => {
  const mCopy = copy(m)
  mapDeInit.start(mCopy)
  return mapDisassembly.start(mCopy)
}

const clearSelection = (m) => {
  for (let i = 0; i < getMapData(m, ['r']).length; i++) {
    let cr = getMapData(m, ['r', i])
    mapSetProp.start(m, cr, {selected: 0, selection: 's'}, '')
  }
}

const updateParentLastSelectedChild = (m, lm) => {
  if (!lm.isRoot) {
    let parentRef = getMapData(m, lm.parentPath)
    parentRef.lastSelectedChild = lm.index
  }
}

export const mapReducer = (m, action, payload) => {
  const { sc } = m
  let lm = getMapData(m, sc.lastPath)
  if (payload.hasOwnProperty('contentToSave')) {
    lm.content = payload.contentToSave
    lm.isEditing = 0
    if (lm.content.substring(0, 2) === '\\[') {
      lm.contentType = 'equation'
    } else if (lm.content.substring(0, 1) === '=') {
      lm.contentCalc = lm.content
    }
  }
  switch (action) {
    // VIEW
    case 'changeDensity': {
      m.density = m.density === 'small' ? 'large' : 'small'
      break
    }
    case 'changeAlignment': {
      m.alignment = m.alignment === 'centered' ? 'adaptive' : 'centered'
      break
    }
    case 'moveTargetPreview': {
      m.moveData = payload.moveData
      break
    }
    case 'selectTargetPreview': {
      for (let i = 0; i < payload.highlightTargetPathList.length; i++) {
        getMapData(m, payload.highlightTargetPathList[i]).selected = 1
      }
      m.selectionRect = payload.selectionRect
      break
    }
    // SELECT
    case 'clearSelection': {
      clearSelection(m)
      break
    }
    case 'selectStruct': {
      clearSelection(m)
      const {lastOverPath} = payload
      const lm = getMapData(m, lastOverPath)
      lm.selected = 1
      lm.selection = 's'
      updateParentLastSelectedChild(m, lm)
      break
    }
    case 'selectStructToo': {
      const {lastOverPath} = payload
      const lm = getMapData(m, lastOverPath)
      lm.selected = sc.maxSel + 1
      updateParentLastSelectedChild(m, lm)
      break
    }
    case 'selectStructFamily': {
      const {lastOverPath} = payload
      const lm = getMapData(m, lastOverPath)
      if (lm.path.length === 2) {
        lm.selected = 0
        if (lm.d[0].selected === 1) {
          lm.d[0].selected = 0
          lm.d[1].selected = 1
          lm.d[1].selection = 'f'
        } else {
          clearSelection(m)
          lm.d[0].selected = 1
          lm.d[1].selected = 0
          lm.d[0].selection = 'f'
        }
      } else {
        if (lm.s.length > 0) {
          clearSelection(m)
          lm.selected = 1
          lm.selection = 'f'
        }
      }
      updateParentLastSelectedChild(m, lm)
      break
    }
    case 'selectTarget': {
      for (let i = 0; i < payload.highlightTargetPathList.length; i++) {
        getMapData(m, payload.highlightTargetPathList[i]).selected = 1
      }
      break
    }
    case 'select_all': {
      for (let i = 0; i < getMapData(m, ['r']).length; i++) {
        let cr = getMapData(m, ['r', i])
        mapSetProp.start(m, cr, {selected: 1}, 'struct')
      }
      break
    }
    case 'selectDescendantsOut': {
      if (lm.s.length > 0) {
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
      }
      break
    }
    case 'select_S_F_M': {
      if (lm.hasCell) {
        clearSelection(m)
        let toPath = [...sc.lastPath, 'c', 0, 0]
        getMapData(m, toPath).selected = 1
        getMapData(m, toPath).s[0].selected = 1
      }
      break
    }
    case 'select_CCRCC_B_S': {
      clearSelection(m)
      getMapData(m, getMapData(m, lm.parentPath).path).selected = 1
      break
    }
    case 'select_M_BB_S': {
      clearSelection(m)
      getMapData(m, getMapData(m, getMapData(m, lm.parentPath).parentPath).path).selected = 1
      break
    }
    case 'select_M_F_S': {
      clearSelection(m)
      lm.selected = 1
      break
    }
    case 'select_CRCC_F_M': {
      clearSelection(m)
      lm.selected = 1
      lm.s[0].selected = 1
      break
    }
    case 'select_S_B_M': {
      for (let i = lm.path.length - 2; i > 0; i--) {
        if (Number.isInteger(lm.path[i]) &&
          Number.isInteger(lm.path[i + 1])) {
          clearSelection(m)
          let toPath = lm.path.slice(0, i + 2)
          getMapData(m, toPath).selected = 1
          getMapData(m, toPath).s[0].selected = 1
          break
        }
      }
      break
    }
    case 'select_D_M': {
      clearSelection(m)
      let toPath = nodeNavigate(m, sc.lastPath.slice(0, sc.lastPath.length - 2), 'cell2cell', 'ArrowDown')
      getMapData(m, toPath).selected = 1
      getMapData(m, toPath).s[0].selected = 1
      break
    }
    case 'select_O_M': {
      clearSelection(m)
      let toPath = nodeNavigate(m, sc.lastPath.slice(0, sc.lastPath.length - 2), 'cell2cell', lm.path[3] ? 'ArrowLeft' : 'ArrowRight')
      getMapData(m, toPath).selected = 1
      getMapData(m, toPath).s[0].selected = 1
      break
    }
    case 'selectNeighborStruct': {
      clearSelection(m)
      let fromPath = sc.lastPath
      if (payload.keyCode === 'ArrowUp') fromPath = sc.geomHighPath
      if (payload.keyCode === 'ArrowDown') fromPath = sc.geomLowPath
      let toPath = nodeNavigate(m, fromPath, 'struct2struct', payload.keyCode)
      getMapData(m, toPath).selected = 1
      break
    }
    case 'selectNeighborStructToo': {
      let toPath = nodeNavigate(m, sc.lastPath, 'struct2struct', payload.keyCode)
      getMapData(m, toPath).selected = sc.maxSel + 1
      break
    }
    case 'selectNeighborMixed': {
      clearSelection(m)
      let toPath = nodeNavigate(m, sc.lastPath.slice(0, sc.lastPath.length - 2), 'cell2cell', payload.keyCode)
      getMapData(m, toPath).selected = 1
      getMapData(m, toPath).s[0].selected = 1
      break
    }
    case 'select_CR': {
      clearSelection(m)
      let parentRef = getMapData(m, lm.parentPath)
      let parentParentRef = getMapData(m, parentRef.parentPath)
      let currRow = parentRef.index[0]
      let colLen = parentParentRef.c[0].length
      for (let i = 0; i < colLen; i++) {
        parentParentRef.c[currRow][i].selected = 1
      }
      break
    }
    case 'select_CC': {
      clearSelection(m)
      let parentRef = getMapData(m, lm.parentPath)
      let parentParentRef = getMapData(m, parentRef.parentPath)
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
        clearSelection(m)
        for (let i = 0; i < sc.cellSelectedPathList.length; i++) {
          let currPath = sc.cellSelectedPathList[i]
          let toPath = nodeNavigate(m, currPath, 'cell2cell', payload.keyCode)
          getMapData(m, toPath).selected = 1
        }
      }
      break
    }
    case 'select_R': {
      clearSelection(m)
      let cr = getMapData(m, ['r', 0])
      cr.selected = 1
      break
    }
    // INSERT
    case 'insert_U_S': {
      if (!lm.isRoot) {
        clearSelection(m)
        structInsert(m, lm, 'siblingUp')
      }
      break
    }
    case 'insert_D_S': {
      if (!lm.isRoot) {
        clearSelection(m)
        structInsert(m, lm, 'siblingDown')
      }
      break
    }
    case 'insert_O_S': {
      clearSelection(m)
      structInsert(m, lm, 'child')
      break
    }
    case 'insert_M_CRCC': {
      cellInsert(m, sc.lastPath.slice(0, sc.lastPath.length - 2), payload.keyCode)
      break
    }
    case 'insert_CX_CRCC': {
      cellInsert(m, sc.lastPath, payload.keyCode)
      break
    }
    // DELETE
    case 'delete_S': {
      structDeleteReselect(m, sc)
      break
    }
    case 'delete_CRCC': {
      cellBlockDeleteReselect(m, sc)
      break
    }
    // MOVE
    case 'move_S': {
      nodeMove(m, sc, 'struct2struct', payload.keyCode)
      break
    }
    case 'move_CRCC': {
      nodeMove(m, sc, 'cellBlock2CellBlock', payload.keyCode)
      break
    }
    case 'transpose': {
      if (lm.hasCell) {
        lm.c = transposeArray(lm.c)
      }
      break
    }
    case 'copySelection': {
      nodeMove(m, sc, 'struct2clipboard', '', 'COPY')
      break
    }
    case 'cutSelection': {
      nodeMove(m, sc, 'struct2clipboard', '', 'CUT')
      structDeleteReselect(m, sc)
      break
    }
    case 'moveTarget': {
      nodeMoveMouse(m, sc, payload.moveTargetPath, payload.moveTargetIndex)
      break
    }
    case 'cellifyMulti': {
      nodeMove(m, sc, 'struct2cell', '', 'multiRow')
      clearSelection(m)
      let toPath = getMapData(m, getMapData(m, sc.geomHighPath).parentPath).path
      getMapData(m, toPath).selected = 1
      getMapData(m, toPath).s[0].selected = 1
      break
    }
    case 'insertTextFromClipboardAsText': {
      document.execCommand("insertHTML", false, payload)
      break
    }
    case 'insertTextFromClipboardAsNode': {
      // we can structInsert here AND pass this assignment as an argument so it is set WHEN created
      Object.assign(lm, {contentType: 'text', content: payload})
      break
    }
    case 'insertElinkFromClipboardAsNode': {
      Object.assign(lm, {contentType: 'text', content: payload, linkType: 'external', link: payload})
      break
    }
    case 'insertEquationFromClipboardAsNode': {
      Object.assign(lm, {contentType: 'equation', content: payload})
      break
    }
    case 'insertImageFromLinkAsNode': {
      const {width, height} = payload.imageSize
      Object.assign(lm, {contentType: 'image', content: payload.imageId, imageW: width, imageH: height})
      break
    }
    case 'insertMapFromClipboard': {
      clearSelection(m)
      setClipboard(JSON.parse(payload))
      nodeMove(m, sc, 'clipboard2struct', '', 'PASTE')
      break
    }
    case 'insertTable': {
      clearSelection(m)
      structInsert(m, lm, 'childTable', payload)
      break
    }
    // FORMAT
    case 'setFormatParams': {
      const {lineWidth, lineType, lineColor, borderWidth, borderColor, fillColor, textFontSize, textColor} = {...m.nc, ...payload}
      for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        const cm = getMapData(m, sc.structSelectedPathList[i])
        const props = {
          lineWidth,
          lineType,
          lineColor,
          [cm.selection === 's' ? 'sBorderWidth' : 'fBorderWidth'] : borderWidth,
          [cm.selection === 's' ? 'sBorderColor' : 'fBorderColor'] : borderColor,
          [cm.selection === 's' ? 'sFillColor' : 'fFillColor'] : fillColor,
          textFontSize,
          textColor,
        }
        for (const prop in props) {
          if (props[prop] !== undefined) {
            const assignment = {}
            assignment[prop] = props[prop] === 'clear' ? nodeProps.saveOptional[prop] : props[prop]
            if ((cm.selection === 's' || ['fBorderWidth', 'fBorderColor', 'fFillColor'].includes(prop))) {
              Object.assign(cm, assignment)
            } else {
              mapSetProp.start(m, cm, assignment, '')
            }
          }
        }
      }
      break
    }
    case 'applyColorFromKey': {
      for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        let cm = getMapData(m, sc.structSelectedPathList[i])
        cm.textColor = [
          '#222222',
          '#999999', '#bbbbbb', '#dddddd',
          '#d5802a', '#1c8e1c', '#8e1c8e',
          '#990000', '#000099', '#ffffff'][payload.currColor]
      }
      break
    }
    case 'toggleTask': {
      if (lm.taskStatus === -1) {
        mapSetProp.start(m, lm, {taskStatus: 0}, '')
      } else {
        mapSetProp.start(m, lm, {taskStatus: -1}, '')
      }
      break
    }
    case 'setTaskStatus': {
      let cm = getMapData(m, mapFindById.start(m, getMapData(m, ['r', 0]), payload.nodeId))
      cm.taskStatus = payload.taskStatus
      break
    }
    // EDIT
    case'contentTypeToText': {
      lm.isEditing = 1
      if (lm.contentType === 'equation') {
        lm.contentType = 'text'
      }
      break
    }
    case 'deleteContent': {
      if (!lm.hasCell) {
        lm.content = ''
      }
      break
    }
    case 'typeText': {
      lm.content = payload
      lm.isEditing = 1
      break
    }
  }
  return m
}

export const reCalc = (pm: any, m: any) => {
  let cr = getMapData(m, ['r', 0])
  mapAlgo.start(m, cr)
  mapInit.start(m, cr)
  mapChain.start(m, cr, 0)
  mapTaskCheck.start(m, cr)
  mapDiff.start(pm, m, cr)
  mapMeasure.start(m, cr)
  mapPlace.start(m, cr)
  mapTaskCalc.start(m, cr)
  mapExtractSelection.start(m, cr)
  mapExtractFormatting.start(m)
  // init, chain, mapDiff, mapCalcTask, mapExtractTask, mapExtractSelection, mapExtractFormatting, mapMeasure, mapPlace
  return m
}

const redrawStep = (m: any, colorMode: any, isEditing, shouldAnimationInit: boolean) => {
  flagDomData()
  let cr = getMapData(m, ['r', 0])
  mapVisualizeSvg.start(m, cr, colorMode, isEditing, shouldAnimationInit)
  mapVisualizeDiv.start(m, cr, colorMode, isEditing)
  updateDomData()
}

export const reDraw = (m: any, colorMode: any, isEditing: boolean) => {
  if (m.animationRequested) { // if we don't want to store this, we may just use mapGetProp...
    redrawStep(m, colorMode, isEditing, true)
  }
  redrawStep(m, colorMode, isEditing, false)
}
