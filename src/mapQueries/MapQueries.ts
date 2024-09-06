import isEqual from "react-fast-compare"
import {sSaveOptional} from "../state/MapState"
import {C, G, L, M, N, PC, PR, PS, R, S, T, SSaveOptional} from "../state/MapStateTypes"
import {NodeMode} from "../state/Enums.ts"
import {excludeKeys, getEquals, hasEquals, hasTrues} from "../utils/Utils"
import {isC, isCS, isG, isT, isL, isQuasiSD, isQuasiSU, isR, isRS, isS, isSS} from "./PathQueries.ts"
import {sortPath} from "../mapMutations/MapSort.ts"

export const mapArrayToObject = (m: M): object => Object.fromEntries(m.map(n => [n.nodeId, excludeKeys(n, ['nodeId'])]))
export const mapObjectToArray = (obj: object): M => Object.entries(obj).map(el => ({nodeId: el[0], ...el[1]} as N))

export const getHN = (m: M): Map<string, N> => new Map<string, N>(m.map(ni => [ni.nodeId, ni as N]))
export const getHP = (m: M): Map<string, N> => new Map<string, N>(m.map(ni => [ni.path.join(''), ni as N]))

export const mG = (m: M): G[] => m.filter(n => isG(n.path)) as G[]
export const mL = (m: M): L[] => m.filter(n => isL(n.path)) as L[]
export const mR = (m: M): R[] => m.filter(n => isR(n.path)) as R[]
export const mS = (m: M): S[] => m.filter(n => isS(n.path)) as S[]
export const mC = (m: M): C[] => m.filter(n => isC(n.path)) as C[]
export const mT = (m: M): T[] => m.filter(n => isT(n.path)) as T[]

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

export const getAXR = (m: M): R[] => mR(m).filter(ri => ri.selected).sort(sortPath)
export const getAXS = (m: M): S[] => mS(m).filter(si => si.selected).sort(sortPath)
export const getAXC = (m: M): C[] => mC(m).filter(ci => ci.selected).sort(sortPath)

export const getFXS = (m: M): S => getAXS(m).sort(sortPath).at(0)!
export const getLXS = (m: M): S => getAXS(m).sort(sortPath).at(-1)!

export const getLastIndexL = (m: M): number => Math.max(-1, ...mL(m).map(li => li.path.at(-1) as number))
export const getLastIndexR = (m: M): number => Math.max(-1, ...mR(m).map(ri => ri.path.at(-1) as number))

export const isAXL = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isL(el.path)))
export const isAXR = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isR(el.path)))
export const isAXS = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isS(el.path)))
export const isAXRS = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isRS(el.path)))
export const isAXSS = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isSS(el.path)))
export const isAXCS = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isCS(el.path)))
export const isAXC = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isC(el.path)))

export const isAXSN = (m: M): boolean => isAXS(m) && hasEquals(getAXS(m).map((ni, i) => ni.path.with(-1, ni.path.at(-1) - i)))
export const isAXC1 = (m: M): boolean => isAXC(m) && getAXC(m).length === 1
export const isAXCR = (m: M): boolean => isAXC(m) && getAXC(m).length > 1 && hasEquals(getAXC(m).map(ni => ni.path.with(-1, 0)))
export const isAXCC = (m: M): boolean => isAXC(m) && getAXC(m).length > 1 && hasEquals(getAXC(m).map(ni => ni.path.with(-2, 0)))

export const hasQuasiSD = (m: M): boolean => {const xs = getXS(m); return (xs.ci ?? xs.ri).so.filter(si => !si.selected && isQuasiSD(xs.path, si.path)).length > 0}
export const hasQuasiSU = (m: M): boolean => {const xs = getXS(m); return (xs.ci ?? xs.ri).so.filter(si => !si.selected && isQuasiSU(xs.path, si.path)).length > 0}

export const getQuasiSD = (m: M): S => {const xs = getXS(m); return (xs.ci ?? xs.ri).so.reverse().find(si => !si.selected && isQuasiSD(xs.path, si.path))!}
export const getQuasiSU = (m: M): S => {const xs = getXS(m); return (xs.ci ?? xs.ri).so.reverse().findLast(si => !si.selected && isQuasiSU(xs.path, si.path))!}

export const getLineWidth = (m: M): SSaveOptional['lineWidth'] => getEquals(getAXS(m).map(ti => ti.lineWidth)) ?? sSaveOptional.lineWidth
export const getLineType = (m: M): SSaveOptional['lineType'] => getEquals(getAXS(m).map(ti => ti.lineType)) ?? sSaveOptional.lineType
export const getLineColor = (m: M): SSaveOptional['lineColor'] => getEquals(getAXS(m).map(ti => ti.lineColor)) ?? sSaveOptional.lineColor
export const getSBorderWidth = (m: M): SSaveOptional['sBorderWidth'] => getEquals(getAXS(m).map(ti => ti.sBorderWidth)) ?? sSaveOptional.sBorderWidth
export const getFBorderWidth = (m: M): SSaveOptional['fBorderWidth'] => getEquals(getAXS(m).map(ti => ti.fBorderWidth)) ?? sSaveOptional.fBorderWidth
export const getSBorderColor = (m: M): SSaveOptional['sBorderColor'] => getEquals(getAXS(m).map(ti => ti.sBorderColor)) ?? sSaveOptional.sBorderColor
export const getFBorderColor = (m: M): SSaveOptional['fBorderColor'] => getEquals(getAXS(m).map(ti => ti.fBorderColor)) ?? sSaveOptional.fBorderColor
export const getSFillColor = (m: M): SSaveOptional['sFillColor'] => getEquals(getAXS(m).map(ti => ti.sFillColor)) ?? sSaveOptional.sFillColor
export const getFFillColor = (m: M): SSaveOptional['fFillColor'] => getEquals(getAXS(m).map(ti => ti.fFillColor)) ?? sSaveOptional.fFillColor
export const getTextFontSize = (m: M): SSaveOptional['textFontSize'] => getEquals(getAXS(m).map(ti => ti.textFontSize)) ?? sSaveOptional.textFontSize
export const getTextColor = (m: M): SSaveOptional['textColor'] => getEquals(getAXS(m).map(ti => ti.textColor)) ?? sSaveOptional.textColor

export const isExistingLink = (m: M, l: L): boolean => mL(m).some(li =>
  l.fromNodeId === li.fromNodeId &&
  l.toNodeId === li.toNodeId &&
  l.fromNodeSide  === li.fromNodeSide &&
  l.toNodeSide === li.toNodeSide
)

export const getNodeMode = (m: M) => {
  if (isAXL(m)) return NodeMode.EDIT_LINE
  else if (isAXR(m)) return NodeMode.EDIT_ROOT
  else if (isAXS(m)) return NodeMode.EDIT_STRUCT
  else if (isAXC1(m)) return NodeMode.EDIT_CELL
  else if (isAXCR(m)) return NodeMode.EDIT_CELL_ROW
  else if (isAXCC(m)) return NodeMode.EDIT_CELL_COLUMN
  else return NodeMode.VIEW
}
