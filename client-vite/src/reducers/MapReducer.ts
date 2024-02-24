import {getCountXASU1O1, getCountXCL, getCountXCU, getCountXSCH, getCountXSCV, getCountXSI1U, getG, getLastSO, getNodeById, getNodeByPath, getQuasiSD, getQuasiSU, getX, getXA, getXAEO, getXFSU1, getXSCO, getXSI1, getXSI2, getXSO1, mR, sortNode, sortPath, mS, mC, getXR, getXC, getLCS, getRCS, getDCS, getUCS, getXS, getXFS, getXLS, getXAC,} from "../queries/MapQueries.ts"
import {ControlType, Flow} from "../state/Enums"
import {sSaveOptional} from "../state/MapState"
import {C, M, PC, PR, PS, PT, R, S} from "../state/MapStateTypes"
import {mapCalcTask} from "./MapCalcTask"
import {deleteCC, deleteCR, deleteL, deleteLR, deleteS,} from "./MapDelete"
import {mapInit} from "./MapInit"
import {insertCC, insertCR, insertL, insertR, insertS, insertTable} from "./MapInsert"
import {mapMeasure} from "./MapMeasure"
import {copyLR, copyS, cutLR, duplicateR, duplicateS, moveCC, moveCR, moveS, moveS2T, pasteLR, pasteS, cutS} from "./MapMove"
import {gptParseNodeMermaid, gptParseNodesS, gptParseNodesT} from "./MapParseGpt"
import {mapPlaceIndented} from "./MapPlaceIndented.ts"
import {MR} from "./MapReducerEnum.ts"
import {selectAddT, selectC, selectR, selectRemoveT, selectS, selectT, selectTL, unselectNodes} from "./MapSelect"
import {mapChain} from "./MapChain.ts"
import {mapPlaceExploded} from "./MapPlaceExploded.ts"
import {mapCalcOrientation} from "./MapCalcOrientation.ts"

export const mapReducerAtomic = (m: M, action: MR, payload?: any) => {
  switch (action) {
    case 'load': break

    case 'setDensitySmall': getG(m).density = 'small'; break
    case 'setDensityLarge': getG(m).density = 'large'; break
    case 'setPlaceTypeExploded': getG(m).flow = Flow.EXPLODED; break
    case 'setPlaceTypeIndented': getG(m).flow = Flow.INDENTED; break

    case 'unselect': unselectNodes(m); break
    case 'selectR': selectR(m, getNodeByPath(m, payload.path) as R); break
    case 'selectS': selectS(m, getNodeByPath(m, payload.path) as S, 's'); break
    case 'selectC': selectC(m, getNodeByPath(m, payload.path) as C); break
    case 'selectFirstR': selectR(m, mR(m).at(0)!); break
    case 'selectFirstS': selectS(m, mS(m).at(0)!, 's'); break
    case 'selectFirstC': selectC(m, mC(m).at(0)!); break
    case 'selectXR': selectR(m, getNodeByPath(m, getX(m).path.slice(0, 2) as PR) as R); break
    case 'selectXS': selectS(m, getNodeByPath(m, getX(m).path.slice(0, 2).concat('s', 0) as PS) as S, 's'); break
    case 'selectSelfX': selectS(m, getXS(m), 's'); break
    case 'selectFamilyX': selectS(m, getXS(m), 'f'); break
    case 'selectSD': selectS(m, getQuasiSD(m) as S, 's'); break
    case 'selectSU': selectS(m, getQuasiSU(m) as S, 's'); break
    case 'selectSO': selectS(m, getLastSO(m) as S, 's'); break
    case 'selectSI': selectS(m, getNodeById(m, getXS(m).si1) as S, 's'); break
    case 'selectSF': selectS(m, getNodeByPath(m, getX(m).path.concat('s', 0) as PS) as S, 's'); break
    case 'selectLCS': selectS(m, getLCS(m), 's'); break
    case 'selectRCS': selectS(m, getRCS(m), 's'); break
    case 'selectDCS': selectS(m, getDCS(m), 's'); break
    case 'selectUCS': selectS(m, getUCS(m), 's'); break
    case 'selectCFR0': selectT(m, getNodeByPath(m, getX(m).path.with(-2, 0) as PT), 's'); break
    case 'selectCFC0': selectT(m, getNodeByPath(m, getX(m).path.with(-1, 0) as PT), 's'); break
    case 'selectCFF': selectT(m, getNodeByPath(m, getX(m).path.concat('c', 0, 0) as PT), 's'); break
    case 'selectXCIS': selectS(m, getNodeByPath(m, getX(m).path.slice(0, -3) as PT) as S, 's'); break
    case 'selectXSIC': selectC(m, getNodeByPath(m, getX(m).path.slice(0, getX(m).path.findLastIndex(pi => pi === 'c') + 3) as PC) as C); break
    case 'selectAddT': selectAddT(m, getNodeByPath(m, payload.path), 's'); break
    case 'selectRemoveT': selectRemoveT(getNodeByPath(m, payload.path)); break
    case 'selectAddSD': selectAddT(m, getQuasiSD(m), 's'); break
    case 'selectAddSU': selectAddT(m, getQuasiSU(m), 's'); break
    case 'selectRA': selectTL(m, mR(m), 's'); break
    case 'selectSA': selectTL(m, mS(m), 's'); break
    case 'selectSameCR': selectTL(m, getXC(m).ch.map(nid => getNodeById(m, nid)), 's'); break
    case 'selectSameCC': selectTL(m, getXC(m).cv.map(nid => getNodeById(m, nid)), 's'); break
    case 'selectCD': selectTL(m, getXA(m).map(ci => getNodeByPath(m, ci.path.with(-2, ci.path.at(-2) + 1) as PT)), 's'); break
    case 'selectCU': selectTL(m, getXA(m).map(ci => getNodeByPath(m, ci.path.with(-2, ci.path.at(-2) - 1) as PT)), 's'); break
    case 'selectCR': selectTL(m, getXA(m).map(ci => getNodeByPath(m, ci.path.with(-1, ci.path.at(-1) + 1) as PT)), 's'); break
    case 'selectCL': selectTL(m, getXA(m).map(ci => getNodeByPath(m, ci.path.with(-1, ci.path.at(-1) - 1) as PT)), 's'); break
    case 'selectSByRectangle': selectTL(m, payload.pathList.map((p: PT) => getNodeByPath(m, p)), 's'); break

    case 'insertL': insertL(m, payload); break
    case 'insertR': insertR(m); break
    case 'insertSD': insertS(m, getXSI1(m), getXFS(m).su.length + 1, payload); break
    case 'insertSU': insertS(m, getXSI1(m), getX(m).path.at(-1), payload); break
    case 'insertSO': insertS(m, getX(m), getX(m).so1.length, payload); break
    case 'insertSOText': insertS(m, getX(m), getX(m).so1.length, { contentType: 'text', content: payload }); break
    case 'insertSOLink': insertS(m, getX(m), getX(m).so1.length, { contentType: 'text', content: payload, linkType: 'external', link: payload }); break
    case 'insertSOImage': insertS(m, getX(m), getX(m).so1.length, { contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height }); break
    case 'insertCRD': insertCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case 'insertCRU': insertCR(m, getXSI1(m), getCountXCU(m)); break
    case 'insertSCRD': insertCR(m, getX(m), getCountXSCV(m)); break
    case 'insertSCRU': insertCR(m, getX(m), 0); break
    case 'insertCCR': insertCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case 'insertCCL': insertCC(m, getXSI1(m), getCountXCL(m)); break
    case 'insertSCCR': insertCC(m, getX(m), getCountXSCH(m)); break
    case 'insertSCCL': insertCC(m, getX(m), 0); break
    case 'insertSDTable': insertTable(m, getXSI1(m), getXS(m).su.length + 1, payload); break
    case 'insertSUTable': insertTable(m, getXSI1(m), getXS(m).su.length, payload); break
    case 'insertSOTable': insertTable(m, getX(m), getX(m).so1.length, payload); break

    case 'gptParseNodesS': gptParseNodesS(m, payload.gptParsed); break
    case 'gptParseNodesT': gptParseNodesT(m, payload.gptParsed); break
    case 'gptParseNodeMermaid': gptParseNodeMermaid(m, payload.gptParsed); break

    case 'deleteL': deleteL(m, payload); break
    case 'deleteLR': { const reselect = mR(m).find(ri => !ri.selected)!.nodeId; deleteLR(m); selectT(m, getNodeById(m, reselect), 's'); break }
    case 'deleteSJumpSU': { const reselect = getXFS(m).su.at(-1) as string; deleteS(m); selectS(m, getNodeById(m, reselect) as S, 's'); break }
    case 'deleteSJumpSD': { const reselect = getXLS(m).sd.at(-1) as string; deleteS(m); selectS(m, getNodeById(m, reselect) as S, 's'); break }
    case 'deleteSJumpSI': { const reselect = getXS(m).si1; deleteS(m); selectS(m, getNodeById(m, reselect) as S, 's'); break }
    case 'deleteCRJumpU': { const reselectList = getXAC(m).map(ci => ci.cu.at(-1) as string); deleteCR(m); selectTL(m, reselectList.map(nid => getNodeById(m, nid)), 's'); break }
    case 'deleteCRJumpD': { const reselectList = getXAC(m).map(ci => ci.cd.at(-1) as string); deleteCR(m); selectTL(m, reselectList.map(nid => getNodeById(m, nid)), 's'); break }
    case 'deleteCRJumpSI': { const reselect = getXC(m).si1; deleteCR(m); selectS(m, getNodeById(m, reselect) as S, 's'); break }
    case 'deleteCCJumpL': { const reselectList = getXAC(m).map(ci => ci.cl.at(-1) as string); deleteCC(m); selectTL(m, reselectList.map(nid => getNodeById(m, nid)), 's'); break }
    case 'deleteCCJumpR': { const reselectList = getXAC(m).map(ci => ci.cr.at(-1) as string); deleteCC(m); selectTL(m, reselectList.map(nid => getNodeById(m, nid)), 's'); break }
    case 'deleteCCJumpSI': { const reselect = getXC(m).si1; deleteCC(m); selectS(m, getNodeById(m, reselect) as S, 's'); break }
    case 'cutLR': { const reselect = mR(m).find(ri => !ri.selected)!.nodeId; cutLR(m); selectR(m, getNodeById(m, reselect) as R); break }
    case 'cutSJumpRI': { const reselect = getXS(m).si1; cutS(m); selectR(m, getNodeById(m, reselect) as R); break }
    case 'cutSJumpSU': { const reselect = getXFS(m).su.at(-1) as string; cutS(m); selectS(m, getNodeById(m, reselect) as S, 's'); break }
    case 'cutSJumpSD': { const reselect = getXLS(m).sd.at(-1) as string; cutS(m); selectS(m, getNodeById(m, reselect) as S, 's'); break }
    case 'cutSJumpSI': { const reselect = getXS(m).si1; cutS(m); selectS(m, getNodeById(m, reselect) as S, 's'); break }
    case 'cutSJumpCI': { const reselect = getXS(m).si1; cutS(m); selectC(m, getNodeById(m, reselect) as C); break }
    case 'copyLR': copyLR(m); break
    case 'copyS': copyS(m); break
    case 'pasteLR': pasteLR(m, payload); break
    case 'pasteSO': pasteS(m, getX(m), getX(m).so1.length, payload); break
    case 'duplicateR': duplicateR(m); break;
    case 'duplicateS': duplicateS(m); break;
    case 'moveSD': moveS(m, getXSI1(m), getXFS(m).su.length + 1); break
    case 'moveST': moveS(m, getXSI1(m), 0); break
    case 'moveSU': moveS(m, getXSI1(m), getXFS(m).su.length - 1); break
    case 'moveSB': moveS(m, getXSI1(m), getXLS(m).sd.length); break
    case 'moveSO': moveS(m, getXFSU1(m), getCountXASU1O1(m)); break
    case 'moveSI': moveS(m, getXSI2(m), getCountXSI1U(m) + 1); break
    case 'moveSByDrag': moveS(m, getNodeById(m, payload.moveInsertParentNodeId), payload.moveTargetIndex); break
    case 'moveCRD': moveCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case 'moveCRU': moveCR(m, getXSI1(m), getCountXCU(m) - 1); break
    case 'moveCCR': moveCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case 'moveCCL': moveCC(m, getXSI1(m), getCountXCL(m) - 1); break
    case 'moveS2TO': moveS2T(m, getX(m), getXSO1(m)); break
    case 'transpose': getXSCO(m).forEach(ti => ti.path = [...ti.path.slice(0, getX(m).path.length + 1), ti.path.at(getX(m).path.length + 2), ti.path.at(getX(m).path.length + 1), ...ti.path.slice(getX(m).path.length + 3)] as PT); break

    case 'setTaskStatus': Object.assign(getNodeById(m, payload.nodeId), { taskStatus: payload.taskStatus }); break
    case 'setContentText': Object.assign(getX(m), { contentType: 'text', content: payload.content }); break
    case 'setContentEquation': Object.assign(getX(m), { contentType: 'equation', content: payload.content }); break
    case 'setContentMermaid': Object.assign(getX(m), { contentType: 'mermaid', content: payload.content }); break
    case 'setControlTypeNone': Object.assign(getX(m), { controlType: ControlType.NONE }); break
    case 'setControlTypeIngestion': Object.assign(getX(m), { controlType: ControlType.INGESTION }); break
    case 'setControlTypeExtraction': Object.assign(getX(m), { controlType: ControlType.EXTRACTION }); break
    case 'offsetD': Object.assign(getX(m), { offsetH: getXR(m).offsetH += 20 }); break
    case 'offsetU': Object.assign(getX(m), { offsetH: getXR(m).offsetH -= 20 }); break
    case 'offsetR': Object.assign(getX(m), { offsetW: getXR(m).offsetW += 20 }); break
    case 'offsetL': Object.assign(getX(m), { offsetW: getXR(m).offsetW -= 20 }); break
    case 'offsetRByDrag': Object.assign(getX(m), { offsetW: payload.toX, offsetH: payload.toY }); break
    case 'setLineWidth': getXA(m).forEach(ti => Object.assign(ti, { lineWidth: payload })); break
    case 'setLineType': getXA(m).forEach(ti => Object.assign(ti, { lineType: payload })); break
    case 'setLineColor': getXA(m).forEach(ti => Object.assign(ti, { lineColor: payload })); break
    case 'setSBorderWidth': getXA(m).forEach(ti => Object.assign(ti, { sBorderWidth: payload })); break
    case 'setFBorderWidth': getXA(m).forEach(ti => Object.assign(ti, { fBorderWidth: payload })); break
    case 'setSBorderColor': getXA(m).forEach(ti => Object.assign(ti, { sBorderColor: payload })); break
    case 'setFBorderColor': getXA(m).forEach(ti => Object.assign(ti, { fBorderColor: payload })); break
    case 'setSFillColor': getXA(m).forEach(ti => Object.assign(ti, { sFillColor: payload })); break
    case 'setFFillColor': getXA(m).forEach(ti => Object.assign(ti, { fFillColor: payload })); break
    case 'setTextFontSize': getXA(m).forEach(ti => Object.assign(ti, { textFontSize: payload })); break
    case 'setTextColor': getXA(m).forEach(ti => Object.assign(ti, { textColor: payload })); break
    case 'setBlur': getXA(m).forEach(ti => Object.assign(ti, { blur: 1 })); break
    case 'setTaskModeOn': mS(getXAEO(m)).forEach(ti => !ti.path.includes('c') && Object.assign(ti, { taskStatus: ti.taskStatus === 0 ? 1 : ti.taskStatus })); break
    case 'setTaskModeOff': mS(getXAEO(m)).forEach(ti => Object.assign(ti, { taskStatus: 0 })); break
    case 'setTaskModeReset': mS(getXAEO(m)).forEach(ti => Object.assign(ti, { taskStatus: ti.taskStatus > 0 ? 1 : ti.taskStatus })); break

    case 'clearDimensions': Object.assign(getX(m), { dimW: sSaveOptional.dimW, dimH: sSaveOptional.dimH }); break
    case 'clearLine': getXA(m).forEach(ti => Object.assign(ti, { lineWidth: sSaveOptional.lineWidth, lineType: sSaveOptional.lineType, lineColor: sSaveOptional.lineColor })); break
    case 'clearSBorder': getXA(m).forEach(ti => Object.assign(ti, { sBorderWidth: sSaveOptional.sBorderWidth, sBorderColor: sSaveOptional.sBorderColor })); break
    case 'clearFBorder': getXA(m).forEach(ti => Object.assign(ti, { fBorderWidth: sSaveOptional.fBorderWidth, fBorderColor: sSaveOptional.fBorderColor })); break
    case 'clearSFill': getXA(m).forEach(ti => Object.assign(ti, { sFillColor: sSaveOptional.sFillColor })); break
    case 'clearFFill': getXA(m).forEach(ti => Object.assign(ti, { fFillColor: sSaveOptional.fFillColor })); break
    case 'clearText': getXA(m).forEach(ti => Object.assign(ti, { textColor: sSaveOptional.textColor, textFontSize: sSaveOptional.textFontSize })); break
    case 'clearBlur': getXA(m).forEach(ti => Object.assign(ti, { blur: sSaveOptional.blur })); break
  }
  return m
}

export const mapReducer = (pm: M, action: MR, payload: any) => {
  console.log('MAP_MUTATION: ' + action, payload)
  const m = structuredClone(pm).sort(sortPath)
  mapReducerAtomic(m, action, payload)
  mapInit(m)
  mapChain(m)
  mapCalcOrientation(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  getG(m).flow === Flow.EXPLODED && mapPlaceExploded(m)
  getG(m).flow === Flow.INDENTED && mapPlaceIndented(m)
  return m.sort(sortNode)
}
