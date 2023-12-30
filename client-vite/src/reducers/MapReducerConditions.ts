import {getCountXCO1, getX, isXACC, isXR, isXS} from "../selectors/MapQueries.ts"
import {M} from "../state/MapStateTypes.ts"
import {MRT} from "./MapReducerTypes.ts"

export const mrc = (m: M, action: MRT): boolean => {
  switch (action) {
    case MRT.LOAD: return false

    case MRT.undo: return false
    case MRT.redo: return false
    case MRT.saveView: return false
    case MRT.saveFromCoordinates: return false

    case MRT.setDensitySmall: return false
    case MRT.setDensityLarge: return false
    case MRT.setPlaceTypeExploded: return false
    case MRT.setPlaceTypeIndented: return false

    case MRT.selectT: return false
    case MRT.selectXR: return false
    case MRT.selectSelfX: return false
    case MRT.selectFamilyX: return false
    case MRT.selectSD: return false
    case MRT.selectSU: return false
    case MRT.selectSO: return false
    case MRT.selectSI: return false
    case MRT.selectSF: return false
    case MRT.selectCFfirstRow: return isXACC(m)
    case MRT.selectCFfirstCol: return false
    case MRT.selectCFF: return false
    case MRT.selectXSIC: return false
    case MRT.selectTtoo: return false
    case MRT.selectSDtoo: return false
    case MRT.selectSUtoo: return false
    case MRT.selectRA: return false
    case MRT.selectSA: return false
    case MRT.selectCRSAME: return false
    case MRT.selectCCSAME: return false
    case MRT.selectCD: return false
    case MRT.selectCU: return false
    case MRT.selectCR: return false
    case MRT.selectCL: return false
    case MRT.selectByRectangle: return false

    case MRT.insertL: return false
    case MRT.insertR: return false
    case MRT.insertSD: return isXS(m)
    case MRT.insertSU: return false
    case MRT.insertSO: return isXS(m) || isXR(m)
    case MRT.insertSOText: return false
    case MRT.insertSOLink: return false
    case MRT.insertSOImage: return false
    case MRT.insertCRD: return false
    case MRT.insertCRU: return false
    case MRT.insertSCRD: return isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0
    case MRT.insertSCRU: return isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0
    case MRT.insertCCR: return false
    case MRT.insertCCL: return false
    case MRT.insertSCCR: return isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0
    case MRT.insertSCCL: return isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0
    case MRT.insertSOTable: return false

    case MRT.gptParseNodesS: return false
    case MRT.gptParseNodesT: return false
    case MRT.gptParseNodeMermaid: return false

    case MRT.deleteL: return false
    case MRT.deleteLR: return false
    case MRT.deleteS: return false
    case MRT.deleteCR: return false
    case MRT.deleteCC: return false

    case MRT.cutLR: return false
    case MRT.cutS: return false
    case MRT.copyLR: return false
    case MRT.copyS: return false
    case MRT.pasteLR: return false
    case MRT.pasteSO: return false
    case MRT.duplicateR: return false
    case MRT.duplicateS: return false
    case MRT.moveSD: return false
    case MRT.moveST: return false
    case MRT.moveSU: return false
    case MRT.moveSB: return false
    case MRT.moveSO: return false
    case MRT.moveSI: return false
    case MRT.moveByDrag: return false
    case MRT.moveCRD: return false
    case MRT.moveCRU: return false
    case MRT.moveCCR: return false
    case MRT.moveCCL: return false
    case MRT.moveS2TO: return false
    case MRT.transpose: return false

    case MRT.setTaskStatus: return false
    case MRT.setContentText: return false
    case MRT.setContentEquation: return false
    case MRT.setContentMermaid: return false
    case MRT.setControlTypeNone: return false
    case MRT.setControlTypeIngestion: return false
    case MRT.setControlTypeExtraction: return false
    case MRT.offsetD: return false
    case MRT.offsetU: return false
    case MRT.offsetR: return false
    case MRT.offsetL: return false
    case MRT.setLlmData: return false
    case MRT.setLineWidth: return false
    case MRT.setLineType: return false
    case MRT.setLineColor: return false
    case MRT.setSBorderWidth: return false
    case MRT.setFBorderWidth: return false
    case MRT.setSBorderColor: return false
    case MRT.setFBorderColor: return false
    case MRT.setSFillColor: return false
    case MRT.setFFillColor: return false
    case MRT.setTextFontSize: return false
    case MRT.setTextColor: return false
    case MRT.setBlur: return false
    case MRT.setTaskModeOn: return false
    case MRT.setTaskModeOff: return false
    case MRT.setTaskModeReset: return false

    case MRT.clearDimensions: return false
    case MRT.clearLlmData: return false
    case MRT.clearLine: return false
    case MRT.clearSBorder: return false
    case MRT.clearFBorder: return false
    case MRT.clearSFill: return false
    case MRT.clearFFill: return false
    case MRT.clearText: return false
    case MRT.clearBlur: return false
  }
  return false
}
