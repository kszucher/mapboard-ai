import {ControlTypes} from "../state/Enums"
import {gptParseNodesS, gptParseNodesT, gptParseNodeMermaid} from "./MapParseGpt"
import {tSaveOptional} from "../state/MapState"
import {M, PT, T} from "../state/MapStateTypes"
import {mapCalcTask} from "./MapCalcTask"
import {deleteL, deleteReselectCC, deleteReselectCR, deleteReselectLR, deleteReselectS,} from "./MapDelete"
import {mapInit} from "./MapInit"
import {insertCC, insertCR, insertL, insertR, insertS, insertTable} from "./MapInsert"
import {mapMeasure} from "./MapMeasure"
import {copyLR, copyS, cutLR, cutS, duplicateR, duplicateS, moveCC, moveCR, moveS, moveS2T, pasteLR, pasteS} from "./MapMove"
import {mapPlace} from "./MapPlace"
import {selectT, selectTL, selectTToo} from "./MapSelect"
import {mT, sortNode, sortPath, isCH, isCV, getG, getX, getNodeById, getCountXASU, getCountXSO1, getCountXASD, getCountXASU1O1, getCountXSI1U, getCountXCU, getCountXCL, getCountXSCV, getCountXSCH, getR0, getXA, getXAEO, getCountXRD0SO1, getCountXRD1SO1, getXSO1, getXSO2, getTRD0, isR, getXACD1, getXACU1, getXACR1, getXACL1, getXSI1, getXFSU1, getXSI2, getXRD1, getXRD0, getNodeByPath, getQuasiSU, getQuasiSD, getLastSO, getLastSOR, getLastSOL, getXR, getXSIC, getXSCO, mTR} from "../selectors/MapSelector"

export const mapReducerAtomic = (m: M, action: string, payload: any) => {
  switch (action) {
    case 'LOAD': break

    case 'setDensitySmall': getG(m).density = 'small'; break
    case 'setDensityLarge': getG(m).density = 'large'; break
    case 'setAlignmentCentered': getG(m).alignment = 'centered'; break
    case 'setAlignmentAdaptive': getG(m).alignment = 'adaptive'; break

    case 'selectT': selectT(m, getNodeByPath(m, payload.path), 's'); break
    case 'selectXR': selectT(m, getXR(m), 's'); break
    case 'selectSelfX': selectT(m, getX(m), 's'); break
    case 'selectFamilyX': selectT(m, getX(m), 'f'); break
    case 'selectFamilyXRD0': selectT(m, getXRD0(m), 'f'); break
    case 'selectFamilyXRD1': selectT(m, getXRD1(m), 'f'); break
    case 'selectSD': selectT(m, getQuasiSD(m), 's'); break
    case 'selectSU': selectT(m, getQuasiSU(m), 's'); break
    case 'selectSO': selectT(m, getLastSO(m), 's'); break
    case 'selectSOR': selectT(m, getLastSOR(m), 's'); break
    case 'selectSOL': selectT(m, getLastSOL(m), 's'); break
    case 'selectSI': selectT(m, getXSI1(m), 's'); break
    case 'selectSF': selectT(m, getNodeByPath(m, [...getX(m).path, 's', 0]), 's'); break
    case 'selectCFfirstRow': selectT(m, getNodeByPath(m, getX(m).path.map((pi, i) => i === getX(m).path.length -2 ? 0 : pi) as PT) as T, 's'); break
    case 'selectCFfirstCol': selectT(m, getNodeByPath(m, getX(m).path.map((pi, i) => i === getX(m).path.length -1 ? 0 : pi) as PT) as T, 's'); break
    case 'selectCFF': selectT(m, getNodeByPath(m, [...getX(m).path, 'c', 0, 0]), 's'); break
    case 'selectXSIC': selectT(m,  getXSIC(m), 's'); break
    case 'selectTtoo': selectTToo(m, getNodeByPath(m, payload.path), 's'); break
    case 'selectSDtoo': selectTToo(m, getQuasiSD(m), 's'); break
    case 'selectSUtoo': selectTToo(m, getQuasiSU(m), 's'); break
    case 'selectRA': selectTL(m, mTR(m), 's'); break
    case 'selectSA': selectTL(m, mT(m).filter(ti => ti.content !== ''), 's'); break
    case 'selectCRSAME': selectTL(m, mT(m).filter(ti => isCV(ti.path, getX(m).path)), 's'); break
    case 'selectCCSAME': selectTL(m, mT(m).filter(ti => isCH(ti.path, getX(m).path)), 's'); break
    case 'selectCD': selectTL(m, getXACD1(m), 's'); break
    case 'selectCU': selectTL(m, getXACU1(m), 's'); break
    case 'selectCR': selectTL(m, getXACR1(m), 's'); break
    case 'selectCL': selectTL(m, getXACL1(m), 's'); break
    case 'selectByRectangle': selectTL(m, payload.pathList.map((p: PT) => getNodeByPath(m, p)), 's'); break

    case 'insertL': insertL(m, payload); break
    case 'insertR': insertR(m); break
    case 'insertSD': insertS(m, getXSI1(m), getCountXASU(m) + 1, payload); break
    case 'insertSU': insertS(m, getXSI1(m), getX(m).path.at(-1), payload); break
    case 'insertSOR': insertS(m, getXRD0(m), getCountXRD0SO1(m), payload); break
    case 'insertSO': insertS(m, getX(m), getCountXSO1(m), payload); break
    case 'insertSORText': insertS(m, getXRD0(m), getCountXRD0SO1(m), {contentType: 'text', content: payload}); break
    case 'insertSOText': insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload}); break
    case 'insertSORLink': insertS(m, getXRD0(m), getCountXRD0SO1(m), {contentType: 'text', content: payload, linkType: 'external', link: payload}); break
    case 'insertSOLink': insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload, linkType: 'external', link: payload}); break
    case 'insertSORImage': insertS(m, getXRD0(m), getCountXRD0SO1(m), {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insertSOImage': insertS(m, getX(m), getCountXSO1(m), {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insertCRD': insertCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case 'insertCRU': insertCR(m, getXSI1(m), getCountXCU(m)); break
    case 'insertSCRD': insertCR(m, getX(m), getCountXSCV(m)); break
    case 'insertSCRU': insertCR(m, getX(m), 0); break
    case 'insertCCR': insertCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case 'insertCCL': insertCC(m, getXSI1(m), getCountXCL(m)); break
    case 'insertSCCR': insertCC(m, getX(m), getCountXSCH(m)); break
    case 'insertSCCL': insertCC(m, getX(m), 0); break
    case 'insertSORTable': insertTable(m, getXRD0(m), getCountXRD0SO1(m), payload); break
    case 'insertSOTable': insertTable(m, getX(m), getCountXSO1(m), payload); break

    case 'gptParseNodesS': gptParseNodesS(m, payload.gptParsed); break
    case 'gptParseNodesT': gptParseNodesT(m, payload.gptParsed); break
    case 'gptParseNodeMermaid': gptParseNodeMermaid(m, payload.gptParsed); break

    case 'deleteL': deleteL(m, payload); break
    case 'deleteLR': deleteReselectLR(m); break
    case 'deleteS': deleteReselectS(m); break
    case 'deleteCR': deleteReselectCR(m); break
    case 'deleteCC': deleteReselectCC(m); break

    case 'cutLR': cutLR(m); break
    case 'cutS': cutS(m); break
    case 'copyLR': copyLR(m); break
    case 'copyS': copyS(m); break
    case 'pasteLR': pasteLR(m, payload); break
    case 'pasteSOR': pasteS(m, getXRD0(m), getCountXRD0SO1(m), payload); break
    case 'pasteSO': pasteS(m, getX(m), getCountXSO1(m), payload); break
    case 'duplicateR': duplicateR(m); break;
    case 'duplicateS': duplicateS(m); break;
    case 'moveSD': moveS(m, getXSI1(m), getCountXASU(m) + 1); break
    case 'moveST': moveS(m, getXSI1(m), 0); break
    case 'moveSU': moveS(m, getXSI1(m), getCountXASU(m) - 1); break
    case 'moveSB': moveS(m, getXSI1(m), getCountXASD(m)); break
    case 'moveSO': moveS(m, getXFSU1(m), getCountXASU1O1(m)); break
    case 'moveSI': moveS(m, getXSI2(m), getCountXSI1U(m) + 1); break
    case 'moveSIR': moveS(m, getXRD1(m), getCountXRD1SO1(m)); break
    case 'moveSIL': moveS(m, getXRD0(m), getCountXRD0SO1(m)); break
    case 'moveByDrag': moveS(m, getNodeById(m, payload.moveInsertParentNodeId), payload.moveTargetIndex); break
    case 'moveCRD': moveCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case 'moveCRU': moveCR(m, getXSI1(m), getCountXCU(m) - 1); break
    case 'moveCCR': moveCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case 'moveCCL': moveCC(m, getXSI1(m), getCountXCL(m) - 1); break
    case 'moveS2TOR': moveS2T(m, getXRD0(m), getXSO2(m)); break
    case 'moveS2TO': moveS2T(m, getX(m), getXSO1(m)); break
    case 'transpose': getXSCO(m).forEach(ti => ti.path = [...ti.path.slice(0, getX(m).path.length + 1), ti.path.at(getX(m).path.length + 2), ti.path.at(getX(m).path.length + 1), ...ti.path.slice(getX(m).path.length + 3)] as PT); break

    case 'setTaskStatus': Object.assign(getNodeById(m, payload.nodeId), {taskStatus: payload.taskStatus}); break
    case 'setContentText': Object.assign(getX(m), {contentType: 'text', content: payload.content}); break
    case 'setContentEquation': Object.assign(getX(m), {contentType: 'equation', content: payload.content}); break
    case 'setContentMermaid': Object.assign(getX(m), {contentType: 'mermaid', content: payload.content}); break
    case 'setControlTypeNone': Object.assign(getX(m), { controlType: ControlTypes.NONE }); break
    case 'setControlTypeIngestion': Object.assign(getX(m), { controlType: ControlTypes.INGESTION }); break
    case 'setControlTypeExtraction': Object.assign(getX(m), { controlType: ControlTypes.EXTRACTION }); break
    case 'offsetD': Object.assign(getX(m), { offsetH: getX(m).offsetH += 20 }); break
    case 'offsetU': Object.assign(getX(m), { offsetH: getX(m).offsetH -= 20 }); break
    case 'offsetR': Object.assign(getX(m), { offsetW: getX(m).offsetW += 20 }); break
    case 'offsetL': Object.assign(getX(m), { offsetW: getX(m).offsetW -= 20 }); break
    case 'setLlmData': Object.assign(getX(m), { llmDataType: 'audio', llmDataId: 'llmDataId' }); break
    case 'setLineWidth': getXA(m).forEach(ti => Object.assign(ti, {lineWidth: payload})); break
    case 'setLineType': getXA(m).forEach(ti => Object.assign(ti, {lineType: payload})); break
    case 'setLineColor': getXA(m).forEach(ti => Object.assign(ti, {lineColor: payload})); break
    case 'setSBorderWidth': getXA(m).forEach(ti => Object.assign(ti, {sBorderWidth: payload})); break
    case 'setFBorderWidth': getXA(m).forEach(ti => Object.assign(isR(ti.path) ? getTRD0(m, ti) : ti, {fBorderWidth: payload})); break
    case 'setSBorderColor': getXA(m).forEach(ti => Object.assign(ti, {sBorderColor: payload})); break
    case 'setFBorderColor': getXA(m).forEach(ti => Object.assign(isR(ti.path) ? getTRD0(m, ti) : ti, {fBorderColor: payload})); break
    case 'setSFillColor': getXA(m).forEach(ti => Object.assign(ti, {sFillColor: payload})); break
    case 'setFFillColor': getXA(m).forEach(ti => Object.assign(isR(ti.path) ? getTRD0(m, ti) : ti, {fFillColor: payload})); break
    case 'setTextFontSize': getXA(m).forEach(ti => Object.assign(ti, {textFontSize: payload})); break
    case 'setTextColor': getXA(m).forEach(ti => Object.assign(ti, {textColor: payload})); break
    case 'setBlur': getXA(m).forEach(ti => Object.assign(ti, {blur: 1})); break
    case 'setTaskModeOn': getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: ti.taskStatus === 0 ? 1 : ti.taskStatus})); break
    case 'setTaskModeOff': getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: 0 })); break
    case 'setTaskModeReset': getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: ti.taskStatus > 0 ? 1 : ti.taskStatus})); break

    case 'clearDimensions': Object.assign(getX(m), {dimW: tSaveOptional.dimW, dimH: tSaveOptional.dimH}); break
    case 'clearLlmData': Object.assign(getX(m), {llmDataType: tSaveOptional.llmDataType, llmDataId: tSaveOptional.llmDataId}); break
    case 'clearLine': getXA(m).forEach(ti => Object.assign(ti, {lineWidth: tSaveOptional.lineWidth, lineType: tSaveOptional.lineType, lineColor: tSaveOptional.lineColor})); break
    case 'clearSBorder': getXA(m).forEach(ti => Object.assign(ti, {sBorderWidth: tSaveOptional.sBorderWidth, sBorderColor: tSaveOptional.sBorderColor})); break
    case 'clearFBorder': getXA(m).forEach(ti => Object.assign(isR(ti.path) ? getTRD0(m, ti) : ti, {fBorderWidth: tSaveOptional.fBorderWidth, fBorderColor: tSaveOptional.fBorderColor})); break
    case 'clearSFill': getXA(m).forEach(ti => Object.assign(ti, {sFillColor: tSaveOptional.sFillColor})); break
    case 'clearFFill': getXA(m).forEach(ti => Object.assign(isR(ti.path) ? getTRD0(m, ti) : ti, {fFillColor: tSaveOptional.fFillColor})); break
    case 'clearText': getXA(m).forEach(ti => Object.assign(ti, {textColor: tSaveOptional.textColor, textFontSize: tSaveOptional.textFontSize})); break
    case 'clearBlur': getXA(m).forEach(ti => Object.assign(ti, {blur: tSaveOptional.blur})); break
  }
  return m
}

export const mapReducer = (pm: M, action: string, payload: any) => {
  console.log('MAP_MUTATION: ' + action, payload)
  const m = structuredClone(pm).sort(sortPath)
  mapReducerAtomic(m, action, payload)
  mapInit(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(sortNode)
}
