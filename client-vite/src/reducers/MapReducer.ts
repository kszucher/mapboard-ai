import {getG, getQuasiSD, getQuasiSU, mR, sortNode, sortPath, mS, mC, getXR, getXC, getLCS, getRCS, getDCS, getUCS, getXS, getXFS, getXLS, getXAC, getXAS, pathToR, pathToS, pathToC, idToR, idToS, idToC} from "../queries/MapQueries.ts"
import {ControlType, Flow} from "../state/Enums"
import {sSaveOptional} from "../state/MapState"
import {M, PC, PR, PS, R, S} from "../state/MapStateTypes"
import {mapCalcTask} from "./MapCalcTask"
import {deleteCC, deleteCR, deleteL, deleteLR, deleteS,} from "./MapDelete"
import {mapInit} from "./MapInit"
import {insertCCL, insertCCR, insertCRD, insertCRU, insertL, insertR, insertS, insertSCCL, insertSCCR, insertSCRD, insertSCRU, insertTable} from "./MapInsert"
import {mapMeasure} from "./MapMeasure"
import {copyLRSC, copySC, cutLRSC, duplicateRSC, duplicateSC, moveS2T, pasteLRSC, pasteSC, cutSC, moveCRD, moveCRU, moveCCR, moveCCL, transpose, moveSC} from "./MapMove"
import {MR} from "./MapReducerEnum.ts"
import {selectAddR, selectAddS, selectC, selectCL, selectR, selectRL, selectS, selectSL, unselectC, unselectNodes, unselectR, unselectS} from "./MapSelect"
import {mapChain} from "./MapChain.ts"
import {mapPlace} from "./MapPlace.ts"
import {mapCalcOrientation} from "./MapCalcOrientation.ts"
import {getRD, getRL, getRR, getRU} from "../queries/MapFindNearestR.ts"

export const mapReducerAtomic = (m: M, action: MR, payload?: any) => {
  switch (action) {
    case 'load': break

    case 'setDensitySmall': getG(m).density = 'small'; break
    case 'setDensityLarge': getG(m).density = 'large'; break
    case 'setPlaceTypeExploded': getG(m).flow = Flow.EXPLODED; break
    case 'setPlaceTypeIndented': getG(m).flow = Flow.INDENTED; break

    case 'selectR': selectR(m, pathToR(m, payload.path)); break
    case 'selectS': selectS(m, pathToS(m, payload.path), 's'); break
    case 'selectC': selectC(m, pathToC(m, payload.path)); break
    case 'selectRR': selectR(m, getRR(m, getXR(m))!); break
    case 'selectRL': selectR(m, getRL(m, getXR(m))!); break
    case 'selectRD': selectR(m, getRD(m, getXR(m))!); break
    case 'selectRU': selectR(m, getRU(m, getXR(m))!); break
    case 'selectFirstR': selectR(m, mR(m).at(0)!); break
    case 'selectFirstS': selectS(m, mS(m).at(0)!, 's'); break
    case 'selectFirstC': selectC(m, mC(m).at(0)!); break
    case 'selectSelfX': selectS(m, getXS(m), 's'); break
    case 'selectFamilyX': selectS(m, getXS(m), 'f'); break
    case 'selectSD': selectS(m, getQuasiSD(m) as S, 's'); break
    case 'selectSU': selectS(m, getQuasiSU(m) as S, 's'); break
    case 'selectRSO': selectS(m, pathToS(m, [...getXR(m).path, 's', 0] as PS), 's'); break
    case 'selectSSO': selectS(m, pathToS(m, [...getXS(m).path, 's', 0] as PS), 's'); break
    case 'selectSSOLast': selectS(m, pathToS(m, [...getXS(m).path, 's', getXS(m).lastSelectedChild] as PS), 's'); break
    case 'selectCSO': selectS(m, pathToS(m, [...getXC(m).path, 's', 0] as PS), 's'); break
    case 'selectSI': idToS(m, getXS(m).si1).lastSelectedChild = getXS(m).path.at(-1); selectS(m, idToS(m, getXS(m).si1), 's'); break
    case 'selectLCS': selectS(m, getLCS(m), 's'); break
    case 'selectRCS': selectS(m, getRCS(m), 's'); break
    case 'selectDCS': selectS(m, getDCS(m), 's'); break
    case 'selectUCS': selectS(m, getUCS(m), 's'); break
    case 'selectCFR0': selectC(m, pathToC(m, getXC(m).path.with(-2, 0) as PC)); break
    case 'selectCFC0': selectC(m, pathToC(m, getXC(m).path.with(-1, 0) as PC)); break
    case 'selectCFF': selectC(m, pathToC(m, [...getXS(m).path, 'c', 0, 0])); break
    case 'selectXSIR': selectR(m, pathToR(m, getXS(m).path.slice(0, 2) as PR)); break
    case 'selectXSIRS': selectS(m, pathToS(m, getXS(m).path.slice(0, 2).concat('s', 0) as PS), 's'); break
    case 'selectXSIC': selectC(m, pathToC(m, getXS(m).path.slice(0, getXS(m).path.findLastIndex(pi => pi === 'c') + 3) as PC)); break
    case 'selectXSICS': selectS(m, pathToS(m, getXS(m).path.slice(0, getXS(m).path.findLastIndex(pi => pi === 'c') + 3).concat('s', 0) as PS), 's'); break
    case 'selectXCIS': selectS(m, pathToS(m, getXC(m).path.slice(0, -3) as PS), 's'); break
    case 'selectAddR': selectAddR(m, pathToR(m, payload.path)); break
    case 'selectAddS': selectAddS(m, pathToS(m, payload.path), 's'); break
    case 'selectAddSD': selectAddS(m, getQuasiSD(m), 's'); break
    case 'selectAddSU': selectAddS(m, getQuasiSU(m), 's'); break
    case 'selectRA': selectRL(m, mR(m)); break
    case 'selectSA': selectSL(m, mS(m)); break
    case 'selectFirstCR': selectCL(m, mC(m).at(0)!.ch.map(nid => idToC(m, nid))); break
    case 'selectFirstCC': selectCL(m, mC(m).at(0)!.cv.map(nid => idToC(m, nid))); break
    case 'selectSameCR': selectCL(m, getXC(m).ch.map(nid => idToC(m, nid))); break
    case 'selectSameCC': selectCL(m, getXC(m).cv.map(nid => idToC(m, nid))); break
    case 'selectCD': selectCL(m, getXAC(m).map(ci => pathToC(m, ci.path.with(-2, ci.path.at(-2) + 1) as PC))); break
    case 'selectCU': selectCL(m, getXAC(m).map(ci => pathToC(m, ci.path.with(-2, ci.path.at(-2) - 1) as PC))); break
    case 'selectCR': selectCL(m, getXAC(m).map(ci => pathToC(m, ci.path.with(-1, ci.path.at(-1) + 1) as PC))); break
    case 'selectCL': selectCL(m, getXAC(m).map(ci => pathToC(m, ci.path.with(-1, ci.path.at(-1) - 1) as PC))); break
    case 'selectSByRectangle': selectSL(m, (payload.pathList as PS[]).map(p => pathToS(m, p))); break

    case 'unselect': unselectNodes(m); break
    case 'unselectR': unselectR(pathToR(m, payload.path)); break
    case 'unselectS': unselectS(pathToS(m, payload.path)); break
    case 'unselectC': unselectC(pathToC(m, payload.path)); break

    case 'insertL': insertL(m, payload); break
    case 'insertR': insertR(m); break
    case 'insertSD': insertS(m, getXLS(m).path.with(-1, getXLS(m).su.length + 1) as PS, payload); break
    case 'insertSU': insertS(m, getXFS(m).path.with(-1, getXFS(m).su.length) as PS, payload); break
    case 'insertRSO': insertS(m, [...getXR(m).path, 's', getXR(m).so1.length], payload); break
    case 'insertSSO': insertS(m, [...getXS(m).path, 's', getXS(m).so1.length], payload); break
    case 'insertSSOText': insertS(m, [...getXS(m).path, 's', getXS(m).so1.length], { contentType: 'text', content: payload }); break
    case 'insertSSOLink': insertS(m, [...getXS(m).path, 's', getXS(m).so1.length], { contentType: 'text', content: payload, linkType: 'external', link: payload }); break
    case 'insertSSOImage': insertS(m, [...getXS(m).path, 's', getXS(m).so1.length], { contentType: 'image', content: payload.imageId, imageW: payload.imageSize.width, imageH: payload.imageSize.height }); break
    case 'insertCSO': insertS(m, [...getXC(m).path, 's', getXC(m).so1.length], payload); break
    case 'insertCRD': insertCRD(m); break
    case 'insertCRU': insertCRU(m); break
    case 'insertCCR': insertCCR(m); break
    case 'insertCCL': insertCCL(m); break
    case 'insertSCRD': insertSCRD(m); break
    case 'insertSCRU': insertSCRU(m); break
    case 'insertSCCR': insertSCCR(m); break
    case 'insertSCCL': insertSCCL(m); break
    case 'insertSDTable': insertTable(m, getXS(m).path.with(-1, getXS(m).su.length + 1) as PS, payload); break
    case 'insertSUTable': insertTable(m, getXS(m).path.with(-1, getXS(m).su.length) as PS, payload); break
    case 'insertSSOTable': insertTable(m, [...getXS(m).path, 's', getXS(m).so1.length] as PS, payload); break

    case 'deleteL': deleteL(m, payload); break
    case 'deleteLR': { const reselect = mR(m).find(ri => !ri.selected)!.nodeId; deleteLR(m); selectR(m, idToR(m, reselect )); break }
    case 'deleteSJumpSU': { const reselect = getXFS(m).su.at(-1)!; deleteS(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'deleteSJumpSD': { const reselect = getXLS(m).sd.at(-1)!; deleteS(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'deleteSJumpSI': { const reselect = getXS(m).si1; deleteS(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'deleteSJumpR': { const reselect = getXR(m).nodeId; deleteS(m); selectR(m, idToR(m, reselect)); break }
    case 'deleteCRJumpU': { const reselectList = getXAC(m).map(ci => ci.cu.at(-1)!); deleteCR(m); selectCL(m, reselectList.map(nid => idToC(m, nid))); break }
    case 'deleteCRJumpD': { const reselectList = getXAC(m).map(ci => ci.cd.at(-1)!); deleteCR(m); selectCL(m, reselectList.map(nid => idToC(m, nid))); break }
    case 'deleteCRJumpSI': { const reselect = getXC(m).si1; deleteCR(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'deleteCCJumpL': { const reselectList = getXAC(m).map(ci => ci.cl.at(-1)!); deleteCC(m); selectCL(m, reselectList.map(nid => idToC(m, nid))); break }
    case 'deleteCCJumpR': { const reselectList = getXAC(m).map(ci => ci.cr.at(-1)!); deleteCC(m); selectCL(m, reselectList.map(nid => idToC(m, nid))); break }
    case 'deleteCCJumpSI': { const reselect = getXC(m).si1; deleteCC(m); selectS(m, idToS(m, reselect), 's'); break }

    case 'cutLR': { const reselect = mR(m).find(ri => !ri.selected)!.nodeId; cutLRSC(m); selectR(m, idToR(m, reselect) as R); break }
    case 'cutSJumpRI': { const reselect = getXS(m).ri1; cutSC(m); selectR(m, idToR(m, reselect)); break }
    case 'cutSJumpSU': { const reselect = getXFS(m).su.at(-1)!; cutSC(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'cutSJumpSD': { const reselect = getXLS(m).sd.at(-1)!; cutSC(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'cutSJumpSI': { const reselect = getXS(m).si1; cutSC(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'cutSJumpCI': { const reselect = getXS(m).ci1; cutSC(m); selectC(m, idToC(m, reselect)); break }

    case 'copyLR': copyLRSC(m); break
    case 'copyS': copySC(m); break

    case 'pasteLR': pasteLRSC(m, payload); break
    case 'pasteRSO': pasteSC(m, [...getXR(m).path, 's',  getXR(m).so1.length], payload); break
    case 'pasteSSO': pasteSC(m, [...getXS(m).path, 's',  getXS(m).so1.length], payload); break
    case 'pasteCSO': pasteSC(m, [...getXC(m).path, 's',  getXC(m).so1.length], payload); break

    case 'duplicateR': duplicateRSC(m); break;
    case 'duplicateS': duplicateSC(m); break;

    case 'moveSD': moveSC(m, getXS(m).path.with(-1, getXFS(m).su.length + 1) as PS); break
    case 'moveST': moveSC(m, getXS(m).path.with(-1, 0) as PS); break
    case 'moveSU': moveSC(m, getXS(m).path.with(-1, getXFS(m).su.length - 1) as PS); break
    case 'moveSB': moveSC(m, getXS(m).path.with(-1, getXLS(m).sd.length) as PS); break
    case 'moveSO': moveSC(m, [...idToS(m, getXFS(m).su.at(-1) as string).path, 's', idToS(m, getXFS(m).su.at(-1) as string).so1.length] as PS); break
    case 'moveSI': moveSC(m, idToS(m, getXS(m).si1).path.with(-1, idToS(m, getXS(m).si1).su.length + 1) as PS); break
    case 'moveSByDrag': moveSC(m, [...idToS(m, payload.moveInsertParentNodeId).path, 's', payload.moveTargetIndex]); break
    case 'moveCRD': moveCRD(m); break
    case 'moveCRU': moveCRU(m); break
    case 'moveCCR': moveCCR(m); break
    case 'moveCCL': moveCCL(m); break
    case 'moveS2T': moveS2T(m); break

    case 'transpose': transpose(m); break

    case 'offsetD': Object.assign(getXR(m), { offsetH: getXR(m).offsetH += 20 }); break
    case 'offsetU': Object.assign(getXR(m), { offsetH: getXR(m).offsetH -= 20 }); break
    case 'offsetR': Object.assign(getXR(m), { offsetW: getXR(m).offsetW += 20 }); break
    case 'offsetL': Object.assign(getXR(m), { offsetW: getXR(m).offsetW -= 20 }); break
    case 'offsetRByDrag': Object.assign(getXR(m), { offsetW: payload.toX, offsetH: payload.toY }); break

    case 'setControlTypeNone': Object.assign(getXR(m), { controlType: ControlType.NONE }); break
    case 'setControlTypeIngestion': Object.assign(getXR(m), { controlType: ControlType.INGESTION }); break
    case 'setControlTypeExtraction': Object.assign(getXR(m), { controlType: ControlType.EXTRACTION }); break

    case 'setContentText': Object.assign(getXS(m), { contentType: 'text', content: payload.content }); break
    case 'setContentEquation': Object.assign(getXS(m), { contentType: 'equation', content: payload.content }); break

    case 'setLineWidth': getXAS(m).forEach(si => Object.assign(si, { lineWidth: payload })); break
    case 'setLineType': getXAS(m).forEach(si => Object.assign(si, { lineType: payload })); break
    case 'setLineColor': getXAS(m).forEach(si => Object.assign(si, { lineColor: payload })); break
    case 'setSBorderWidth': getXAS(m).forEach(si => Object.assign(si, { sBorderWidth: payload })); break
    case 'setFBorderWidth': getXAS(m).forEach(si => Object.assign(si, { fBorderWidth: payload })); break
    case 'setSBorderColor': getXAS(m).forEach(si => Object.assign(si, { sBorderColor: payload })); break
    case 'setFBorderColor': getXAS(m).forEach(si => Object.assign(si, { fBorderColor: payload })); break
    case 'setSFillColor': getXAS(m).forEach(si => Object.assign(si, { sFillColor: payload })); break
    case 'setFFillColor': getXAS(m).forEach(si => Object.assign(si, { fFillColor: payload })); break
    case 'setTextFontSize': getXAS(m).forEach(si => Object.assign(si, { textFontSize: payload })); break
    case 'setTextColor': getXAS(m).forEach(si => Object.assign(si, { textColor: payload })); break
    case 'setBlur': getXAS(m).forEach(si => Object.assign(si, { blur: 1 })); break

    case 'setTaskModeOn': getXS(m).so.map(nid => idToS(m, nid)).forEach(si => !si.path.includes('c') && Object.assign(si, { taskStatus: si.taskStatus === 0 ? 1 : si.taskStatus })); break
    case 'setTaskModeOff': getXS(m).so.map(nid => idToS(m, nid)).forEach(si => Object.assign(si, { taskStatus: 0 })); break
    case 'setTaskModeReset': getXS(m).so.map(nid => idToS(m, nid)).forEach(si => Object.assign(si, { taskStatus: si.taskStatus > 0 ? 1 : si.taskStatus })); break
    case 'setTaskStatus': Object.assign(idToS(m, payload.nodeId), { taskStatus: payload.taskStatus }); break

    case 'clearDimensions': Object.assign(getXS(m), { dimW: sSaveOptional.dimW, dimH: sSaveOptional.dimH }); break
    case 'clearLine': getXAS(m).forEach(si => Object.assign(si, { lineWidth: sSaveOptional.lineWidth, lineType: sSaveOptional.lineType, lineColor: sSaveOptional.lineColor })); break
    case 'clearSBorder': getXAS(m).forEach(si => Object.assign(si, { sBorderWidth: sSaveOptional.sBorderWidth, sBorderColor: sSaveOptional.sBorderColor })); break
    case 'clearFBorder': getXAS(m).forEach(si => Object.assign(si, { fBorderWidth: sSaveOptional.fBorderWidth, fBorderColor: sSaveOptional.fBorderColor })); break
    case 'clearSFill': getXAS(m).forEach(si => Object.assign(si, { sFillColor: sSaveOptional.sFillColor })); break
    case 'clearFFill': getXAS(m).forEach(si => Object.assign(si, { fFillColor: sSaveOptional.fFillColor })); break
    case 'clearText': getXAS(m).forEach(si => Object.assign(si, { textColor: sSaveOptional.textColor, textFontSize: sSaveOptional.textFontSize })); break
    case 'clearBlur': getXAS(m).forEach(si => Object.assign(si, { blur: sSaveOptional.blur })); break
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
  mapPlace(m)
  return m.sort(sortNode)
}
