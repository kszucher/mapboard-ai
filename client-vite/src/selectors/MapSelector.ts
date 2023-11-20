import isEqual from "react-fast-compare"
import {getTaskWidth} from "../components/map/MapSvgUtils"
import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {tSaveOptional} from "../state/MapState"
import {G, L, M, N, P, PT, PTC, T, TSaveOptional} from "../state/MapStateTypes"
import {isArrayOfEqualValues} from "../utils/Utils"

export const sortablePath = (p: P): string => p.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('')

export const sortPath = (a: N, b: N) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
export const sortNode = (a: N, b: N) => a.nodeId > b.nodeId ? 1 : -1

export const getNodeByPath = (m: M, p: PT) => m.find(ti => isEqual(ti.path, p)) as T
export const getNodeById = (m: M, nodeId: string) => m.find(ti => ti.nodeId === nodeId) as T

export const getPathPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')
export const getPathDir = (p: PT) => p[3] ? -1 : 1

export const getXF = (m: M): T => mT(m).find(ti => ti.selected)! as T
export const getXL = (m: M): T => mT(m).findLast(ti => ti.selected)!
export const getX = (m: M): T => mT(m).reduce((a, b) => a.selected > b.selected ? a : b)
export const getXA = (m: M): T[] => mT(m).filter(ti => ti.selected) as T[]

export const isDirR = (m: M) => getPathDir(getX(m).path) === 1
export const isDirL = (m: M) => getPathDir(getX(m).path) === -1

export const getLiL = (m: M): number => m.findLast(ti => getPathPattern(ti.path) === 'l')?.path.at(1) || -1
export const getRiL = (m: M): number => m.findLast(ti => getPathPattern(ti.path) === 'r')?.path.at(1) || 0

const isG = (p: P): boolean => p.at(0) === 'g'
const isL = (p: P): boolean => p.at(0) === 'l'
const isT = (p: P): boolean => p.at(0) === 'r' || p.at(0) === 's' || p.at(0) === 'c'

export const isR = (p: PT): boolean => getPathPattern(p).endsWith('r')
export const isD = (p: PT): boolean => getPathPattern(p).endsWith('d')
export const isS = (p: PT): boolean => getPathPattern(p).endsWith('s')
export const isC = (p: PT): boolean => getPathPattern(p).endsWith('c')

export const mG = (m: M): G[] => m.filter(n => isG(n.path)) as G[]
export const mL = (m: M): L[] => m.filter(n => isL(n.path)) as L[]
export const mT = (m: M): T[] => m.filter(n => isT(n.path)) as T[]
export const mTR = (m: M): T[] => m.filter(n => isT(n.path) && isR(n.path as PT)) as T[]

export const getG = (m: M): G => mG(m).at(0) as G

export const isTR = (t: T): boolean => isR(t.path)
export const isXR = (m: M): boolean => isR(getX(m).path)
export const isTD = (t: T): boolean => isD(t.path)
export const isXD = (m: M): boolean => isD(getX(m).path)
export const isTS = (t: T): boolean => isS(t.path)
export const isXS = (m: M): boolean => isS(getX(m).path)

export const getRDSCIPL = (p: PT): PT[] => p.map((pi, i) => p.slice(0, i)).filter(pi => (['r', 'd', 's'].includes(pi.at(-2)) || pi.at(-3) === 'c' )).map(el => el as PT)
export const getRSIPL = (p: PT): PT[] => getRDSCIPL(p).filter(pi => !isD(pi) && !isC(pi))
const getSI1 = (p: PT) => p.slice(0, p.findLastIndex(el => typeof el === 'string')) as PT
const getSI2 = (p: PT) => getSI1(getSI1(p))
const getSIC = (p: PT) => getRDSCIPL(p).findLast(pli => getPathPattern(pli).endsWith('c'))!

const isTRD0SO = (p: PT, pt: PT): boolean => pt.length >= 6 && isEqual(pt.slice(0, 4), [...p.slice(0, 2), 'd', 0] as PT)
const isTRD1SO = (p: PT, pt: PT): boolean => pt.length >= 6 && isEqual(pt.slice(0, 4), [...p.slice(0, 2), 'd', 1] as PT)
export const isSD = (p: PT, pt: PT): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) > p.at(-1)
export const isSU = (p: PT, pt: PT): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) < p.at(-1)
const isSU1 = (p: PT, pt: PT): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) === p.at(-1) - 1
const isSI1 = (p: PT, pt: PT): boolean => pt.length < p.length && isEqual(pt, getSI1(p))
const isSI2 = (p: PT, pt: PT): boolean => pt.length < p.length && isEqual(pt, getSI2(p))
const isSI1U = (p: PT, pt: PT): boolean => isSU(getSI1(p), pt)
export const isSEO = (p: PT, pt: PT): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)
const isSO = (p: PT, pt: PT): boolean => pt.length > p.length && isEqual(pt.slice(0, p.length), p)
const isSO1 = (p: PT, pt: PT): boolean => pt.length === p.length + 2 && isEqual(pt.slice(0, -2), p) && pt.at(-2) === 's'
const isSO2 = (p: PT, pt: PT): boolean => pt.length === p.length + 4 && isEqual(pt.slice(0, -4), p) && pt.at(-2) === 's'
const isCO1 = (p: PT, pt: PT): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-3) === 'c'
const isCO2 = (p: PT, pt: PT): boolean => pt.length === p.length + 5 && isEqual(pt.slice(0, -5), p) && pt.at(-3) === 'c'
export const isCON = (p: PT): boolean => p.some(pi => pi === 'c')
const isCD1 = (p: PTC, pt: PTC): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) === p.at(-2) + 1 && pt.at(-1) === p.at(-1)
const isCU1 = (p: PTC, pt: PTC): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) === p.at(-2) - 1 && pt.at(-1) === p.at(-1)
const isCR1 = (p: PTC, pt: PTC): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) === p.at(-2) && pt.at(-1) === p.at(-1) + 1
const isCL1 = (p: PTC, pt: PTC): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) === p.at(-2) && pt.at(-1) === p.at(-1) - 1
const isSCO = (p: PT, pt: PT): boolean => pt.length >= p.length + 3 && isEqual(pt.slice(0, p.length), p) && pt.at(p.length) === 'c'
const isSCXX = (p: PT, pt: PT): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p)
const isSCYY = (p: PT, pt: PT): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-2) > 0 && pt.at(-1) > 0
const isSCR0 = (p: PT, pt: PT): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-2) === 0
const isSCC0 = (p: PT, pt: PT): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-1) === 0
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

export const getR0 = (m: M): T => getNodeByPath(m, ['r', 0])
export const getTSI1 = (m: M, t: T): T => m.find(ti => isSI1(t.path, ti.path as PT))! as T
export const getXSI1 = (m: M): T => m.find(ti => isSI1(getXF(m).path, ti.path as PT))! as T
export const getTSI2 = (m: M, t: T): T => m.find(ti => isSI2(t.path, ti.path as PT))! as T
export const getXSI2 = (m: M): T => m.find(ti => isSI2(getX(m).path, ti.path as PT))! as T
export const getXFSU1 = (m: M): T => m.find(ti => isSU1(getXF(m).path, ti.path as PT))! as T
export const getXFSI1 = (m: M): T => m.find(ti => isSI1(getXF(m).path, ti.path as PT))! as T
export const getXFSI2 = (m: M): T => m.find(ti => isSI2(getXF(m).path, ti.path as PT))! as T
export const getTSIC = (m: M, t: T): T => getNodeByPath(m, getSIC(t.path) as PT)
export const getXSIC = (m: M): T => getNodeByPath(m, getSIC(getX(m).path) as PT)
export const getTR = (m: M, t: T): T => getNodeByPath(m, t.path.slice(0, 2) as PT)
export const getXR = (m: M): T => getNodeByPath(m, getX(m).path.slice(0, 2) as PT)
export const getTRD0 = (m: M, t: T): T => getNodeByPath(m, [...t.path.slice(0, 2), 'd', 0] as PT)
export const getXRD0 = (m: M): T => getNodeByPath(m, [...getX(m).path.slice(0, 2), 'd', 0] as PT)
export const getTRD1 = (m: M, t: T): T => getNodeByPath(m, [...t.path.slice(0, 2), 'd', 1] as PT)
export const getXRD1 = (m: M): T => getNodeByPath(m, [...getX(m).path.slice(0, 2), 'd', 1] as PT)
export const getQuasiSU = (m: M): T => m.findLast(ti => sortablePath(ti.path) < sortablePath(getX(m).path) && getPathDir(ti.path as PT) === getPathDir(getX(m).path) && getPathPattern(ti.path) === getPathPattern(getX(m).path))! as T
export const getQuasiSD = (m: M): T => m.find(ti => sortablePath(ti.path) > sortablePath(getX(m).path) && getPathDir(ti.path as PT) === getPathDir(getX(m).path) && getPathPattern(ti.path) === getPathPattern(getX(m).path))! as T

export const getXSO1 = (m: M): T[] => m.filter(ti => isSO1(getX(m).path, ti.path as PT)) as T[]
export const getXSO2 = (m: M): T[] => m.filter(ti => isSO2(getX(m).path, ti.path as PT)) as T[]
export const getXSCO = (m: M): M => m.filter(ti => isSCO(getX(m).path, ti.path as PT))
export const getXSCR0 = (m: M): M => m.filter(ti => isSCR0(getX(m).path, ti.path as PT))
export const getXSCC0 = (m: M): M => m.filter(ti => isSCC0(getX(m).path, ti.path as PT))
export const getXSCYY = (m: M): T[] => m.filter(ti => isSCYY(getX(m).path, ti.path as PT)) as T[]
export const getTRD0SO = (m: M, t: T): T[] => m.filter(ti => isTRD0SO(t.path, ti.path as PT)) as T[]
export const getTRD0SOL = (m: M, t: T): T[] => getTRD0SO(m, t).filter(ti => getCountTSO1(m, ti) === 0)
export const getXRD0SO = (m: M): T[] => m.filter(ti => isTRD0SO(getX(m).path, ti.path as PT)) as T[]
export const getTRD1SO = (m: M, t: T): T[] => m.filter(ti => isTRD1SO(t.path, ti.path as PT)) as T[]
export const getXRD1SO = (m: M): T[] => m.filter(ti => isTRD1SO(getX(m).path, ti.path as PT)) as T[]
export const getXAEO = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isSEO(xti.path, ti.path as PT))) as T[]}
export const getXACD1 = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isCD1(xti.path as PTC, ti.path as PTC))) as T[]}
export const getXACU1 = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isCU1(xti.path as PTC, ti.path as PTC))) as T[]}
export const getXACR1 = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isCR1(xti.path as PTC, ti.path as PTC))) as T[]}
export const getXACL1 = (m: M): T[] => {const xa = getXA(m); return m.filter(ti => xa.some(xti => isCL1(xti.path as PTC, ti.path as PTC))) as T[]}

const getCountSD = (m: M, p: PT): number => m.filter(ti => isSD(p, ti.path as PT)).length
const getCountSU = (m: M, p: PT): number => m.filter(ti => isSU(p, ti.path as PT)).length
const getCountSI1U = (m: M, p: PT): number => m.filter(ti => isSI1U(p, ti.path as PT)).length
const getCountSO1 = (m: M, p: PT): number => m.filter(ti => isSO1(p, ti.path as PT)).length
const getCountSO2 = (m: M, p: PT): number => m.filter(ti => isSO2(p, ti.path as PT)).length
const getCountCO1 = (m: M, p: PT): number => m.filter(ti => isCO1(p, ti.path as PT)).length
const getCountCO2 = (m: M, p: PT): number => m.filter(ti => isCO2(p, ti.path as PT)).length
const getCountCV = (m: M, p: PT): number => m.filter(ti => isCH(p, ti.path as PT)).length
const getCountCH = (m: M, p: PT): number => m.filter(ti => isCV(p, ti.path as PT)).length

export const getCountXASD = (m: M): number => getCountSD(m, getXL(m).path)
export const getCountXASU = (m: M): number => getCountSU(m, getXF(m).path)
export const getCountXASU1O1 = (m: M): number => getCountSO1(m, getXFSU1(m).path)
export const getCountTSO1 = (m: M, t: T): number => getCountSO1(m, t.path)
export const getCountXSO1 = (m: M): number => getCountSO1(m, getX(m).path)
export const getCountTSO2 = (m: M, t: T): number => getCountSO2(m, t.path)
export const getCountXSO2 = (m: M): number => getCountSO2(m, getX(m).path)
export const getCountXSI1U = (m: M): number => getCountSI1U(m, getX(m).path)
export const getCountXRD0SO1 = (m: M): number => getCountSO1(m, getXRD0(m).path)
export const getCountXRD1SO1 = (m: M): number => getCountSO1(m, getXRD1(m).path)
export const getCountTCO1 = (m: M, t: T): number => getCountCO1(m, t.path)
export const getCountXCO1 = (m: M): number => getCountCO1(m, getX(m).path)
export const getCountTCO2 = (m: M, t: T): number => getCountCO2(m, t.path)
export const getCountXCU = (m: M): number => getX(m).path.at(-2)
export const getCountXCL = (m: M): number => getX(m).path.at(-1)
export const getCountXCV = (m: M): number => getCountCV(m, getX(m).path)
export const getCountXCH = (m: M): number => getCountCH(m, getX(m).path)
export const getCountTSCV = (m: M, t: T): number => getCountCV(m, [...t.path, 'c', 0, 0])
export const getCountXSCV = (m: M): number => getCountCV(m, [...getX(m).path, 'c', 0, 0])
export const getCountTSCH = (m: M, t: T): number => getCountCH(m, [...t.path, 'c', 0, 0])
export const getCountXSCH = (m: M): number => getCountCH(m, [...getX(m).path, 'c', 0, 0])
export const getCountQuasiSU = (m: M): number => m.filter(ti => sortablePath(ti.path) < sortablePath(getX(m).path) && getPathDir(ti.path as PT) === getPathDir(getX(m).path) && getPathPattern(ti.path) === getPathPattern(getX(m).path)).length
export const getCountQuasiSD = (m: M): number => m.filter(ti => sortablePath(ti.path) > sortablePath(getX(m).path) && getPathDir(ti.path as PT) === getPathDir(getX(m).path) && getPathPattern(ti.path) === getPathPattern(getX(m).path)).length

export const isXDS = (m: M): boolean => getPathPattern(getX(m).path) === 'rds'
export const isXAR = (m: M): boolean => getXA(m).map(ti => ti.path).every(p => isR(p))
export const isXASVN = (m: M): boolean => isS(getX(m).path) && getXA(m).map(ti => ti.path).every(p => isSV(getX(m).path, p)) && (getXL(m).path.at(-1) - getXF(m).path.at(-1)) === getXA(m).length - 1
export const isXC = (m: M): boolean => isC(getX(m).path) && getXA(m).length === 1
export const isXACR = (m: M): boolean => isC(getX(m).path) && getXA(m).length > 1 && getXA(m).map(ti => ti.path).every(p => isCV(getX(m).path, p))
export const isXACC = (m: M): boolean => isC(getX(m).path) && getXA(m).length > 1 && getXA(m).map(ti => ti.path).every(p => isCH(getX(m).path, p))
export const isXCB = (m: M): boolean => isC(getX(m).path) && getCountXCU(m) === getCountXCV(m) - 1
export const isXCT = (m: M): boolean => isC(getX(m).path) && getCountXCU(m) === 0
export const isXCR = (m: M): boolean => isC(getX(m).path) && getCountXCL(m) === getCountXCH(m) - 1
export const isXCL = (m: M): boolean => isC(getX(m).path) && getCountXCL(m) === 0

export const getLastSO = (m: M): T => getNodeByPath(m, [...getX(m).path, 's', getX(m).lastSelectedChild > - 1 && getX(m).lastSelectedChild < getCountXSO1(m) ? getX(m).lastSelectedChild : 0])
export const getLastSOR = (m: M): T => getNodeByPath(m, [...getXRD0(m).path, 's', getXRD0(m).lastSelectedChild > - 1 && getXRD0(m).lastSelectedChild < getCountXRD0SO1(m) ? getXRD0(m).lastSelectedChild : 0])
export const getLastSOL = (m: M): T => getNodeByPath(m, [...getXRD1(m).path, 's', getXRD1(m).lastSelectedChild > - 1 && getXRD1(m).lastSelectedChild < getCountXRD1SO1(m) ? getXRD1(m).lastSelectedChild : 0])

export const getReselectR = (m: M): T => mT(m).find(ti => !ti.selected && isR(ti.path))!
export const getReselectS = (m: M): T => getCountXASU(m) ? getXFSU1(m) : (isXDS(m) ? getXFSI2(m): getXFSI1(m))
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
export const getFBorderWidth = (m: M): TSaveOptional['fBorderWidth'] => isArrayOfEqualValues(getXA(m).map(ti => ti.fBorderWidth)) ? (isXR(m) ? getXRD0(m).fBorderWidth : getX(m).fBorderWidth) : tSaveOptional.fBorderWidth
export const getSBorderColor = (m: M): TSaveOptional['sBorderColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.sBorderColor)) ? getX(m).sBorderColor : tSaveOptional.sBorderColor
export const getFBorderColor = (m: M): TSaveOptional['fBorderColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.fBorderColor)) ? (isXR(m) ? getXRD0(m).fBorderColor : getX(m).fBorderColor) : tSaveOptional.fBorderColor
export const getSFillColor = (m: M): TSaveOptional['sFillColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.sFillColor)) ? getX(m).sFillColor : tSaveOptional.sFillColor
export const getFFillColor = (m: M): TSaveOptional['fFillColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.fFillColor)) ? (isXR(m) ? getXRD0(m).fFillColor : getX(m).fFillColor) : tSaveOptional.fFillColor
export const getTextFontSize = (m: M): TSaveOptional['textFontSize'] => isArrayOfEqualValues(getXA(m).map(ti => ti.textFontSize)) ? getX(m).textFontSize : tSaveOptional.textFontSize
export const getTextColor = (m: M): TSaveOptional['textColor'] => isArrayOfEqualValues(getXA(m).map(ti => ti.textColor)) ? getX(m).textColor : tSaveOptional.textColor

export const hasTaskRight = (m: M, t: T): number => +getTRD0SO(m, t).some(ti => ti.taskStatus !== 0)
export const hasTaskLeft = (m: M, t: T): number => +getTRD1SO(m, t).some(ti => ti.taskStatus !== 0)

export const getRootStartX = (m: M, t: T): number => t.offsetW
export const getRootStartY = (m: M, t: T): number => t.offsetH
export const getRootW = (m: M, t: T): number => getTRD0(m, t).familyW + getTRD1(m, t).familyW + t.selfW  + getTaskWidth(getG(m)) * (hasTaskLeft(m, t) + hasTaskRight(m, t)) + 2 * MARGIN_X
export const getRootH = (m: M, t: T): number => Math.max(...[t.selfH, getTRD0(m, t).familyH, getTRD1(m, t).familyH]) + 2 * MARGIN_Y

export const getRootMidX = (m: M, t: T): number => getRootStartX(m, t) + getRootW(m, t) / 2
export const getRootMidY = (m: M, t: T): number => getRootStartY(m, t) + getRootH(m, t) / 2
export const getRootEndX = (m: M, t: T): number => getRootStartX(m, t) + getRootW(m, t)
export const getRootEndY = (m: M, t: T): number => getRootStartY(m, t) + getRootH(m, t)

export const isExistingLink = (m: M, l: L): boolean => mL(m).some(li => l.fromNodeId === li.fromNodeId && l.toNodeId === li.toNodeId)
