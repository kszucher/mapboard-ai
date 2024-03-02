import isEqual from "react-fast-compare"
import {sSaveOptional} from "../state/MapState"
import {G, L, M, N, P, PT, T, SSaveOptional, S, R, C, NPartial, PR, PS, PC} from "../state/MapStateTypes"
import {isArrayOfEqualValues} from "../utils/Utils"
import {MapMode} from "../state/Enums.ts"

export const sortablePath = (p: P): string => p.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('')

export const sortPath = (a: N, b: N) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
export const sortNode = (a: NPartial, b: NPartial) => a.nodeId > b.nodeId ? 1 : -1

export const pathToR = (m: M, p: PR) => m.find(ti => isEqual(ti.path, p)) as R
export const pathToS = (m: M, p: PS) => m.find(ti => isEqual(ti.path, p)) as S
export const pathToC = (m: M, p: PC) => m.find(ti => isEqual(ti.path, p)) as C

export const idToR = (m: M, nodeId: string) => m.find(ri => ri.nodeId === nodeId) as R
export const idToS = (m: M, nodeId: string) => m.find(si => si.nodeId === nodeId) as S
export const idToC = (m: M, nodeId: string) => m.find(ci => ci.nodeId === nodeId) as C

export const getHN = (m: M): Map<string, T> => new Map<string, T>(m.map(ti => [ti.nodeId, ti as T]))
export const getHP = (m: M): Map<string, T> => new Map<string, T>(m.map(ti => [ti.path.join(''), ti as T]))

const getPathPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')

export const isG = (p: P): boolean => p.at(0) === 'g'
export const isL = (p: P): boolean => p.at(0) === 'l'
export const isR = (p: P): boolean => p.at(-2) === 'r'
export const isS = (p: P): boolean => p.at(-2) === 's'
export const isC = (p: P): boolean => p.at(-3) === 'c'
export const isRS = (p: P): boolean => p.at(-4) === 'r' && isS(p)
export const isRSC = (p: P): boolean => p.at(-7) === 'r' && p.at(-5) === 's' && p.at(-3) === 'c'
export const isSS = (p: P): boolean => p.at(-4) === 's' && p.at(-2) === 's'
export const isSSC = (p: P): boolean => p.at(-7) === 's' && p.at(-5) === 's' && p.at(-3) === 'c'
export const isCS = (p: P): boolean => p.at(-5) === 'c' && p.at(-2) === 's'

export const mG = (m: M): G[] => m.filter(n => isG(n.path)) as G[]
export const mL = (m: M): L[] => m.filter(n => isL(n.path)) as L[]
export const mR = (m: M): R[] => m.filter(n => isR(n.path)) as R[]
export const mS = (m: M): S[] => m.filter(n => isS(n.path)) as S[]
export const mRS = (m: M): S[] => m.filter(n => isRS(n.path)) as S[]
export const mSS = (m: M): S[] => m.filter(n => isSS(n.path)) as S[]
export const mCS = (m: M): S[] => m.filter(n => isCS(n.path)) as S[]
export const mC = (m: M): C[] => m.filter(n => isC(n.path)) as C[]

export const getXR = (m: M): R => mR(m).reduce((a, b) => a.selected > b.selected ? a : b, {} as R)
export const getXS = (m: M): S => mS(m).reduce((a, b) => a.selected > b.selected ? a : b, {} as S)
export const getXC = (m: M): C => mC(m).reduce((a, b) => a.selected > b.selected ? a : b, {} as C)
export const getXAR = (m: M): R[] => mR(m).filter(ri => ri.selected)
export const getXARS = (m: M): S[] => mRS(m).filter(si => si.selected)
export const getXASS = (m: M): S[] => mSS(m).filter(si => si.selected)
export const getXACS = (m: M): S[] => mCS(m).filter(si => si.selected)
export const getXAS = (m: M): S[] => mS(m).filter(si => si.selected)
export const getXAC = (m: M): C[] => mC(m).filter(ci => ci.selected)

export const isXAR = (m: M): boolean => getXAR(m).length > 0
export const isXAS = (m: M): boolean => getXAS(m).length > 0
export const isXARS = (m: M): boolean => getXARS(m).length > 0
export const isXASS = (m: M): boolean => getXASS(m).length > 0
export const isXACS = (m: M): boolean => getXACS(m).length > 0
export const isXASVN = (m: M): boolean => getXAS(m).length > 0 && isArrayOfEqualValues(getXAS(m).map((ni, i) => ni.path.with(-1, ni.path.at(-1) - i)))
export const isXC = (m: M): boolean => getXAC(m).length === 1
export const isXACR = (m: M): boolean => getXAC(m).length > 1 && isArrayOfEqualValues(getXAC(m).map(ni => ni.path.with(-1, 0)))
export const isXACC = (m: M): boolean => getXAC(m).length > 1 && isArrayOfEqualValues(getXAC(m).map(ni => ni.path.with(-2, 0)))

export const getXFS = (m: M): S => mS(m).find(si => si.selected)!
export const getXLS = (m: M): S => mS(m).findLast(si => si.selected)!

export const getLastIndexL = (m: M): number => m.findLast(ti => getPathPattern(ti.path) === 'l')?.path.at(1) || -1
export const getLastIndexR = (m: M): number => m.findLast(ti => getPathPattern(ti.path) === 'r')?.path.at(1) || 0

export const getG = (m: M): G => mG(m).at(0) as G

export const getLCS = (m: M): S => pathToS(m, [...getXS(m).path.slice(0, -5), 'c', getXS(m).path.at(-4), getXS(m).path.at(-3) - 1, 's', 0])
export const getRCS = (m: M): S => pathToS(m, [...getXS(m).path.slice(0, -5), 'c', getXS(m).path.at(-4), getXS(m).path.at(-3) + 1, 's', 0])
export const getDCS = (m: M): S => pathToS(m, [...getXS(m).path.slice(0, -5), 'c', getXS(m).path.at(-4) + 1, getXS(m).path.at(-3), 's', 0])
export const getUCS = (m: M): S => pathToS(m, [...getXS(m).path.slice(0, -5), 'c', getXS(m).path.at(-4) - 1, getXS(m).path.at(-3), 's', 0])

const isOfSameR = (p: PT, pt: PT): boolean => pt.at(1) === p.at(1)
const isOfSameC = (p: PT, pt: PT): boolean => isEqual(p.slice(0, p.findLastIndex(pi => pi === 'c') + 3), pt.slice(0, pt.findLastIndex(pti => pti === 'c') + 3))

const isQuasiSD = (p: PT, pt: PT): boolean => isOfSameR(p, pt) && isOfSameC(p, pt) && sortablePath(pt) > sortablePath(p) && getPathPattern(pt) === getPathPattern(p)
const isQuasiSU = (p: PT, pt: PT): boolean => isOfSameR(p, pt) && isOfSameC(p, pt) && sortablePath(pt) < sortablePath(p) && getPathPattern(pt) === getPathPattern(p)

export const getQuasiSD = (m: M): S => mS(m).find(ti => !ti.selected && isQuasiSD(getXS(m).path, ti.path))!
export const getQuasiSU = (m: M): S => mS(m).findLast(ti => !ti.selected && isQuasiSU(getXS(m).path, ti.path))!

export const isREO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)
export const isSEO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)
export const isCEO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)

export const isRDO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) > p.at(-1)
export const isSEODO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) >= p.at(-1)
export const isCD = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) > p.at(-2)! && pt.at(p.length - 1) === p.at(-1)
export const isCR = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) === p.at(-2)! && pt.at(p.length - 1) > p.at(-1)

export const getXAEO = (m: M): T[] => {const xa = getXAS(m); return m.filter(ti => xa.some(xti => isSEO(xti.path, ti.path as PT))) as T[]}

export const lToCb = (m: M): L[] =>
  mL(m).filter(li => getNodeById(m, li.fromNodeId).selected && idToR(m, li.toNodeId).selected).map((li, i) => ({...li, path: ['l', i]}))

export const rToCb = (m: M): T[] => {
  const xar = getXAR(m)
  const xarIndices = xar.map(ri => ri.path.at(1))
  return ([
    ...mR(m).filter(ri => xar.some(xari => xari.path.at(1) === ri.path.at(1))).map(ri => ({...ri, path: ri.path.with(1, xarIndices.indexOf(ri.path[1]))})),
    ...mS(m).filter(si => xar.some(xari => xari.path.at(1) === si.path.at(1))).map(si => ({...si, path: si.path.with(1, xarIndices.indexOf(si.path[1]))})),
    ...mC(m).filter(ci => xar.some(xari => xari.path.at(1) === ci.path.at(1))).map(ci => ({...ci, path: ci.path.with(1, xarIndices.indexOf(ci.path[1]))}))
  ] as T[]).sort(sortPath)
}

export const sToCb = (m: M): N[] =>
  mS(getXAEO(m))
    .map(ti => ({...ti, path: ['s', ti.path.at(getXS(m).path.length - 1) - getXFS(m).su.length, ...ti.path.slice(getXS(m).path.length)]})) as unknown as N[]

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

export const getMapMode = (m: M) => {
  if ((m as T[]).some((ti: T) => ti.selected)) {
    if (isXAR(m)) {
      return MapMode.EDIT_ROOT
    } else if (isXAS(m)) {
      return MapMode.EDIT_STRUCT
    } else if (isXC(m)) {
      return MapMode.EDIT_CELL
    }
  } else {
    return MapMode.VIEW
  }
}

// TODO remove
const getRSCIPL = (p: PT): PT[] => p.map((_, i) => p.slice(0, i)).filter(pi => (['r', 's'].includes(pi.at(-2)) || pi.at(-3) === 'c' )).map(el => el as PT)
export const getSIPL = (p: PT): PT[] => getRSCIPL(p).filter(pi => !isR(pi) && !isC(pi))
const getSI1 = (p: PT) => p.slice(0, p.findLastIndex(el => typeof el === 'string')) as PT
const isSI1 = (p: PT, pt: PT): boolean => pt.length < p.length && isEqual(pt, getSI1(p))
export const getNodeByPath = (m: M, p: PT) => m.find(ti => isEqual(ti.path, p)) as T
export const getNodeById = (m: M, nodeId: string) => m.find(ti => ti.nodeId === nodeId) as T
export const getTR = (m: M, t: T): T => getNodeByPath(m, t.path.slice(0, 2) as PT)
export const getXSI1 = (m: M): T => m.find(ti => isSI1(getXFS(m).path, ti.path as PT))! as T
