import isEqual from "react-fast-compare"
import {Dir} from "../core/Enums"
import {transpose} from '../core/Utils'
import {structNavigate} from '../node/NodeNavigate'
import {nSaveOptional} from "../state/MapProps"
import {M, N} from "../state/MapPropTypes"
import {mapCalcTask} from "./MapCalcTask"
import {mapChain} from "./MapChain"
import {deleteSelectCC, deleteSelectCR, deleteSelectS} from "./MapDelete";
import {mapInit} from "./MapInit"
import {insertCCL, insertCCR, insertCRD, insertCRU, insertSelectSD, insertSelectSO, insertSelectSU, insertSelectTable} from "./MapInsert"
import {mapMeasure} from "./MapMeasure"
import {
  copyS, cutS,
  moveCCL,
  moveCCR,
  moveCRD,
  moveCRU,
  moveSB,
  moveSD,
  moveSI,
  moveSIL,
  moveSIR,
  moveSO,
  moveST,
  moveSU, pasteS
} from "./MapMove"
import {mapPlace} from "./MapPlace"
import {selectNode, selectNodeList, selectNodeToo} from "./MapSelect";
import {
  sortNode,
  sortPath,
  isR,
  isCH,
  isCV,
  getEditedNode,
  getG,
  getX,
  getXP,
  getNodeByPath,
  getParentNodeByPath,
  setPropXA,
  setPropXASF,
  getCXAR,
  getCXAL,
  getCXAD,
  getCXAU,
  getSXF,
  getSXL,
  getCXR,
  getCXL,
  getCXU,
  getCXD, getNodeById,
} from "./MapUtils"

export const mapReducer = (pm: M, action: string, payload: any) => {
  console.log('MAP_MUTATION: ' + action, payload)
  // TODO map type validity check here to prevent errors
  const m = structuredClone(pm).sort(sortPath)
  switch (action) {
    case 'LOAD': break
    case 'changeDensity': getG(m).density = getG(m).density === 'small' ? 'large' : 'small'; break
    case 'changeAlignment': getG(m).alignment = getG(m).alignment === 'centered' ? 'adaptive' : 'centered'; break
    case 'select_R': selectNode(m, ['r', 0], 's'); break // fixme - does NOT clean 'f' selection on root, neither all selection
    case 'select_S': { // will be oneliner once the mouse ops will be routed
      const n = getNodeByPath(m, payload.path)
      if (n.dCount || payload.selection === 's' || n.sCount && payload.selection === 'f') {
        const r0d0 = getNodeByPath(pm, ['r', 0, 'd', 0])
        const r0d1 = getNodeByPath(pm, ['r', 0, 'd', 1])
        let toPath = []
        if (!isR(payload.path) && isEqual(n.path, payload.path) || isR(payload.path) && payload.selection === 's') toPath = payload.path
        else if (isR(payload.path) && !r0d0.selected && payload.selection === 'f') toPath = ['r', 0, 'd', 0]
        else if (isR(payload.path) && r0d0.selected && !r0d1.selected && payload.selection === 'f') toPath =['r', 0, 'd', 1]
        console.log(payload.add)
        payload.add ? selectNodeToo(m, toPath, payload.selection) : selectNode(m, toPath, payload.selection)
        if (!n.dCount) {
          getParentNodeByPath(m, payload.path).lastSelectedChild = payload.path.at(-1)
        }
      }
      break
    }
    case 'select_all': selectNodeList(m, m.filter(n => n.content !== '').map(n => n.path), 's'); break
    case 'select_S_D': selectNode(m, structNavigate(m, getSXL(m).path, Dir.D), 's'); break
    case 'select_S_D_too': selectNodeToo(m, structNavigate(m, getSXL(m).path, Dir.D), 's'); break
    case 'select_S_U': selectNode(m, structNavigate(m, getSXF(m).path, Dir.U), 's'); break
    case 'select_S_U_too': selectNodeToo(m, structNavigate(m, getSXF(m).path, Dir.U), 's'); break
    case 'select_S_O': selectNode(m, structNavigate(m, getXP(m), Dir.O), 's'); break // todo use "ds" in WLKP, distinguish O and OR, and REMOVE structNavigate dependency
    case 'select_S_OR': selectNode(m, structNavigate(m, ['r', 0, 'd', 0], Dir.OR), 's'); break
    case 'select_S_OL': selectNode(m, structNavigate(m, ['r', 0, 'd', 1], Dir.OL), 's'); break
    case 'select_S_I': selectNode(m, structNavigate(m, getXP(m), Dir.I), 's'); break // todo use "ds" in WLKP, distinguish I and IR, and REMOVE structNavigate dependency
    case 'select_S_family_O': getX(m).selection = 'f'; break
    case 'select_S_family_OR': selectNode(m, ['r', 0, 'd', 0], 'f'); break
    case 'select_S_family_OL': selectNode(m, ['r', 0, 'd', 1], 'f'); break
    case 'select_S_F': selectNode(m, [...getXP(m), 's', 0], 's'); break
    case 'select_S_B': selectNode(m, getXP(m).slice(0, -3), 's'); break
    case 'select_C_R': selectNode(m, getCXR(m), 's'); break
    case 'select_C_L': selectNode(m, getCXL(m), 's'); break
    case 'select_C_D': selectNode(m, getCXD(m), 's'); break
    case 'select_C_U': selectNode(m, getCXU(m), 's'); break
    case 'select_C_F_firstRow': selectNode(m, structuredClone(getXP(m)).map((pi, i) => i === getXP(m).length -2 ? 0 : pi), 's'); break
    case 'select_C_F_firstCol': selectNode(m, structuredClone(getXP(m)).map((pi, i) => i === getXP(m).length -1 ? 0 : pi), 's'); break
    case 'select_C_FF': (getX(m).cRowCount || getX(m).cColCount) ? selectNode(m, [...getXP(m), 'c', 0, 0], 's') : () => {}; break // todo use things in WLKP and NO ternary
    case 'select_C_B': getXP(m).includes('c') ? selectNode(m, [...getXP(m).slice(0, getXP(m).lastIndexOf('c') + 3)], 's') : () => {}; break // todo use things in WLKP and NO ternary
    case 'select_CR_SAME': selectNodeList(m, m.filter(n => isCV(n.path, getXP(m))).map(n => n.path), 's'); break
    case 'select_CC_SAME': selectNodeList(m, m.filter(n => isCH(n.path, getXP(m))).map(n => n.path), 's'); break
    case 'select_CR_D': selectNodeList(m, getCXAD(m), 's'); break
    case 'select_CR_U': selectNodeList(m, getCXAU(m), 's'); break
    case 'select_CC_R': selectNodeList(m, getCXAR(m), 's'); break
    case 'select_CC_L': selectNodeList(m, getCXAL(m), 's'); break
    case 'select_dragged': selectNodeList(m, payload.nList.map((n: N) => n.path), 's'); break

    case 'insert_S_O': insertSelectSO(m, {}); break
    case 'insert_S_O_text': insertSelectSO(m, {contentType: 'text', content: payload.text}); break
    case 'insert_S_O_elink': insertSelectSO(m, {contentType: 'text', content: payload.text, linkType: 'external', link: payload.text}); break
    case 'insert_S_O_equation': insertSelectSO(m, {contentType: 'equation', content: payload.text}); break
    case 'insert_S_O_image': insertSelectSO(m, {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insert_S_O_table': insertSelectTable(m, payload.rowLen, payload.colLen); break
    case 'insert_S_D': insertSelectSD(m, {}); break
    case 'insert_S_U': insertSelectSU(m, {}); break
    case 'insert_CR_D': insertCRD(m); break
    case 'insert_CR_U': insertCRU(m); break
    case 'insert_CC_R': insertCCR(m); break
    case 'insert_CC_L': insertCCL(m); break

    case 'delete_S': deleteSelectS(m); break
    case 'delete_CR': deleteSelectCR(m); break
    case 'delete_CC': deleteSelectCC(m); break

    case 'move_S_D': moveSD(m); break
    case 'move_S_T': moveST(m); break
    case 'move_S_U': moveSU(m); break
    case 'move_S_B': moveSB(m); break
    case 'move_S_O': moveSO(m); break
    case 'move_S_I': moveSI(m); break
    case 'move_S_I_R': moveSIR(m); break
    case 'move_S_I_L': moveSIL(m); break
    case 'move_CR_D': moveCRD(m); break;
    case 'move_CR_U': moveCRU(m); break;
    case 'move_CC_R': moveCCR(m); break;
    case 'move_CC_L': moveCCL(m); break;

    case 'copySelection': copyS(m); break
    case 'cutSelection': cutS(m); break
    case 'insertNodesFromClipboard': pasteS(m, payload); break

    case 'move_dragged': {
      // nodeMoveMouse(m, sc, payload.moveTargetPath, payload.moveTargetIndex) // TODO insertPath will be EZ: [...moveTarget, s, moveTargetIndex] !!!
      break
    }

    case 'transpose': {
      // if (getX(m).cRowCount || getX(m).cColCount) {
      //   getX(m).c = transpose(getX(m).c)
      // }
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
      // mapSetProp.iterate(getX(m), { taskStatus: getX(m).taskStatus === 0 ? 1 : 0 }, true)
      break
    }
    case 'setTaskStatus': getNodeById(m, payload.nodeId).taskStatus = payload.taskStatus; break

    case 'startEditAppend': getX(m).contentType === 'equation' ? Object.assign(getX(m), { contentType: 'text' }) : () => {}; break
    case 'typeText': Object.assign(getX(m), { contentType: 'text', content: payload.content }); break
    case 'finishEdit': Object.assign(getEditedNode(m, payload.path), { contentType: payload.content.substring(0, 2) === '\\[' ? 'equation' : 'text', content: payload.content }); break

    case 'setLineWidth': getX(m).selection === 's' ? setPropXA(m, 'lineWidth', payload) : setPropXASF (m, 'lineWidth', payload); break
    case 'setLineType': getX(m).selection === 's' ? setPropXA(m, 'lineType', payload) : setPropXASF (m, 'lineType', payload); break
    case 'setLineColor': getX(m).selection === 's' ? setPropXA(m, 'lineColor', payload) : setPropXASF (m, 'lineColor', payload); break
    case 'setBorderWidth': getX(m).selection === 's' ? setPropXA(m, 'sBorderWidth', payload) : setPropXA (m, 'fBorderWidth', payload); break
    case 'setBorderColor': getX(m).selection === 's' ? setPropXA(m, 'sBorderColor', payload) : setPropXA (m, 'fBorderColor', payload); break
    case 'setFillColor': getX(m).selection === 's' ? setPropXA(m, 'sFillColor', payload) : setPropXA (m, 'fFillColor', payload); break
    case 'setTextFontSize': getX(m).selection === 's' ? setPropXA(m, 'textFontSize', payload) : setPropXASF (m, 'textFontSize', payload); break
    case 'setTextColor': getX(m).selection === 's' ? setPropXA(m, 'textColor', payload) : setPropXASF (m, 'textColor', payload); break
    case 'clearLine': {
      getX(m).selection === 's' ? setPropXA(m, 'lineWidth', nSaveOptional.lineWidth) : setPropXASF (m, 'lineWidth', nSaveOptional.lineWidth)
      getX(m).selection === 's' ? setPropXA(m, 'lineType', nSaveOptional.lineType) : setPropXASF (m, 'lineType', nSaveOptional.lineType)
      getX(m).selection === 's' ? setPropXA(m, 'lineColor', nSaveOptional.lineColor) : setPropXASF (m, 'lineColor', nSaveOptional.lineColor)
      break
    }
    case 'clearBorder': {
      getX(m).selection === 's' ? setPropXA(m, 'sBorderWidth', nSaveOptional.sBorderWidth) : setPropXA(m, 'fBorderWidth', nSaveOptional.sBorderWidth)
      getX(m).selection === 's' ? setPropXA(m, 'sBorderColor', nSaveOptional.sBorderColor) : setPropXA(m, 'fBorderColor', nSaveOptional.sBorderColor)
      break
    }
    case 'clearFill': {
      getX(m).selection === 's' ? setPropXA(m, 'sFillColor', nSaveOptional.sFillColor) : setPropXA(m, 'fFillColor', nSaveOptional.fFillColor)
      break
    }
    case 'clearText': {
      getX(m).selection === 's' ? setPropXA(m, 'textColor', nSaveOptional.textColor) : setPropXASF(m, 'textColor', nSaveOptional.textColor)
      getX(m).selection === 's' ? setPropXA(m, 'textFontSize', nSaveOptional.textFontSize) : setPropXASF(m, 'textFontSize', nSaveOptional.textFontSize)
      break
    }
  }

  // m.forEach(n => console.log(n.selected, n.path, n.content))

  // TODO mapFix
  mapInit(m)
  mapChain(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(sortNode)
}
