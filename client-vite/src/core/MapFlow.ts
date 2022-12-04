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
import {structCreate} from '../node/NodeCreate'
import {nodeMoveMouse, structMove, cellColMove, cellRowMove} from '../node/NodeMove'
import {nodeNavigate} from '../node/NodeNavigate'
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
  for (let i = 0; i < getMapData(m, ['r']).length; i++) {
    let cr = getMapData(m, ['r', i])
    mapSetProp.start(m, cr, {selected: 0, selection: 's'}, '')
  }
}

const updateParentLastSelectedChild = (m: any, ln: any) => {
  if (!ln.isRoot) {
    let pn = getMapData(m, ln.parentPath)
    pn.lastSelectedChild = ln.index
  }
}

export const mapReducer = (m: any, action: any, payload: any) => {
  const { sc } = m
  let ln = getMapData(m, sc.lastPath)
  if (payload.hasOwnProperty('contentToSave')) {
    ln.content = payload.contentToSave
    if (ln.content.substring(0, 2) === '\\[') {
      ln.contentType = 'equation'
    } else if (ln.content.substring(0, 1) === '=') {
      ln.contentCalc = ln.content
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
      if (payload.direction === Dir.U) {toPath = m.sc.geomHighPath}
      else if (payload.direction === Dir.D) {toPath = m.sc.geomLowPath}
      else if (payload.direction === Dir.OR) {toPath = ['r', 0, 'd', 0]}
      else if (payload.direction === Dir.OL) {toPath = ['r', 0, 'd', 1]}
      getMapData(m, nodeNavigate(m, toPath, 'struct2struct', payload.direction)).selected = (payload.add ? sc.maxSel + 1 : 1)
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
      getMapData(m, nodeNavigate(m, ln.path.slice(0, -2), 'cell2cell', payload.direction)).selected = 1
      getMapData(m, [...nodeNavigate(m, ln.path.slice(0, -2), 'cell2cell', payload.direction), 's', 0]).selected = 1
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
      for (let i = ln.path.length - 2; i > 0; i--) {
        if (Number.isInteger(ln.path[i]) && Number.isInteger(ln.path[i + 1])) {
          clearSelection(m)
          getMapData(m, ln.path.slice(0, i + 2)).selected = 1
          getMapData(m, [...ln.path.slice(0, i + 2), 's', 0]).selected = 1
          break
        }
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
        getMapData(m, nodeNavigate(m, currPath, 'cell2cell', payload.direction)).selected = 1
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
      if (!ln.isRoot) {
        clearSelection(m)
        structCreate(m, ln, Dir.U, {})
      }
      break
    }
    case 'insert_S_D': {
      if (!ln.isRoot) {
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
      structCreate(m, ln, Dir.O, { taskStatus: -1, c: tableGen })
      break
    }
    case 'insert_CC_IO': {
      const n = payload.b ? getMapData(m, ln.parentPath) : ln
      const pn = getMapData(m, n.parentPath)
      const currCol = n.index[1]
      const rowLen = pn.c.length
      if (payload.direction === Dir.I) {
        for (let i = 0; i < rowLen; i++) {
          pn.c[i].splice(currCol, 0, getDefaultNode({s: [getDefaultNode()]}))
        }
      } else if (payload.direction === Dir.O) {
        for (let i = 0; i < rowLen; i++) {
          pn.c[i].splice(currCol + 1, 0, getDefaultNode({s: [getDefaultNode()]}))
        }
      }
      break
    }
    case 'insert_CR_UD': {
      const n = payload.b ? getMapData(m, ln.parentPath) : ln
      const pn = getMapData(m, n.parentPath)
      const currRow = n.index[0]
      const colLen = pn.c[0].length
      if (payload.direction === Dir.U) {
        let newRow = new Array(colLen)
        for (let i = 0; i < colLen; i++) {
          newRow[i] = getDefaultNode({s: [getDefaultNode()]})
        }
        pn.c.splice(currRow, 0, newRow)
      } else if (payload.direction === Dir.D) {
        let newRow = new Array(colLen)
        for (let i = 0; i < colLen; i++) {
          newRow[i] = getDefaultNode({s: [getDefaultNode()]})
        }
        pn.c.splice(currRow + 1, 0, newRow)
      }
      break
    }
    case 'insertMapFromClipboard': {
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
      structDeleteReselect(m, sc)
      break
    }
    case 'delete_CRCC': { // TODO separate CRCC
      cellBlockDeleteReselect(m, sc)
      break
    }
    // MOVE
    case 'move_S_IOUD': {
      structMove(m, 'struct2struct', payload.direction)
      break
    }
    case 'move_CR_UD': {
      cellRowMove(m, payload.direction)
      break
    }
    case 'move_CC_IO': {
      cellColMove(m, payload.direction)
      break
    }
    case 'transpose': {
      if (ln.hasCell) {
        ln.c = transposeArray(ln.c)
      }
      break
    }
    case 'copySelection': {
      structMove(m, 'struct2clipboard')
      break
    }
    case 'cutSelection': {
      structMove(m, 'struct2clipboard')
      structDeleteReselect(m, sc)
      break
    }
    case 'moveTarget': {
      nodeMoveMouse(m, sc, payload.moveTargetPath, payload.moveTargetIndex)
      break
    }
    case 'cellifyMulti': { // TODO rename to something move_
      structMove(m, 'struct2cell')
      clearSelection(m)
      let toPath = getMapData(m, getMapData(m, sc.geomHighPath).parentPath).path // TODO use slice
      getMapData(m, toPath).selected = 1
      getMapData(m, toPath).s[0].selected = 1
      break
    }
    case 'append_text': {
      document.execCommand("insertHTML", false, payload.text)
      break
    }
    // FORMAT
    case 'setFormatParams': {
      // @ts-ignore
      const {lineWidth, lineType, lineColor, borderWidth, borderColor, fillColor, textFontSize, textColor} = {...m.nc, ...payload}
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
      let cn = getMapData(m, mapFindById.start(m, getMapData(m, ['r', 0]), payload.nodeId))
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
  let cr = getMapData(m, ['r', 0])
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
