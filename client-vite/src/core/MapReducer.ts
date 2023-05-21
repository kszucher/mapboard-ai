import isEqual from "react-fast-compare"
import {shortcutColors} from "../component/Colors"
import {Dir} from "../state/Enums"
import {transpose} from './Utils'
import {structNavigate} from './NodeNavigate'
import {nSaveOptional} from "../state/MapProps"
import {M, N} from "../state/MapPropTypes"
import {mapCalcTask} from "./MapCalcTask"
import {deleteReselectCC, deleteReselectCR, deleteReselectS,} from "./MapDelete";
import {mapInit} from "./MapInit"
import {insertCC, insertCR, insertS, insertSL, insertTable} from "./MapInsert"
import {mapMeasure} from "./MapMeasure"
import {copyS, cutS, moveCC, moveCR, moveS, pasteS} from "./MapMove"
import {mapPlace} from "./MapPlace"
import {selectNode, selectNodeList, selectNodeToo} from "./MapSelect";
import {sortNode, sortPath, isR, isCH, isCV, getEditedNode, getG, getX, getXP, getNodeByPath, getParentNodeByPath, setPropXA, setPropXASF, getCXAR, getCXAL, getCXAD, getCXAU, getCXR, getCXL, getCXU, getCXD, getNodeById, getSXI1, getCountSXAU, getCountSXO1, getSXAU1, getCountSXAD, getCountSXAU1O1, getCountSXI1U, getCountR0D1S, getCountR0D0S, getCountCXU, getCountCXL, getSXI2, getSXFP, getSXLP, getCountSS, getCountD, getSXSCYYS0,} from "./MapUtils"

export const mapReducerAtomic = (m: M, action: string, payload: any) => {
  switch (action) {
    case 'LOAD': break
    case 'changeDensity': getG(m).density = getG(m).density === 'small' ? 'large' : 'small'; break
    case 'changeAlignment': getG(m).alignment = getG(m).alignment === 'centered' ? 'adaptive' : 'centered'; break
    case 'selectR': selectNode(m, ['r', 0], 's'); break
    case 'selectS': {
      const pm = m
      const n = getNodeByPath(m, payload.path)
      if (getCountD(m, n.path) || payload.selection === 's' || getCountSS(m, n.path) && payload.selection === 'f') {
        const r0d0 = getNodeByPath(pm, ['r', 0, 'd', 0])
        const r0d1 = getNodeByPath(pm, ['r', 0, 'd', 1])
        let toPath = []
        if (!isR(payload.path) && isEqual(n.path, payload.path) || isR(payload.path) && payload.selection === 's')
          toPath = payload.path
        else if (isR(payload.path) && !r0d0.selected && payload.selection === 'f')
          toPath = ['r', 0, 'd', 0]
        else if (isR(payload.path) && r0d0.selected && !r0d1.selected && payload.selection === 'f')
          toPath =['r', 0, 'd', 1]
        payload.add ? selectNodeToo(m, toPath, payload.selection) : selectNode(m, toPath, payload.selection)
        if (!getCountD(m, n.path)) {
          getParentNodeByPath(m, payload.path).lastSelectedChild = payload.path.at(-1)
        }
      }
      break
    }
    case 'selectall': selectNodeList(m, m.filter(n => n.content !== '').map(n => n.path), 's'); break
    case 'selectSD': selectNode(m, structNavigate(m, getSXLP(m), Dir.D), 's'); break
    case 'selectSDtoo': selectNodeToo(m, structNavigate(m, getSXLP(m), Dir.D), 's'); break
    case 'selectSU': selectNode(m, structNavigate(m, getSXFP(m), Dir.U), 's'); break
    case 'selectSUtoo': selectNodeToo(m, structNavigate(m, getSXFP(m), Dir.U), 's'); break
    case 'selectSO': selectNode(m, structNavigate(m, getXP(m), Dir.O), 's'); break
    case 'selectSOR': selectNode(m, structNavigate(m, ['r', 0, 'd', 0], Dir.OR), 's'); break
    case 'selectSOL': selectNode(m, structNavigate(m, ['r', 0, 'd', 1], Dir.OL), 's'); break
    case 'selectSI': selectNode(m, structNavigate(m, getXP(m), Dir.I), 's'); break
    case 'selectSfamilyO': getX(m).selection = 'f'; break
    case 'selectSfamilyOR': selectNode(m, ['r', 0, 'd', 0], 'f'); break
    case 'selectSfamilyOL': selectNode(m, ['r', 0, 'd', 1], 'f'); break
    case 'selectSF': selectNode(m, [...getXP(m), 's', 0], 's'); break
    case 'selectSB': selectNode(m, getXP(m).slice(0, -3), 's'); break
    case 'selectCD': selectNode(m, getCXD(m), 's'); break
    case 'selectCU': selectNode(m, getCXU(m), 's'); break
    case 'selectCR': selectNode(m, getCXR(m), 's'); break
    case 'selectCL': selectNode(m, getCXL(m), 's'); break
    case 'selectCFfirstRow': selectNode(m, (getXP(m)).map((pi, i) => i === getXP(m).length -2 ? 0 : pi), 's'); break
    case 'selectCFfirstCol': selectNode(m, (getXP(m)).map((pi, i) => i === getXP(m).length -1 ? 0 : pi), 's'); break
    case 'selectCFF': selectNode(m, [...getXP(m), 'c', 0, 0], 's'); break
    case 'selectCB': selectNode(m, [...getXP(m).slice(0, getXP(m).lastIndexOf('c') + 3)], 's'); break
    case 'selectCRSAME': selectNodeList(m, m.filter(n => isCV(n.path, getXP(m))).map(n => n.path), 's'); break
    case 'selectCCSAME': selectNodeList(m, m.filter(n => isCH(n.path, getXP(m))).map(n => n.path), 's'); break
    case 'selectCRD': selectNodeList(m, getCXAD(m), 's'); break
    case 'selectCRU': selectNodeList(m, getCXAU(m), 's'); break
    case 'selectCCR': selectNodeList(m, getCXAR(m), 's'); break
    case 'selectCCL': selectNodeList(m, getCXAL(m), 's'); break
    case 'selectDragged': payload.nList.length ? selectNodeList(m, payload.nList.map((n: N) => n.path), 's') : () => {}; break

    case 'insertSD': insertS(m, [...getSXI1(m), 's', getCountSXAU(m) + 1], payload); break
    case 'insertSU': insertS(m, [...getXP(m)], payload); break
    case 'insertSOR': insertS(m, ['r', 0, 'd', 0, 's', getCountR0D0S(m)], payload); break
    case 'insertSO': insertS(m, [...getXP(m), 's', getCountSXO1(m)], payload); break
    case 'insertSLOR': insertSL(m, ['r', 0, 'd', 0, 's', getCountR0D0S(m)], payload); break
    case 'insertSLO': insertSL(m, [...getXP(m), 's', getCountSXO1(m)], payload); break
    case 'insertSORTable': insertTable(m, ['r', 0, 'd', 0, 's', getCountR0D0S(m)], payload); break
    case 'insertSOTable': insertTable(m, [...getXP(m), 's', getCountSXO1(m)], payload); break
    case 'insertCRD': insertCR(m, [...getSXI1(m), 'c', getCountCXU(m) + 1, 0]); break
    case 'insertCRU': insertCR(m, [...getSXI1(m), 'c', getCountCXU(m), 0]); break // what
    case 'insertCCR': insertCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m) + 1]); break
    case 'insertCCL': insertCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m)]); break

    case 'deleteS': deleteReselectS(m); break
    case 'deleteCR': deleteReselectCR(m); break
    case 'deleteCC': deleteReselectCC(m); break

    case 'moveSD': moveS(m, getSXI1(m), getCountSXAU(m) + 1); break
    case 'moveST': moveS(m, getSXI1(m), 0); break
    case 'moveSU': moveS(m, getSXI1(m), getCountSXAU(m) - 1); break
    case 'moveSB': moveS(m, getSXI1(m), getCountSXAD(m)); break
    case 'moveSO': moveS(m, getSXAU1(m), getCountSXAU1O1(m)); break
    case 'moveSI': moveS(m, getSXI2(m), getCountSXI1U(m) + 1); break
    case 'moveSIR': moveS(m, ['r', 0, 'd', 1], getCountR0D1S(m)); break
    case 'moveSIL': moveS(m, ['r', 0, 'd', 0], getCountR0D0S(m)); break
    case 'moveCRD': moveCR(m, [...getSXI1(m), 'c', getCountCXU(m) + 1, 0]); break
    case 'moveCRU': moveCR(m, [...getSXI1(m), 'c', getCountCXU(m) - 1, 0]); break
    case 'moveCCR': moveCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m) + 1]); break
    case 'moveCCL': moveCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m) - 1]); break

    case 'copySelection': copyS(m); break
    case 'cutSelection': cutS(m); break
    case 'insertNodesFromClipboard': pasteS(m, payload); break
    case 'drag': moveS(m, payload.moveTargetPath, payload.moveTargetIndex); break

    case 'transpose': {
      // https://stackoverflow.com/questions/872310/javascript-swap-array-elements
      // make swap as a utility, and then just simply map through component

      // if (getX(m).cRowCount || getX(m).cColCount) {
      //   getX(m).c = transpose(getX(m).c)
      // }
      break
    }

    case 'cellify': {
      // we do an insertSelectSO table here... and will take the clipboard items and assigning them SAW-like, but how so???
      // valahogy a foreach-ben le lehetne másolni a másolt kontent tartalmának sX részét, ahol cX0sX kialakítás lesz tehát adott sorba adott cuccot

      // if (!sc.isRootIncluded && sc.haveSameParent) {
      //   structMove(m, 'struct2cell')
      //   clearSelection(m)
      //   getMapData(m, [...sc.geomHighPath, 'c', 0, 0]).selected = 1
      // }
      break
    }

    case 'fillTable': {
      getSXSCYYS0(m).forEach(n => Object.assign(n, {content: payload.gptSuggestionsParsed[n.path.at(-4) as number][n.path.at(-3) as number]}))
      break
    }

    case 'applyColorFromKey': setPropXA(m, 'textColor', shortcutColors[payload.currColor]); break

    case 'toggleTask': setPropXASF(m, 'taskStatus', getX(m).taskStatus === 0 ? 1 : 0); break
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
}

export const mapReducer = (pm: M, action: string, payload: any) => {
  console.log('MAP_MUTATION: ' + action, payload)
  // TODO map validity check
  const m = structuredClone(pm).sort(sortPath)
  mapReducerAtomic(m, action, payload)
  mapInit(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(sortNode)
}
