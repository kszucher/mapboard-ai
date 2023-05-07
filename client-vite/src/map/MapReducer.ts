import isEqual from "react-fast-compare"
import {Dir} from "../core/Enums"
import {transpose} from '../core/Utils'
import {structNavigate} from '../node/NodeNavigate'
import {nSaveOptional} from "../state/MapProps"
import {M, N} from "../state/MapPropTypes"
import {mapCalcTask} from "./MapCalcTask"
import {mapChain} from "./MapChain"
import {deleteReselectCC, deleteReselectCR, deleteReselectS,} from "./MapDelete";
import {mapInit} from "./MapInit"
import {insertCCL, insertCCR, insertCRD, insertCRU, insertSD, insertSO, insertSU, insertTable} from "./MapInsert"
import {mapMeasure} from "./MapMeasure"
import {copyS, cutS, moveCC, moveCR, moveS, pasteS} from "./MapMove"
import {mapPlace} from "./MapPlace"
import {selectNode, selectNodeList, selectNodeToo} from "./MapSelect";
import {sortNode, sortPath, isR, isCH, isCV, getEditedNode, getG, getX, getXP, getNodeByPath, getParentNodeByPath, setPropXA, setPropXASF, getCXAR, getCXAL, getCXAD, getCXAU, getSXF, getSXL, getCXR, getCXL, getCXU, getCXD, getNodeById, getSXI1, getCountSXAU, getSXAU1, getCountSXAD, getCountSXAU1O1, getCountSXI1U, getCountR0D1S, getCountR0D0S, getCountCXU, getCountCXL, getSXI2,} from "./MapUtils"

export const mapReducerAtomic = (m: M, action: string, payload: any) => {
  switch (action) {
    case 'LOAD': break
    case 'changeDensity': getG(m).density = getG(m).density === 'small' ? 'large' : 'small'; break
    case 'changeAlignment': getG(m).alignment = getG(m).alignment === 'centered' ? 'adaptive' : 'centered'; break
    case 'selectR': selectNode(m, ['r', 0], 's'); break // fixme - does NOT clean 'f' selection on root, neither all selection
    case 'selectS': { // will be oneliner once the mouse ops will be routed
      const pm = m
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
    case 'selectall': selectNodeList(m, m.filter(n => n.content !== '').map(n => n.path), 's'); break
    case 'selectSD': selectNode(m, structNavigate(m, getSXL(m).path, Dir.D), 's'); break
    case 'selectSDtoo': selectNodeToo(m, structNavigate(m, getSXL(m).path, Dir.D), 's'); break
    case 'selectSU': selectNode(m, structNavigate(m, getSXF(m).path, Dir.U), 's'); break
    case 'selectSUtoo': selectNodeToo(m, structNavigate(m, getSXF(m).path, Dir.U), 's'); break
    case 'selectSO': selectNode(m, structNavigate(m, getXP(m), Dir.O), 's'); break // todo use "ds" in WLKP, distinguish O and OR, and REMOVE structNavigate dependency
    case 'selectSOR': selectNode(m, structNavigate(m, ['r', 0, 'd', 0], Dir.OR), 's'); break
    case 'selectSOL': selectNode(m, structNavigate(m, ['r', 0, 'd', 1], Dir.OL), 's'); break
    case 'selectSI': selectNode(m, structNavigate(m, getXP(m), Dir.I), 's'); break // todo use "ds" in WLKP, distinguish I and IR, and REMOVE structNavigate dependency
    case 'selectSfamilyO': getX(m).selection = 'f'; break
    case 'selectSfamilyOR': selectNode(m, ['r', 0, 'd', 0], 'f'); break
    case 'selectSfamilyOL': selectNode(m, ['r', 0, 'd', 1], 'f'); break
    case 'selectSF': selectNode(m, [...getXP(m), 's', 0], 's'); break
    case 'selectSB': selectNode(m, getXP(m).slice(0, -3), 's'); break
    case 'selectCR': selectNode(m, getCXR(m), 's'); break
    case 'selectCL': selectNode(m, getCXL(m), 's'); break
    case 'selectCD': selectNode(m, getCXD(m), 's'); break
    case 'selectCU': selectNode(m, getCXU(m), 's'); break
    case 'selectCFfirstRow': selectNode(m, (getXP(m)).map((pi, i) => i === getXP(m).length -2 ? 0 : pi), 's'); break
    case 'selectCFfirstCol': selectNode(m, (getXP(m)).map((pi, i) => i === getXP(m).length -1 ? 0 : pi), 's'); break
    case 'selectCFF': (getX(m).cRowCount || getX(m).cColCount) ? selectNode(m, [...getXP(m), 'c', 0, 0], 's') : () => {}; break // todo use things in WLKP and NO ternary
    case 'selectCB': getXP(m).includes('c') ? selectNode(m, [...getXP(m).slice(0, getXP(m).lastIndexOf('c') + 3)], 's') : () => {}; break // todo use things in WLKP and NO ternary
    case 'selectCRSAME': selectNodeList(m, m.filter(n => isCV(n.path, getXP(m))).map(n => n.path), 's'); break
    case 'selectCCSAME': selectNodeList(m, m.filter(n => isCH(n.path, getXP(m))).map(n => n.path), 's'); break
    case 'selectCRD': selectNodeList(m, getCXAD(m), 's'); break
    case 'selectCRU': selectNodeList(m, getCXAU(m), 's'); break
    case 'selectCCR': selectNodeList(m, getCXAR(m), 's'); break
    case 'selectCCL': selectNodeList(m, getCXAL(m), 's'); break
    case 'selectdragged': payload.nList.length ? selectNodeList(m, payload.nList.map((n: N) => n.path), 's') : () => {}; break

    case 'insertSO': insertSO(m, {}); break
    case 'insertSOtext': insertSO(m, {contentType: 'text', content: payload.text}); break
    case 'insertSOelink': insertSO(m, {contentType: 'text', content: payload.text, linkType: 'external', link: payload.text}); break
    case 'insertSOequation': insertSO(m, {contentType: 'equation', content: payload.text}); break
    case 'insertSOimage': insertSO(m, {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insertSOtable': insertTable(m, payload.rowLen, payload.colLen); break
    case 'insertSD': insertSD(m, {}); break
    case 'insertSU': insertSU(m, {}); break
    case 'insertCRD': insertCRD(m); break
    case 'insertCRU': insertCRU(m); break
    case 'insertCCR': insertCCR(m); break
    case 'insertCCL': insertCCL(m); break

    case 'deleteS': deleteReselectS(m); break
    case 'deleteCR': deleteReselectCR(m); break
    case 'deleteCC': deleteReselectCC(m); break

    case 'moveSD': moveS(m, [...getSXI1(m), 's', getCountSXAU(m) + 1]); break
    case 'moveST': moveS(m, [...getSXI1(m), 's', 0]); break
    case 'moveSU': moveS(m, [...getSXI1(m), 's', getCountSXAU(m) - 1]); break
    case 'moveSB': moveS(m, [...getSXI1(m), 's', getCountSXAD(m)]); break
    case 'moveSO': moveS(m, [...getSXAU1(m), 's', getCountSXAU1O1(m)]); break
    case 'moveSI': moveS(m, [...getSXI2(m), 's', getCountSXI1U(m) + 1]); break
    case 'moveSIR': moveS(m, ['r', 0, 'd', 1, 's', getCountR0D1S(m)]); break
    case 'moveSIL': moveS(m, ['r', 0, 'd', 0, 's', getCountR0D0S(m)]); break
    case 'moveCRD': moveCR(m, [...getSXI1(m), 'c', getCountCXU(m) + 1, 0]); break
    case 'moveCRU': moveCR(m, [...getSXI1(m), 'c', getCountCXU(m) - 1, 0]); break
    case 'moveCCR': moveCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m) + 1]); break
    case 'moveCCL': moveCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m) - 1]); break

    case 'copySelection': copyS(m); break
    case 'cutSelection': cutS(m); break
    case 'insertNodesFromClipboard': pasteS(m, payload); break
    case 'movedragged': moveS(m, [...payload.moveTargetPath, 's', payload.moveTargetIndex]); break

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
      // mapSetProp.iterate(getX(m), { taskStatus: getX(m).taskStatus === 0 ? 1 : 0 }, true) // ez a 0-ból ami azt jelenti hogy no task csinál 1-et ami backlog
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
}

export const mapReducer = (pm: M, action: string, payload: any) => {
  console.log('MAP_MUTATION: ' + action, payload)
  // TODO map type validity check here to prevent errors
  const m = structuredClone(pm).sort(sortPath)
  mapReducerAtomic(m, action, payload)
  // m.forEach(n => console.log(n.selected, n.path, n.content))

  // TODO mapFix
  mapInit(m)
  mapChain(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(sortNode)
}
