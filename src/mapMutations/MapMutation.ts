import {getG, getQuasiSD, getQuasiSU, mR, mS, mC, getXR, getXC, getXS, getFXS, getLXS, getAXC, getAXS, pathToR, pathToS, pathToC, idToR, idToS, idToC} from "../mapQueries/MapQueries.ts"
import {ControlType, Flow} from "../consts/Enums"
import {sSaveOptional} from "../mapState/MapState.ts"
import {M, PC, PS, R, S} from "../mapState/MapStateTypes.ts"
import {deleteCC, deleteCR, deleteL, deleteLRSC, deleteS,} from "./MapDelete"
import {insertCCL, insertCCR, insertCRD, insertCRU, insertCSO, insertL, insertR, insertRSO, insertSCCL, insertSCCR, insertSCRD, insertSCRU, insertSD, insertSSO, insertSU, insertTable} from "./MapInsert"
import {copyLRSC, copySC, duplicateLRSC, duplicateSC, moveS2T, pasteLRSC, pasteSC, transpose, moveSC, moveCL} from "./MapMove"
import {MM} from "./MapMutationEnum.ts"
import {selectAddR, selectAddS, selectC, selectCL, selectR, selectRL, selectS, selectSL, unselectC, unselectNodes, unselectR, unselectS} from "./MapSelect"
import {getRD, getRL, getRR, getRU} from "../mapQueries/MapFindNearestR.ts"

export const mapMutation = (m: M, action: MM, payload?: any) => {
  console.log(action)
  switch (action) {
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
    case 'selectRSO': selectS(m, getXR(m).so1.at(0)!, 's'); break
    case 'selectSSO': selectS(m, getXS(m).so1.at(0)!, 's'); break
    case 'selectSSOLast': selectS(m, pathToS(m, [...getXS(m).path, 's', getXS(m).lastSelectedChild] as PS), 's'); break
    case 'selectCSO': selectS(m, getXC(m).so1.at(0)!, 's'); break
    case 'selectSI': getXS(m).si1!.lastSelectedChild = getXS(m).path.at(-1); selectS(m, getXS(m).si1!, 's'); break
    case 'selectCFR0': selectC(m, pathToC(m, getXC(m).path.with(-2, 0) as PC)); break
    case 'selectCFC0': selectC(m, pathToC(m, getXC(m).path.with(-1, 0) as PC)); break
    case 'selectCFF': selectC(m, pathToC(m, [...getXS(m).path, 'c', 0, 0])); break
    case 'selectXSIR': selectR(m, getXS(m).ri); break
    case 'selectXSIRS': selectS(m, getXS(m).ri.so1.at(0)!, 's'); break
    case 'selectXSIC': selectC(m, getXS(m).ci!); break
    case 'selectXSICS': selectS(m, getXS(m).ci!.so1.at(0)!, 's'); break
    case 'selectXCIS': selectS(m, pathToS(m, getXC(m).path.slice(0, -3) as PS), 's'); break
    case 'selectAddR': selectAddR(m, pathToR(m, payload.path)); break
    case 'selectAddS': selectAddS(m, pathToS(m, payload.path), 's'); break
    case 'selectAddSD': selectAddS(m, getQuasiSD(m), 's'); break
    case 'selectAddSU': selectAddS(m, getQuasiSU(m), 's'); break
    case 'selectRA': selectRL(m, mR(m)); break
    case 'selectSA': selectSL(m, mS(m)); break
    case 'selectFirstCR': selectCL(m, mC(m).at(0)!.ch); break
    case 'selectFirstCC': selectCL(m, mC(m).at(0)!.cv); break
    case 'selectSameCR': selectCL(m, getXC(m).ch); break
    case 'selectSameCC': selectCL(m, getXC(m).cv); break
    case 'selectDC': selectC(m, getXC(m).cd.at(-1)!); break
    case 'selectUC': selectC(m, getXC(m).cu.at(-1)!); break
    case 'selectRC': selectC(m, getXC(m).cr.at(-1)!); break
    case 'selectLC': selectC(m, getXC(m).cl.at(-1)!); break
    case 'selectDCL': selectCL(m, getAXC(m).map(ci => ci.cd.at(-1)!)); break
    case 'selectUCL': selectCL(m, getAXC(m).map(ci => ci.cu.at(-1)!)); break
    case 'selectRCL': selectCL(m, getAXC(m).map(ci => ci.cr.at(-1)!)); break
    case 'selectLCL': selectCL(m, getAXC(m).map(ci => ci.cl.at(-1)!)); break
    case 'selectDCS': selectS(m, getXS(m).ci1!.cd.at(-1)!.so1.at(0)!, 's'); break
    case 'selectUCS': selectS(m, getXS(m).ci1!.cu.at(-1)!.so1.at(0)!, 's'); break
    case 'selectRCS': selectS(m, getXS(m).ci1!.cr.at(-1)!.so1.at(0)!, 's'); break
    case 'selectLCS': selectS(m, getXS(m).ci1!.cl.at(-1)!.so1.at(0)!, 's'); break
    case 'selectSByRectangle': selectSL(m, payload.intersectingNodes.map((nid: string) => idToS(m, nid))); break
    case 'unselect': unselectNodes(m); break
    case 'unselectR': unselectR(pathToR(m, payload.path)); break
    case 'unselectS': unselectS(pathToS(m, payload.path)); break
    case 'unselectC': unselectC(pathToC(m, payload.path)); break

    case 'insertL': insertL(m, payload); break
    case 'insertR': insertR(m); break
    case 'insertSD': insertSD(m, {taskStatus: getLXS(m).taskStatus}); break
    case 'insertSU': insertSU(m, {taskStatus: getFXS(m).taskStatus}); break
    case 'insertRSO': insertRSO(m); break
    case 'insertSSO': insertSSO(m, {taskStatus: getXS(m).taskStatus}); break
    case 'insertCSO': insertCSO(m); break
    case 'insertCRD': insertCRD(m); break
    case 'insertCRU': insertCRU(m); break
    case 'insertCCR': insertCCR(m); break
    case 'insertCCL': insertCCL(m); break
    case 'insertSCRD': insertSCRD(m); break
    case 'insertSCRU': insertSCRU(m); break
    case 'insertSCCR': insertSCCR(m); break
    case 'insertSCCL': insertSCCL(m); break
    case 'insertSSOTable': insertTable(m, [...getXS(m).path, 's', getXS(m).so1.length] as PS, payload); break

    case 'deleteL': deleteL(m, payload); break
    case 'deleteLRSC': { const reselect = mR(m).find(ri => !ri.selected)!.nodeId; deleteLRSC(m); selectR(m, idToR(m, reselect )); break }
    case 'deleteSJumpSU': { const reselect = getFXS(m).su.at(-1)!.nodeId; deleteS(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'deleteSJumpSD': { const reselect = getLXS(m).sd.at(-1)!.nodeId; deleteS(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'deleteSJumpSI': { const reselect = getXS(m).si1!.nodeId; deleteS(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'deleteSJumpCI': { const reselect = getXS(m).ci1!.nodeId; deleteS(m); selectC(m, idToC(m, reselect)); break }
    case 'deleteSJumpR': { const reselect = getXS(m).ri.nodeId; deleteS(m); selectR(m, idToR(m, reselect)); break }
    case 'deleteCRJumpU': { const reselectList = getAXC(m).map(ci => ci.cu.at(-1)!.nodeId); deleteCR(m); selectCL(m, reselectList.map(nid => idToC(m, nid))); break }
    case 'deleteCRJumpD': { const reselectList = getAXC(m).map(ci => ci.cd.at(-1)!.nodeId); deleteCR(m); selectCL(m, reselectList.map(nid => idToC(m, nid))); break }
    case 'deleteCRJumpSI': { const reselect = getXC(m).si1!.nodeId; deleteCR(m); selectS(m, idToS(m, reselect), 's'); break }
    case 'deleteCCJumpL': { const reselectList = getAXC(m).map(ci => ci.cl.at(-1)!.nodeId); deleteCC(m); selectCL(m, reselectList.map(nid => idToC(m, nid))); break }
    case 'deleteCCJumpR': { const reselectList = getAXC(m).map(ci => ci.cr.at(-1)!.nodeId); deleteCC(m); selectCL(m, reselectList.map(nid => idToC(m, nid))); break }
    case 'deleteCCJumpSI': { const reselect = getXC(m).si1!.nodeId; deleteCC(m); selectS(m, idToS(m, reselect), 's'); break }

    case 'cutLRJumpR': { const reselect = mR(m).find(ri => !ri.selected)!.nodeId; copyLRSC(m); deleteLRSC(m); selectR(m, idToR(m, reselect) as R); break }
    case 'cutSJumpRI': { const reselect = getXS(m).ri1!; copySC(m); deleteS(m); selectR(m, reselect); break }
    case 'cutSJumpSU': { const reselect = getFXS(m).su.at(-1)!; copySC(m); deleteS(m); selectS(m, reselect, 's'); break }
    case 'cutSJumpSD': { const reselect = getLXS(m).sd.at(-1)!; copySC(m); deleteS(m); selectS(m, reselect, 's'); break }
    case 'cutSJumpSI': { const reselect = getXS(m).si1!; copySC(m); deleteS(m); selectS(m, reselect, 's'); break }
    case 'cutSJumpCI': { const reselect = getXS(m).ci1!; copySC(m); deleteS(m); selectC(m, reselect); break }
    case 'copyLR': copyLRSC(m); break
    case 'copyS': copySC(m); break
    case 'pasteLR': pasteLRSC(m, payload); break
    case 'pasteRSO': pasteSC(m, getXR(m),  getXR(m).so1.at(-1), payload); break
    case 'pasteSSO': pasteSC(m, getXS(m),  getXS(m).so1.at(-1), payload); break
    case 'pasteCSO': pasteSC(m, getXC(m),  getXC(m).so1.at(-1), payload); break
    case 'duplicateR': duplicateLRSC(m); break;
    case 'duplicateS': duplicateSC(m); break;
    case 'moveSD': moveSC(m, getXS(m).ti1, getLXS(m).sd.at(-1), getLXS(m).sd.at(-2)); break
    case 'moveST': moveSC(m, getXS(m).ti1, undefined, getXS(m).ti1.so1.at(0)); break
    case 'moveSU': moveSC(m, getXS(m).ti1, getFXS(m).su.at(-2), getFXS(m).su.at(-1)); break
    case 'moveSB': moveSC(m, getXS(m).ti1, getXS(m).ti1.so1.at(-1), undefined); break
    case 'moveSO': moveSC(m, getFXS(m).su.at(-1)!, getFXS(m).su.at(-1)!.so1.at(-1), undefined); break
    case 'moveSI': moveSC(m, getXS(m).si1!.ti1, getXS(m).si1!, getXS(m).si1!.sd.at(-1)); break
    case 'moveSByDrag': if (payload.sl) moveSC(m, idToS(m, payload.sl),  idToS(m, payload.su), idToS(m, payload.sd)); break
    case 'moveCRD': moveCL(getAXC(m), getAXC(m).map(ci => ci.cd.at(-1)!), getXC(m).path.indexOf('c') + 1, 1); break
    case 'moveCRU': moveCL(getAXC(m), getAXC(m).map(ci => ci.cu.at(-1)!), getXC(m).path.indexOf('c') + 1, - 1); break
    case 'moveCCR': moveCL(getAXC(m), getAXC(m).map(ci => ci.cr.at(-1)!), getXC(m).path.indexOf('c') + 2, 1); break
    case 'moveCCL': moveCL(getAXC(m), getAXC(m).map(ci => ci.cl.at(-1)!), getXC(m).path.indexOf('c') + 2, - 1); break
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
    case 'setLineWidth': getAXS(m).forEach(si => Object.assign(si, { lineWidth: payload })); break
    case 'setLineType': getAXS(m).forEach(si => Object.assign(si, { lineType: payload })); break
    case 'setLineColor': getAXS(m).forEach(si => Object.assign(si, { lineColor: payload })); break
    case 'setSBorderWidth': getAXS(m).forEach(si => Object.assign(si, { sBorderWidth: payload })); break
    case 'setFBorderWidth': getAXS(m).forEach(si => Object.assign(si, { fBorderWidth: payload })); break
    case 'setSBorderColor': getAXS(m).forEach(si => Object.assign(si, { sBorderColor: payload })); break
    case 'setFBorderColor': getAXS(m).forEach(si => Object.assign(si, { fBorderColor: payload })); break
    case 'setSFillColor': getAXS(m).forEach(si => Object.assign(si, { sFillColor: payload })); break
    case 'setFFillColor': getAXS(m).forEach(si => Object.assign(si, { fFillColor: payload })); break
    case 'setTextFontSize': getAXS(m).forEach(si => Object.assign(si, { textFontSize: payload })); break
    case 'setTextColor': getAXS(m).forEach(si => Object.assign(si, { textColor: payload })); break
    case 'setBlur': getAXS(m).forEach(si => Object.assign(si, { blur: 1 })); break
    case 'setTaskModeOn': [getXS(m), ...getXS(m).so].forEach(si => Object.assign(si, { taskStatus: si.taskStatus === 0 ? 1 : si.taskStatus })); break
    case 'setTaskModeOff': [getXS(m), ...getXS(m).so].forEach(si => Object.assign(si, { taskStatus: 0 })); break
    case 'setTaskModeReset': [getXS(m), ...getXS(m).so].forEach(si => Object.assign(si, { taskStatus: si.taskStatus > 0 ? 1 : si.taskStatus })); break
    case 'setTaskStatus': Object.assign(idToS(m, payload.nodeId), { taskStatus: payload.taskStatus }); break
    case 'clearDimensions': Object.assign(getXS(m), { dimW: sSaveOptional.dimW, dimH: sSaveOptional.dimH }); break
    case 'clearLine': getAXS(m).forEach(si => Object.assign(si, { lineWidth: sSaveOptional.lineWidth, lineType: sSaveOptional.lineType, lineColor: sSaveOptional.lineColor })); break
    case 'clearSBorder': getAXS(m).forEach(si => Object.assign(si, { sBorderWidth: sSaveOptional.sBorderWidth, sBorderColor: sSaveOptional.sBorderColor })); break
    case 'clearFBorder': getAXS(m).forEach(si => Object.assign(si, { fBorderWidth: sSaveOptional.fBorderWidth, fBorderColor: sSaveOptional.fBorderColor })); break
    case 'clearSFill': getAXS(m).forEach(si => Object.assign(si, { sFillColor: sSaveOptional.sFillColor })); break
    case 'clearFFill': getAXS(m).forEach(si => Object.assign(si, { fFillColor: sSaveOptional.fFillColor })); break
    case 'clearText': getAXS(m).forEach(si => Object.assign(si, { textColor: sSaveOptional.textColor, textFontSize: sSaveOptional.textFontSize })); break
    case 'clearBlur': getAXS(m).forEach(si => Object.assign(si, { blur: sSaveOptional.blur })); break
  }
}
