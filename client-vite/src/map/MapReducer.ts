import {genHash, transpose} from '../core/Utils'
import {cellNavigate, structNavigate} from '../node/NodeNavigate'
import {Dir} from "../core/Enums"
import {M, Path} from "../state/MTypes"
import {N} from "../state/NPropsTypes"
import {
  fSetter,
  getDefaultNode, getEditableNode, getInsertPathD,
  getInsertPathO, getLastSelectedNode, getLP, getNodeById,
  getNodeByPath,
  getParentNodeByPath, incrementPathAt, isC,
  isCellColSiblingPath,
  isCellRowSiblingPath, isChildPath, isLowerSiblingPath,
  isR,
  nodeSorter,
  pathSorter,
  sSetter
} from "./MapUtils"
import {mapPlace} from "./MapPlace"
import {mapMeasure} from "./MapMeasure"
import {nSaveOptional} from "../state/NProps";
import {mapExtractSelection} from "./MapExtractSelection";
import {mapCalcTask} from "./MapCalcTask";
import {mapInit} from "./MapInit";
import {mapChain} from "./MapChain";
import isEqual from "react-fast-compare";

const selectNode = (m: M, path: Path, selection: 's' | 'f', add: boolean) => {
  const maxSel = 0 // TODO
  m.forEach(n => Object.assign(n, n.path.length > 1 && isEqual(n.path, path)
    ? { selected: add ? maxSel + 1 : 1 , selection }
    : { selected: 0, selection: 's' }
  ))
}

const selectNodeList = (m: M, pathList: Path[], selection: 's' | 'f') => {
  m.forEach((n, i) => Object.assign(n, n.path.length > 1 && pathList.map(p => p.join('')).includes(n.path.join(''))
    ? { selected: i, selection }
    : { selected: 0, selection: 's' }
  ))
}

const insertNode = (m, dir: Dir, content: string) => {
  let insertPath
  if (dir === Dir.O) insertPath = getInsertPathO(m)
  else if (dir === Dir.U) insertPath = getLP(m)
  else if (dir === Dir.D) insertPath = getInsertPathD(m)

  if (dir === Dir.D) {
    m.forEach(n => isLowerSiblingPath(insertPath, n.path) ? n.path = incrementPathAt(n.path, insertPath.length - 1) : () => {})
  }

  m.push(getDefaultNode({ path: structuredClone(insertPath), content, nodeId: 'node' + genHash(8) }))
  m.sort(pathSorter)
  return insertPath
}

const deleteNode = () => {
  // this will also return a path, just not the one it received but what it calculated, so
  // with this background-flow, we have ALL select at one level, we will see whether its good or bad
}

export const mapReducer = (pm: M, action: string, payload: any) => {
  console.log('MAP_MUTATION: ' + action, payload)
  // TODO map type validity check here to prevent errors
  const m = structuredClone(pm).sort(pathSorter)
  const g = m.filter((n: N) => n.path.length === 1).at(0)
  const { sc } = g
  const ln = action === 'LOAD' ? null as N : getNodeByPath(m, sc.lastPath) // intead of this is getLN
  switch (action) {
    case 'LOAD': break
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
      else if (payload.dir === Dir.O && ln.sCount > 0) ln.selection = 'f'
      break
    }
    case 'select_S_IOUD': {
      let toPath = [...sc.lastPath]
      if (payload.dir === Dir.U) toPath = sc.geomHighPath
      else if (payload.dir === Dir.D) toPath = sc.geomLowPath
      else if (payload.dir === Dir.OR) toPath = ['r', 0, 'd', 0]
      else if (payload.dir === Dir.OL) toPath = ['r', 0, 'd', 1]
      selectNode(m, structNavigate(m, toPath, payload.dir), 's', payload.add)
      break
    }
    case 'select_S_F': selectNode(m, [...ln.path, 's', 0], 's', false); break
    case 'select_S_B': selectNode(m, ln.path.slice(0, -3), 's', false); break
    case 'select_S_BB': selectNode(m, ln.path.slice(0, -5), 's', false); break
    case 'select_C_IOUD': selectNode(m, cellNavigate(m, ln.path, payload.dir), 's', false); break
    case 'select_C_F': selectNode(m, ln.path, 's', false); break
    case 'select_C_FF': (ln.cRowCount || ln.cColCount) ? selectNode(m, [...sc.lastPath, 'c', 0, 0], 's', false) : () => {}; break
    case 'select_C_B': ln.path.includes('c') ? selectNode(m, [...ln.path.slice(0, ln.path.lastIndexOf('c') + 3)], 's', false) : () => {}; break
    case 'select_CR_SAME': selectNodeList(m, m.filter(n => isCellRowSiblingPath(n.path, ln.path)).map(n => n.path), 's'); break
    case 'select_CC_SAME': selectNodeList(m, m.filter(n => isCellColSiblingPath(n.path, ln.path)).map(n => n.path), 's'); break
    case 'select_CR_UD': selectNodeList(m, m.filter(n => isCellRowSiblingPath(n.path, cellNavigate(m, ln.path, payload.dir))).map(n => n.path), 's'); break
    case 'select_CC_IO': selectNodeList(m, m.filter(n => isCellColSiblingPath(n.path, cellNavigate(m, ln.path, payload.dir))).map(n => n.path), 's'); break
    case 'select_R': selectNode(m, ['r', 0], 's', false); break
    case 'select_dragged': selectNodeList(m, payload.nList.map(n => n.path), 's'); break
    // INSERT
    case 'insert_S_U': selectNode(m, insertNode(m, Dir.U, ''), 's', false); break
    case 'insert_S_D': selectNode(m, insertNode(m, Dir.D, ''), 's', false); break
    case 'insert_S_O': selectNode(m, insertNode(m, Dir.O, ''), 's', false); break
    case 'insert_S_O_text': {
      // clearSelection(m)
      // structCreate(m, ln, Dir.O, { contentType: 'text', content: payload.text })
      break
    }
    case 'insert_S_O_elink': {
      // clearSelection(m)
      // structCreate(m, ln, Dir.O, { contentType: 'text', content: payload.text, linkType: 'external', link: payload.text })
      break
    }
    case 'insert_S_O_equation': {
      // clearSelection(m)
      // structCreate(m, ln, Dir.O, { contentType: 'equation', content: payload.text })
      break
    }
    case 'insert_S_O_image': { // TODO check... after path is fixed
      // const { imageId, imageSize } = payload
      // const { width, height } = imageSize
      // clearSelection(m)
      // structCreate(m, ln, Dir.O, { contentType: 'image', content: imageId, imageW: width, imageH: height })
      break
    }
    case 'insert_S_O_table': {
      // clearSelection(m)
      // const { rowLen, colLen } = payload
      // const newTable = createArray(rowLen, colLen)
      // for (let i = 0; i < rowLen; i++) {
      //   for (let j = 0; j < colLen; j++) {
      //     newTable[i][j] = getDefaultNode({s: [getDefaultNode()]})
      //   }
      // }
      // structCreate(m, ln, Dir.O, { taskStatus: 0, c: newTable })
      break
    }
    case 'insert_CC_IO': {
      // cellColCreate(m, payload.b ? getMapData(m, ln.parentPath) : ln, payload.dir) // FIXME getParentPath
      break
    }
    case 'insert_CR_UD': {
      // cellRowCreate(m, payload.b ? getMapData(m, ln.parentPath) : ln, payload.dir) // FIXME getParentPath
      break
    }
    case 'insertNodesFromClipboard': {
      // clearSelection(m)
      // const nodeList = JSON.parse(payload.text)
      // for (let i = 0; i < nodeList.length; i++) {
      //   mapSetProp.iterate(nodeList[i], () => ({ nodeId: 'node' + genHash(8) }), true)
      //   structCreate(m, ln, Dir.O, { ...nodeList[i] })
      // }
      break
    }
    // DELETE
    case 'delete_S': {
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
      // if (ln.cRowCount || ln.cColCount) {
      //   ln.c = transpose(ln.c)
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
      // mapSetProp.iterate(ln, { taskStatus: ln.taskStatus === 0 ? 1 : 0 }, true)
      break
    }
    case 'setTaskStatus': {
      // const { nodeId, taskStatus } = payload
      // const n = getMapData(m, mapFindById.start(m, nodeId))
      // n.taskStatus = taskStatus
      break
    }
    // EDIT
    case 'startEditAppend': getLastSelectedNode(m).contentType === 'equation' ? Object.assign(getLastSelectedNode(m), { contentType: 'text' }) : () => {}; break
    case 'typeText': Object.assign(getLastSelectedNode(m), { contentType: 'text', content: payload.content }); break
    case 'finishEdit': Object.assign(getEditableNode(m, payload.path), { contentType: payload.content.substring(0, 2) === '\\[' ? 'equation' : 'text', content: payload.content }); break
    // FORMAT
    case 'setLineWidth': ln.selection === 's' ? sSetter(m, 'lineWidth', payload) : fSetter (m, 'lineWidth', payload); break
    case 'setLineType': ln.selection === 's' ? sSetter(m, 'lineType', payload) : fSetter (m, 'lineType', payload); break
    case 'setLineColor': ln.selection === 's' ? sSetter(m, 'lineColor', payload) : fSetter (m, 'lineColor', payload); break
    case 'setBorderWidth': ln.selection === 's' ? sSetter(m, 'sBorderWidth', payload) : sSetter (m, 'fBorderWidth', payload); break
    case 'setBorderColor': ln.selection === 's' ? sSetter(m, 'sBorderColor', payload) : sSetter (m, 'fBorderColor', payload); break
    case 'setFillColor': ln.selection === 's' ? sSetter(m, 'sFillColor', payload) : sSetter (m, 'fFillColor', payload); break
    case 'setTextFontSize': ln.selection === 's' ? sSetter(m, 'textFontSize', payload) : fSetter (m, 'textFontSize', payload); break
    case 'setTextColor': ln.selection === 's' ? sSetter(m, 'textColor', payload) : fSetter (m, 'textColor', payload); break
    case 'clearLine': {
      ln.selection === 's' ? sSetter(m, 'lineWidth', nSaveOptional.lineWidth) : fSetter (m, 'lineWidth', nSaveOptional.lineWidth)
      ln.selection === 's' ? sSetter(m, 'lineType', nSaveOptional.lineType) : fSetter (m, 'lineType', nSaveOptional.lineType)
      ln.selection === 's' ? sSetter(m, 'lineColor', nSaveOptional.lineColor) : fSetter (m, 'lineColor', nSaveOptional.lineColor)
      break
    }
    case 'clearBorder': {
      ln.selection === 's' ? sSetter(m, 'sBorderWidth', nSaveOptional.sBorderWidth) : sSetter(m, 'fBorderWidth', nSaveOptional.sBorderWidth)
      ln.selection === 's' ? sSetter(m, 'sBorderColor', nSaveOptional.sBorderColor) : sSetter(m, 'fBorderColor', nSaveOptional.sBorderColor)
      break
    }
    case 'clearFill': {
      ln.selection === 's' ? sSetter(m, 'sFillColor', nSaveOptional.sFillColor) : sSetter(m, 'fFillColor', nSaveOptional.fFillColor)
      break
    }
    case 'clearText': {
      ln.selection === 's' ? sSetter(m, 'textColor', nSaveOptional.textColor) : fSetter(m, 'textColor', nSaveOptional.textColor)
      ln.selection === 's' ? sSetter(m, 'textFontSize', nSaveOptional.textFontSize) : fSetter(m, 'textFontSize', nSaveOptional.textFontSize)
      break
    }
  }

  // TODO mapFix
  mapInit(m)
  mapChain(m)
  mapCalcTask(m)
  mapExtractSelection(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(nodeSorter)
}
