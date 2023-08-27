import {shortcutColors} from "../component/Colors"
import {Dir} from "../state/Enums"
import {gptParseNodesS, gptParseNodesT, gptParseNodeMermaid} from "./GptParser"
import {transpose} from './Utils'
import {structNavigate} from './NodeNavigate'
import {nSaveOptional} from "../state/MapState"
import {M, N} from "../state/MapStateTypes"
import {mapCalcTask} from "./MapCalcTask"
import {deleteReselectCC, deleteReselectCR, deleteReselectR, deleteReselectS,} from "./MapDelete"
import {mapInit} from "./MapInit"
import {insertCC, insertCR, insertS, insertTable, insertTemplateR} from "./MapInsert"
import {mapMeasure} from "./MapMeasure"
import {copyR, copyS, cutS, moveCC, moveCR, moveS, moveS2T, pasteS} from "./MapMove"
import {mapPlace} from "./MapPlace"
import {selectNode, selectNodeList, selectNodeToo} from "./MapSelect"
import {sortNode, sortPath, isCH, isCV, getEditedNode, getG, getX, getXP, getNodeById, getXSI1P, getCountXASU, getCountXSO1, getCountXASD, getCountXASU1O1, getCountXSI1U, getCountXCU, getCountXCL, getXSFP, getXSLP, getCountSCR, getCountSCC, getR0, getXRi, getRi, getRiL, getRootStartX, getRootStartY, getXA, getXAF, getCountXRiD0S, getCountXRiD1S, getXSO1, getXSO2, getRXD0, getNRiD0, isR, getXACD1, getXACU1, getXACR1, getXACL1, getXSI1, getXASU1, getXSI2, getXRiD1, getXRiD0} from "./MapUtils"

export const mapReducerAtomic = (m: M, action: string, payload: any) => {
  switch (action) {
    case 'LOAD': break
    case 'setDensitySmall': getG(m).density = 'small'; break
    case 'setDensityLarge': getG(m).density = 'large'; break
    case 'setAlignmentCentered': getG(m).alignment = 'centered'; break
    case 'setAlignmentAdaptive': getG(m).alignment = 'adaptive'; break

    case 'selectR0': selectNode(m, ['r', 0], 's'); break
    case 'selectXRi': selectNode(m, ['r', getXRi(m)], 's'); break
    case 'selectS': selectNode(m, payload.path, 's'); break
    case 'selectStoo': selectNodeToo(m, payload.path, 's'); break
    case 'selectF': selectNode(m, payload.path, 'f'); break
    case 'selectRXD0F': selectNode(m, ['r', getRi(payload.path), 'd', 0], 'f'); break
    case 'selectRXD1F': selectNode(m, ['r', getRi(payload.path), 'd', 1], 'f'); break
    case 'selectall': selectNodeList(m, m.filter(n => n.content !== '').map(n => n.path), 's'); break
    case 'selectSD': selectNode(m, structNavigate(m, getXSLP(m), Dir.D), 's'); break
    case 'selectSDtoo': selectNodeToo(m, structNavigate(m, getXSLP(m), Dir.D), 's'); break
    case 'selectSU': selectNode(m, structNavigate(m, getXSFP(m), Dir.U), 's'); break
    case 'selectSUtoo': selectNodeToo(m, structNavigate(m, getXSFP(m), Dir.U), 's'); break
    case 'selectSO': selectNode(m, structNavigate(m, getXP(m), Dir.O), 's'); break
    case 'selectSOR': selectNode(m, structNavigate(m, ['r', getXRi(m), 'd', 0], Dir.OR), 's'); break
    case 'selectSOL': selectNode(m, structNavigate(m, ['r', getXRi(m), 'd', 1], Dir.OL), 's'); break
    case 'selectSI': selectNode(m, structNavigate(m, getXP(m), Dir.I), 's'); break
    case 'selectSfamilyO': getX(m).selection = 'f'; break
    case 'selectSfamilyOR': selectNode(m, ['r', getXRi(m), 'd', 0], 'f'); break
    case 'selectSfamilyOL': selectNode(m, ['r', getXRi(m), 'd', 1], 'f'); break
    case 'selectSF': selectNode(m, [...getXP(m), 's', 0], 's'); break
    case 'selectSB': selectNode(m, getXP(m).slice(0, -3), 's'); break
    case 'selectCFfirstRow': selectNode(m, (getXP(m)).map((pi, i) => i === getXP(m).length -2 ? 0 : pi), 's'); break
    case 'selectCFfirstCol': selectNode(m, (getXP(m)).map((pi, i) => i === getXP(m).length -1 ? 0 : pi), 's'); break
    case 'selectCFF': selectNode(m, [...getXP(m), 'c', 0, 0], 's'); break
    case 'selectCB': selectNode(m, [...getXP(m).slice(0, getXP(m).lastIndexOf('c') + 3)], 's'); break
    case 'selectCRSAME': selectNodeList(m, m.filter(n => isCV(n.path, getXP(m))).map(n => n.path), 's'); break
    case 'selectCCSAME': selectNodeList(m, m.filter(n => isCH(n.path, getXP(m))).map(n => n.path), 's'); break
    case 'selectCD': selectNodeList(m, getXACD1(m).map(n => n.path), 's'); break
    case 'selectCU': selectNodeList(m, getXACU1(m).map(n => n.path), 's'); break
    case 'selectCR': selectNodeList(m, getXACR1(m).map(n => n.path), 's'); break
    case 'selectCL': selectNodeList(m, getXACL1(m).map(n => n.path), 's'); break
    case 'selectDragged': selectNodeList(m, payload.nList.map((n: N) => n.path), 's'); break

    case 'insertSD': insertS(m, getXSI1(m), getCountXASU(m) + 1, payload); break
    case 'insertSU': insertS(m, getXSI1(m), getX(m).path.at(-1) as number, payload); break
    case 'insertSOR': insertS(m, getXRiD0(m), getCountXRiD0S(m), payload); break
    case 'insertSO': insertS(m, getX(m), getCountXSO1(m), payload); break
    case 'insertSORText': insertS(m, getXRiD0(m), getCountXRiD0S(m), {contentType: 'text', content: payload}); break
    case 'insertSOText': insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload}); break
    case 'insertSORLink': insertS(m, getXRiD0(m), getCountXRiD0S(m), {contentType: 'text', content: payload, linkType: 'external', link: payload}); break
    case 'insertSOLink': insertS(m, getX(m), getCountXSO1(m), {contentType: 'text', content: payload, linkType: 'external', link: payload}); break
    case 'insertSOREquation': insertS(m, getXRiD0(m), getCountXRiD0S(m), {contentType: 'equation', content: payload}); break
    case 'insertSOEquation': insertS(m, getX(m), getCountXSO1(m), {contentType: 'equation', content: payload}); break
    case 'insertSORImage': insertS(m, getXRiD0(m), getCountXRiD0S(m), {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insertSOImage': insertS(m, getX(m), getCountXSO1(m), {contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height}); break
    case 'insertSORTable': insertTable(m, getXRiD0(m), getCountXRiD0S(m), payload); break
    case 'insertSOTable': insertTable(m, getX(m), getCountXSO1(m), payload); break
    case 'insertCRD': insertCR(m, [...getXSI1P(m), 'c', getCountXCU(m) + 1, 0]); break
    case 'insertCRU': insertCR(m, [...getXSI1P(m), 'c', getCountXCU(m), 0]); break
    case 'insertCCR': insertCC(m, [...getXSI1P(m), 'c', 0, getCountXCL(m) + 1]); break
    case 'insertCCL': insertCC(m, [...getXSI1P(m), 'c', 0, getCountXCL(m)]); break
    case 'insertSCRD': insertCR(m, [...getXP(m), 'c', getCountSCR(m, getXP(m)), 0]); break
    case 'insertSCRU': insertCR(m, [...getXP(m), 'c', 0, 0]); break
    case 'insertSCCR': insertCC(m, [...getXP(m), 'c', 0, getCountSCC(m, getXP(m))]); break
    case 'insertSCCL': insertCC(m, [...getXP(m), 'c', 0, 0]); break
    case 'insertTemplateRR': insertTemplateR(m, payload.template, getRiL(m) + 1, getRootStartX(m, getR0(m)) + getG(m).maxR + 200, 0); break
    case 'insertTemplateRD': insertTemplateR(m, payload.template, getRiL(m) + 1, 0, getRootStartY(m, getR0(m)) + getG(m).maxD + 500); break

    case 'deleteR': deleteReselectR(m); break
    case 'deleteS': deleteReselectS(m); break
    case 'deleteCR': deleteReselectCR(m); break
    case 'deleteCC': deleteReselectCC(m); break

    case 'moveSD': moveS(m, getXSI1(m), getCountXASU(m) + 1); break
    case 'moveST': moveS(m, getXSI1(m), 0); break
    case 'moveSU': moveS(m, getXSI1(m), getCountXASU(m) - 1); break
    case 'moveSB': moveS(m, getXSI1(m), getCountXASD(m)); break
    case 'moveSO': moveS(m, getXASU1(m), getCountXASU1O1(m)); break
    case 'moveSI': moveS(m, getXSI2(m), getCountXSI1U(m) + 1); break
    case 'moveSIR': moveS(m, getXRiD1(m), getCountXRiD1S(m)); break
    case 'moveSIL': moveS(m, getXRiD0(m), getCountXRiD0S(m)); break
    case 'moveCRD': moveCR(m, getXSI1(m), getCountXCU(m) + 1); break
    case 'moveCRU': moveCR(m, getXSI1(m), getCountXCU(m) - 1); break
    case 'moveCCR': moveCC(m, getXSI1(m), getCountXCL(m) + 1); break
    case 'moveCCL': moveCC(m, getXSI1(m), getCountXCL(m) - 1); break
    case 'moveS2TOR': moveS2T(m, getRXD0(m, getRi(getXP(m))), getXSO2(m)); break
    case 'moveS2TO': moveS2T(m, getX(m), getXSO1(m)); break

    case 'copyR': copyR(m); break
    case 'copyS': copyS(m); break
    case 'cutS': cutS(m); break
    case 'pasteSOR': pasteS(m, getXRiD0(m), getCountXRiD0S(m), payload); break
    case 'pasteSO': pasteS(m, getX(m), getCountXSO1(m), payload); break
    case 'drag': moveS(m, payload.moveTargetPath, payload.moveTargetIndex); break
    case 'transpose': break

    case 'setLineWidth': getXA(m).forEach(n => Object.assign(n, {lineWidth: payload})); break
    case 'setLineType': getXA(m).forEach(n => Object.assign(n, {lineType: payload})); break
    case 'setLineColor': getXA(m).forEach(n => Object.assign(n, {lineColor: payload})); break
    case 'setSBorderWidth': getXA(m).forEach(n => Object.assign(n, {sBorderWidth: payload})); break
    case 'setFBorderWidth': getXA(m).forEach(n => Object.assign(isR(n.path) ? getNRiD0(m, n) : n, {fBorderWidth: payload})); break
    case 'setSBorderColor': getXA(m).forEach(n => Object.assign(n, {sBorderColor: payload})); break
    case 'setFBorderColor': getXA(m).forEach(n => Object.assign(isR(n.path) ? getNRiD0(m, n) : n, {fBorderColor: payload})); break
    case 'setSFillColor': getXA(m).forEach(n => Object.assign(n, {sFillColor: payload})); break
    case 'setFFillColor': getXA(m).forEach(n => Object.assign(isR(n.path) ? getNRiD0(m, n) : n, {fFillColor: payload})); break
    case 'setTextFontSize': getXA(m).forEach(n => Object.assign(n, {textFontSize: payload})); break
    case 'setTextColor': getXA(m).forEach(n => Object.assign(n, {textColor: payload})); break

    case 'clearLine': getXA(m).forEach(n => Object.assign(n, {lineWidth: nSaveOptional.lineWidth, lineType: nSaveOptional.lineType, lineColor: nSaveOptional.lineColor})); break
    case 'clearSBorder': getXA(m).forEach(n => Object.assign(n, {sBorderWidth: nSaveOptional.sBorderWidth, sBorderColor: nSaveOptional.sBorderColor})); break
    case 'clearFBorder': getXA(m).forEach(n => Object.assign(isR(n.path) ? getNRiD0(m, n) : n, {fBorderWidth: nSaveOptional.fBorderWidth, fBorderColor: nSaveOptional.fBorderColor})); break
    case 'clearSFill': getXA(m).forEach(n => Object.assign(n, {sFillColor: nSaveOptional.sFillColor})); break
    case 'clearFFill': getXA(m).forEach(n => Object.assign(isR(n.path) ? getNRiD0(m, n) : n, {fFillColor: nSaveOptional.fFillColor})); break
    case 'clearText': getXA(m).forEach(n => Object.assign(n, {textColor: nSaveOptional.textColor, textFontSize: nSaveOptional.textFontSize})); break

    case 'applyColorFromKey': getXA(m).forEach(n => Object.assign(n, {textColor: shortcutColors[payload.currColor]})); break
    case 'taskModeOn': getXAF(m).forEach(n => Object.assign(n, {taskStatus: n.taskStatus === 0 ? 1 : n.taskStatus})); break
    case 'taskModeOff': getXAF(m).forEach(n => Object.assign(n, {taskStatus: 0 })); break
    case 'taskModeReset': getXAF(m).forEach(n => Object.assign(n, {taskStatus: n.taskStatus > 0 ? 1 : n.taskStatus})); break
    case 'setTaskStatus': getNodeById(m, payload.nodeId).taskStatus = payload.taskStatus; break
    case 'typeText': Object.assign(getX(m), { contentType: 'text', content: payload.content }); break
    case 'finishEdit': Object.assign(getEditedNode(m, payload.path), { contentType: payload.contentType, content: payload.content }); break
    case 'setNote': Object.assign(getR0(m), { note: payload.note }); break
    case 'setContent': Object.assign(getX(m), { content: payload.content }); break
    case 'resetDimensions': Object.assign(getX(m), { dimW: 0, dimH: 0 }); break

    case 'gptParseNodesS': gptParseNodesS(m, payload.gptParsed); break
    case 'gptParseNodesT': gptParseNodesT(m, payload.gptParsed); break
    case 'gptParseNodeMermaid': gptParseNodeMermaid(m, payload.gptParsed); break

    case 'offsetD': getX(m).offsetH += 20; break
    case 'offsetU': getX(m).offsetH -= 20; break
    case 'offsetR': getX(m).offsetW += 20; break
    case 'offsetL': getX(m).offsetW -= 20; break

    case 'saveConnection': getG(m).connections.push(payload); break
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
