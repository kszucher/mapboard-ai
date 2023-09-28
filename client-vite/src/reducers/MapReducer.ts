import {ControlTypes} from "../state/Enums"
import {gptParseNodesS, gptParseNodesT, gptParseNodeMermaid} from "./MapParseGpt"
import {tSaveOptional} from "../state/MapState"
import {M, P, T} from "../state/MapStateTypes"
import {mapCalcTask} from "./MapCalcTask"
import {deleteL, deleteReselectCC, deleteReselectCR, deleteReselectLR, deleteReselectS,} from "./MapDelete"
import {mapInit} from "./MapInit"
import {insertCC, insertCR, insertL, insertS, insertTable} from "./MapInsert"
import {mapMeasure} from "./MapMeasure"
import {copyLR, copyS, cutLR, cutS, duplicateR, duplicateS, moveCC, moveCR, moveS, moveS2T, pasteS} from "./MapMove"
import {mapPlace} from "./MapPlace"
import {selectNode, selectNodeList, selectNodeToo} from "./MapSelect"
import {mT, sortNode, sortPath, isCH, isCV, getEditedNode, getG, getX, getNodeById, getCountXASU, getCountXSO1, getCountXASD, getCountXASU1O1, getCountXSI1U, getCountXCU, getCountXCL, getCountXSCV, getCountXSCH, getR0, getXA, getXAEO, getCountXRD0S, getCountXRD1S, getXSO1, getXSO2, getTRD0, isR, getXACD1, getXACU1, getXACR1, getXACL1, getXSI1, getXFSU1, getXSI2, getXRD1, getXRD0, getNodeByPath, getQuasiSU, getQuasiSD, getLastSO, getLastSOR, getLastSOL, getTR, getXR, getXSIC, getXSCO, getRL} from "../selectors/MapSelector"

export const mapReducerAtomic = (m: M, action: string, payload: any) => {
  switch (action) {
    case 'LOAD': break
    case 'setDensitySmall': getG(m).density = 'small'; break
    case 'setDensityLarge': getG(m).density = 'large'; break
    case 'setAlignmentCentered': getG(m).alignment = 'centered'; break
    case 'setAlignmentAdaptive': getG(m).alignment = 'adaptive'; break

    case 'selectR0': selectNode(m, getNodeByPath(m, ['r', 0]), 's'); break
    case 'selectRL': selectNodeList(m, getRL(m), 's'); break
    case 'selectNR': selectNode(m, getTR(m, getNodeByPath(m, payload.path)), 's'); break
    case 'selectXR': selectNode(m, getXR(m), 's'); break
    case 'selectFamilyX': selectNode(m, getX(m), 'f'); break
    case 'selectFamilyXRD0': selectNode(m, getXRD0(m), 'f'); break
    case 'selectFamilyXRD1': selectNode(m, getXRD1(m), 'f'); break
    case 'selectNS': selectNode(m, getNodeByPath(m, payload.path), 's'); break
    case 'selectXS': selectNode(m, getX(m), 's'); break
    case 'selectStoo': selectNodeToo(m, getNodeByPath(m, payload.path), 's'); break
    case 'selectall': selectNodeList(m, mT(m).filter(ti => ti.content !== ''), 's'); break
    case 'selectSD': selectNode(m, getQuasiSD(m), 's'); break
    case 'selectSDtoo': selectNodeToo(m, getQuasiSD(m), 's'); break
    case 'selectSU': selectNode(m, getQuasiSU(m), 's'); break
    case 'selectSUtoo': selectNodeToo(m, getQuasiSU(m), 's'); break
    case 'selectSO': selectNode(m, getLastSO(m), 's'); break
    case 'selectSOR': selectNode(m, getLastSOR(m), 's'); break
    case 'selectSOL': selectNode(m, getLastSOL(m), 's'); break
    case 'selectSI': selectNode(m, getXSI1(m), 's'); break
    case 'selectSF': selectNode(m, getNodeByPath(m, [...getX(m).path, 's', 0]), 's'); break
    case 'selectCFfirstRow': selectNode(m, getNodeByPath(m, (getX(m).path).map((pi, i) => i === getX(m).path.length -2 ? 0 : pi)), 's'); break
    case 'selectCFfirstCol': selectNode(m, getNodeByPath(m, (getX(m).path).map((pi, i) => i === getX(m).path.length -1 ? 0 : pi)), 's'); break
    case 'selectCFF': selectNode(m, getNodeByPath(m, [...getX(m).path, 'c', 0, 0]), 's'); break
    case 'selectXSIC': selectNode(m,  getXSIC(m), 's'); break
    case 'selectCRSAME': selectNodeList(m, mT(m).filter(ti => isCV(ti.path, getX(m).path)), 's'); break
    case 'selectCCSAME': selectNodeList(m, mT(m).filter(ti => isCH(ti.path, getX(m).path)), 's'); break
    case 'selectCD': selectNodeList(m, getXACD1(m), 's'); break
    case 'selectCU': selectNodeList(m, getXACU1(m), 's'); break
    case 'selectCR': selectNodeList(m, getXACR1(m), 's'); break
    case 'selectCL': selectNodeList(m, getXACL1(m), 's'); break
    case 'selectDragged': selectNodeList(m, payload.pathList.map((p: P) => getNodeByPath(m, p)), 's'); break

    case 'insertL': insertL(m, payload); break
    case 'insertSD': insertS(m, getXSI1(m), getCountXASU(m) + 1, payload); break
    case 'insertSU': insertS(m, getXSI1(m), getX(m).path.at(-1) as number, payload); break
    case 'insertSOR': insertS(m, getXRD0(m), getCountXRD0S(m), payload); break
    case 'insertSO': insertS(m, getX(m), getCountXSO1(m), payload); break
    case 'insertSORText': insertS(m, getXRD0(m), getCountXRD0S(m), {contentType: 'text', content: payload}); break
    case 'insertSOText': insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload}); break
    case 'insertSORLink': insertS(m, getXRD0(m), getCountXRD0S(m), {contentType: 'text', content: payload, linkType: 'external', link: payload}); break
    case 'insertSOLink': insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload, linkType: 'external', link: payload}); break
    case 'insertSOREquation': insertS(m, getXRD0(m), getCountXRD0S(m), {contentType: 'equation', content: payload}); break
    case 'insertSOEquation': insertS(m, getX(m), getCountXSO1(m), {contentType: 'equation', content: payload}); break
    case 'insertSORImage': insertS(m, getXRD0(m), getCountXRD0S(m), {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insertSOImage': insertS(m, getX(m), getCountXSO1(m), {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insertSORTable': insertTable(m, getXRD0(m), getCountXRD0S(m), payload); break
    case 'insertSOTable': insertTable(m, getX(m), getCountXSO1(m), payload); break
    case 'insertCRD': insertCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case 'insertCRU': insertCR(m, getXSI1(m), getCountXCU(m)); break
    case 'insertCCR': insertCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case 'insertCCL': insertCC(m, getXSI1(m), getCountXCL(m)); break
    case 'insertSCRD': insertCR(m, getX(m), getCountXSCV(m)); break
    case 'insertSCRU': insertCR(m, getX(m), 0); break
    case 'insertSCCR': insertCC(m, getX(m), getCountXSCH(m)); break
    case 'insertSCCL': insertCC(m, getX(m), 0); break
    // case 'insertTemplateRR': insertTemplateR(m, payload.template, getRiL(m) + 1, getRootStartX(m, getR0(m)) + getG(m).maxR + 200, 0); break
    // case 'insertTemplateRD': insertTemplateR(m, payload.template, getRiL(m) + 1, 0, getRootStartY(m, getR0(m)) + getG(m).maxD + 500); break

    case 'deleteL': deleteL(m, payload); break
    case 'deleteLR': deleteReselectLR(m); break
    case 'deleteS': deleteReselectS(m); break
    case 'deleteCR': deleteReselectCR(m); break
    case 'deleteCC': deleteReselectCC(m); break

    case 'duplicateR': duplicateR(m); break;
    case 'duplicateS': duplicateS(m); break;
    case 'moveSD': moveS(m, getXSI1(m), getCountXASU(m) + 1); break
    case 'moveST': moveS(m, getXSI1(m), 0); break
    case 'moveSU': moveS(m, getXSI1(m), getCountXASU(m) - 1); break
    case 'moveSB': moveS(m, getXSI1(m), getCountXASD(m)); break
    case 'moveSO': moveS(m, getXFSU1(m), getCountXASU1O1(m)); break
    case 'moveSI': moveS(m, getXSI2(m), getCountXSI1U(m) + 1); break
    case 'moveSIR': moveS(m, getXRD1(m), getCountXRD1S(m)); break
    case 'moveSIL': moveS(m, getXRD0(m), getCountXRD0S(m)); break
    case 'drag': moveS(m, getNodeById(m, payload.moveInsertParentNodeId), payload.moveTargetIndex); break
    case 'moveCRD': moveCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case 'moveCRU': moveCR(m, getXSI1(m), getCountXCU(m) - 1); break
    case 'moveCCR': moveCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case 'moveCCL': moveCC(m, getXSI1(m), getCountXCL(m) - 1); break
    case 'moveS2TOR': moveS2T(m, getXRD0(m), getXSO2(m)); break
    case 'moveS2TO': moveS2T(m, getX(m), getXSO1(m)); break
    case 'transpose': getXSCO(m).forEach(ti => ti.path = [...ti.path.slice(0, getX(m).path.length + 1), ti.path.at(getX(m).path.length + 2), ti.path.at(getX(m).path.length + 1), ...ti.path.slice(getX(m).path.length + 3)] as P); break
    case 'copyLR': copyLR(m); break
    case 'copyS': copyS(m); break
    case 'cutLR': cutLR(m); break
    case 'cutS': cutS(m); break
    case 'pasteSOR': pasteS(m, getXRD0(m), getCountXRD0S(m), payload); break
    case 'pasteSO': pasteS(m, getX(m), getCountXSO1(m), payload); break

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

    case 'clearLine': getXA(m).forEach(ti => Object.assign(ti, {lineWidth: tSaveOptional.lineWidth, lineType: tSaveOptional.lineType, lineColor: tSaveOptional.lineColor})); break
    case 'clearSBorder': getXA(m).forEach(ti => Object.assign(ti, {sBorderWidth: tSaveOptional.sBorderWidth, sBorderColor: tSaveOptional.sBorderColor})); break
    case 'clearFBorder': getXA(m).forEach(ti => Object.assign(isR(ti.path) ? getTRD0(m, ti) : ti, {fBorderWidth: tSaveOptional.fBorderWidth, fBorderColor: tSaveOptional.fBorderColor})); break
    case 'clearSFill': getXA(m).forEach(ti => Object.assign(ti, {sFillColor: tSaveOptional.sFillColor})); break
    case 'clearFFill': getXA(m).forEach(ti => Object.assign(isR(ti.path) ? getTRD0(m, ti) : ti, {fFillColor: tSaveOptional.fFillColor})); break
    case 'clearText': getXA(m).forEach(ti => Object.assign(ti, {textColor: tSaveOptional.textColor, textFontSize: tSaveOptional.textFontSize})); break

    case 'setTaskModeOn': getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: ti.taskStatus === 0 ? 1 : ti.taskStatus})); break
    case 'setTaskModeOff': getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: 0 })); break
    case 'setTaskModeReset': getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: ti.taskStatus > 0 ? 1 : ti.taskStatus})); break
    case 'setTaskStatus': getNodeById(m, payload.nodeId).taskStatus = payload.taskStatus; break
    case 'setNote': Object.assign(getR0(m), { note: payload.note }); break
    case 'setContent': Object.assign(getX(m), { content: payload.content }); break
    case 'setControlTypeNone': Object.assign(getX(m), { controlType: ControlTypes.NONE }); break
    case 'setControlTypeUpload': Object.assign(getX(m), { controlType: ControlTypes.UPLOAD }); break
    case 'setControlTypeGenerate': Object.assign(getX(m), { controlType: ControlTypes.GENERATE }); break

    case 'resetDimensions': Object.assign(getX(m), { dimW: 0, dimH: 0 }); break

    case 'typeText': Object.assign(getX(m), { contentType: 'text', content: payload.content }); break
    case 'finishEdit': Object.assign(getEditedNode(m, payload.path), { contentType: payload.contentType, content: payload.content }); break

    case 'gptParseNodesS': gptParseNodesS(m, payload.gptParsed); break
    case 'gptParseNodesT': gptParseNodesT(m, payload.gptParsed); break
    case 'gptParseNodeMermaid': gptParseNodeMermaid(m, payload.gptParsed); break

    case 'offsetD': getX(m).offsetH += 20; break
    case 'offsetU': getX(m).offsetH -= 20; break
    case 'offsetR': getX(m).offsetW += 20; break
    case 'offsetL': getX(m).offsetW -= 20; break

    case 'devSetLlmDataExample': Object.assign(getX(m), { llmDataType: 'audio', llmDataId: 'llmDataId' }); break
    case 'devClearLlmData': Object.assign(getX(m), { llmDataType: 'text', llmDataId: '' }); break

    case 'devSetBlur': getXA(m).forEach(ti => Object.assign(ti, {blur: 1})); break
    case 'devClearBlur': getXA(m).forEach(ti => Object.assign(ti, {blur: 0})); break

  }
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
