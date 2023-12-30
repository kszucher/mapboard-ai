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
import { MR } from "./MapReducerEnum.ts"
import {selectT, selectTL, selectTToo} from "./MapSelect"

export const mapReducerAtomic = (m: M, action: MR, payload: any) => {
  console.log(action)
  switch (action) {
    case MR.LOAD: break

    case MR.setDensitySmall: getG(m).density = 'small'; break
    case MR.setDensityLarge: getG(m).density = 'large'; break
    case MR.setPlaceTypeExploded: getG(m).flow = Flow.EXPLODED; break
    case MR.setPlaceTypeIndented: getG(m).flow = Flow.INDENTED; break

    case MR.selectT: selectT(m, getNodeByPath(m, payload.path), 's'); break
    case MR.selectXR: selectT(m, getXR(m), 's'); break
    case MR.selectSelfX: selectT(m, getX(m), 's'); break
    case MR.selectFamilyX: selectT(m, getX(m), 'f'); break
    case MR.selectSD: selectT(m, getQuasiSD(m), 's'); break
    case MR.selectSU: selectT(m, getQuasiSU(m), 's'); break
    case MR.selectSO: selectT(m, getLastSO(m), 's'); break
    case MR.selectSI: selectT(m, getXSI1(m), 's'); break
    case MR.selectSF: selectT(m, getNodeByPath(m, [...getX(m).path, 's', 0]), 's'); break
    case MR.selectCFfirstRow: selectT(m, getNodeByPath(m, getX(m).path.map((pi, i) => i === getX(m).path.length -2 ? 0 : pi) as PT) as T, 's'); break
    case MR.selectCFfirstCol: selectT(m, getNodeByPath(m, getX(m).path.map((pi, i) => i === getX(m).path.length -1 ? 0 : pi) as PT) as T, 's'); break
    case MR.selectCFF: selectT(m, getNodeByPath(m, [...getX(m).path, 'c', 0, 0]), 's'); break
    case MR.selectXSIC: selectT(m,  getXSIC(m), 's'); break
    case MR.selectTtoo: selectTToo(m, getNodeByPath(m, payload.path), 's'); break
    case MR.selectSDtoo: selectTToo(m, getQuasiSD(m), 's'); break
    case MR.selectSUtoo: selectTToo(m, getQuasiSU(m), 's'); break
    case MR.selectRA: selectTL(m, mTR(m), 's'); break
    case MR.selectSA: selectTL(m, mT(m).filter(ti => ti.content !== ''), 's'); break
    case MR.selectCRSAME: selectTL(m, mT(m).filter(ti => isCV(ti.path, getX(m).path)), 's'); break
    case MR.selectCCSAME: selectTL(m, mT(m).filter(ti => isCH(ti.path, getX(m).path)), 's'); break
    case MR.selectCD: selectTL(m, getXACD1(m), 's'); break
    case MR.selectCU: selectTL(m, getXACU1(m), 's'); break
    case MR.selectCR: selectTL(m, getXACR1(m), 's'); break
    case MR.selectCL: selectTL(m, getXACL1(m), 's'); break
    case MR.selectByRectangle: selectTL(m, payload.pathList.map((p: PT) => getNodeByPath(m, p)), 's'); break

    case MR.insertL: insertL(m, payload); break
    case MR.insertR: insertR(m); break
    case MR.insertSD: insertS(m, getXSI1(m), getCountXASU(m) + 1, payload); break
    case MR.insertSU: insertS(m, getXSI1(m), getX(m).path.at(-1), payload); break
    case MR.insertSO: insertS(m, getX(m), getCountXSO1(m), payload); break
    case MR.insertSOText: insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload}); break
    case MR.insertSOLink: insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload, linkType: 'external', link: payload}); break
    case MR.insertSOImage: insertS(m, getX(m), getCountXSO1(m), {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case MR.insertCRD: insertCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case MR.insertCRU: insertCR(m, getXSI1(m), getCountXCU(m)); break
    case MR.insertSCRD: insertCR(m, getX(m), getCountXSCV(m)); break
    case MR.insertSCRU: insertCR(m, getX(m), 0); break
    case MR.insertCCR: insertCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case MR.insertCCL: insertCC(m, getXSI1(m), getCountXCL(m)); break
    case MR.insertSCCR: insertCC(m, getX(m), getCountXSCH(m)); break
    case MR.insertSCCL: insertCC(m, getX(m), 0); break
    case MR.insertSOTable: insertTable(m, getX(m), getCountXSO1(m), payload); break

    case MR.gptParseNodesS: gptParseNodesS(m, payload.gptParsed); break
    case MR.gptParseNodesT: gptParseNodesT(m, payload.gptParsed); break
    case MR.gptParseNodeMermaid: gptParseNodeMermaid(m, payload.gptParsed); break

    case MR.deleteL: deleteL(m, payload); break
    case MR.deleteLR: deleteReselectLR(m); break
    case MR.deleteS: deleteReselectS(m); break
    case MR.deleteCR: deleteReselectCR(m); break
    case MR.deleteCC: deleteReselectCC(m); break

    case MR.cutLR: cutLR(m); break
    case MR.cutS: cutS(m); break
    case MR.copyLR: copyLR(m); break
    case MR.copyS: copyS(m); break
    case MR.pasteLR: pasteLR(m, payload); break
    case MR.pasteSO: pasteS(m, getX(m), getCountXSO1(m), payload); break
    case MR.duplicateR: duplicateR(m); break;
    case MR.duplicateS: duplicateS(m); break;
    case MR.moveSD: moveS(m, getXSI1(m), getCountXASU(m) + 1); break
    case MR.moveST: moveS(m, getXSI1(m), 0); break
    case MR.moveSU: moveS(m, getXSI1(m), getCountXASU(m) - 1); break
    case MR.moveSB: moveS(m, getXSI1(m), getCountXASD(m)); break
    case MR.moveSO: moveS(m, getXFSU1(m), getCountXASU1O1(m)); break
    case MR.moveSI: moveS(m, getXSI2(m), getCountXSI1U(m) + 1); break
    case MR.moveByDrag: moveS(m, getNodeById(m, payload.moveInsertParentNodeId), payload.moveTargetIndex); break
    case MR.moveCRD: moveCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case MR.moveCRU: moveCR(m, getXSI1(m), getCountXCU(m) - 1); break
    case MR.moveCCR: moveCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case MR.moveCCL: moveCC(m, getXSI1(m), getCountXCL(m) - 1); break
    case MR.moveS2TO: moveS2T(m, getX(m), getXSO1(m)); break
    case MR.transpose: getXSCO(m).forEach(ti => ti.path = [...ti.path.slice(0, getX(m).path.length + 1), ti.path.at(getX(m).path.length + 2), ti.path.at(getX(m).path.length + 1), ...ti.path.slice(getX(m).path.length + 3)] as PT); break

    case MR.setTaskStatus: Object.assign(getNodeById(m, payload.nodeId), {taskStatus: payload.taskStatus}); break
    case MR.setContentText: Object.assign(getX(m), {contentType: 'text', content: payload.content}); break
    case MR.setContentEquation: Object.assign(getX(m), {contentType: 'equation', content: payload.content}); break
    case MR.setContentMermaid: Object.assign(getX(m), {contentType: 'mermaid', content: payload.content}); break
    case MR.setControlTypeNone: Object.assign(getX(m), { controlType: ControlType.NONE }); break
    case MR.setControlTypeIngestion: Object.assign(getX(m), { controlType: ControlType.INGESTION }); break
    case MR.setControlTypeExtraction: Object.assign(getX(m), { controlType: ControlType.EXTRACTION }); break
    case MR.offsetD: Object.assign(getX(m), { offsetH: getX(m).offsetH += 20 }); break
    case MR.offsetU: Object.assign(getX(m), { offsetH: getX(m).offsetH -= 20 }); break
    case MR.offsetR: Object.assign(getX(m), { offsetW: getX(m).offsetW += 20 }); break
    case MR.offsetL: Object.assign(getX(m), { offsetW: getX(m).offsetW -= 20 }); break
    case MR.setLlmData: Object.assign(getX(m), { llmDataType: 'audio', llmDataId: 'llmDataId' }); break
    case MR.setLineWidth: getXA(m).forEach(ti => Object.assign(ti, {lineWidth: payload})); break
    case MR.setLineType: getXA(m).forEach(ti => Object.assign(ti, {lineType: payload})); break
    case MR.setLineColor: getXA(m).forEach(ti => Object.assign(ti, {lineColor: payload})); break
    case MR.setSBorderWidth: getXA(m).forEach(ti => Object.assign(ti, {sBorderWidth: payload})); break
    case MR.setFBorderWidth: getXA(m).forEach(ti => Object.assign(ti, {fBorderWidth: payload})); break
    case MR.setSBorderColor: getXA(m).forEach(ti => Object.assign(ti, {sBorderColor: payload})); break
    case MR.setFBorderColor: getXA(m).forEach(ti => Object.assign(ti, {fBorderColor: payload})); break
    case MR.setSFillColor: getXA(m).forEach(ti => Object.assign(ti, {sFillColor: payload})); break
    case MR.setFFillColor: getXA(m).forEach(ti => Object.assign(ti, {fFillColor: payload})); break
    case MR.setTextFontSize: getXA(m).forEach(ti => Object.assign(ti, {textFontSize: payload})); break
    case MR.setTextColor: getXA(m).forEach(ti => Object.assign(ti, {textColor: payload})); break
    case MR.setBlur: getXA(m).forEach(ti => Object.assign(ti, {blur: 1})); break
    case MR.setTaskModeOn: getXAEO(m).forEach(ti => !ti.path.includes('c') && Object.assign(ti, {taskStatus: ti.taskStatus === 0 ? 1 : ti.taskStatus})); break
    case MR.setTaskModeOff: getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: 0 })); break
    case MR.setTaskModeReset: getXAEO(m).forEach(ti => Object.assign(ti, {taskStatus: ti.taskStatus > 0 ? 1 : ti.taskStatus})); break

    case MR.clearDimensions: Object.assign(getX(m), {dimW: tSaveOptional.dimW, dimH: tSaveOptional.dimH}); break
    case MR.clearLlmData: Object.assign(getX(m), {llmDataType: tSaveOptional.llmDataType, llmDataId: tSaveOptional.llmDataId}); break
    case MR.clearLine: getXA(m).forEach(ti => Object.assign(ti, {lineWidth: tSaveOptional.lineWidth, lineType: tSaveOptional.lineType, lineColor: tSaveOptional.lineColor})); break
    case MR.clearSBorder: getXA(m).forEach(ti => Object.assign(ti, {sBorderWidth: tSaveOptional.sBorderWidth, sBorderColor: tSaveOptional.sBorderColor})); break
    case MR.clearFBorder: getXA(m).forEach(ti => Object.assign(ti, {fBorderWidth: tSaveOptional.fBorderWidth, fBorderColor: tSaveOptional.fBorderColor})); break
    case MR.clearSFill: getXA(m).forEach(ti => Object.assign(ti, {sFillColor: tSaveOptional.sFillColor})); break
    case MR.clearFFill: getXA(m).forEach(ti => Object.assign(ti, {fFillColor: tSaveOptional.fFillColor})); break
    case MR.clearText: getXA(m).forEach(ti => Object.assign(ti, {textColor: tSaveOptional.textColor, textFontSize: tSaveOptional.textFontSize})); break
    case MR.clearBlur: getXA(m).forEach(ti => Object.assign(ti, {blur: tSaveOptional.blur})); break
  }
  return m
}

export const mapReducer = (pm: M, action: MR, payload: any) => {
  // console.log('MAP_MUTATION: ' + action, payload)
  const m = structuredClone(pm).sort(sortPath)
  mapReducerAtomic(m, action, payload)
  mapInit(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  return m.sort(sortNode)
}
