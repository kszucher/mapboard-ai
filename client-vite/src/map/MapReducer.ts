import {Dir} from "../core/Enums"
import {M, N, P} from "../state/MapPropTypes"
import {mapInit} from "./MapInit"
import {mapChain} from "./MapChain"
import {mapCalcTask} from "./MapCalcTask"
import {mapMeasure} from "./MapMeasure"
import {mapPlace} from "./MapPlace"
import isEqual from "react-fast-compare"
import {genHash, transpose} from '../core/Utils'
import {cellNavigate, structNavigate} from '../node/NodeNavigate'
import {
  sortPath,
  sortNode,

  getG,
  getLS,
  getDefaultNode,
  getNodeByPath,
  getParentNodeByPath,
  getEditedNode,
  getInsertParentNode,
  setSelection,
  setSelectionFamily,
  incrementPathItemAt,
  isCellColSiblingPath,
  isCellRowSiblingPath,
  isR,
  isLowerSiblingFamilyPath,
  isFamilyOrLowerSiblingFamilyPath,
} from "./MapUtils"
import {nSaveOptional} from "../state/MapProps";

const selectNode = (m: M, path: P, selection: 's' | 'f', add: boolean) => {
  m.forEach(n => Object.assign(n, n.path.length > 1 && isEqual(n.path, path) ? { selected: add ? getLS(m).selected + 1 : 1 , selection } : { selected: 0, selection: 's' }))
}

const selectNodeList = (m: M, pathList: P[], selection: 's' | 'f') => {
  m.forEach((n, i) => Object.assign(n, n.path.length > 1 && pathList.map(p => p.join('')).includes(n.path.join('')) ? { selected: i, selection } : { selected: 0, selection: 's' }))
}

const moveFamilyOrLowerSiblingFamilyDown = (m: M) => {
  m.forEach(n => Object.assign(n, isFamilyOrLowerSiblingFamilyPath(getLS(m).path, n.path) ? {path: incrementPathItemAt(n.path, getLS(m).path.length - 1)} : {}))
}

const moveLowerSiblingFamilyDown = (m: M) => {
  m.forEach(n => Object.assign(n, isLowerSiblingFamilyPath(getLS(m).path, n.path) ? {path: incrementPathItemAt(n.path, getLS(m).path.length - 1)} : {}))
}

const createNode = (m, attributes: object) => {
  m.push(getDefaultNode({ ...attributes, nodeId: 'node' + genHash(8) }))
  m.sort(sortPath)
}

const createNodes = (m, nodeList: N[]) => {
  m.concat(nodeList.map(n => getDefaultNode({ ...n, nodeId: 'node' + genHash(8) }))) // ????
  m.sort(sortPath)
}

const insertSelectNodeO = (m: M, attributes: object) => {
  const insertPath = [...getInsertParentNode(m).path, 's', getInsertParentNode(m).sCount]
  createNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus})
  selectNode(m, insertPath, 's', false)
}

const insertSelectNodeU = (m: M, attributes: object) => {
  const insertPath = getLS(m).path
  moveFamilyOrLowerSiblingFamilyDown(m)
  createNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ?  1 : 0})
  selectNode(m, insertPath, 's', false)
  m.forEach(n =>{console.log(n.path,n.content)})
}

const insertSelectNodeD = (m: M, attributes: object) => {
  const insertPath = incrementPathItemAt(getLS(m).path, getLS(m).path.length - 1)
  moveLowerSiblingFamilyDown(m)
  createNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ?  1 : 0})
  selectNode(m, insertPath, 's', false)
}

// insert cell
// insert cell row
// insert cell col

const deleteNode = () => {
  // this will also return a path, just not the one it received but what it calculated, so
  // with this background-flow, we have ALL select at one level, we will see whether its good or bad
}

export const mapReducer = (pm: M, action: string, payload: any) => {
  console.log('MAP_MUTATION: ' + action, payload)
  // TODO map type validity check here to prevent errors
  const m = structuredClone(pm).sort(sortPath)
  const g = getG(m)
  const ls = action === 'LOAD' ? null as N : getLS(m)
  switch (action) {
    case 'LOAD':
      break
    // // VIEW
    case 'changeDensity': g.density = g.density === 'small' ? 'large' : 'small'; break
    case 'changeAlignment': g.alignment = g.alignment === 'centered' ? 'adaptive' : 'centered'; break
    case 'select_S': {
      const n = getNodeByPath(m, payload.path)
      if (n.dCount || payload.selection === 's' || n.sCount && payload.selection === 'f') {
        const r0d0 = getNodeByPath(pm, ['r', 0, 'd', 0])
        const r0d1 = getNodeByPath(pm, ['r', 0, 'd', 1])
        let toPath = []
        if (!isR(payload.path) && isEqual(n.path, payload.path) || isR(payload.path) && payload.selection === 's') toPath = payload.path
        else if (isR(payload.path) && !r0d0.selected && payload.selection === 'f') toPath = ['r', 0, 'd', 0]
        else if (isR(payload.path) && r0d0.selected && !r0d1.selected && payload.selection === 'f') toPath =['r', 0, 'd', 1]
        selectNode(m, toPath, payload.selection, payload.add)
        if (!n.dCount) {
          getParentNodeByPath(m, payload.path).lastSelectedChild = payload.path.at(-1)
        }
      }
      break
    }
    case 'select_all': selectNodeList(m, m.filter(n => n.content !== '').map(n => n.path), 's'); break
    case 'selectDescendantsOut': {
      if (payload.dir === Dir.OR) selectNode(m, ['r', 0, 'd', 0], 'f', false)
      else if (payload.dir === Dir.OL) selectNode(m, ['r', 0, 'd', 1], 'f', false)
      else if (payload.dir === Dir.O && ls.sCount > 0) ls.selection = 'f'
      break
    }
    case 'select_S_IOUD': {
      let toPath = [...ls.path]
      if (payload.dir === Dir.U) toPath = m.find(n => n.selected).path
      else if (payload.dir === Dir.D) toPath = m.findLast(n => n.selected).path
      else if (payload.dir === Dir.OR) toPath = ['r', 0, 'd', 0]
      else if (payload.dir === Dir.OL) toPath = ['r', 0, 'd', 1]
      selectNode(m, structNavigate(m, toPath, payload.dir), 's', payload.add)
      break
    }
    case 'select_S_F': selectNode(m, [...ls.path, 's', 0], 's', false); break
    case 'select_S_B': selectNode(m, ls.path.slice(0, -3), 's', false); break
    case 'select_S_BB': selectNode(m, ls.path.slice(0, -5), 's', false); break
    case 'select_C_IOUD': selectNode(m, cellNavigate(m, ls.path, payload.dir), 's', false); break
    case 'select_C_F': selectNode(m, ls.path, 's', false); break
    case 'select_C_FF': (ls.cRowCount || ls.cColCount) ? selectNode(m, [...ls.path, 'c', 0, 0], 's', false) : () => {}; break
    case 'select_C_B': ls.path.includes('c') ? selectNode(m, [...ls.path.slice(0, ls.path.lastIndexOf('c') + 3)], 's', false) : () => {}; break
    case 'select_CR_SAME': selectNodeList(m, m.filter(n => isCellRowSiblingPath(n.path, ls.path)).map(n => n.path), 's'); break
    case 'select_CC_SAME': selectNodeList(m, m.filter(n => isCellColSiblingPath(n.path, ls.path)).map(n => n.path), 's'); break
    case 'select_CR_UD': selectNodeList(m, m.filter(n => isCellRowSiblingPath(n.path, cellNavigate(m, ls.path, payload.dir))).map(n => n.path), 's'); break
    case 'select_CC_IO': selectNodeList(m, m.filter(n => isCellColSiblingPath(n.path, cellNavigate(m, ls.path, payload.dir))).map(n => n.path), 's'); break
    case 'select_R': selectNode(m, ['r', 0], 's', false); break
    case 'select_dragged': selectNodeList(m, payload.nList.map(n => n.path), 's'); break
    // INSERT
    case 'insert_S_O': insertSelectNodeO(m, {}); break
    case 'insert_S_O_text': insertSelectNodeO(m, {contentType: 'text', content: payload.text}); break
    case 'insert_S_O_elink': insertSelectNodeO(m, {contentType: 'text', content: payload.text, linkType: 'external', link: payload.text}); break
    case 'insert_S_O_equation': insertSelectNodeO(m, {contentType: 'equation', content: payload.text}); break
    case 'insert_S_O_image': insertSelectNodeO(m, {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insert_S_O_table': {
      insertSelectNodeO(m, {})
      for (let i = 0; i < payload.rowLen; i++) {
        for (let j = 0; j < payload.colLen; j++) {
          // m.push(getDefaultNode({ path: [...insertPath, 'c', i, j], nodeId: 'node' + genHash(8) }))
        }
      }
      m.sort(sortPath)
      break
    }
    case 'insert_S_U': insertSelectNodeU(m, {}); break
    case 'insert_S_D': insertSelectNodeD(m, {}); break
    case 'insert_CC_IO': {
      // cellColCreate(m, payload.b ? getMapData(m, ls.parentPath) : ls, payload.dir) // FIXME getParentPath
      break
    }
    case 'insert_CR_UD': {
      // cellRowCreate(m, payload.b ? getMapData(m, ls.parentPath) : ls, payload.dir) // FIXME getParentPath
      break
    }
    case 'insertNodesFromClipboard': {
      // clearSelection(m)
      // const nodeList = JSON.parse(payload.text)
      // for (let i = 0; i < nodeList.length; i++) {
      //   mapSetProp.iterate(nodeList[i], () => ({ nodeId: 'node' + genHash(8) }), true)
      //   structCreate(m, ls, Dir.O, { ...nodeList[i] })
      // }
      break
    }
    // DELETE
    case 'delete_S': { // TODO think about the nodes this will toss UP or DOWN
      // if (!sc.isRootIncluded) {
      //   structDeleteReselect(m, sc)
      // }
      break
    }
    case 'delete_CRCC': {
      // cellDeleteReselect(m, sc)
      break
    }
    // MOVE
    case 'move_S_IOUD': {
      // if (!sc.isRootIncluded && sc.haveSameParent) {
      //   structMove(m, 'struct2struct', payload.dir)
      // }
      break
    }
    case 'move_CR_UD': {
      // if (sc.haveSameParent) {
      //   cellRowMove(m, payload.dir)
      // }
      break
    }
    case 'move_CC_IO': {
      // if (sc.haveSameParent) {
      //   cellColMove(m, payload.dir)
      // }
      break
    }
    case 'transpose': {
      // if (ls.cRowCount || ls.cColCount) {
      //   ls.c = transpose(ls.c)
      // }
      break
    }
    case 'copySelection': {
      // if (!sc.isRootIncluded) {
      //   structMove(m, 'struct2clipboard')
      // }
      break
    }
    case 'cutSelection': {
      // if (!sc.isRootIncluded) {
      //   structMove(m, 'struct2clipboard')
      //   structDeleteReselect(m, sc)
      // }
      break
    }
    case 'move_dragged': {
      // nodeMoveMouse(m, sc, payload.moveTargetPath, payload.moveTargetIndex)
      break
    }
    case 'cellify': {
      // if (!sc.isRootIncluded && sc.haveSameParent) {
      //   structMove(m, 'struct2cell')
      //   clearSelection(m)
      //   getMapData(m, [...sc.geomHighPath, 'c', 0, 0]).selected = 1
      // }
      break
    }
    case 'applyColorFromKey': {
      // for (let i = 0; i < sc.structSelectedPathList.length; i++) {
      //   let n = getMapData(m, sc.structSelectedPathList[i])
      //   n.textColor = [
      //     '#222222',
      //     '#999999', '#bbbbbb', '#dddddd',
      //     '#d5802a', '#1c8e1c', '#8e1c8e',
      //     '#990000', '#000099', '#ffffff'][payload.currColor]
      // }
      break
    }
    case 'toggleTask': {
      // mapSetProp.iterate(ls, { taskStatus: ls.taskStatus === 0 ? 1 : 0 }, true)
      break
    }
    case 'setTaskStatus': {
      // const { nodeId, taskStatus } = payload
      // const n = getMapData(m, mapFindById.start(m, nodeId))
      // n.taskStatus = taskStatus
      break
    }
    // EDIT
    case 'startEditAppend': getLS(m).contentType === 'equation' ? Object.assign(getLS(m), { contentType: 'text' }) : () => {}; break
    case 'typeText': Object.assign(getLS(m), { contentType: 'text', content: payload.content }); break
    case 'finishEdit': Object.assign(getEditedNode(m, payload.path), { contentType: payload.content.substring(0, 2) === '\\[' ? 'equation' : 'text', content: payload.content }); break
    // FORMAT
    case 'setLineWidth': ls.selection === 's' ? setSelection(m, 'lineWidth', payload) : setSelectionFamily (m, 'lineWidth', payload); break
    case 'setLineType': ls.selection === 's' ? setSelection(m, 'lineType', payload) : setSelectionFamily (m, 'lineType', payload); break
    case 'setLineColor': ls.selection === 's' ? setSelection(m, 'lineColor', payload) : setSelectionFamily (m, 'lineColor', payload); break
    case 'setBorderWidth': ls.selection === 's' ? setSelection(m, 'sBorderWidth', payload) : setSelection (m, 'fBorderWidth', payload); break
    case 'setBorderColor': ls.selection === 's' ? setSelection(m, 'sBorderColor', payload) : setSelection (m, 'fBorderColor', payload); break
    case 'setFillColor': ls.selection === 's' ? setSelection(m, 'sFillColor', payload) : setSelection (m, 'fFillColor', payload); break
    case 'setTextFontSize': ls.selection === 's' ? setSelection(m, 'textFontSize', payload) : setSelectionFamily (m, 'textFontSize', payload); break
    case 'setTextColor': ls.selection === 's' ? setSelection(m, 'textColor', payload) : setSelectionFamily (m, 'textColor', payload); break
    case 'clearLine': {
      ls.selection === 's' ? setSelection(m, 'lineWidth', nSaveOptional.lineWidth) : setSelectionFamily (m, 'lineWidth', nSaveOptional.lineWidth)
      ls.selection === 's' ? setSelection(m, 'lineType', nSaveOptional.lineType) : setSelectionFamily (m, 'lineType', nSaveOptional.lineType)
      ls.selection === 's' ? setSelection(m, 'lineColor', nSaveOptional.lineColor) : setSelectionFamily (m, 'lineColor', nSaveOptional.lineColor)
      break
    }
    case 'clearBorder': {
      ls.selection === 's' ? setSelection(m, 'sBorderWidth', nSaveOptional.sBorderWidth) : setSelection(m, 'fBorderWidth', nSaveOptional.sBorderWidth)
      ls.selection === 's' ? setSelection(m, 'sBorderColor', nSaveOptional.sBorderColor) : setSelection(m, 'fBorderColor', nSaveOptional.sBorderColor)
      break
    }
    case 'clearFill': {
      ls.selection === 's' ? setSelection(m, 'sFillColor', nSaveOptional.sFillColor) : setSelection(m, 'fFillColor', nSaveOptional.fFillColor)
      break
    }
    case 'clearText': {
      ls.selection === 's' ? setSelection(m, 'textColor', nSaveOptional.textColor) : setSelectionFamily(m, 'textColor', nSaveOptional.textColor)
      ls.selection === 's' ? setSelection(m, 'textFontSize', nSaveOptional.textFontSize) : setSelectionFamily(m, 'textFontSize', nSaveOptional.textFontSize)
      break
    }
  }

  // TODO mapFix
  mapInit(m)
  mapChain(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(sortNode)
}
