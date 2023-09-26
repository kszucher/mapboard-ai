import isEqual from "react-fast-compare"
import {getTaskWidth} from "../components/MapSvgUtils"
import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {G, N, M, T, P, L} from "../state/MapStateTypes"
import {isArrayOfEqualValues} from "../utils/Utils"

export const sortablePath = (p: P): string => p.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('')

export const sortPath = (a: N, b: N) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
export const sortNode = (a: N, b: N) => a.nodeId > b.nodeId ? 1 : -1

export const getNodeByPath = (m: M, p: P) => mT(m).find(t => isEqual(t.path, p)) as N
export const getNodeById = (m: M, nodeId: string) => mT(m).find(t => t.nodeId === nodeId) as N

export const getPathPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')
export const getPathDir = (p: P) => p[3] ? -1 : 1

export const isDirR = (m: M) => getPathDir(getX(m).path) === 1
export const isDirL = (m: M) => getPathDir(getX(m).path) === -1

export const getLiL = (m: M): number => mT(m).findLast(t => getPathPattern(t.path) === 'l')?.path.at(1) as number || -1
export const getRiL = (m: M): number => mT(m).findLast(t => getPathPattern(t.path) === 'r')?.path.at(1) as number

export const isG = (p: P): boolean => p.at(0) === 'g'
export const isL = (p: P): boolean => p.at(0) === 'l'
export const isT = (p: P): boolean => p.at(0) === 'r' || p.at(0) === 's' || p.at(0) === 'c'
export const isR = (p: P): boolean => getPathPattern(p).endsWith('r')
export const isD = (p: P): boolean => getPathPattern(p).endsWith('d')
export const isS = (p: P): boolean => getPathPattern(p).endsWith('s')
export const isC = (p: P): boolean => getPathPattern(p).endsWith('c')

export const mG = (m: M) => m.filter(n => isG(n.path))
export const mL = (m: M) => m.filter(n => isL(n.path))
export const mT = (m: M) => m.filter(n => isT(n.path))

export const getG = (m: M): G => mG(m).at(0) as G

export const isNR = (t: T): boolean => isR(t.path)
export const isXR = (m: M): boolean => isR(getX(m).path)
export const isND = (t: T): boolean => isD(t.path)
export const isXD = (m: M): boolean => isD(getX(m).path)
export const isNS = (t: T): boolean => isS(t.path)
export const isXS = (m: M): boolean => isS(getX(m).path)

export const isXDS = (m: M): boolean => getPathPattern(getX(m).path) === 'rds'
export const isXAR = (m: M): boolean => getXA(m).map(t => t.path).every(p => isR(p))
const isXASV = (m: M): boolean => isS(getX(m).path) && getXA(m).map(t => t.path).every(p => isSV(getX(m).path, p))
export const isXASVN = (m: M): boolean => isXASV(m) && ((getXL(m).path.at(-1) as number) - (getXF(m).path.at(-1) as number)) === getXA(m).length - 1
export const isXC = (m: M): boolean => isC(getX(m).path) && getXA(m).length === 1
export const isXACR = (m: M): boolean => isC(getX(m).path) && getXA(m).length > 1 && getXA(m).map(t => t.path).every(p => isCV(getX(m).path, p))
export const isXACC = (m: M): boolean => isC(getX(m).path) && getXA(m).length > 1 && getXA(m).map(t => t.path).every(p => isCH(getX(m).path, p))
export const isXCB = (m: M): boolean => isC(getX(m).path) && getCountXCU(m) === getCountXCV(m) - 1
export const isXCT = (m: M): boolean => isC(getX(m).path) && getCountXCU(m) === 0
export const isXCR = (m: M): boolean => isC(getX(m).path) && getCountXCL(m) === getCountXCH(m) - 1
export const isXCL = (m: M): boolean => isC(getX(m).path) && getCountXCL(m) === 0

export const isNRD0SO = (p: P, pt: P): boolean => pt.length > p.length && isEqual(pt.slice(0, 4), [...p.slice(0, 2), 'd', 0])
export const isNRD1SO = (p: P, pt: P): boolean => pt.length > p.length && isEqual(pt.slice(0, 4), [...p.slice(0, 2), 'd', 1])

export const isSD = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! > p.at(-1)!
export const isSU = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! < p.at(-1)!
export const isSEO = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)
export const isSO = (p: P, pt: P): boolean => pt.length > p.length && isEqual(pt.slice(0, p.length), p)
const isSO1 = (p: P, pt: P): boolean => pt.length === p.length + 2 && isEqual(pt.slice(0, -2), p) && pt.at(-2) === 's'
const isSO2 = (p: P, pt: P): boolean => pt.length === p.length + 4 && isEqual(pt.slice(0, -4), p) && pt.at(-2) === 's'
const isCO1 = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-3) === 'c'
const isCO2 = (p: P, pt: P): boolean => pt.length === p.length + 5 && isEqual(pt.slice(0, -5), p) && pt.at(-3) === 'c'
export const isCON = (p: P): boolean => p.includes('c')
const isCD1 = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) as number === p.at(-2) as number + 1 && pt.at(-1) as number === p.at(-1) as number
const isCU1 = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) as number === p.at(-2) as number - 1 && pt.at(-1) as number === p.at(-1) as number
const isCR1 = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) as number === p.at(-2) as number && pt.at(-1) as number === p.at(-1) as number + 1
const isCL1 = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -3), p.slice(0, -3)) && pt.at(-2) as number === p.at(-2) as number && pt.at(-1) as number === p.at(-1) as number - 1
const isSCO = (p: P, pt: P): boolean => pt.length >= p.length + 3 && isEqual(pt.slice(0, p.length), p) && pt.at(p.length) === 'c'
const isSCXX = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p)
const isSCYY = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-2) as number > 0 && pt.at(-1) as number > 0
const isSCR0 = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-2) === 0
const isSCC0 = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-1) === 0
const isSV = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -1), p.slice(0, -1))
export const isCV = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-2) === p.at(-2)
export const isCH = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-1) === p.at(-1)
export const isRDO = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! > p.at(-1)!
export const isSEODO = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! >= p.at(-1)!
export const isSDO = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! > p.at(-1)!
export const isCED = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! >= p.at(-2)! && pt.at(p.length - 1)! === p.at(-1)!
export const isCD = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! > p.at(-2)! && pt.at(p.length - 1)! === p.at(-1)!
export const isCER = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! === p.at(-2)! && pt.at(p.length - 1)! >= p.at(-1)!
export const isCR = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! === p.at(-2)! && pt.at(p.length - 1)! > p.at(-1)!

export const getCountQuasiSU = (m: M): number => mT(m).filter(t => sortablePath(t.path) < sortablePath(getX(m).path) && getPathDir(t.path) === getPathDir(getX(m).path) && getPathPattern(t.path) === getPathPattern(getX(m).path)).length
export const getQuasiSU = (m: M): T => mT(m).findLast(t => sortablePath(t.path) < sortablePath(getX(m).path) && getPathDir(t.path) === getPathDir(getX(m).path) && getPathPattern(t.path) === getPathPattern(getX(m).path))!
export const getCountQuasiSD = (m: M): number => mT(m).filter(t => sortablePath(t.path) > sortablePath(getX(m).path) && getPathDir(t.path) === getPathDir(getX(m).path) && getPathPattern(t.path) === getPathPattern(getX(m).path)).length
export const getQuasiSD = (m: M): T => mT(m).find(t => sortablePath(t.path) > sortablePath(getX(m).path) && getPathDir(t.path) === getPathDir(getX(m).path) && getPathPattern(t.path) === getPathPattern(getX(m).path))!

export const getLastSO = (m: M): T => getNodeByPath(m, [...getX(m).path, 's', getX(m).lastSelectedChild > - 1 && getX(m).lastSelectedChild < getCountXSO1(m) ? getX(m).lastSelectedChild : 0])
export const getLastSOR = (m: M): T => getNodeByPath(m, [...getXRD0(m).path, 's', getXRD0(m).lastSelectedChild > - 1 && getXRD0(m).lastSelectedChild < getCountXRD0S(m) ? getXRD0(m).lastSelectedChild : 0])
export const getLastSOL = (m: M): T => getNodeByPath(m, [...getXRD1(m).path, 's', getXRD1(m).lastSelectedChild > - 1 && getXRD1(m).lastSelectedChild < getCountXRD1S(m) ? getXRD1(m).lastSelectedChild : 0])

const getSU1 = (p: P): P => p.at(-1) as number > 0 ? [...p.slice(0, -1), p.at(-1) as number - 1] : p

export const getSIPL = (p: P): P[] => p.map((pi, i) => p.slice(0, i)).filter(pi => ['r', 'd', 's'].includes(pi.at(-2) as string) || pi.at(-3) === 'c' )

export const getSI1P = (p: P): P => getSIPL(p).at(-1) as P
const getSI2P = (p: P): P => getSIPL(p).at(-2) as P
const getSIC = (p: P) => getSIPL(p).findLast(pli => getPathPattern(pli).endsWith('c'))!

export const getXF = (m: M): T => mT(m).find(t => t.selected)!
export const getXL = (m: M): T => mT(m).findLast(t => t.selected)!
export const getX = (m: M): T => mT(m).reduce((a, b) => a.selected > b.selected ? a : b)
export const getR0 = (m: M): T => getNodeByPath(m, ['r', 0])
export const getNSI1 = (m: M, t: T): T => getNodeByPath(m, getSI1P(t.path))
export const getXSI1 = (m: M): T => getNodeByPath(m, getSI1P(getX(m).path))
export const getNSI2 = (m: M, t: T): T => getNodeByPath(m, getSI2P(t.path))
export const getXSI2 = (m: M): T => getNodeByPath(m, getSI2P(getX(m).path))
export const getXFSU1 = (m: M): T => getNodeByPath(m, getSU1(getXF(m).path))
export const getXFSI1 = (m: M): T => getNodeByPath(m, getSI1P(getXF(m).path))
export const getXFSI2 = (m: M): T => getNodeByPath(m, getSI2P(getXF(m).path))
export const getNSIC = (m: M, t: T): T => getNodeByPath(m, getSIC(t.path))
export const getXSIC = (m: M): T => getNodeByPath(m, getSIC(getX(m).path))
export const getNR = (m: M, t: T): T => getNodeByPath(m, t.path.slice(0, 2))
export const getXR = (m: M): T => getNodeByPath(m, getX(m).path.slice(0, 2))
export const getNRD0 = (m: M, t: T): T => getNodeByPath(m, [...t.path.slice(0, 2), 'd', 0]) // could be done with find plus isNRDO instead...
export const getXRD0 = (m: M): T => getNodeByPath(m, [...getX(m).path.slice(0, 2), 'd', 0])
export const getNRD1 = (m: M, t: T): T => getNodeByPath(m, [...t.path.slice(0, 2), 'd', 1])
export const getXRD1 = (m: M): T => getNodeByPath(m, [...getX(m).path.slice(0, 2), 'd', 1])

export const getRL = (m: M): M => mT(m).filter(t => getPathPattern(t.path) === 'r')
export const getXSO1 = (m: M): M => mT(m).filter(t => isSO1(getX(m).path, t.path))
export const getXSO2 = (m: M): M => mT(m).filter(t => isSO2(getX(m).path, t.path))
export const getXSCO = (m: M): M => mT(m).filter(t => isSCO(getX(m).path, t.path))
export const getXSCR0 = (m: M): M => mT(m).filter(t => isSCR0(getX(m).path, t.path))
export const getXSCC0 = (m: M): M => mT(m).filter(t => isSCC0(getX(m).path, t.path))
export const getXSCYY = (m: M): M => mT(m).filter(t => isSCYY(getX(m).path, t.path))
export const getXA = (m: M): M => mT(m).filter(t => t.selected)
export const getNRD0SO = (m: M, t: T): M => mT(m).filter(tt => isNRD0SO(t.path, tt.path))
export const getXRD0SO = (m: M): M => mT(m).filter(tt => isNRD0SO(getX(m).path, tt.path))
export const getNRD1SO = (m: M, t: T): M => mT(m).filter(tt => isNRD1SO(t.path, tt.path))
export const getXRD1SO = (m: M): M => mT(m).filter(tt => isNRD1SO(getX(m).path, tt.path))
export const getXAEO = (m: M): M => mT(m).filter(t => getXA(m).some(xn => isSEO(xn.path, t.path)))
export const getXACD1 = (m: M): M => mT(m).filter(t => getXA(m).some(xn => isCD1(xn.path, t.path)))
export const getXACU1 = (m: M): M => mT(m).filter(t => getXA(m).some(xn => isCU1(xn.path, t.path)))
export const getXACR1 = (m: M): M => mT(m).filter(t => getXA(m).some(xn => isCR1(xn.path, t.path)))
export const getXACL1 = (m: M): M => mT(m).filter(t => getXA(m).some(xn => isCL1(xn.path, t.path)))

const getCountSD = (m: M, p: P): number => mT(m).filter(t => isSD(p, t.path)).length
const getCountSU = (m: M, p: P): number => mT(m).filter(t => isSU(p, t.path)).length
const getCountSO1 = (m: M, p: P): number => mT(m).filter(t => isSO1(p, t.path)).length
const getCountSO2 = (m: M, p: P): number => mT(m).filter(t => isSO2(p, t.path)).length
const getCountCO1 = (m: M, p: P): number => mT(m).filter(t => isCO1(p, t.path)).length
const getCountCO2 = (m: M, p: P): number => mT(m).filter(t => isCO2(p, t.path)).length
const getCountCV = (m: M, p: P): number => mT(m).filter(t => isCH(p, t.path)).length
const getCountCH = (m: M, p: P): number => mT(m).filter(t => isCV(p, t.path)).length

export const getCountXASD = (m: M): number => getCountSD(m, getXL(m).path)
export const getCountXASU = (m: M): number => getCountSU(m, getXF(m).path)
export const getCountXASU1O1 = (m: M): number => getCountSO1(m, getXFSU1(m).path)
export const getCountNSO1 = (m: M, t: T): number => getCountSO1(m, t.path)
export const getCountXSO1 = (m: M): number => getCountSO1(m, getX(m).path)
export const getCountNSO2 = (m: M, t: T): number => getCountSO2(m, t.path)
export const getCountXSO2 = (m: M): number => getCountSO2(m, getX(m).path)
export const getCountXSI1U = (m: M): number => getCountSU(m, getSI1P(getX(m).path))
export const getCountXRD0S = (m: M): number => getCountSO1(m, getXRD0(m).path)
export const getCountXRD1S = (m: M): number => getCountSO1(m, getXRD1(m).path)
export const getCountNCO1 = (m: M, t: T): number => getCountCO1(m, t.path)
export const getCountXCO1 = (m: M): number => getCountCO1(m, getX(m).path)
export const getCountNCO2 = (m: M, t: T): number => getCountCO2(m, t.path)
export const getCountXCU = (m: M): number => getX(m).path.at(-2) as number
export const getCountXCL = (m: M): number => getX(m).path.at(-1) as number
export const getCountXCV = (m: M): number => getCountCV(m, getX(m).path)
export const getCountXCH = (m: M): number => getCountCH(m, getX(m).path)
export const getCountNSCV = (m: M, t: T): number => getCountCV(m, [...t.path, 'c', 0, 0])
export const getCountXSCV = (m: M): number => getCountCV(m, [...getX(m).path, 'c', 0, 0])
export const getCountNSCH = (m: M, t: T): number => getCountCH(m, [...t.path, 'c', 0, 0])
export const getCountXSCH = (m: M): number => getCountCH(m, [...getX(m).path, 'c', 0, 0])

export const getPropXA = (m: M, prop: keyof T) => isArrayOfEqualValues(getXA(m).map(t => t[prop])) ? getX(m)[prop] : null

export const getReselectR = (m: M): T => mT(m).find(t => !t.selected && isR(t.path))!
export const getReselectS = (m: M): T => getCountXASU(m) ? getXFSU1(m) : (isXDS(m) ? getXFSI2(m): getXFSI1(m))
export const getReselectCR = (m: M): M => getCountXCU(m) ? getXACU1(m) : ( getCountXCV(m) >= 2 ? getXACD1(m) : [getXSI1(m)] as M )
export const getReselectCC = (m: M): M => getCountXCL(m) ? getXACL1(m) : ( getCountXCH(m) >= 2 ? getXACR1(m) : [getXSI1(m)] as M )

export const lToCb = (m: M) => mL(m).filter(l => getNodeById(m, l.fromNodeId)?.selected && getNodeById(m, l.toNodeId)?.selected).map((l, i) => ({...l, path: ['l', i]})) as M
export const rToCb = (m: M) => getXA(m).map(el => el.path.at(1)).map(ri => mT(m).filter(t => isEqual(t.path.slice(0, 2), ['r', ri]))).map((m, i) => mT(m).map(t => ({...t, path: ['r', i, ...t.path.slice(2)]}))).flat() as M
export const sToCb = (m: M) => getXAEO(m).map(t => ({...t, path: ['s', (t.path.at(getX(m).path.length - 1) as number) - getCountXASU(m), ...t.path.slice(getX(m).path.length)]})) as M
export const crToCb = (m: M) => getXAEO(m).map(t => ({...t, path: ['c', (t.path.at(getX(m).path.length - 2) as number) - getCountXCU(m), t.path.at(getX(m).path.length - 1), ...t.path.slice(getX(m).path.length)]})) as M
export const ccToCb = (m: M) => getXAEO(m).map(t => ({...t, path: ['c', (t.path.at(getX(m).path.length - 2) as number), (t.path.at(getX(m).path.length - 1) as number) - getCountXCL(m), ...t.path.slice(getX(m).path.length)]})) as M

export const getEditedPath = (p: P): P => getPathPattern(p).endsWith('c') ? [...p, 's', 0] as P : p
export const getEditedNode = (m: M, p: P): T => getNodeByPath(m, getEditedPath(p))

export const hasTaskRight = (m: M, t: T): number => +getNRD0SO(m, t).some(t => t.taskStatus !== 0)
export const hasTaskLeft = (m: M, t: T): number => +getNRD1SO(m, t).some(t => t.taskStatus !== 0)

export const getRootStartX = (m: M, t: T): number => t.nodeStartX - getNRD1(m, t).familyW - getTaskWidth(getG(m)) * hasTaskLeft(m, t) - MARGIN_X
export const getRootStartY = (m: M, t: T): number => t.nodeY - Math.max(...[getNRD0(m, t).familyH, getNRD1(m, t).familyH]) / 2 - MARGIN_Y
export const getRootW = (m: M, t: T): number => getNRD0(m, t).familyW + getNRD1(m, t).familyW + t.selfW  + getTaskWidth(getG(m)) * (hasTaskLeft(m, t) + hasTaskRight(m, t)) + 2 * MARGIN_X
export const getRootH = (m: M, t: T): number => Math.max(...[getNRD0(m, t).familyH, getNRD1(m, t).familyH]) + 2 * MARGIN_Y
export const getRootMidX = (m: M, t: T):number => getRootStartX(m, t) + getRootW(m, t) / 2
export const getRootMidY = (m: M, t: T):number => getRootStartY(m, t) + getRootH(m, t) / 2
export const getRootEndX = (m: M, t: T):number => getRootStartX(m, t) + getRootW(m, t)
export const getRootEndY = (m: M, t: T):number => getRootStartY(m, t) + getRootH(m, t)

export const isExistingLink = (m: M, l: L): boolean => mL(m).some(lt => l.fromNodeId === lt.fromNodeId && l.toNodeId === lt.toNodeId)
