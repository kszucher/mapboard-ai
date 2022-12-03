import {getDefaultNode, nodeProps} from './DefaultProps'
import {flagDomData, updateDomData} from './DomFlow'
import {copy, genHash, subsref, transposeArray} from './Utils'
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
import {mapCalcTask} from '../map/MapCalcTask'
import {mapCheckTask} from '../map/MapCheckTask'
import {mapVisualizeDiv} from '../map/MapVisualizeDiv'
import {mapVisualizeSvg} from '../map/MapVisualizeSvg'
import {cellBlockDeleteReselect, structDeleteReselect} from '../node/NodeDelete'
import {cellInsert, structInsert} from '../node/NodeInsert'
import {nodeMove, nodeMoveMouse} from '../node/NodeMove'
import {nodeNavigate} from '../node/NodeNavigate'

export const getMapData = (m: any, path: any) => {
  return subsref(m, path)
}

export const getSavedMapData = (m: any) => {
  const mCopy = copy(m)
  mapDeInit.start(mCopy)
  return mapDisassembly.start(mCopy)
}

const clearSelection = (m: any) => {
  for (let i = 0; i < getMapData(m, ['r']).length; i++) {
    let cr = getMapData(m, ['r', i])
    mapSetProp.start(m, cr, {selected: 0, selection: 's'}, '')
  }
}

const updateParentLastSelectedChild = (m: any, lm: any) => {
  if (!lm.isRoot) {
    let parentRef = getMapData(m, lm.parentPath)
    parentRef.lastSelectedChild = lm.index
  }
}

export const mapReducer = (m: any, action: any, payload: any) => {
  const { sc } = m
  let lm = getMapData(m, sc.lastPath)
  if (payload.hasOwnProperty('contentToSave')) {
    lm.content = payload.contentToSave
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
          if (payload.code === 'ArrowRight') {
            lm.d[0].selected = 1
            lm.d[0].selection = 'f'
          } else if (payload.code === 'ArrowLeft') {
            lm.d[1].selected = 1
            lm.d[1].selection = 'f'
          }
        } else if (
          lm.path[3] === 0 && payload.code === 'ArrowRight' ||
          lm.path[3] === 1 && payload.code === 'ArrowLeft') {
          lm.selection = 'f'
        } else if (
          lm.path[3] === 0 && payload.code === 'ArrowLeft' ||
          lm.path[3] === 1 && payload.code === 'ArrowRight') {
          lm.selection = 's'
        }
      }
      break
    }
    case 'select_S_IOUD': {
      clearSelection(m)
      let newTruePath = payload.truePath
      if (payload.direction === 'U') {
        newTruePath = m.sc.geomHighPath
      } else if (payload.direction === 'D') {
        newTruePath = m.sc.geomLowPath
      }
      getMapData(m, nodeNavigate(m, newTruePath, 'struct2struct', payload.direction)).selected = 1
      break
    }
    case 'select_S_IOUD+': {
      getMapData(m, nodeNavigate(m, payload.truePath, 'struct2struct', payload.direction)).selected = sc.maxSel + 1
      break
    }
    case 'select_S_F': {
      clearSelection(m)
      lm.selected = 1
      break
    }
    case 'select_S_B': {
      clearSelection(m)
      getMapData(m, lm.path.slice(0, -3)).selected = 1
      break
    }
    case 'select_S_BB': {
      clearSelection(m)
      getMapData(m, lm.path.slice(0, -5)).selected = 1
      break
    }
    case 'select_M_IOUD': {
      clearSelection(m)
      getMapData(m, nodeNavigate(m, lm.path.slice(0, -2), 'cell2cell', payload.direction)).selected = 1
      getMapData(m, [...nodeNavigate(m, lm.path.slice(0, -2), 'cell2cell', payload.direction), 's', 0]).selected = 1
      break
    }
    case 'select_M_F': {
      clearSelection(m)
      lm.selected = 1
      lm.s[0].selected = 1
      break
    }
    case 'select_M_FF': {
      if (lm.hasCell) {
        clearSelection(m)
        getMapData(m, [...sc.lastPath, 'c', 0, 0]).selected = 1
        getMapData(m, [...sc.lastPath, 'c', 0, 0, 's', 0]).selected = 1
      }
      break
    }
    case 'select_M_B': {
      for (let i = lm.path.length - 2; i > 0; i--) {
        if (Number.isInteger(lm.path[i]) && Number.isInteger(lm.path[i + 1])) {
          clearSelection(m)
          getMapData(m, lm.path.slice(0, i + 2)).selected = 1
          getMapData(m, [...lm.path.slice(0, i + 2), 's', 0]).selected = 1
          break
        }
      }
      break
    }
    case 'select_CR_IO': {
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
    case 'select_CR_UD': {
      clearSelection(m)
      for (let i = 0; i < sc.cellSelectedPathList.length; i++) {
        let currPath = sc.cellSelectedPathList[i]
        getMapData(m, nodeNavigate(m, currPath, 'cell2cell', payload.direction)).selected = 1
      }
      break
    }
    case 'select_CC_IO': {
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
    case 'select_CC_UD': {
      clearSelection(m)
      for (let i = 0; i < sc.cellSelectedPathList.length; i++) {
        let currPath = sc.cellSelectedPathList[i]
        getMapData(m, nodeNavigate(m, currPath, 'cell2cell', payload.direction)).selected = 1
      }
      break
    }
    case 'select_R': {
      clearSelection(m)
      getMapData(m, ['r', 0]).selected = 1
      break
    }
    // INSERT
    case 'insert_S_U': {
      if (!lm.isRoot) {
        clearSelection(m)
        structInsert(m, lm, 'U', {})
      }
      break
    }
    case 'insert_S_D': {
      if (!lm.isRoot) {
        clearSelection(m)
        structInsert(m, lm, 'D', {})
      }
      break
    }
    case 'insert_S_O': {
      clearSelection(m)
      structInsert(m, lm, 'O', {})
      break
    }
    case 'insert_CC_IO': {
      cellInsert(m, sc.lastPath, payload.code) // TODO cellColInsert
      break
    }
    case 'insert_CC_B_IO': {
      cellInsert(m, sc.lastPath.slice(0, -2), payload.code) // TODO cellColInsert
      break
    }
    case 'insert_CR_UD': {
      cellInsert(m, sc.lastPath, payload.code) // TODO cellRowInsert
      break
    }
    case 'insert_CR_B_UD': {
      cellInsert(m, sc.lastPath.slice(0, -2), payload.code) // TODO cellRowInsert
      break
    }
    // DELETE
    case 'delete_S': {
      structDeleteReselect(m, sc)
      break
    }
    case 'delete_CRCC': { // TODO separate CRCC
      cellBlockDeleteReselect(m, sc)
      break
    }
    // MOVE
    case 'move_S_IOUD': {
      nodeMove(m, sc, 'struct2struct', payload.code, '')
      break
    }
    case 'move_CR_UD': {
      nodeMove(m, sc, 'cellBlock2CellBlock', payload.code, '') // TODO separate CR
      break
    }
    case 'move_CC_IO': {
      nodeMove(m, sc, 'cellBlock2CellBlock', payload.code, '') // TODO separate CC
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
    case 'cellifyMulti': { // TODO rename to something move_
      nodeMove(m, sc, 'struct2cell', '', 'multiRow')
      clearSelection(m)
      let toPath = getMapData(m, getMapData(m, sc.geomHighPath).parentPath).path // TODO use slice
      getMapData(m, toPath).selected = 1
      getMapData(m, toPath).s[0].selected = 1
      break
    }
    case 'insertTextFromClipboardAsText': {
      document.execCommand("insertHTML", false, payload.text)
      break
    }
    case 'insertTextFromClipboardAsNode': {
      clearSelection(m)
      structInsert(m, lm, 'O', { contentType: 'text', content: payload.text })
      break
    }
    case 'insertElinkFromClipboardAsNode': {
      clearSelection(m)
      structInsert(m, lm, 'O', { contentType: 'text', content: payload.text, linkType: 'external', link: payload.text })
      break
    }
    case 'insertEquationFromClipboardAsNode': {
      clearSelection(m)
      structInsert(m, lm, 'O', { contentType: 'equation', content: payload.text })
      break
    }
    case 'insertImageFromLinkAsNode': { // TODO check... after path is fixed
      const { imageId, imageSize } = payload
      const { width, height } = imageSize
      clearSelection(m)
      structInsert(m, lm, 'O', { contentType: 'image', content: imageId, imageW: width, imageH: height })
      break
    }
    case 'insertMapFromClipboard': {
      clearSelection(m)
      const nodeList = JSON.parse(payload.text)
      for (let i = 0; i < nodeList.length; i++) {
        mapSetProp.start(undefined, nodeList[i], ()=>({ nodeId: 'node' + genHash(8) }), '')
        structInsert(m, lm, 'O', { ...nodeList[i] })
      }
      break
    }
    case 'insertTable': {
      clearSelection(m)
      const tableGen = []
      const {rowLen, colLen} = payload
      for (let i = 0; i < rowLen; i++) {
        tableGen.push([])
        for (let j = 0; j < colLen; j++) {
          // @ts-ignore
          tableGen[i].push([])
          // @ts-ignore
          tableGen[i][j] = getDefaultNode({s: [getDefaultNode()]})
        }
      }
      structInsert(m, lm, 'O', { taskStatus: -1, c: tableGen })
      break
    }
    // FORMAT
    case 'setFormatParams': {
      // @ts-ignore
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
            // @ts-ignore
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
      if (lm.taskStatus === -1) { // one line
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
    case'startEdit': {
      if (lm.contentType === 'equation') {
        lm.contentType = 'text'
      }
      break
    }
    case 'typeText': {
      lm.contentType = 'text' // one line
      lm.content = payload
      break
    }
    case 'finishEdit': {
      break
    }
  }
  return m
}

export const reCalc = (pm: any, m: any) => {
  let cr = getMapData(m, ['r', 0])
  // use cn instead of cm inside these
  mapAlgo.start(m, cr)
  mapInit.start(m, cr)
  mapChain.start(m, cr, 0)
  mapDiff.start(pm, m, cr)
  mapCalcTask.start(m, cr)
  mapCheckTask.start(m, cr)
  mapExtractSelection.start(m, cr)
  mapExtractFormatting.start(m)
  mapMeasure.start(m, cr)
  mapPlace.start(m, cr)
  return m
}

const redrawStep = (m: any, colorMode: any, isEditing: boolean, shouldAnimationInit: boolean) => {
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
