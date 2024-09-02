import isEqual from "react-fast-compare"
import {sSaveOptional} from "../state/MapState"
import {C, G, L, M, N, PC, PR, PS, R, S, SSaveOptional} from "../state/MapStateTypes"
import {NodeMode} from "../state/Enums.ts"
import {isArrayOfEqualValues} from "../utils/Utils"
import {getPathPattern, isC, isCS, isG, isL, isQuasiSD, isQuasiSU, isR, isRS, isS, isSS} from "./PathQueries.ts"
import {sortPath} from "../mapMutations/MapSort.ts";

export const getHN = (m: M): Map<string, N> => new Map<string, N>(m.map(ni => [ni.nodeId, ni as N]))
export const getHP = (m: M): Map<string, N> => new Map<string, N>(m.map(ni => [ni.path.join(''), ni as N]))

export const mG = (m: M): G[] => m.filter(n => isG(n.path)) as G[]
export const mL = (m: M): L[] => m.filter(n => isL(n.path)) as L[]
export const mR = (m: M): R[] => m.filter(n => isR(n.path)) as R[]
export const mS = (m: M): S[] => m.filter(n => isS(n.path)) as S[]
export const mRS = (m: M): S[] => m.filter(n => isRS(n.path)) as S[]
export const mSS = (m: M): S[] => m.filter(n => isSS(n.path)) as S[]
export const mCS = (m: M): S[] => m.filter(n => isCS(n.path)) as S[]
export const mC = (m: M): C[] => m.filter(n => isC(n.path)) as C[]

export const pathToR = (m: M, p: PR) => mR(m).find(ri => isEqual(ri.path, p)) as R
export const pathToS = (m: M, p: PS) => mS(m).find(si => isEqual(si.path, p)) as S
export const pathToC = (m: M, p: PC) => mC(m).find(ci => isEqual(ci.path, p)) as C

export const idToL = (m: M, nodeId: string) => mL(m).find(li => li.nodeId === nodeId) as L
export const idToR = (m: M, nodeId: string) => mR(m).find(ri => ri.nodeId === nodeId) as R
export const idToS = (m: M, nodeId: string) => mS(m).find(si => si.nodeId === nodeId) as S
export const idToC = (m: M, nodeId: string) => mC(m).find(ci => ci.nodeId === nodeId) as C

export const getG = (m: M): G => mG(m).at(0) as G

export const getXR = (m: M): R => mR(m).reduce((a, b) => a.selected > b.selected ? a : b, {} as R)
export const getXS = (m: M): S => mS(m).reduce((a, b) => a.selected > b.selected ? a : b, {} as S)
export const getXC = (m: M): C => mC(m).reduce((a, b) => a.selected > b.selected ? a : b, {} as C)

export const getXAR = (m: M): R[] => mR(m).filter(ri => ri.selected).sort(sortPath)
export const getXARS = (m: M): S[] => mRS(m).filter(si => si.selected).sort(sortPath)
export const getXASS = (m: M): S[] => mSS(m).filter(si => si.selected).sort(sortPath)
export const getXACS = (m: M): S[] => mCS(m).filter(si => si.selected).sort(sortPath)
export const getXAS = (m: M): S[] => mS(m).filter(si => si.selected).sort(sortPath)
export const getXAC = (m: M): C[] => mC(m).filter(ci => ci.selected).sort(sortPath)

export const getXFS = (m: M): S => mS(m).find(si => si.selected)! // should be path sorted (actually, once getXAS is path sorted, getXAS(m).at(0))
export const getXLS = (m: M): S => mS(m).findLast(si => si.selected)! // should be path sorted (actually, once getXAS is path sorted, getXAS(m).at(-1))

export const getLastIndexL = (m: M): number => m.findLast(ti => getPathPattern(ti.path) === 'l')?.path.at(1) ?? -1 // should use Math.max OR we can use getXAR(m).at(-1).path.at(-1) as that is sorted
export const getLastIndexR = (m: M): number => m.findLast(ti => getPathPattern(ti.path) === 'r')?.path.at(1) ?? -1 // should use Math.max OR we can use getXAR(m).at(-1).path.at(-1) as that is sorted

export const isXAR = (m: M): boolean => getXAR(m).length > 0
export const isXAS = (m: M): boolean => getXAS(m).length > 0
export const isXARS = (m: M): boolean => getXARS(m).length > 0
export const isXASS = (m: M): boolean => getXASS(m).length > 0
export const isXACS = (m: M): boolean => getXACS(m).length > 0
export const isXASVN = (m: M): boolean => getXAS(m).length > 0 && isArrayOfEqualValues(getXAS(m).map((ni, i) => ni.path.with(-1, ni.path.at(-1) - i)))
export const isXC = (m: M): boolean => getXAC(m).length === 1
export const isXACR = (m: M): boolean => getXAC(m).length > 1 && isArrayOfEqualValues(getXAC(m).map(ni => ni.path.with(-1, 0)))
export const isXACC = (m: M): boolean => getXAC(m).length > 1 && isArrayOfEqualValues(getXAC(m).map(ni => ni.path.with(-2, 0)))

export const getQuasiSD = (m: M): S => mS(m).find(si => !si.selected && isQuasiSD(getXS(m).path, si.path))!
export const getQuasiSU = (m: M): S => mS(m).findLast(si => !si.selected && isQuasiSU(getXS(m).path, si.path))!

export const getLineWidth = (m: M): SSaveOptional['lineWidth'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.lineWidth)) ? getXS(m).lineWidth : sSaveOptional.lineWidth
export const getLineType = (m: M): SSaveOptional['lineType'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.lineType)) ? getXS(m).lineType : sSaveOptional.lineType
export const getLineColor = (m: M): SSaveOptional['lineColor'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.lineColor)) ? getXS(m).lineColor : sSaveOptional.lineColor
export const getSBorderWidth = (m: M): SSaveOptional['sBorderWidth'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.sBorderWidth)) ? getXS(m).sBorderWidth : sSaveOptional.sBorderWidth
export const getFBorderWidth = (m: M): SSaveOptional['fBorderWidth'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.fBorderWidth)) ? getXS(m).fBorderWidth : sSaveOptional.fBorderWidth
export const getSBorderColor = (m: M): SSaveOptional['sBorderColor'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.sBorderColor)) ? getXS(m).sBorderColor : sSaveOptional.sBorderColor
export const getFBorderColor = (m: M): SSaveOptional['fBorderColor'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.fBorderColor)) ? getXS(m).fBorderColor : sSaveOptional.fBorderColor
export const getSFillColor = (m: M): SSaveOptional['sFillColor'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.sFillColor)) ? getXS(m).sFillColor : sSaveOptional.sFillColor
export const getFFillColor = (m: M): SSaveOptional['fFillColor'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.fFillColor)) ? getXS(m).fFillColor : sSaveOptional.fFillColor
export const getTextFontSize = (m: M): SSaveOptional['textFontSize'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.textFontSize)) ? getXS(m).textFontSize : sSaveOptional.textFontSize
export const getTextColor = (m: M): SSaveOptional['textColor'] => isArrayOfEqualValues(getXAS(m).map(ti => ti.textColor)) ? getXS(m).textColor : sSaveOptional.textColor

export const hasTask = (m: M, r: R): number => +mS(m).filter(ti => ti.path.at(1) === r.path.at(1) && ti.path.length > 2).some(ti => ti.taskStatus !== 0)

export const isExistingLink = (m: M, l: L): boolean => mL(m).some(li =>
  l.fromNodeId === li.fromNodeId &&
  l.toNodeId === li.toNodeId &&
  l.fromNodeSide  === li.fromNodeSide &&
  l.toNodeSide === li.toNodeSide
)

export const getNodeMode = (m: M) => {
  if ([...mR(m), ...mS(m), ...mC(m)].every(ni => ni.selected === 0)) return NodeMode.VIEW
  if (isXAR(m)) return NodeMode.EDIT_ROOT
  if (isXAS(m)) return NodeMode.EDIT_STRUCT
  if (isXC(m)) return NodeMode.EDIT_CELL
  if (isXACR(m)) return NodeMode.EDIT_CELL_ROW
  if (isXACC(m)) return NodeMode.EDIT_CELL_COLUMN
}
