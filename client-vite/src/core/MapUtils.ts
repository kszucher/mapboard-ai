import isEqual from "react-fast-compare"
import {getTaskWidth} from "../component/MapSvgUtils"
import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {G, GN, M, N, P} from "../state/MapStateTypes"
import {isArrayOfEqualValues} from "./Utils"

export const sortablePath = (p: P): string => p.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('')

export const sortPath = (a: GN, b: GN) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
export const sortNode = (a: GN, b: GN) => a.nodeId > b.nodeId ? 1 : -1

export const getNodeByPath = (m: M, p: P) => m.find(n => isEqual(n.path, p)) as GN
export const getNodeById = (m: M, nodeId: string) => m.find(n => n.nodeId === nodeId) as GN

export const getPathPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')
export const getPathDir = (p: P) => p[3] ? -1 : 1
export const isDirR = (m: M) => getPathDir(getX(m).path) === 1
export const isDirL = (m: M) => getPathDir(getX(m).path) === -1

export const getRi = (p: P): number => p.at(1) as number
export const getRiL = (m: M): number => m.findLast(n => n.path.length === 2)!.path.at(1) as number
export const getXRi = (m: M): number => getRi(getX(m).path)

export const isG = (p: P): boolean => getPathPattern(p).endsWith('g')
export const isR = (p: P): boolean => getPathPattern(p).endsWith('r')
export const isD = (p: P): boolean => getPathPattern(p).endsWith('d')
export const isS = (p: P): boolean => getPathPattern(p).endsWith('s')
export const isC = (p: P): boolean => getPathPattern(p).endsWith('c')

export const isNR = (m: M, n: N): boolean => isR(n.path)
export const isXR = (m: M): boolean => isR(getX(m).path)
export const isXD = (m: M): boolean => isD(getX(m).path)
export const isNS = (m: M, n: N): boolean => isS(n.path)
export const isXS = (m: M): boolean => isS(getX(m).path)

export const isXDS = (m: M): boolean => getX(m).path.length === 6
const isXASV = (m: M): boolean => isS(getX(m).path) && getXA(m).map(n => n.path).every(p => isSV(getX(m).path, p))
export const isXASVN = (m: M): boolean => isXASV(m) && ((getXSL(m).path.at(-1) as number) - (getXSF(m).path.at(-1) as number)) === getXA(m).length - 1
export const isXC = (m: M): boolean => isC(getX(m).path) && getXA(m).length === 1
export const isXACR = (m: M): boolean => isC(getX(m).path) && getXA(m).length > 1 && getXA(m).map(n => n.path).every(p => isCV(getX(m).path, p))
export const isXACC = (m: M): boolean => isC(getX(m).path) && getXA(m).length > 1 && getXA(m).map(n => n.path).every(p => isCH(getX(m).path, p))
export const isXCB = (m: M): boolean => isC(getX(m).path) && getCountXCU(m) === getCountXCV(m) - 1
export const isXCT = (m: M): boolean => isC(getX(m).path) && getCountXCU(m) === 0
export const isXCR = (m: M): boolean => isC(getX(m).path) && getCountXCL(m) === getCountXCH(m) - 1
export const isXCL = (m: M): boolean => isC(getX(m).path) && getCountXCL(m) === 0

const isSD = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! > p.at(-1)!
export const isSU = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! < p.at(-1)!
const isSEO = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length), p)
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
const isSCXX = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p)
const isSCYY = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-2) as number > 0 && pt.at(-1) as number > 0
const isSCR0 = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-2) === 0
const isSCC0 = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-1) === 0
const isSV = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -1), p.slice(0, -1))
export const isCV = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-2) === p.at(-2)
export const isCH = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-1) === p.at(-1)
export const isNRD = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! > p.at(-1)!
export const isNSED = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! >= p.at(-1)!
export const isNSD = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! > p.at(-1)!
export const isNCED = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! >= p.at(-2)! && pt.at(p.length - 1)! === p.at(-1)!
export const isNCD = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! > p.at(-2)! && pt.at(p.length - 1)! === p.at(-1)!
export const isNCER = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! === p.at(-2)! && pt.at(p.length - 1)! >= p.at(-1)!
export const isNCR = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! === p.at(-2)! && pt.at(p.length - 1)! > p.at(-1)!

export const getG = (m: M): G => m.filter(n => n.path.length === 1).at(0) as G

export const getCountQuasiSU = (m: M): number => m.filter(n => sortablePath(n.path) < sortablePath(getX(m).path) && getPathDir(n.path) === getPathDir(getX(m).path) && getPathPattern(n.path) === getPathPattern(getX(m).path)).length
export const getQuasiSU = (m: M): N => m.findLast(n => sortablePath(n.path) < sortablePath(getX(m).path) && getPathDir(n.path) === getPathDir(getX(m).path) && getPathPattern(n.path) === getPathPattern(getX(m).path))!
export const getCountQuasiSD = (m: M): number => m.filter(n => sortablePath(n.path) > sortablePath(getX(m).path) && getPathDir(n.path) === getPathDir(getX(m).path) && getPathPattern(n.path) === getPathPattern(getX(m).path)).length
export const getQuasiSD = (m: M): N => m.find(n => sortablePath(n.path) > sortablePath(getX(m).path) && getPathDir(n.path) === getPathDir(getX(m).path) && getPathPattern(n.path) === getPathPattern(getX(m).path))!

export const getLastSO = (m: M): N => getNodeByPath(m, [...getX(m).path, 's', getX(m).lastSelectedChild > - 1 && getX(m).lastSelectedChild < getCountXSO1(m) ? getX(m).lastSelectedChild : 0])
export const getLastSOR = (m: M): N => getNodeByPath(m, [...getXRD0(m).path, 's', getXRD0(m).lastSelectedChild > - 1 && getXRD0(m).lastSelectedChild < getCountXRD0S(m) ? getXRD0(m).lastSelectedChild : 0])
export const getLastSOL = (m: M): N => getNodeByPath(m, [...getXRD1(m).path, 's', getXRD1(m).lastSelectedChild > - 1 && getXRD1(m).lastSelectedChild < getCountXRD1S(m) ? getXRD1(m).lastSelectedChild : 0])

const getSU1 = (p: P): P => p.at(-1) as number > 0 ? [...p.slice(0, -1), p.at(-1) as number - 1] : p

export const getSIPL = (p: P): P[] => p.map((pi, i) => p.slice(0, i)).filter(pi => ['r', 'd', 's'].includes(pi.at(-2) as string) || pi.at(-3) === 'c' )

export const getSI1P = (p: P): P => getSIPL(p).at(-1) as P
const getSI2P = (p: P): P => getSIPL(p).at(-2) as P
const getSIC = (p: P) => getSIPL(p).findLast(pli => getPathPattern(pli).endsWith('c'))!

const getXSF = (m: M): N => m.find(n => n.selected)!
const getXSL = (m: M): N => m.findLast(n => n.selected)!
export const getX = (m: M): N => m.filter(n => n.path.length > 1).reduce((a, b) => a.selected > b.selected ? a : b)
export const getR0 = (m: M): N => getNodeByPath(m, ['r', 0])
export const getNSI1 = (m: M, n: N): N => getNodeByPath(m, getSI1P(n.path))
export const getXSI1 = (m: M): N => getNodeByPath(m, getSI1P(getX(m).path))
export const getNSI2 = (m: M, n: N): N => getNodeByPath(m, getSI2P(n.path))
export const getXSI2 = (m: M): N => getNodeByPath(m, getSI2P(getX(m).path))
export const getXASU1 = (m: M): N => getNodeByPath(m, getSU1(getXSF(m).path))
export const getNSIC = (m: M, n: N): N => getNodeByPath(m, getSIC(n.path))
export const getXSIC = (m: M): N => getNodeByPath(m, getSIC(getX(m).path))
export const getNR = (m: M, n: N): N => getNodeByPath(m, n.path.slice(0, 2))
export const getXR = (m: M): N => getNodeByPath(m, getX(m).path.slice(0, 2))
export const getNRD0 = (m: M, n: N): N => getNodeByPath(m, [...n.path.slice(0, 2), 'd', 0])
export const getXRD0 = (m: M): N => getNodeByPath(m, [...getX(m).path.slice(0, 2), 'd', 0])
export const getNRD1 = (m: M, n: N): N => getNodeByPath(m, [...n.path.slice(0, 2), 'd', 1])
export const getXRD1 = (m: M): N => getNodeByPath(m, [...getX(m).path.slice(0, 2), 'd', 1])

export const getRL = (m: M): M => m.filter(n => n.path.length === 2)
export const getXSO1 = (m: M): M => m.filter(n => isSO1(getX(m).path, n.path))
export const getXSO2 = (m: M): M => m.filter(n => isSO2(getX(m).path, n.path))
export const getXSSCR0 = (m: M): M => m.filter(n => isSCR0(getX(m).path, n.path))
export const getXSSCC0 = (m: M): M => m.filter(n => isSCC0(getX(m).path, n.path))
export const getXSSCYY = (m: M): M => m.filter(n => isSCYY(getX(m).path, n.path))
export const getXA = (m: M): M => m.filter(n => n.selected)
export const getNRD0SO = (m: M, n: N): M => m.filter(nt => isSO(getNRD0(m, n).path, nt.path))
export const getXRD0SO = (m: M): M => m.filter(n => isSO(getXRD0(m).path, n.path))
export const getXAEO = (m: M): M => m.filter(n => getXA(m).some(xn => isSEO(xn.path, n.path)))
export const getXAO = (m: M): M => m.filter(n => getXA(m).some(xn => isSO(xn.path, n.path)))
export const getXACD1 = (m: M): M => m.filter(n => getXA(m).some(xn => isCD1(xn.path, n.path)))
export const getXACU1 = (m: M): M => m.filter(n => getXA(m).some(xn => isCU1(xn.path, n.path)))
export const getXACR1 = (m: M): M => m.filter(n => getXA(m).some(xn => isCR1(xn.path, n.path)))
export const getXACL1 = (m: M): M => m.filter(n => getXA(m).some(xn => isCL1(xn.path, n.path)))

const getCountSD = (m: M, p: P): number => m.filter(n => isSD(p, n.path)).length
const getCountSU = (m: M, p: P): number => m.filter(n => isSU(p, n.path)).length
const getCountSO1 = (m: M, p: P): number => m.filter(n => isSO1(p, n.path)).length
const getCountSO2 = (m: M, p: P): number => m.filter(n => isSO2(p, n.path)).length
const getCountCO1 = (m: M, p: P): number => m.filter(n => isCO1(p, n.path)).length
const getCountCO2 = (m: M, p: P): number => m.filter(n => isCO2(p, n.path)).length
const getCountCV = (m: M, p: P): number => m.filter(n => isCH(p, n.path)).length
const getCountCH = (m: M, p: P): number => m.filter(n => isCV(p, n.path)).length

export const getCountXASD = (m: M): number => getCountSD(m, getXSL(m).path)
export const getCountXASU = (m: M): number => getCountSU(m, getXSF(m).path)
export const getCountXASU1O1 = (m: M): number => getCountSO1(m, getXASU1(m).path)
export const getCountNSO1 = (m: M, n: N): number => getCountSO1(m, n.path)
export const getCountXSO1 = (m: M): number => getCountSO1(m, getX(m).path)
export const getCountNSO2 = (m: M, n: N): number => getCountSO2(m, n.path)
export const getCountXSO2 = (m: M): number => getCountSO2(m, getX(m).path)
export const getCountXSI1U = (m: M): number => getCountSU(m, getSI1P(getX(m).path))
export const getCountXRD0S = (m: M): number => getCountSO1(m, getXRD0(m).path)
export const getCountXRD1S = (m: M): number => getCountSO1(m, getXRD1(m).path)
export const getCountNCO1 = (m: M, n: N): number => getCountCO1(m, n.path)
export const getCountXCO1 = (m: M): number => getCountCO1(m, getX(m).path)
export const getCountNCO2 = (m: M, n: N): number => getCountCO2(m, n.path)
export const getCountXCU = (m: M): number => getX(m).path.at(-2) as number
export const getCountXCL = (m: M): number => getX(m).path.at(-1) as number
export const getCountXCV = (m: M): number => getCountCV(m, getX(m).path)
export const getCountXCH = (m: M): number => getCountCH(m, getX(m).path)
export const getCountNSCV = (m: M, n: N): number => getCountCV(m, [...n.path, 'c', 0, 0])
export const getCountXSCV = (m: M): number => getCountCV(m, [...getX(m).path, 'c', 0, 0])
export const getCountNSCH = (m: M, n: N): number => getCountCH(m, [...n.path, 'c', 0, 0])
export const getCountXSCH = (m: M): number => getCountCH(m, [...getX(m).path, 'c', 0, 0])

export const getPropXA = (m: M, prop: keyof N) => isArrayOfEqualValues(getXA(m).map(n => n[prop])) ? getX(m)[prop] : null

export const getReselectR = (m: M): N => m.find(n => !n.selected && isR(n.path))!
export const getReselectS = (m: M): N => getCountXASU(m) ? getNodeByPath(m, getSU1(getXSF(m).path)) : (isXDS(m) ? getNodeByPath(m, getSI2P(getXSF(m).path)): getNodeByPath(m, getSI1P(getXSF(m).path)))
export const getReselectCR = (m: M): M => getCountXCU(m) ? getXACU1(m) : ( getCountXCV(m) >= 2 ? getXA(m) : [getNodeByPath(m, getXSI1(m).path)] )
export const getReselectCC = (m: M): M => getCountXCL(m) ? getXACL1(m) : ( getCountXCH(m) >= 2 ? getXA(m) : [getNodeByPath(m, getXSI1(m).path)] )

export const getEditedPath = (p: P): P => getPathPattern(p).endsWith('c') ? [...p, 's', 0] as P : p
export const getEditedNode = (m: M, p: P): N => getNodeByPath(m, getEditedPath(p))

export const hasTaskRight = (m: M, ri: number) => +m.filter(n => n.path.at(1) === ri).some(n => n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4 && n.path[3] === 0)
export const hasTaskLeft = (m: M, ri: number) => +m.filter(n => n.path.at(1) === ri).some(n => n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4 && n.path[3] === 1)

export const getRootStartX = (m: M, n: N): number => n.nodeStartX - getNRD1(m, n).familyW - getTaskWidth(getG(m)) * hasTaskLeft(m, getRi(n.path)) - MARGIN_X
export const getRootStartY = (m: M, n: N): number => n.nodeY - Math.max(...[getNRD0(m, n).familyH, getNRD1(m, n).familyH]) / 2 - MARGIN_Y
export const getRootW = (m: M, n: N): number => getNRD0(m, n).familyW + getNRD1(m, n).familyW + n.selfW  + getTaskWidth(getG(m)) * (hasTaskLeft(m, getRi(n.path)) + hasTaskRight(m, getRi(n.path))) + 2 * MARGIN_X
export const getRootH = (m: M, n: N): number => Math.max(...[getNRD0(m, n).familyH, getNRD1(m, n).familyH]) + 2 * MARGIN_Y
export const getRootMidX = (m: M, n: N):number => getRootStartX(m, n) + getRootW(m, n) / 2
export const getRootMidY = (m: M, n: N):number => getRootStartY(m, n) + getRootH(m, n) / 2
export const getRootEndX = (m: M, n: N):number => getRootStartX(m, n) + getRootW(m, n)
export const getRootEndY = (m: M, n: N):number => getRootStartY(m, n) + getRootH(m, n)
