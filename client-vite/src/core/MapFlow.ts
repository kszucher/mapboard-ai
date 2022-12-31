import {getDefaultNode, nodeProps} from './DefaultProps'
import {flagDomData, updateDomData} from './DomFlow'
import {copy, createArray, genHash, subsref, transposeArray} from './Utils'
import {mapFindById} from '../map/MapFindById'
import {mapFix} from '../map/MapFix'
import {mapInit} from '../map/MapInit'
import {mapChain} from '../map/MapChain'
import {mapDeInit} from '../map/MapDeInit'
import {mapDiff} from "../map/MapDiff"
import {mapDisassembly} from '../map/MapDisassembly'
import {mapExtractProps} from "../map/MapExtractProps"
import {mapExtractSelection} from '../map/MapExtractSelection'
import {mapMeasure} from '../map/MapMeasure'
import {mapPlace} from '../map/MapPlace'
import {mapSetProp} from '../map/MapSetProp'
import {mapCalcTask} from '../map/MapCalcTask'
import {mapVisualizeDiv} from '../map/MapVisualizeDiv'
import {mapVisualizeSvg} from '../map/MapVisualizeSvg'
import {cellDeleteReselect, structDeleteReselect} from '../node/NodeDelete'
import {cellColCreate, cellRowCreate, structCreate} from '../node/NodeCreate'
import {nodeMoveMouse, structMove, cellColMove, cellRowMove} from '../node/NodeMove'
import {structNavigate, cellNavigate} from '../node/NodeNavigate'
import {Dir} from "./Types";

export const getMapData = (m: any, path: any) => {
  return subsref(m, path)
}

export const getSavedMapData = (m: any) => {
  const mCopy = copy(m)
  mapDeInit.start(mCopy)
  return mapDisassembly.start(mCopy)
}

const clearSelection = (m: any) => {
  mapSetProp.start(m, m.r[0], { selected: 0, selection: 's' }, '')
}

const updateParentLastSelectedChild = (m: any, ln: any) => {
  if (!m.g.sc.isRootIncluded) {
    let pn = getMapData(m, ln.parentPath)
    pn.lastSelectedChild = ln.index
  }
}

export const mapReducer = (m: any, action: any, payload: any) => {
  const { sc } = m.g
  let ln = getMapData(m, sc.lastPath)
  if (payload.hasOwnProperty('contentToSave')) {
    ln.content = payload.contentToSave
    if (ln.content.substring(0, 2) === '\\[') {
      ln.contentType = 'equation'
    }
  }
  switch (action) {
    // VIEW
    case 'changeDensity': {
      m.g.density = m.g.density === 'small' ? 'large' : 'small'
      break
    }
    case 'changeAlignment': {
      m.g.alignment = m.g.alignment === 'centered' ? 'adaptive' : 'centered'
      break
    }
    case 'moveTargetPreview': {
      break
    }
    case 'selectTargetPreview': {
      clearSelection(m)
      for (let i = 0; i < payload.highlightTargetPathList.length; i++) {
        getMapData(m, payload.highlightTargetPathList[i]).selected = 1
      }
      break
    }
    // SELECT
    case 'selectStruct': {
      clearSelection(m)
      const {lastOverPath} = payload
      const ln = getMapData(m, lastOverPath)
      ln.selected = 1
      ln.selection = 's'
      updateParentLastSelectedChild(m, ln)
      break
    }
    case 'selectStructToo': {
      const {lastOverPath} = payload
      const ln = getMapData(m, lastOverPath)
      ln.selected = sc.maxSel + 1
      updateParentLastSelectedChild(m, ln)
      break
    }
    case 'selectStructFamily': {
      const {lastOverPath} = payload
      const ln = getMapData(m, lastOverPath)
      if (ln.path.length === 2) {
        ln.selected = 0
        if (ln.d[0].selected === 1) {
          ln.d[0].selected = 0
          ln.d[1].selected = 1
          ln.d[1].selection = 'f'
        } else {
          clearSelection(m)
          ln.d[0].selected = 1
          ln.d[1].selected = 0
          ln.d[0].selection = 'f'
        }
      } else {
        if (ln.s.length > 0) {
          clearSelection(m)
          ln.selected = 1
          ln.selection = 'f'
        }
      }
      updateParentLastSelectedChild(m, ln)
      break
    }
    case 'selectTarget': {
      clearSelection(m)
      if (payload.highlightTargetPathList.length) {
        for (let i = 0; i < payload.highlightTargetPathList.length; i++) {
          getMapData(m, payload.highlightTargetPathList[i]).selected = 1
        }
      } else {
        getMapData(m, ['r', 0]).selected = 1
      }
      break
    }
    case 'select_all': {
      mapSetProp.start(m, m.r[0], { selected: 1, selection: 's' }, 'struct')
      break
    }
    case 'selectDescendantsOut': {
      if (ln.s.length > 0) {
        if (ln.path.length === 2) {
          ln.selected = 0
          if (payload.code === 'ArrowRight') {
            ln.d[0].selected = 1
            ln.d[0].selection = 'f'
          } else if (payload.code === 'ArrowLeft') {
            ln.d[1].selected = 1
            ln.d[1].selection = 'f'
          }
        } else if (
          ln.path[3] === 0 && payload.code === 'ArrowRight' ||
          ln.path[3] === 1 && payload.code === 'ArrowLeft') {
          ln.selection = 'f'
        } else if (
          ln.path[3] === 0 && payload.code === 'ArrowLeft' ||
          ln.path[3] === 1 && payload.code === 'ArrowRight') {
          ln.selection = 's'
        }
      }
      break
    }
    case 'select_S_IOUD': {
      if (!payload.add) {
        clearSelection(m)
      }
      let toPath = [...sc.lastPath]
      if (payload.direction === Dir.U) {toPath = sc.geomHighPath}
      else if (payload.direction === Dir.D) {toPath = sc.geomLowPath}
      else if (payload.direction === Dir.OR) {toPath = ['r', 0, 'd', 0]}
      else if (payload.direction === Dir.OL) {toPath = ['r', 0, 'd', 1]}
      getMapData(m, structNavigate(m, toPath, payload.direction)).selected = (payload.add ? sc.maxSel + 1 : 1)
      break
    }
    case 'select_S_F': {
      clearSelection(m)
      ln.selected = 1
      break
    }
    case 'select_S_B': {
      clearSelection(m)
      getMapData(m, ln.path.slice(0, -3)).selected = 1
      break
    }
    case 'select_S_BB': {
      clearSelection(m)
      getMapData(m, ln.path.slice(0, -5)).selected = 1
      break
    }
    case 'select_M_IOUD': {
      clearSelection(m)
      getMapData(m, cellNavigate(m, ln.path.slice(0, -2), payload.direction)).selected = 1
      getMapData(m, [...cellNavigate(m, ln.path.slice(0, -2), payload.direction), 's', 0]).selected = 1
      break
    }
    case 'select_M_F': {
      clearSelection(m)
      ln.selected = 1
      ln.s[0].selected = 1
      break
    }
    case 'select_M_FF': {
      if (ln.hasCell) {
        clearSelection(m)
        getMapData(m, [...sc.lastPath, 'c', 0, 0]).selected = 1
        getMapData(m, [...sc.lastPath, 'c', 0, 0, 's', 0]).selected = 1
      }
      break
    }
    case 'select_M_B': {
      if (ln.path.includes('c')) {
        clearSelection(m)
        getMapData(m, [...ln.path.slice(0, ln.path.lastIndexOf('c') + 3)]).selected = 1
        getMapData(m, [...ln.path.slice(0, ln.path.lastIndexOf('c') + 3), 's', 0]).selected = 1
      }
      break
    }
    case 'select_CR_IO': {
      clearSelection(m)
      let pn = getMapData(m, ln.parentPath)
      let parentParentRef = getMapData(m, pn.parentPath)
      let currRow = pn.index[0]
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
        getMapData(m, cellNavigate(m, currPath, payload.direction)).selected = 1
      }
      break
    }
    case 'select_CC_IO': {
      clearSelection(m)
      let pn = getMapData(m, ln.parentPath)
      let parentParentRef = getMapData(m, pn.parentPath)
      let currCol = pn.index[1]
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
        getMapData(m, cellNavigate(m, currPath, payload.direction)).selected = 1
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
      if (!sc.isRootIncluded) {
        clearSelection(m)
        structCreate(m, ln, Dir.U, {})
      }
      break
    }
    case 'insert_S_D': {
      if (!sc.isRootIncluded) {
        clearSelection(m)
        structCreate(m, ln, Dir.D, {})
      }
      break
    }
    case 'insert_S_O': {
      clearSelection(m)
      structCreate(m, ln, Dir.O, {})
      break
    }
    case 'insert_S_O_text': {
      clearSelection(m)
      structCreate(m, ln, Dir.O, { contentType: 'text', content: payload.text })
      break
    }
    case 'insert_S_O_elink': {
      clearSelection(m)
      structCreate(m, ln, Dir.O, { contentType: 'text', content: payload.text, linkType: 'external', link: payload.text })
      break
    }
    case 'insert_S_O_equation': {
      clearSelection(m)
      structCreate(m, ln, Dir.O, { contentType: 'equation', content: payload.text })
      break
    }
    case 'insert_S_O_image': { // TODO check... after path is fixed
      const { imageId, imageSize } = payload
      const { width, height } = imageSize
      clearSelection(m)
      structCreate(m, ln, Dir.O, { contentType: 'image', content: imageId, imageW: width, imageH: height })
      break
    }
    case 'insert_S_O_table': {
      clearSelection(m)
      const { rowLen, colLen } = payload
      const newTable = createArray(rowLen, colLen)
      for (let i = 0; i < rowLen; i++) {
        for (let j = 0; j < colLen; j++) {
          newTable[i][j] = getDefaultNode({s: [getDefaultNode()]})
        }
      }
      structCreate(m, ln, Dir.O, { taskStatus: -1, c: newTable })
      break
    }
    case 'insert_CC_IO': {
      cellColCreate(m, payload.b ? getMapData(m, ln.parentPath) : ln, payload.direction)
      break
    }
    case 'insert_CR_UD': {
      cellRowCreate(m, payload.b ? getMapData(m, ln.parentPath) : ln, payload.direction)
      break
    }
    case 'insertNodesFromClipboard': {
      clearSelection(m)
      const nodeList = JSON.parse(payload.text)
      for (let i = 0; i < nodeList.length; i++) {
        mapSetProp.start(undefined, nodeList[i], ()=>({ nodeId: 'node' + genHash(8) }), '')
        structCreate(m, ln, Dir.O, { ...nodeList[i] })
      }
      break
    }
    // DELETE
    case 'delete_S': {
      if (!sc.isRootIncluded) {
        structDeleteReselect(m, sc)
      }
      break
    }
    case 'delete_CRCC': {
      cellDeleteReselect(m, sc)
      break
    }
    // MOVE
    case 'move_S_IOUD': {
      if (!sc.isRootIncluded && sc.haveSameParent) {
        structMove(m, 'struct2struct', payload.direction)
      }
      break
    }
    case 'move_CR_UD': {
      if (sc.haveSameParent) {
        cellRowMove(m, payload.direction)
      }
      break
    }
    case 'move_CC_IO': {
      if (sc.haveSameParent) {
        cellColMove(m, payload.direction)
      }
      break
    }
    case 'transpose': {
      if (ln.hasCell) {
        ln.c = transposeArray(ln.c)
      }
      break
    }
    case 'copySelection': {
      if (!sc.isRootIncluded) {
        structMove(m, 'struct2clipboard')
      }
      break
    }
    case 'cutSelection': {
      if (!sc.isRootIncluded) {
        structMove(m, 'struct2clipboard')
        structDeleteReselect(m, sc)
      }
      break
    }
    case 'moveTarget': {
      nodeMoveMouse(m, sc, payload.moveTargetPath, payload.moveTargetIndex)
      break
    }
    case 'cellify': {
      if (!sc.isRootIncluded && sc.haveSameParent) {
        structMove(m, 'struct2cell')
        clearSelection(m)
        getMapData(m, [...sc.geomHighPath, 'c', 0, 0]).selected = 1
        getMapData(m, [...sc.geomHighPath, 'c', 0, 0, 's', 0]).selected = 1
      }
      break
    }
    case 'append_text': {
      document.execCommand("insertHTML", false, payload.text)
      break
    }
    // FORMAT
    case 'setFormatParams': {
      // @ts-ignore
      const {lineWidth, lineType, lineColor, borderWidth, borderColor, fillColor, textFontSize, textColor} = {...m.g.nc, ...payload}
      for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        const cn = getMapData(m, sc.structSelectedPathList[i])
        const props = {
          lineWidth,
          lineType,
          lineColor,
          [cn.selection === 's' ? 'sBorderWidth' : 'fBorderWidth'] : borderWidth,
          [cn.selection === 's' ? 'sBorderColor' : 'fBorderColor'] : borderColor,
          [cn.selection === 's' ? 'sFillColor' : 'fFillColor'] : fillColor,
          textFontSize,
          textColor,
        }
        for (const prop in props) {
          if (props[prop] !== undefined) {
            const assignment = {}
            // @ts-ignore
            assignment[prop] = props[prop] === 'clear' ? nodeProps.saveOptional[prop] : props[prop]
            if ((cn.selection === 's' || ['fBorderWidth', 'fBorderColor', 'fFillColor'].includes(prop))) {
              Object.assign(cn, assignment)
            } else {
              mapSetProp.start(m, cn, assignment, '')
            }
          }
        }
      }
      break
    }
    case 'applyColorFromKey': {
      for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        let cn = getMapData(m, sc.structSelectedPathList[i])
        cn.textColor = [
          '#222222',
          '#999999', '#bbbbbb', '#dddddd',
          '#d5802a', '#1c8e1c', '#8e1c8e',
          '#990000', '#000099', '#ffffff'][payload.currColor]
      }
      break
    }
    case 'toggleTask': {
      mapSetProp.start(m, ln, {taskStatus: ln.taskStatus === -1 ? 0 : -1}, '')
      break
    }
    case 'setTaskStatus': {
      let cn = getMapData(m, mapFindById.start(m, payload.nodeId))
      cn.taskStatus = payload.taskStatus
      break
    }
    // EDIT
    case'startEdit': {
      if (ln.contentType === 'equation') {
        ln.contentType = 'text'
      }
      break
    }
    case 'typeText': {
      Object.assign(ln, { contentType: 'text', content: payload })
      break
    }
    case 'finishEdit': {
      break
    }
  }
  return m
}

export const reCalc = (pm: any, m: any) => {
  mapFix.start(m)
  mapInit.start(m)
  mapChain.start(m)
  mapDiff.start(pm, m)
  mapCalcTask.start(m)
  mapExtractSelection.start(m)
  mapExtractProps.start(m)
  mapMeasure.start(m)
  mapPlace.start(m)
  return m
}

const redrawStep = (m: any, colorMode: any, isEditing: boolean, shouldAnimationInit: boolean) => {
  flagDomData()
  mapVisualizeSvg.start(m, colorMode, shouldAnimationInit)
  mapVisualizeDiv.start(m, colorMode)
  updateDomData()
}

export const reDraw = (m: any, colorMode: any, isEditing: boolean) => {
  if (m.g.animationRequested) {
    redrawStep(m, colorMode, isEditing, true)
  }
  redrawStep(m, colorMode, isEditing, false)
}
