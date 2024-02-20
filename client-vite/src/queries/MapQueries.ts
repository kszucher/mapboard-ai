import isEqual from "react-fast-compare"
import {tSaveOptional} from "../state/MapState"
import {G, L, M, N, P, PT, PTC, T, TSaveOptional} from "../state/MapStateTypes"
import {isArrayOfEqualValues} from "../utils/Utils"
import {MapMode} from "../state/Enums.ts"

export const sortablePath = (p: P): string => p.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('')

export const sortPath = (a: N, b: N) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
export const sortNode = (a: N, b: N) => a.nodeId > b.nodeId ? 1 : -1

export const getNodeByPath = (m: M, p: PT) => m.find(ti => isEqual(ti.path, p)) as T
export const getNodeById = (m: M, nodeId: string) => m.find(ti => ti.nodeId === nodeId) as T

const getPathPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')

export const getXF = (m: M): T => mT(m).find(ti => ti.selected)! as T
export const getXL = (m: M): T => mT(m).findLast(ti => ti.selected)!
export const getX = (m: M): T => mT(m).reduce((a, b) => a.selected > b.selected ? a : b)
export const getXA = (m: M): T[] => mT(m).filter(ti => ti.selected) as T[]

export const getLastIndexL = (m: M): number => m.findLast(ti => getPathPattern(ti.path) === 'l')?.path.at(1) || -1
export const getLastIndexR = (m: M): number => m.findLast(ti => getPathPattern(ti.path) === 'r')?.path.at(1) || 0

export const isG = (p: P): boolean => p.at(0) === 'g'
const isL = (p: P): boolean => p.at(0) === 'l'
const isT = (p: P): boolean => p.at(0) === 'r' || p.at(0) === 's' || p.at(0) === 'c'

export const isR = (p: PT): boolean => getPathPattern(p).endsWith('r')
export const isRS = (p: PT): boolean => getPathPattern(p).endsWith('rs')
export const isRSC = (p: PT): boolean => getPathPattern(p).endsWith('rsc')
export const isS = (p: PT): boolean => getPathPattern(p).endsWith('s')
export const isSS = (p: PT): boolean => getPathPattern(p).endsWith('ss')
export const isSSC = (p: PT): boolean => getPathPattern(p).endsWith('ssc')
export const isC = (p: PT): boolean => getPathPattern(p).endsWith('c')
export const isCS = (p: PT): boolean => getPathPattern(p).endsWith('cs')

export const mG = (m: M): G[] => m.filter(n => isG(n.path)) as G[]
export const mL = (m: M): L[] => m.filter(n => isL(n.path)) as L[]
export const mT = (m: M): T[] => m.filter(n => isT(n.path)) as T[]
export const mGT = (m: M): T[] => m.filter(n => isG(n.path) || isT(n.path)) as T[]
export const mTR = (m: M): T[] => m.filter(n => isT(n.path) && isR(n.path as PT)) as T[]
export const mTS = (m: M): T[] => m.filter(n => isT(n.path) && isS(n.path as PT)) as T[]
export const mTC = (m: M): T[] => m.filter(n => isT(n.path) && isC(n.path as PT)) as T[]

export const getG = (m: M): G => mG(m).at(0) as G

export const isXR = (m: M): boolean => isR(getX(m).path)
export const isXRS = (m: M): boolean => isRS(getX(m).path)
export const isXS = (m: M): boolean => isS(getX(m).path)

export const getRSCIPL = (p: PT): PT[] => p.map((_, i) => p.slice(0, i)).filter(pi => (['r', 's'].includes(pi.at(-2)) || pi.at(-3) === 'c' )).map(el => el as PT)
export const getSIPL = (p: PT): PT[] => getRSCIPL(p).filter(pi => !isR(pi) && !isC(pi))
const getSI1 = (p: PT) => p.slice(0, p.findLastIndex(el => typeof el === 'string')) as PT
const getSI2 = (p: PT) => getSI1(getSI1(p))
const getSIC = (p: PT) => getRSCIPL(p).findLast(pli => getPathPattern(pli).endsWith('c'))!

export const isSD = (p: PT, pt: PT): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) > p.at(-1)
export const isSU = (p: PT, pt: PT): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) < p.at(-1)
const isQuasiSD = (p: PT, pt: PT): boolean => pt.at(1) === p.at(1) && sortablePath(pt) > sortablePath(p) && getPathPattern(pt) === getPathPattern(p)
const isQuasiSU = (p: PT, pt: PT): boolean => pt.at(1) === p.at(1) && sortablePath(pt) < sortablePath(p) && getPathPattern(pt) === getPathPattern(p)
const isSU1 = (p: PT, pt: PT): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) === p.at(-1) - 1
const isSI1 = (p: PT, pt: PT): boolean => pt.length < p.length && isEqual(pt, getSI1(p))
const isSI2 = (p: PT, pt: PT): boolean => pt.length < p.length && isEqual(pt, getSI2(p))
const isSI1U = (p: PT, pt: PT): boolean => isSU(getSI1(p), pt)
export const isSEO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)
const isSO1 = (p: PT, pt: PT): boolean => pt.length === p.length + 2 && isEqual(pt.slice(0, -2), p) && pt.at(-2) === 's'
const isCO1 = (p: PT, pt: PT): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-3) === 'c'
const isCO1R0 = (p: PT, pt: PT): boolean => isCO1(p, pt) && pt.at(-2) === 0
const isCO1C0 = (p: PT, pt: PT): boolean => isCO1(p, pt) && pt.at(-1) === 0
const isCD1 = (p: PTC, pt: PTC): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) === p.at(-2) + 1 && pt.at(-1) === p.at(-1)
const isCU1 = (p: PTC, pt: PTC): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) === p.at(-2) - 1 && pt.at(-1) === p.at(-1)
const isCR1 = (p: PTC, pt: PTC): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) === p.at(-2) && pt.at(-1) === p.at(-1) + 1
const isCL1 = (p: PTC, pt: PTC): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) === p.at(-2) && pt.at(-1) === p.at(-1) - 1
const isSCO = (p: PT, pt: PT): boolean => pt.length >= p.length + 3 && isEqual(pt.slice(0, p.length), p) && pt.at(p.length) === 'c'
const isSV = (p: PT, pt: PT): boolean => pt.length === p.length && isEqual(pt.slice(0, -1), p.slice(0, -1))
export const isCV = (p: PT, pt: PT): boolean => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-2) === p.at(-2)
export const isCH = (p: PT, pt: PT): boolean => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-1) === p.at(-1)
export const isRDO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) > p.at(-1)
export const isSEODO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) >= p.at(-1)
export const isSDO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) > p.at(-1)
export const isCED = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) >= p.at(-2)! && pt.at(p.length - 1) === p.at(-1)
export const isCD = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) > p.at(-2)! && pt.at(p.length - 1) === p.at(-1)
export const isCER = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) === p.at(-2)! && pt.at(p.length - 1) >= p.at(-1)
export const isCR = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) === p.at(-2)! && pt.at(p.length - 1) > p.at(-1)

export const getTSI1 = (m: M, t: T): T => m.find(ti => isSI1(t.path, ti.path as PT))! as T
export const getTCO1R0 = (m: M, t: T): T[] => m.filter(ti => isCO1R0(t.path, ti.path as PT))! as T[]
export const getTCO1C0 = (m: M, t: T): T[] => m.filter(ti => isCO1C0(t.path, ti.path as PT))! as T[]
export const getTCV = (m: M, t: T): T[] => m.filter(ti => isCV(t.path, ti.path as PT))! as T[]
export const getTCH = (m: M, t: T): T[] => m.filter(ti => isCH(t.path, ti.path as PT))! as T[]
export const getTR = (m: M, t: T): T => getNodeByPath(m, t.path.slice(0, 2) as PT)

export const getXSI1 = (m: M): T => m.find(ti => isSI1(getXF(m).path, ti.path as PT))! as T
export const getXSI2 = (m: M): T => m.find(ti => isSI2(getX(m).path, ti.path as PT))! as T
export const getXFSU1 = (m: M): T => m.find(ti => isSU1(getXF(m).path, ti.path as PT))! as T
export const getXFSI1 = (m: M): T => m.find(ti => isSI1(getXF(m).path, ti.path as PT))! as T
export const getXSIC = (m: M): T => getNodeByPath(m, getSIC(getX(m).path) as PT)
export const getXR = (m: M): T => getNodeByPath(m, getX(m).path.slice(0, 2) as PT)
export const getXS = (m: M): T => getNodeByPath(m, [...getXR(m).path, 's', 0])

export const getQuasiSD = (m: M): T => mT(m).find(ti => !ti.selected && isQuasiSD(getX(m).path, ti.path))! as T
export const getQuasiSU = (m: M): T => mT(m).findLast(ti => !ti.selected && isQuasiSU(getX(m).path, ti.path))! as T

export const getXSO1 = (m: M): T[] => m.filter(ti => isSO1(getX(m).path, ti.path as PT)) as T[]
export const getXSCO = (m: M): M => m.filter(ti => isSCO(getX(m).path, ti.path as PT))
export const getXAEO = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isSEO(xti.path, ti.path as PT))) as T[]}
export const getXACD1 = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isCD1(xti.path as PTC, ti.path as PTC))) as T[]}
export const getXACU1 = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isCU1(xti.path as PTC, ti.path as PTC))) as T[]}
export const getXACR1 = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isCR1(xti.path as PTC, ti.path as PTC))) as T[]}
export const getXACL1 = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isCL1(xti.path as PTC, ti.path as PTC))) as T[]}

const getCountSD = (m: M, p: PT): number => m.filter(ti => isSD(p, ti.path as PT)).length
const getCountSU = (m: M, p: PT): number => m.filter(ti => isSU(p, ti.path as PT)).length
export const getCountQuasiSD = (m: M): number => mT(m).filter(ti => isQuasiSD(getX(m).path, ti.path)).length
export const getCountQuasiSU = (m: M): number => mT(m).filter(ti => isQuasiSU(getX(m).path, ti.path)).length
const getCountSI1U = (m: M, p: PT): number => m.filter(ti => isSI1U(p, ti.path as PT)).length
const getCountSO1 = (m: M, p: PT): number => m.filter(ti => isSO1(p, ti.path as PT)).length
const getCountCV = (m: M, p: PT): number => m.filter(ti => isCH(p, ti.path as PT)).length
const getCountCH = (m: M, p: PT): number => m.filter(ti => isCV(p, ti.path as PT)).length

export const getCountTSCV = (m: M, t: T): number => getCountCV(m, [...t.path, 'c', 0, 0])
export const getCountTSCH = (m: M, t: T): number => getCountCH(m, [...t.path, 'c', 0, 0])

export const getCountXSU = (m: M): number => getCountSU(m, getX(m).path)
export const getCountXASD = (m: M): number => getCountSD(m, getXL(m).path)
export const getCountXASU = (m: M): number => getCountSU(m, getXF(m).path)
export const getCountXASU1O1 = (m: M): number => getCountSO1(m, getXFSU1(m).path)
export const getCountXSI1U = (m: M): number => getCountSI1U(m, getX(m).path)
export const getCountXCU = (m: M): number => getX(m).path.at(-2)
export const getCountXCL = (m: M): number => getX(m).path.at(-1)
export const getCountXCV = (m: M): number => getCountCV(m, getX(m).path)
export const getCountXCH = (m: M): number => getCountCH(m, getX(m).path)
export const getCountXSCV = (m: M): number => getCountCV(m, [...getX(m).path, 'c', 0, 0])
export const getCountXSCH = (m: M): number => getCountCH(m, [...getX(m).path, 'c', 0, 0])

export const isXAR = (m: M): boolean => getXA(m).map(ti => ti.path).every(p => isR(p))
export const isXASVN = (m: M): boolean => isS(getX(m).path) && getXA(m).map(ti => ti.path).every(p => isSV(getX(m).path, p)) && (getXL(m).path.at(-1) - getXF(m).path.at(-1)) === getXA(m).length - 1
export const isXC = (m: M): boolean => isC(getX(m).path) && getXA(m).length === 1
export const isXACR = (m: M): boolean => isC(getX(m).path) && getXA(m).length > 1 && getXA(m).map(ti => ti.path).every(p => isCV(getX(m).path, p))
export const isXACC = (m: M): boolean => isC(getX(m).path) && getXA(m).length > 1 && getXA(m).map(ti => ti.path).every(p => isCH(getX(m).path, p))
export const isXCB = (m: M): boolean => isC(getX(m).path) && getCountXCU(m) === getCountXCV(m) - 1
export const isXCT = (m: M): boolean => isC(getX(m).path) && getCountXCU(m) === 0
export const isXCR = (m: M): boolean => isC(getX(m).path) && getCountXCL(m) === getCountXCH(m) - 1
export const isXCL = (m: M): boolean => isC(getX(m).path) && getCountXCL(m) === 0

export const getLastSO = (m: M): T => getNodeByPath(m, [...getX(m).path, 's', getX(m).lastSelectedChild > - 1 && getX(m).lastSelectedChild < getX(m).so1.length ? getX(m).lastSelectedChild : 0])

export const getReselectR = (m: M): T => mT(m).find(ti => !ti.selected && isR(ti.path))!
export const getReselectS = (m: M): T => getCountXASU(m) ? getXFSU1(m) : getXFSI1(m)
export const getReselectCR = (m: M): M => getCountXCU(m) ? getXACU1(m) : ( getCountXCV(m) >= 2 ? getXACD1(m) : [getXSI1(m)] as M )
export const getReselectCC = (m: M): M => getCountXCL(m) ? getXACL1(m) : ( getCountXCH(m) >= 2 ? getXACR1(m) : [getXSI1(m)] as M )

export const lToCb = (m: M): L[] => mL(m).filter(li => getNodeById(m, li.fromNodeId).selected && getNodeById(m, li.toNodeId).selected).map((li, i) => ({...li, path: ['l', i]}))
export const rToCb = (m: M): T[] => getXA(m).map(el => el.path.at(1)).map(ri => m.filter(ti => isEqual(ti.path.slice(0, 2), ['r', ri]))).map((m, i) => mT(m).map(ti => ({...ti, path: ['r', i, ...ti.path.slice(2)]}))).flat() as T[]
export const sToCb = (m: M): T[] => getXAEO(m).map(ti => ({...ti, path: ['s', ti.path.at(getX(m).path.length - 1) - getCountXASU(m), ...ti.path.slice(getX(m).path.length)]})) as T[]
export const crToCb = (m: M) => getXAEO(m).map(ti => ({...ti, path: ['c', ti.path.at(getX(m).path.length - 2) - getCountXCU(m), ti.path.at(getX(m).path.length - 1), ...ti.path.slice(getX(m).path.length)]})) as M
export const ccToCb = (m: M) => getXAEO(m).map(ti => ({...ti, path: ['c', ti.path.at(getX(m).path.length - 2), ti.path.at(getX(m).path.length - 1) - getCountXCL(m), ...ti.path.slice(getX(m).path.length)]})) as M

export const getEditedPath = (p: PT): P => getPathPattern(p).endsWith('c') ? [...p, 's', 0] : p
export const getEditedNode = (m: M, p: PT): T => getNodeByPath(m, getEditedPath(p) as PT)

export const getLineWidth = (m: M): TSaveOptional['lineWidth'] => isArrayOfEqualValues(getXA(m).map(ti => ti.lineWidth)) ? getX(m).lineWidth : tSaveOptional.lineWidth
export const getLineType = (m: M): TSaveOptional['lineType'] => isArrayOfEqualValues(getXA(m).map(ti => ti.lineType)) ? getX(m).lineType : tSaveOptional.lineType
export const getLineColor = (m: M): TSaveOptional['lineColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.lineColor)) ? getX(m).lineColor : tSaveOptional.lineColor
export const getSBorderWidth = (m: M): TSaveOptional['sBorderWidth'] => isArrayOfEqualValues(getXA(m).map(ti => ti.sBorderWidth)) ? getX(m).sBorderWidth : tSaveOptional.sBorderWidth
export const getFBorderWidth = (m: M): TSaveOptional['fBorderWidth'] => isArrayOfEqualValues(getXA(m).map(ti => ti.fBorderWidth)) ? getX(m).fBorderWidth : tSaveOptional.fBorderWidth
export const getSBorderColor = (m: M): TSaveOptional['sBorderColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.sBorderColor)) ? getX(m).sBorderColor : tSaveOptional.sBorderColor
export const getFBorderColor = (m: M): TSaveOptional['fBorderColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.fBorderColor)) ? getX(m).fBorderColor : tSaveOptional.fBorderColor
export const getSFillColor = (m: M): TSaveOptional['sFillColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.sFillColor)) ? getX(m).sFillColor : tSaveOptional.sFillColor
export const getFFillColor = (m: M): TSaveOptional['fFillColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.fFillColor)) ? getX(m).fFillColor : tSaveOptional.fFillColor
export const getTextFontSize = (m: M): TSaveOptional['textFontSize'] => isArrayOfEqualValues(getXA(m).map(ti => ti.textFontSize)) ? getX(m).textFontSize : tSaveOptional.textFontSize
export const getTextColor = (m: M): TSaveOptional['textColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.textColor)) ? getX(m).textColor : tSaveOptional.textColor

export const hasTask = (m: M, t: T): number => +mT(m).filter(ti => ti.path.at(1) === t.path.at(1) && ti.path.length > 2).some(ti => ti.taskStatus !== 0)

export const isExistingLink = (m: M, l: L): boolean => mL(m).some(li =>
  l.fromNodeId === li.fromNodeId &&
  l.toNodeId === li.toNodeId &&
  l.fromNodeSide  === li.fromNodeSide &&
  l.toNodeSide === li.toNodeSide
)

export const getMapMode = (m: M) => {
  if ((m as T[]).some((ti: T) => ti.selected)) {
    if (isXR(m)) {
      return MapMode.EDIT_ROOT
    } else if (isXS(m)) {
      return MapMode.EDIT_STRUCT
    } else if (isXC(m)) {
      return MapMode.EDIT_CELL
    }
  } else {
    return MapMode.VIEW
  }
}
