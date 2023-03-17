import {getDefaultNode, nSaveOptional} from './DefaultProps'
import {M, MPartial, N, NC, NSaveOptional} from "../types/DefaultProps"
import {copy, createArray, genHash, subsref, transpose} from './Utils'
import {mapFindById} from '../map/MapFindById'
import {mapFix} from '../map/MapFix'
import {mapInit} from '../map/MapInit'
import {mapCalcTask} from '../map/MapCalcTask'
import {mapChain} from '../map/MapChain'
import {mapDeInit} from '../map/MapDeInit'
import {mapDiff} from "../map/MapDiff"
import {mapDisassembly} from '../map/MapDisassembly'
import {mapExtractProps} from "../map/MapExtractProps"
import {mapExtractSelection} from '../map/MapExtractSelection'
import {mapMeasure} from '../map/MapMeasure'
import {mapPlace} from '../map/MapPlace'
import {mapSetProp} from '../map/MapSetProp'
import {cellDeleteReselect, structDeleteReselect} from '../node/NodeDelete'
import {cellColCreate, cellRowCreate, structCreate} from '../node/NodeCreate'
import {nodeMoveMouse, structMove, cellColMove, cellRowMove} from '../node/NodeMove'
import {structNavigate, cellNavigate} from '../node/NodeNavigate'
import {Dir} from "./Enums"

export const getMapData = (m: M, path: any[]) => {
  return subsref(m, path)
}

export const getSavedMapData = (m: M) => {
  const mCopy = copy(m)
  mapDeInit.start(mCopy)
  return mapDisassembly.start(mCopy)
}

const clearSelection = (m: M) => {
  mapSetProp.iterate(m.r[0], { selected: 0, selection: 's' }, true)
}

const updateParentLastSelectedChild = (m: M, ln: N) => {
  if (!m.g.sc.isRootIncluded) {
    let pn = getMapData(m, ln.parentPath)
    pn.lastSelectedChild = ln.index
  }
}

export const mapReducer = (m: M, action: string, payload: any) => {
  console.log('MAP_MUTATION: ' + action, payload)

  const { sc } = m.g
  let ln = getMapData(m, sc.lastPath)
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
      mapSetProp.iterate(m.r[0], { selected: 1, selection: 's' }, (n: N) => (n.type === 'struct' && !n.hasCell))
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
      let toPath = [...sc.lastPath] as any[]
      if (payload.direction === Dir.U) {toPath = sc.geomHighPath}
      else if (payload.direction === Dir.D) {toPath = sc.geomLowPath}
      else if (payload.direction === Dir.OR) {toPath = ['r', 0, 'd', 0]}
      else if (payload.direction === Dir.OL) {toPath = ['r', 0, 'd', 1]}
      getMapData(m, structNavigate(m, toPath, payload.direction)).selected = (payload.add ? sc.maxSel + 1 : 1)
      break
    }
    case 'select_S_F': {
      clearSelection(m)
      ln.s[0].selected = 1
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
    case 'select_C_IOUD': {
      clearSelection(m)
      getMapData(m, cellNavigate(m, ln.path, payload.direction)).selected = 1
      break
    }
    case 'select_C_F': {
      clearSelection(m)
      ln.selected = 1
      break
    }
    case 'select_C_FF': {
      if (ln.hasCell) {
        clearSelection(m)
        getMapData(m, [...sc.lastPath, 'c', 0, 0]).selected = 1
      }
      break
    }
    case 'select_C_B': {
      if (ln.path.includes('c')) {
        clearSelection(m)
        getMapData(m, [...ln.path.slice(0, ln.path.lastIndexOf('c') + 3)]).selected = 1
      }
      break
    }
    case 'select_CR_IO': {
      clearSelection(m)
      let pn = getMapData(m, ln.parentPath)
      let currRow = ln.index[0]
      let colLen = pn.c[0].length
      for (let i = 0; i < colLen; i++) {
        pn.c[currRow][i].selected = 1
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
      let currCol = ln.index[1]
      let rowLen = pn.c.length
      for (let i = 0; i < rowLen; i++) {
        pn.c[i][currCol].selected = 1
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
    case 'select_dragged': {
      clearSelection(m)
      for (let i = 0; i < payload.nList.length; i++) {
        getMapData(m, payload.nList[i].path).selected = i + 1
      }
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
      structCreate(m, ln, Dir.O, { taskStatus: 0, c: newTable })
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
        mapSetProp.iterate(nodeList[i], () => ({ nodeId: 'node' + genHash(8) }), true)
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
        ln.c = transpose(ln.c)
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
    case 'move_dragged': {
      nodeMoveMouse(m, sc, payload.moveTargetPath, payload.moveTargetIndex)
      break
    }
    case 'cellify': {
      if (!sc.isRootIncluded && sc.haveSameParent) {
        structMove(m, 'struct2cell')
        clearSelection(m)
        getMapData(m, [...sc.geomHighPath, 'c', 0, 0]).selected = 1
      }
      break
    }
    // FORMAT
    case 'setFormatParams': {
      const {lineWidth, lineType, lineColor, borderWidth, borderColor, fillColor, textFontSize, textColor} =
        {...m.g.nc, ...payload} as NC
      for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        const n = getMapData(m, sc.structSelectedPathList[i])
        const props = {
          lineWidth,
          lineType,
          lineColor,
          [n.selection === 's' ? 'sBorderWidth' : 'fBorderWidth'] : borderWidth,
          [n.selection === 's' ? 'sBorderColor' : 'fBorderColor'] : borderColor,
          [n.selection === 's' ? 'sFillColor' : 'fFillColor'] : fillColor,
          textFontSize,
          textColor,
        } as Partial<NSaveOptional>
        for (const prop in props) {
          if (props[prop as keyof NSaveOptional] !== undefined) {
            const assignment = props[prop as keyof NSaveOptional] === 'clear'
              ? { [prop]: nSaveOptional[prop as keyof NSaveOptional] }
              : { [prop]: props[prop as keyof NSaveOptional] }
            if ((n.selection === 's' || ['fBorderWidth', 'fBorderColor', 'fFillColor'].includes(prop))) {
              Object.assign(n, assignment)
            } else {
              mapSetProp.iterate(n, assignment, true)
            }
          }
        }
      }
      break
    }
    case 'applyColorFromKey': {
      for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        let n = getMapData(m, sc.structSelectedPathList[i])
        n.textColor = [
          '#222222',
          '#999999', '#bbbbbb', '#dddddd',
          '#d5802a', '#1c8e1c', '#8e1c8e',
          '#990000', '#000099', '#ffffff'][payload.currColor]
      }
      break
    }
    case 'toggleTask': {
      mapSetProp.iterate(ln, { taskStatus: ln.taskStatus === 0 ? 1 : 0 }, true)
      break
    }
    case 'setTaskStatus': {
      const { nodeId, taskStatus } = payload
      const n = getMapData(m, mapFindById.start(m, nodeId))
      n.taskStatus = taskStatus
      break
    }
    // EDIT
    case'startEditAppend': {
      if (ln.contentType === 'equation') {
        ln.contentType = 'text'
      }
      break
    }
    case 'typeText': {
      Object.assign(ln.type === 'cell' ? ln.s[0] : ln, { contentType: 'text', content: payload })
      break
    }
    case 'finishEdit': {
      const { nodeId, content } = payload
      const n = getMapData(m, mapFindById.start(m, nodeId))
      const isContentEquation = content.substring(0, 2) === '\\['
      if (n.type === 'cell') {
        n.s[0].content = content
        n.s[0].contentType = isContentEquation ? 'equation' : n.s[0].contentType
      } else {
        n.content = content
        n.contentType = isContentEquation ? 'equation' : n.contentType
      }
      break
    }
  }
  return m
}

export const reCalc = (pm: MPartial, m: MPartial) => {
  mapFix.start(m as MPartial)
  mapInit.start(m as MPartial)
  mapChain.start(m as M)
  mapDiff.start(pm as M, m as M)
  mapCalcTask.start(m as M)
  mapExtractSelection.start(m as M)
  mapExtractProps.start(m as M)
  mapMeasure.start(m as M)
  mapPlace.start(m as M)
  return m as M
}
