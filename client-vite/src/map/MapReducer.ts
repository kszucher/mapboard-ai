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
  get_CC_siblingCount,
  get_CR_siblingCount,
  getEditedNode,
  getG,
  getLS,
  getNodeByPath,
  getParentNodeByPath,
  getSelection,
  inc_pi_lim,
  is_CC,
  is_CR,
  is_R,
  setSelection,
  setSelectionFamily,
  sortNode,
  sortPath,
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

export const cellNavigateL = (m: M, p: P) => dec_pi_lim(p, p.length - 1, 0)
export const cellNavigateR = (m: M, p: P) => inc_pi_lim(p, p.length - 1, get_CR_siblingCount(m, p) - 1)
export const cellNavigateU = (m: M, p: P) => dec_pi_lim(p, p.length - 2, 0)
export const cellNavigateD = (m: M, p: P) => inc_pi_lim(p, p.length - 2, get_CC_siblingCount(m, p) - 1)

export const selectNode = (m: M, path: P, selection: 's' | 'f', add: boolean) => {
  m.forEach(n => Object.assign(n, n.path.length > 1 && isEqual(n.path, path) ? { selected: add ? getLS(m).selected + 1 : 1 , selection } : { selected: 0, selection: 's' }))
}

export const selectNodeList = (m: M, pList: P[], selection: 's' | 'f') => {
  m.forEach((n, i) => Object.assign(n, n.path.length > 1 && pList.map(p => p.join('')).includes(n.path.join('')) ? { selected: i, selection } : { selected: 0, selection: 's' }))
}

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
    case 'select_R': selectNode(m, ['r', 0], 's', false); break // fixme - does NOT clean 'f' selection on root, neither all selection
    case 'select_S': { // will be oneliner once the mouse ops will be routed
      const n = getNodeByPath(m, payload.path)
      if (n.dCount || payload.selection === 's' || n.sCount && payload.selection === 'f') {
        const r0d0 = getNodeByPath(pm, ['r', 0, 'd', 0])
        const r0d1 = getNodeByPath(pm, ['r', 0, 'd', 1])
        let toPath = []
        if (!is_R(payload.path) && isEqual(n.path, payload.path) || is_R(payload.path) && payload.selection === 's') toPath = payload.path
        else if (is_R(payload.path) && !r0d0.selected && payload.selection === 'f') toPath = ['r', 0, 'd', 0]
        else if (is_R(payload.path) && r0d0.selected && !r0d1.selected && payload.selection === 'f') toPath =['r', 0, 'd', 1]
        selectNode(m, toPath, payload.selection, payload.add)
        if (!n.dCount) {
          getParentNodeByPath(m, payload.path).lastSelectedChild = payload.path.at(-1)
        }
      }
      break
    }
    case 'select_all': selectNodeList(m, m.filter(n => n.content !== '').map(n => n.path), 's'); break // ok
    case 'select_S_I': selectNode(m, structNavigate(m, ls.path, Dir.I), 's', false); break // todo use "ds" in WLKP, distinguish I and IR, and REMOVE structNavigate dependency
    case 'select_S_O': selectNode(m, structNavigate(m, ls.path, Dir.O), 's', false); break // todo use "ds" in WLKP, distinguish O and OR, and REMOVE structNavigate dependency
    case 'select_S_OR': selectNode(m, structNavigate(m, ['r', 0, 'd', 0], Dir.OR), 's', false); break // ok
    case 'select_S_OL': selectNode(m, structNavigate(m, ['r', 0, 'd', 1], Dir.OL), 's', false); break // ok
    case 'select_S_U': selectNode(m, structNavigate(m, m.find(n => n.selected).path, Dir.U), 's', false); break // ok
    case 'select_S_U_too': selectNode(m, structNavigate(m, m.find(n => n.selected).path, Dir.U), 's', true); break // fixme
    case 'select_S_D': selectNode(m, structNavigate(m, m.findLast(n => n.selected).path, Dir.D), 's', false); break  // ok
    case 'select_S_D_too': selectNode(m, structNavigate(m, m.findLast(n => n.selected).path, Dir.D), 's', true); break // fixme
    case 'select_S_family_O': ls.selection = 'f'; break // ok
    case 'select_S_family_OR': selectNode(m, ['r', 0, 'd', 0], 'f', false); break // ok
    case 'select_S_family_OL': selectNode(m, ['r', 0, 'd', 1], 'f', false); break // ok
    case 'select_S_F': selectNode(m, [...ls.path, 's', 0], 's', false); break // ok
    case 'select_S_B': selectNode(m, ls.path.slice(0, -3), 's', false); break // ok
    case 'select_S_BB': selectNode(m, ls.path.slice(0, -5), 's', false); break // ok
    case 'select_C_R': selectNode(m, cellNavigateR(m, ls.path), 's', false); break // ok
    case 'select_C_L': selectNode(m, cellNavigateL(m, ls.path), 's', false); break // ok
    case 'select_C_U': selectNode(m, cellNavigateU(m, ls.path), 's', false); break // ok
    case 'select_C_D': selectNode(m, cellNavigateD(m, ls.path), 's', false); break // ok
    case 'select_C_F_firstRow': selectNode(m, structuredClone(ls.path).map((pi, i) => i === ls.path.length -2 ? 0 : pi), 's', false); break // ok
    case 'select_C_F_firstCol': selectNode(m, structuredClone(ls.path).map((pi, i) => i === ls.path.length -1 ? 0 : pi), 's', false); break // ok
    case 'select_C_FF': (ls.cRowCount || ls.cColCount) ? selectNode(m, [...ls.path, 'c', 0, 0], 's', false) : () => {}; break // todo use things in WLKP and NO ternary
    case 'select_C_B': ls.path.includes('c') ? selectNode(m, [...ls.path.slice(0, ls.path.lastIndexOf('c') + 3)], 's', false) : () => {}; break // todo use things in WLKP and NO ternary
    case 'select_CR_SAME': selectNodeList(m, m.filter(n => is_CR(n.path, ls.path)).map(n => n.path), 's'); break // ok
    case 'select_CC_SAME': selectNodeList(m, m.filter(n => is_CC(n.path, ls.path)).map(n => n.path), 's'); break // ok
    case 'select_CR_U': selectNodeList(m, getSelection(m).map(n => cellNavigateU(m, n.path)), 's'); break // ok
    case 'select_CR_D': selectNodeList(m, getSelection(m).map(n => cellNavigateD(m, n.path)), 's'); break // ok
    case 'select_CC_L': selectNodeList(m, getSelection(m).map(n => cellNavigateL(m, n.path)), 's'); break // ok
    case 'select_CC_R': selectNodeList(m, getSelection(m).map(n => cellNavigateR(m, n.path)), 's'); break // ok
    case 'select_dragged': selectNodeList(m, payload.nList.map(n => n.path), 's'); break
    // INSERT
    case 'insert_S_O': insert_select_S_O(m, {}); break
    case 'insert_S_O_text': insert_select_S_O(m, {contentType: 'text', content: payload.text}); break
    case 'insert_S_O_elink': insert_select_S_O(m, {contentType: 'text', content: payload.text, linkType: 'external', link: payload.text}); break
    case 'insert_S_O_equation': insert_select_S_O(m, {contentType: 'equation', content: payload.text}); break
    case 'insert_S_O_image': insert_select_S_O(m, {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insert_S_O_table': insert_select_table(m, payload.rowLen, payload.colLen); break
    case 'insert_S_U': insert_select_S_U(m, {}); break
    case 'insert_S_D': insert_select_S_D(m, {}); break
    case 'insert_CC_R': insert_CC_R(m); break
    case 'insert_CC_L': insert_CC_L(m); break
    case 'insert_CR_U': insert_CR_U(m); break
    case 'insert_CR_D': insert_CR_D(m); break

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
    case 'move_S_IOUD': { // break down to many scenarios, IR aka through, et cet BUT first we need a correct NODE NAVIGATE fun
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

  // m.forEach(n => console.log(n.path, n.content))

  // TODO mapFix
  mapInit(m)
  mapChain(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(sortNode)
}
