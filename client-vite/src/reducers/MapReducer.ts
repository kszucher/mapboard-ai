import {getCountXASD, getCountXASU, getCountXASU1O1, getCountXCL, getCountXCU, getCountXSCH, getCountXSCV, getCountXSI1U, getCountXSO1, getG, getLastSO, getNodeById, getNodeByPath, getQuasiSD, getQuasiSU, getX, getXA, getXACD1, getXACL1, getXACR1, getXACU1, getXAEO, getXFSU1, getXR, getXSCO, getXSI1, getXSI2, getXSIC, getXSO1, isCH, isCV, mT, mTR, sortNode, sortPath} from "../selectors/MapQueries.ts"
import {ControlType, Flow} from "../state/Enums"
import {tSaveOptional} from "../state/MapState"
import {M, PT, T} from "../state/MapStateTypes"
import {mapCalcTask} from "./MapCalcTask"
import {deleteL, deleteReselectCC, deleteReselectCR, deleteReselectLR, deleteReselectS,} from "./MapDelete"
import {mapInit} from "./MapInit"
import {insertCC, insertCR, insertL, insertR, insertS, insertTable} from "./MapInsert"
import {mapMeasure} from "./MapMeasure"
import {copyLR, copyS, cutLR, cutS, duplicateR, duplicateS, moveCC, moveCR, moveS, moveS2T, pasteLR, pasteS} from "./MapMove"
import {gptParseNodeMermaid, gptParseNodesS, gptParseNodesT} from "./MapParseGpt"
import {mapPlace} from "./MapPlace"
import { MRT } from "./MapReducerTypes.ts"
import {selectT, selectTL, selectTToo} from "./MapSelect"

export const mapReducerAtomic = (m: M, action: MRT, payload: any) => {
  console.log(action)
  switch (action) {
    case MRT.LOAD: break

    case MRT.setDensitySmall: getG(m).density = 'small'; break
    case MRT.setDensityLarge: getG(m).density = 'large'; break
    case MRT.setPlaceTypeExploded: getG(m).flow = Flow.EXPLODED; break
    case MRT.setPlaceTypeIndented: getG(m).flow = Flow.INDENTED; break

    case MRT.selectT: selectT(m, getNodeByPath(m, payload.path), 's'); break
    case MRT.selectXR: selectT(m, getXR(m), 's'); break
    case MRT.selectSelfX: selectT(m, getX(m), 's'); break
    case MRT.selectFamilyX: selectT(m, getX(m), 'f'); break
    case MRT.selectSD: selectT(m, getQuasiSD(m), 's'); break
    case MRT.selectSU: selectT(m, getQuasiSU(m), 's'); break
    case MRT.selectSO: selectT(m, getLastSO(m), 's'); break
    case MRT.selectSI: selectT(m, getXSI1(m), 's'); break
    case MRT.selectSF: selectT(m, getNodeByPath(m, [...getX(m).path, 's', 0]), 's'); break
    case MRT.selectCFfirstRow: selectT(m, getNodeByPath(m, getX(m).path.map((pi, i) => i === getX(m).path.length -2 ? 0 : pi) as PT) as T, 's'); break
    case MRT.selectCFfirstCol: selectT(m, getNodeByPath(m, getX(m).path.map((pi, i) => i === getX(m).path.length -1 ? 0 : pi) as PT) as T, 's'); break
    case MRT.selectCFF: selectT(m, getNodeByPath(m, [...getX(m).path, 'c', 0, 0]), 's'); break
    case MRT.selectXSIC: selectT(m,  getXSIC(m), 's'); break
    case MRT.selectTtoo: selectTToo(m, getNodeByPath(m, payload.path), 's'); break
    case MRT.selectSDtoo: selectTToo(m, getQuasiSD(m), 's'); break
    case MRT.selectSUtoo: selectTToo(m, getQuasiSU(m), 's'); break
    case MRT.selectRA: selectTL(m, mTR(m), 's'); break
    case MRT.selectSA: selectTL(m, mT(m).filter(ti => ti.content !== ''), 's'); break
    case MRT.selectCRSAME: selectTL(m, mT(m).filter(ti => isCV(ti.path, getX(m).path)), 's'); break
    case MRT.selectCCSAME: selectTL(m, mT(m).filter(ti => isCH(ti.path, getX(m).path)), 's'); break
    case MRT.selectCD: selectTL(m, getXACD1(m), 's'); break
    case MRT.selectCU: selectTL(m, getXACU1(m), 's'); break
    case MRT.selectCR: selectTL(m, getXACR1(m), 's'); break
    case MRT.selectCL: selectTL(m, getXACL1(m), 's'); break
    case MRT.selectByRectangle: selectTL(m, payload.pathList.map((p: PT) => getNodeByPath(m, p)), 's'); break

    case MRT.insertL: insertL(m, payload); break
    case MRT.insertR: insertR(m); break
    case MRT.insertSD: insertS(m, getXSI1(m), getCountXASU(m) + 1, payload); break
    case MRT.insertSU: insertS(m, getXSI1(m), getX(m).path.at(-1), payload); break
    case MRT.insertSO: insertS(m, getX(m), getCountXSO1(m), payload); break
    case MRT.insertSOText: insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload}); break
    case MRT.insertSOLink: insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload, linkType: 'external', link: payload}); break
    case MRT.insertSOImage: insertS(m, getX(m), getCountXSO1(m), {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case MRT.insertCRD: insertCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case MRT.insertCRU: insertCR(m, getXSI1(m), getCountXCU(m)); break
    case MRT.insertSCRD: insertCR(m, getX(m), getCountXSCV(m)); break
    case MRT.insertSCRU: insertCR(m, getX(m), 0); break
    case MRT.insertCCR: insertCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case MRT.insertCCL: insertCC(m, getXSI1(m), getCountXCL(m)); break
    case MRT.insertSCCR: insertCC(m, getX(m), getCountXSCH(m)); break
    case MRT.insertSCCL: insertCC(m, getX(m), 0); break
    case MRT.insertSOTable: insertTable(m, getX(m), getCountXSO1(m), payload); break

    case MRT.gptParseNodesS: gptParseNodesS(m, payload.gptParsed); break
    case MRT.gptParseNodesT: gptParseNodesT(m, payload.gptParsed); break
    case MRT.gptParseNodeMermaid: gptParseNodeMermaid(m, payload.gptParsed); break

    case MRT.deleteL: deleteL(m, payload); break
    case MRT.deleteLR: deleteReselectLR(m); break
    case MRT.deleteS: deleteReselectS(m); break
    case MRT.deleteCR: deleteReselectCR(m); break
    case MRT.deleteCC: deleteReselectCC(m); break

    case MRT.cutLR: cutLR(m); break
    case MRT.cutS: cutS(m); break
    case MRT.copyLR: copyLR(m); break
    case MRT.copyS: copyS(m); break
    case MRT.pasteLR: pasteLR(m, payload); break
    case MRT.pasteSO: pasteS(m, getX(m), getCountXSO1(m), payload); break
    case MRT.duplicateR: duplicateR(m); break;
    case MRT.duplicateS: duplicateS(m); break;
    case MRT.moveSD: moveS(m, getXSI1(m), getCountXASU(m) + 1); break
    case MRT.moveST: moveS(m, getXSI1(m), 0); break
    case MRT.moveSU: moveS(m, getXSI1(m), getCountXASU(m) - 1); break
    case MRT.moveSB: moveS(m, getXSI1(m), getCountXASD(m)); break
    case MRT.moveSO: moveS(m, getXFSU1(m), getCountXASU1O1(m)); break
    case MRT.moveSI: moveS(m, getXSI2(m), getCountXSI1U(m) + 1); break
    case MRT.moveByDrag: moveS(m, getNodeById(m, payload.moveInsertParentNodeId), payload.moveTargetIndex); break
    case MRT.moveCRD: moveCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case MRT.moveCRU: moveCR(m, getXSI1(m), getCountXCU(m) - 1); break
    case MRT.moveCCR: moveCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case MRT.moveCCL: moveCC(m, getXSI1(m), getCountXCL(m) - 1); break
    case MRT.moveS2TO: moveS2T(m, getX(m), getXSO1(m)); break
    case MRT.transpose: getXSCO(m).forEach(ti => ti.path = [...ti.path.slice(0, getX(m).path.length + 1), ti.path.at(getX(m).path.length + 2), ti.path.at(getX(m).path.length + 1), ...ti.path.slice(getX(m).path.length + 3)] as PT); break

    case MRT.setTaskStatus: Object.assign(getNodeById(m, payload.nodeId), {taskStatus: payload.taskStatus}); break
    case MRT.setContentText: Object.assign(getX(m), {contentType: 'text', content: payload.content}); break
    case MRT.setContentEquation: Object.assign(getX(m), {contentType: 'equation', content: payload.content}); break
    case MRT.setContentMermaid: Object.assign(getX(m), {contentType: 'mermaid', content: payload.content}); break
    case MRT.setControlTypeNone: Object.assign(getX(m), { controlType: ControlType.NONE }); break
    case MRT.setControlTypeIngestion: Object.assign(getX(m), { controlType: ControlType.INGESTION }); break
    case MRT.setControlTypeExtraction: Object.assign(getX(m), { controlType: ControlType.EXTRACTION }); break
    case MRT.offsetD: Object.assign(getX(m), { offsetH: getX(m).offsetH += 20 }); break
    case MRT.offsetU: Object.assign(getX(m), { offsetH: getX(m).offsetH -= 20 }); break
    case MRT.offsetR: Object.assign(getX(m), { offsetW: getX(m).offsetW += 20 }); break
    case MRT.offsetL: Object.assign(getX(m), { offsetW: getX(m).offsetW -= 20 }); break
    case MRT.setLlmData: Object.assign(getX(m), { llmDataType: 'audio', llmDataId: 'llmDataId' }); break
    case MRT.setLineWidth: getXA(m).forEach(ti => Object.assign(ti, {lineWidth: payload})); break
    case MRT.setLineType: getXA(m).forEach(ti => Object.assign(ti, {lineType: payload})); break
    case MRT.setLineColor: getXA(m).forEach(ti => Object.assign(ti, {lineColor: payload})); break
    case MRT.setSBorderWidth: getXA(m).forEach(ti => Object.assign(ti, {sBorderWidth: payload})); break
    case MRT.setFBorderWidth: getXA(m).forEach(ti => Object.assign(ti, {fBorderWidth: payload})); break
    case MRT.setSBorderColor: getXA(m).forEach(ti => Object.assign(ti, {sBorderColor: payload})); break
    case MRT.setFBorderColor: getXA(m).forEach(ti => Object.assign(ti, {fBorderColor: payload})); break
    case MRT.setSFillColor: getXA(m).forEach(ti => Object.assign(ti, {sFillColor: payload})); break
    case MRT.setFFillColor: getXA(m).forEach(ti => Object.assign(ti, {fFillColor: payload})); break
    case MRT.setTextFontSize: getXA(m).forEach(ti => Object.assign(ti, {textFontSize: payload})); break
    case MRT.setTextColor: getXA(m).forEach(ti => Object.assign(ti, {textColor: payload})); break
    case MRT.setBlur: getXA(m).forEach(ti => Object.assign(ti, {blur: 1})); break
    case MRT.setTaskModeOn: getXAEO(m).forEach(ti => !ti.path.includes('c') && Object.assign(ti, {taskStatus: ti.taskStatus === 0 ? 1 : ti.taskStatus})); break
    case MRT.setTaskModeOff: getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: 0 })); break
    case MRT.setTaskModeReset: getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: ti.taskStatus > 0 ? 1 : ti.taskStatus})); break

    case MRT.clearDimensions: Object.assign(getX(m), {dimW: tSaveOptional.dimW, dimH: tSaveOptional.dimH}); break
    case MRT.clearLlmData: Object.assign(getX(m), {llmDataType: tSaveOptional.llmDataType, llmDataId: tSaveOptional.llmDataId}); break
    case MRT.clearLine: getXA(m).forEach(ti => Object.assign(ti, {lineWidth: tSaveOptional.lineWidth, lineType: tSaveOptional.lineType, lineColor: tSaveOptional.lineColor})); break
    case MRT.clearSBorder: getXA(m).forEach(ti => Object.assign(ti, {sBorderWidth: tSaveOptional.sBorderWidth, sBorderColor: tSaveOptional.sBorderColor})); break
    case MRT.clearFBorder: getXA(m).forEach(ti => Object.assign(ti, {fBorderWidth: tSaveOptional.fBorderWidth, fBorderColor: tSaveOptional.fBorderColor})); break
    case MRT.clearSFill: getXA(m).forEach(ti => Object.assign(ti, {sFillColor: tSaveOptional.sFillColor})); break
    case MRT.clearFFill: getXA(m).forEach(ti => Object.assign(ti, {fFillColor: tSaveOptional.fFillColor})); break
    case MRT.clearText: getXA(m).forEach(ti => Object.assign(ti, {textColor: tSaveOptional.textColor, textFontSize: tSaveOptional.textFontSize})); break
    case MRT.clearBlur: getXA(m).forEach(ti => Object.assign(ti, {blur: tSaveOptional.blur})); break
  }
  return m
}

export const mapReducer = (pm: M, action: MRT, payload: any) => {
  // console.log('MAP_MUTATION: ' + action, payload)
  const m = structuredClone(pm).sort(sortPath)
  mapReducerAtomic(m, action, payload)
  mapInit(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(sortNode)
}
