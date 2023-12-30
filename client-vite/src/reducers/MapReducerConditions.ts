import {M} from "../state/MapStateTypes.ts"

export const mapReducerConditions = (m: M, action: string): boolean => {
  switch (action) {
    case 'LOAD': return false

    case 'setDensitySmall': return false
    case 'setDensityLarge': return false
    case 'setPlaceTypeExploded': return false
    case 'setPlaceTypeIndented': return false

    case 'selectT': return false
    case 'selectXR': return false
    case 'selectSelfX': return false
    case 'selectFamilyX': return false
    case 'selectSD': return false
    case 'selectSU': return false
    case 'selectSO': return false
    case 'selectSI': return false
    case 'selectSF': return false
    case 'selectCFfirstRow': return false
    case 'selectCFfirstCol': return false
    case 'selectCFF': return false
    case 'selectXSIC': return false
    case 'selectTtoo': return false
    case 'selectSDtoo': return false
    case 'selectSUtoo': return false
    case 'selectRA': return false
    case 'selectSA': return false
    case 'selectCRSAME': return false
    case 'selectCCSAME': return false
    case 'selectCD': return false
    case 'selectCU': return false
    case 'selectCR': return false
    case 'selectCL': return false
    case 'selectByRectangle': return false

    case 'insertL': return false
    case 'insertR': return false
    case 'insertSD': return false
    case 'insertSU': return false
    case 'insertSO': return false
    case 'insertSOText': return false
    case 'insertSOLink': return false
    case 'insertSOImage': return false
    case 'insertCRD': return false
    case 'insertCRU': return false
    case 'insertSCRD': return false
    case 'insertSCRU': return false
    case 'insertCCR': return false
    case 'insertCCL': return false
    case 'insertSCCR': return false
    case 'insertSCCL': return false
    case 'insertSOTable': return false

    case 'gptParseNodesS': return false
    case 'gptParseNodesT': return false
    case 'gptParseNodeMermaid': return false

    case 'deleteL': return false
    case 'deleteLR': return false
    case 'deleteS': return false
    case 'deleteCR': return false
    case 'deleteCC': return false

    case 'cutLR': return false
    case 'cutS': return false
    case 'copyLR': return false
    case 'copyS': return false
    case 'pasteLR': return false
    case 'pasteSO': return false
    case 'duplicateR': return false
    case 'duplicateS': return false
    case 'moveSD': return false
    case 'moveST': return false
    case 'moveSU': return false
    case 'moveSB': return false
    case 'moveSO': return false
    case 'moveSI': return false
    case 'moveByDrag': return false
    case 'moveCRD': return false
    case 'moveCRU': return false
    case 'moveCCR': return false
    case 'moveCCL': return false
    case 'moveS2TO': return false
    case 'transpose': return false

    case 'setTaskStatus': return false
    case 'setContentText': return false
    case 'setContentEquation': return false
    case 'setContentMermaid': return false
    case 'setControlTypeNone': return false
    case 'setControlTypeIngestion': return false
    case 'setControlTypeExtraction': return false
    case 'offsetD': return false
    case 'offsetU': return false
    case 'offsetR': return false
    case 'offsetL': return false
    case 'setLlmData': return false
    case 'setLineWidth': return false
    case 'setLineType': return false
    case 'setLineColor': return false
    case 'setSBorderWidth': return false
    case 'setFBorderWidth': return false
    case 'setSBorderColor': return false
    case 'setFBorderColor': return false
    case 'setSFillColor': return false
    case 'setFFillColor': return false
    case 'setTextFontSize': return false
    case 'setTextColor': return false
    case 'setBlur': return false
    case 'setTaskModeOn': return false
    case 'setTaskModeOff': return false
    case 'setTaskModeReset': return false

    case 'clearDimensions': return false
    case 'clearLlmData': return false
    case 'clearLine': return false
    case 'clearSBorder': return false
    case 'clearFBorder': return false
    case 'clearSFill': return false
    case 'clearFFill': return false
    case 'clearText': return false
    case 'clearBlur': return false
  }
  return false
}
