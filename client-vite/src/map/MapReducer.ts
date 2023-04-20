import {Dir} from "../core/Enums"
import {M, N, P} from "../state/MapPropTypes"
import {mapInit} from "./MapInit"
import {mapChain} from "./MapChain"
import {mapCalcTask} from "./MapCalcTask"
import {mapMeasure} from "./MapMeasure"
import {mapPlace} from "./MapPlace"
import isEqual from "react-fast-compare"
import {transpose} from '../core/Utils'
import {structNavigate} from '../node/NodeNavigate'
import {
  dec_pi_lim,
  getCount_CC,
  getCount_CR,
  getEditedNode,
  get_G,
  get_LS,
  getNodeByPath,
  getParentNodeByPath,
  getSelection,
  inc_pi_lim,
  is_same_CC,
  is_same_CR,
  is_R,
  setSelection,
  setSelectionFamily,
  sortNode,
  sortPath,
  getClosestStructParentPath,
  getCount_S_U,
  get_S_U1,
  dec_pi_n,
  getParentPathList,
  is_S_D, is_S_S_O, getNodeById, is_G,
} from "./MapUtils"
import {nSaveOptional} from "../state/MapProps"
import {
  insert_CC_L,
  insert_CC_R,
  insert_CR_D,
  insert_CR_U,
  insert_select_S_D,
  insert_select_S_O,
  insert_select_S_U,
  insert_select_table
} from "./MapInsert"

export const cellNavigateR = (m: M, p: P) => inc_pi_lim(p, p.length - 1, getCount_CR(m, p) - 1)
export const cellNavigateL = (m: M, p: P) => dec_pi_lim(p, p.length - 1, 0)
export const cellNavigateD = (m: M, p: P) => inc_pi_lim(p, p.length - 2, getCount_CC(m, p) - 1)
export const cellNavigateU = (m: M, p: P) => dec_pi_lim(p, p.length - 2, 0)

export const selectNode = (m: M, path: P, selection: 's' | 'f') => {
  m.forEach(n => Object.assign(n, n.path.length > 1 && isEqual(n.path, path)
    ? { selected: 1, selection }
    : { selected: 0, selection: 's' }
  ))
}

export const selectNodeToo = (m: M, path: P, selection: 's' | 'f') => {
  m.forEach(n => Object.assign(n, n.path.length > 1 && isEqual(n.path, path)
    ? { selected: get_LS(m).selected + 1 , selection }
    : { }
  ))
}

export const selectNodeList = (m: M, pList: P[], selection: 's' | 'f') => {
  m.forEach((n, i) => Object.assign(n, n.path.length > 1 && pList.map(p => p.join('')).includes(n.path.join(''))
    ? { selected: i, selection }
    : { selected: 0, selection: 's' }
  ))
}

const deleteNode = () => {

}

const xm = [
  {selected: 0, nodeId: 'a', path: ['g']},
  {selected: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, nodeId: 'd', path: ['r', 0, 'd', 0]},
  {selected: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
  {selected: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 1]},
  {selected: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 2]},
  {selected: 2, nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 0]},
  {selected: 0, nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 1]},
  {selected: 0, nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 2]},
  {selected: 0, nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 3, nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 0]},
  {selected: 4, nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 1]},
  {selected: 0, nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 2]},
] as M

const xmexpected = [
  {selected: 0, nodeId: 'a', path: ['g']},
  {selected: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
] as M

const deleteSelection = (m: M) => {
  const reselectPath = getCount_S_U(m, get_LS(m).path)
    ? get_S_U1(m, get_LS(m).path).path
    : getClosestStructParentPath(get_LS(m).path)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const pathList = [...getParentPathList(n.path), n.path]
    pathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    pathList.forEach(p => n.path = dec_pi_n(n.path, p.length - 1, m.filter(n => n.selected && is_S_D(n.path, p)).length))
  }
  selectNode(m, reselectPath, 's')
}

export const mapReducer = (pm: M, action: string, payload: any) => {
  console.log('MAP_MUTATION: ' + action, payload)
  // TODO map type validity check here to prevent errors
  const m = structuredClone(pm).sort(sortPath)
  const g = get_G(m)
  const ls = action === 'LOAD' ? null as N : get_LS(m)
  switch (action) {
    case 'LOAD': break
    case 'changeDensity': g.density = g.density === 'small' ? 'large' : 'small'; break
    case 'changeAlignment': g.alignment = g.alignment === 'centered' ? 'adaptive' : 'centered'; break
    case 'select_R': selectNode(m, ['r', 0], 's'); break // fixme - does NOT clean 'f' selection on root, neither all selection
    case 'select_S': { // will be oneliner once the mouse ops will be routed
      const n = getNodeByPath(m, payload.path)
      if (n.dCount || payload.selection === 's' || n.sCount && payload.selection === 'f') {
        const r0d0 = getNodeByPath(pm, ['r', 0, 'd', 0])
        const r0d1 = getNodeByPath(pm, ['r', 0, 'd', 1])
        let toPath = []
        if (!is_R(payload.path) && isEqual(n.path, payload.path) || is_R(payload.path) && payload.selection === 's') toPath = payload.path
        else if (is_R(payload.path) && !r0d0.selected && payload.selection === 'f') toPath = ['r', 0, 'd', 0]
        else if (is_R(payload.path) && r0d0.selected && !r0d1.selected && payload.selection === 'f') toPath =['r', 0, 'd', 1]
        console.log(payload.add)
        payload.add ? selectNodeToo(m, toPath, payload.selection) : selectNode(m, toPath, payload.selection)
        if (!n.dCount) {
          getParentNodeByPath(m, payload.path).lastSelectedChild = payload.path.at(-1)
        }
      }
      break
    }
    case 'select_all': selectNodeList(m, m.filter(n => n.content !== '').map(n => n.path), 's'); break // ok
    case 'select_S_O': selectNode(m, structNavigate(m, ls.path, Dir.O), 's'); break // todo use "ds" in WLKP, distinguish O and OR, and REMOVE structNavigate dependency
    case 'select_S_OR': selectNode(m, structNavigate(m, ['r', 0, 'd', 0], Dir.OR), 's'); break // ok
    case 'select_S_OL': selectNode(m, structNavigate(m, ['r', 0, 'd', 1], Dir.OL), 's'); break // ok
    case 'select_S_I': selectNode(m, structNavigate(m, ls.path, Dir.I), 's'); break // todo use "ds" in WLKP, distinguish I and IR, and REMOVE structNavigate dependency
    case 'select_S_D': selectNode(m, structNavigate(m, m.findLast(n => n.selected).path, Dir.D), 's'); break  // ok
    case 'select_S_D_too': selectNodeToo(m, structNavigate(m, m.findLast(n => n.selected).path, Dir.D), 's'); break // ok
    case 'select_S_U': selectNode(m, structNavigate(m, m.find(n => n.selected).path, Dir.U), 's'); break // ok
    case 'select_S_U_too': selectNodeToo(m, structNavigate(m, m.find(n => n.selected).path, Dir.U), 's'); break // ok
    case 'select_S_family_O': ls.selection = 'f'; break // ok
    case 'select_S_family_OR': selectNode(m, ['r', 0, 'd', 0], 'f'); break // ok
    case 'select_S_family_OL': selectNode(m, ['r', 0, 'd', 1], 'f'); break // ok
    case 'select_S_F': selectNode(m, [...ls.path, 's', 0], 's'); break // ok
    case 'select_S_B': selectNode(m, ls.path.slice(0, -3), 's'); break // ok
    case 'select_S_BB': selectNode(m, ls.path.slice(0, -5), 's'); break // ok
    case 'select_C_R': selectNode(m, cellNavigateR(m, ls.path), 's'); break // ok
    case 'select_C_L': selectNode(m, cellNavigateL(m, ls.path), 's'); break // ok
    case 'select_C_D': selectNode(m, cellNavigateD(m, ls.path), 's'); break // ok
    case 'select_C_U': selectNode(m, cellNavigateU(m, ls.path), 's'); break // ok
    case 'select_C_F_firstRow': selectNode(m, structuredClone(ls.path).map((pi, i) => i === ls.path.length -2 ? 0 : pi), 's'); break // ok
    case 'select_C_F_firstCol': selectNode(m, structuredClone(ls.path).map((pi, i) => i === ls.path.length -1 ? 0 : pi), 's'); break // ok
    case 'select_C_FF': (ls.cRowCount || ls.cColCount) ? selectNode(m, [...ls.path, 'c', 0, 0], 's') : () => {}; break // todo use things in WLKP and NO ternary
    case 'select_C_B': ls.path.includes('c') ? selectNode(m, [...ls.path.slice(0, ls.path.lastIndexOf('c') + 3)], 's') : () => {}; break // todo use things in WLKP and NO ternary
    case 'select_CR_SAME': selectNodeList(m, m.filter(n => is_same_CR(n.path, ls.path)).map(n => n.path), 's'); break // ok
    case 'select_CC_SAME': selectNodeList(m, m.filter(n => is_same_CC(n.path, ls.path)).map(n => n.path), 's'); break // ok
    case 'select_CC_R': selectNodeList(m, getSelection(m).map(n => cellNavigateR(m, n.path)), 's'); break // ok
    case 'select_CC_L': selectNodeList(m, getSelection(m).map(n => cellNavigateL(m, n.path)), 's'); break // ok
    case 'select_CR_D': selectNodeList(m, getSelection(m).map(n => cellNavigateD(m, n.path)), 's'); break // ok
    case 'select_CR_U': selectNodeList(m, getSelection(m).map(n => cellNavigateU(m, n.path)), 's'); break // ok
    case 'select_dragged': selectNodeList(m, payload.nList.map(n => n.path), 's'); break

    case 'insert_S_O': insert_select_S_O(m, {}); break
    case 'insert_S_O_text': insert_select_S_O(m, {contentType: 'text', content: payload.text}); break
    case 'insert_S_O_elink': insert_select_S_O(m, {contentType: 'text', content: payload.text, linkType: 'external', link: payload.text}); break
    case 'insert_S_O_equation': insert_select_S_O(m, {contentType: 'equation', content: payload.text}); break
    case 'insert_S_O_image': insert_select_S_O(m, {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insert_S_O_table': insert_select_table(m, payload.rowLen, payload.colLen); break
    case 'insert_S_D': insert_select_S_D(m, {}); break
    case 'insert_S_U': insert_select_S_U(m, {}); break
    case 'insert_CC_R': insert_CC_R(m); break
    case 'insert_CC_L': insert_CC_L(m); break
    case 'insert_CR_D': insert_CR_D(m); break
    case 'insert_CR_U': insert_CR_U(m); break

    case 'insertNodesFromClipboard': {
      // clearSelection(m)
      // const nodeList = JSON.parse(payload.text)
      // for (let i = 0; i < nodeList.length; i++) {
      //   mapSetProp.iterate(nodeList[i], () => ({ nodeId: 'node' + genHash(8) }), true)
      //   structCreate(m, ls, Dir.O, { ...nodeList[i] })
      // }
      break
    }

    case 'delete_S': deleteSelection(m); break
    case 'delete_CR': break

    case 'move_S_O': break // only for siblings
    case 'move_S_I': break // only for siblings
    case 'move_S_D': break // only for siblings
    case 'move_S_U': break // only for siblings
    case 'move_CR_D': break;
    case 'move_CR_U': break;
    case 'move_CC_O': break;
    case 'move_CC_I': break;

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
    case 'startEditAppend': get_LS(m).contentType === 'equation' ? Object.assign(get_LS(m), { contentType: 'text' }) : () => {}; break
    case 'typeText': Object.assign(get_LS(m), { contentType: 'text', content: payload.content }); break
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

  // m.forEach(n => console.log(n.path, n.content))

  // TODO mapFix
  mapInit(m)
  mapChain(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(sortNode)
}
