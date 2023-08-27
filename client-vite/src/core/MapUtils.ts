import isEqual from "react-fast-compare"
import {getTaskWidth} from "../component/MapSvgUtils";
import {MARGIN_X, MARGIN_Y} from "../state/Consts";
import {G, GN, M, N, P} from "../state/MapStateTypes"
import {isArrayOfEqualValues} from "./Utils"

export const sortPath = (a: GN, b: GN) => a.path.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('') > b.path.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('') ? 1 : -1
export const sortNode = (a: GN, b: GN) => a.nodeId > b.nodeId ? 1 : -1

export const getNodeByPath = (m: M, p: P) => m.find(n => isEqual(n.path, p)) as GN
export const getNodeById = (m: M, nodeId: string) => m.find(n => n.nodeId === nodeId) as GN

export const getPathPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')
export const getPathDir = (p: P) => p[3] ? -1 : 1
export const isDirR = (m: M) => getPathDir(getXP(m)) === 1
export const isDirL = (m: M) => getPathDir(getXP(m)) === -1

export const getRi = (p: P): number => p.at(1) as number
export const getRiL = (m: M): number => m.findLast(n => n.path.length === 2)!.path.at(1) as number
export const getXRi = (m: M): number  => getRi(getXP(m))
export const getNRi = (m: M, n: N): N => getNodeByPath(m, n.path.slice(0, 2))
export const getNRiD0 = (m: M, n: N): N => getNodeByPath(m, [...n.path.slice(0, 2), 'd', 0])
export const getXRiD0 = (m: M): N => getNRiD0(m, getX(m))

const isSO1 = (p: P, pt: P): boolean => pt.length === p.length + 2 && isEqual(pt.slice(0, -2), p) && pt.at(-2) === 's'
const isSO2 = (p: P, pt: P): boolean => pt.length === p.length + 4 && isEqual(pt.slice(0, -4), p) && pt.at(-2) === 's'
const isCO1 = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-3) === 'c'
const isCO2 = (p: P, pt: P): boolean => pt.length === p.length + 5 && isEqual(pt.slice(0, -5), p) && pt.at(-3) === 'c'
const isCD1 = (p: P, pt: P): boolean => pt.length === p.length && pt.at(-2) as number === p.at(-2) as number + 1 && pt.at(-1) as number === p.at(-1) as number
const isCU1 = (p: P, pt: P): boolean => pt.length === p.length && pt.at(-2) as number === p.at(-2) as number - 1 && pt.at(-1) as number === p.at(-1) as number
const isCR1 = (p: P, pt: P): boolean => pt.length === p.length && pt.at(-2) as number === p.at(-2) as number && pt.at(-1) as number === p.at(-1) as number + 1
const isCL1 = (p: P, pt: P): boolean => pt.length === p.length && pt.at(-2) as number === p.at(-2) as number && pt.at(-1) as number === p.at(-1) as number - 1
const isSCXX = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p)
const isSCYY = (p: P, pt: P): boolean => isSCXX(p, pt) && pt.at(-2) as number > 0 && pt.at(-1) as number > 0
const isSCR0 = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-2) === 0
const isSCC0 = (p: P, pt: P): boolean => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-1) === 0
const isSF = (p: P, pt: P): boolean => isEqual(p, pt) || isSO(p, pt)
const isSDF = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! > p.at(-1)!
const isSFDF = (p: P, pt: P): boolean => isSF(p, pt) || isSDF(p, pt)
const isSV = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -1), p.slice(0, -1))
const isCFRF = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 1)! >= p.at(-1)!
const isCFDF = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! >= p.at(-2)!
const isXASV = (m: M): boolean => isS(getXP(m)) && getXA(m).map(n => n.path).every(p => isSV(getXP(m), p))

export const isG = (p: P): boolean => getPathPattern(p).endsWith('g')
export const isR = (p: P): boolean => getPathPattern(p).endsWith('r')
export const isD = (p: P): boolean => getPathPattern(p).endsWith('d')
export const isS = (p: P): boolean => getPathPattern(p).endsWith('s')
export const isC = (p: P): boolean => getPathPattern(p).endsWith('c')
export const isCON = (p: P): boolean => p.includes('c')
export const isSD = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! > p.at(-1)!
export const isSU = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! < p.at(-1)!
export const isSO = (p: P, pt: P): boolean => pt.length > p.length && isEqual(pt.slice(0, p.length), p)
export const isCV = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-2) === p.at(-2)
export const isCH = (p: P, pt: P): boolean => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-1) === p.at(-1)
export const isXR = (m: M): boolean => isR(getXP(m)) && !m.find(n => n.selected && !isR(n.path))
export const isXD = (m: M): boolean => isD(getXP(m)) && !m.find(n => n.selected && !isD(n.path))
export const isXS = (m: M): boolean => isS(getXP(m)) && !m.find(n => n.selected && !isS(n.path))
export const isXDS = (m: M): boolean => getXP(m).length === 6
export const isXASVN = (m: M): boolean => isXASV(m) && ((getXSLP(m).at(-1) as number) - (getXSF(m).path.at(-1) as number)) === getXA(m).length - 1
export const isXC = (m: M): boolean => isC(getXP(m)) && getXA(m).length === 1
export const isXACR = (m: M): boolean => isC(getXP(m)) && getXA(m).length > 1 && getXA(m).map(n => n.path).every(p => isCV(getXP(m), p))
export const isXACC = (m: M): boolean => isC(getXP(m)) && getXA(m).length > 1 && getXA(m).map(n => n.path).every(p => isCH(getXP(m), p))
export const isXCB = (m: M): boolean => isC(getXP(m)) && getCountXCU(m) === getCountXCV(m) - 1
export const isXCT = (m: M): boolean => isC(getXP(m)) && getCountXCU(m) === 0
export const isXCR = (m: M): boolean => isC(getXP(m)) && getCountXCL(m) === getCountXCH(m) - 1
export const isXCL = (m: M): boolean => isC(getXP(m)) && getCountXCL(m) === 0
export const isNSD = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! > p.at(-1)!
export const isNCD = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! > p.at(-2)! && pt.at(p.length - 1)! === p.at(-1)!
export const isNCR = (p: P, pt: P): boolean => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! === p.at(-2)! && pt.at(p.length - 1)! > p.at(-1)!

const getSU1 = (p: P): P => p.at(-1) as number > 0 ? [...p.slice(0, -1), p.at(-1) as number - 1] : p

export const getG = (m: M): G => m.filter(n => n.path.length === 1).at(0) as G

export const getSIPL = (p: P): P[] => p.map((pi, i) => p.slice(0, i)).filter(pi => ['r', 'd', 's'].includes(pi.at(-2) as string) || pi.at(-3) === 'c' )

export const getSI1P = (p: P): P => getSIPL(p).at(-1) as P
export const getSI2P = (p: P): P => getSIPL(p).at(-2) as P

export const getXP = (m: M): P => getX(m).path
export const getXSFP = (m: M): P => getXSF(m).path
export const getXSLP = (m: M): P => getXSL(m).path
export const getXSI1P  = (m: M): P => getSI1P(getXP(m))
export const getXSI2P = (m: M): P => getSI2P(getXP(m))
export const getXASU1P = (m: M): P => getSU1(getXSFP(m))

const getXSF = (m: M): N => m.find(n => n.selected)!
const getXSL = (m: M): N => m.findLast(n => n.selected)!
export const getX = (m: M): N => m.filter(n => n.path.length > 1).reduce((a, b) => a.selected > b.selected ? a : b)
export const getR0 = (m: M): N => getNodeByPath(m, ['r', 0])
export const getRXD0 = (m: M, ri: number): N => getNodeByPath(m, ['r', ri, 'd', 0])
export const getRXD1 = (m: M, ri: number): N => getNodeByPath(m, ['r', ri, 'd', 1])

export const getRL = (m: M): N[] => m.filter(n => n.path.length === 2)
export const getXSO1 = (m: M): N[] => m.filter(n => isSO1(getXP(m), n.path))
export const getXSO2 = (m: M): N[] => m.filter(n => isSO2(getXP(m), n.path))
export const getXA = (m: M): N[] => m.filter(n => n.selected)
export const getXAF = (m: M): N[] => m.filter(n => getXA(m).some(xn => isSF(xn.path, n.path)))
export const getXAO = (m: M): N[] => m.filter(n => getXA(m).some(xn => isSO(xn.path, n.path)))
export const getXSSCR0 = (m: M): N[] => m.filter(n => isSCR0(getXP(m), n.path))
export const getXSSCC0 = (m: M): N[] => m.filter(n => isSCC0(getXP(m), n.path))
export const getXSSCXX = (m: M): N[] => m.filter(n => isSCXX(getXP(m), n.path))
export const getXSSCYY = (m: M): N[] => m.filter(n => isSCYY(getXP(m), n.path))
export const getXACD1 = (m: M): N[] => m.filter(n => getXA(m).some(xn => isCD1(xn.path, n.path)))
export const getXACU1 = (m: M): N[] => m.filter(n => getXA(m).some(xn => isCU1(xn.path, n.path)))
export const getXACR1 = (m: M): N[] => m.filter(n => getXA(m).some(xn => isCR1(xn.path, n.path)))
export const getXACL1 = (m: M): N[] => m.filter(n => getXA(m).some(xn => isCL1(xn.path, n.path)))

const getCountSD = (m: M, p: P): number => m.filter(n => isSD(p, n.path)).length
const getCountSU = (m: M, p: P): number => m.filter(n => isSU(p, n.path)).length
const getCountSO1 = (m: M, p: P): number => m.filter(n => isSO1(p, n.path)).length
const getCountSO2 = (m: M, p: P): number => m.filter(n => isSO2(p, n.path)).length
const getCountCO1 = (m: M, p: P): number => m.filter(n => isCO1(p, n.path)).length
const getCountCO2 = (m: M, p: P): number => m.filter(n => isCO2(p, n.path)).length
const getCountRXD0S = (m: M, ri: number): number => m.filter(n => n.path.length === 6 && n.path.at(1) === ri && getPathDir(n.path) === 1 && isS(n.path)).length
const getCountRXD1S  = (m: M, ri: number): number => m.filter(n => n.path.length === 6 && n.path.at(1) === ri && getPathDir(n.path) === -1 && isS(n.path)).length
const getCountCV = (m: M, p: P): number => m.filter(n => isCH(p, n.path)).length
const getCountCH = (m: M, p: P): number => m.filter(n => isCV(p, n.path)).length
export const getCountSCR = (m: M, p: P): number => getCountCV(m, [...p, 'c', 0, 0])
export const getCountSCC = (m: M, p: P): number => getCountCH(m, [...p, 'c', 0, 0])

export const getCountNSO1 = (m: M, n: N): number => getCountSO1(m, n.path)
export const getCountNSO2 = (m: M, n: N): number => getCountSO2(m, n.path)
export const getCountNCO1 = (m: M, n: N): number => getCountCO1(m, n.path)
export const getCountNCO2 = (m: M, n: N): number => getCountCO2(m, n.path)

export const getCountXASD = (m: M): number => getCountSD(m, getXSLP(m))
export const getCountXASU = (m: M): number => getCountSU(m, getXSFP(m))
export const getCountXASU1O1 = (m: M): number => getCountSO1(m, getXASU1P(m))
export const getCountXSO1 = (m: M): number => getCountSO1(m, getXP(m))
export const getCountXSO2 = (m: M): number => getCountSO2(m, getXP(m))
export const getCountXSI1U = (m: M): number => getCountSU(m, getSI1P(getXP(m)))
export const getCountXRXD0S = (m: M): number => getCountRXD0S(m, getXRi(m))
export const getCountXRXD1S = (m: M): number => getCountRXD1S(m, getXRi(m))
export const getCountXCO1 = (m: M): number => getCountCO1(m, getXP(m))
export const getCountXCU = (m: M): number => getXP(m).at(-2) as number
export const getCountXCL = (m: M): number => getXP(m).at(-1) as number
export const getCountXCH = (m: M): number => getCountCH(m, getXP(m))
export const getCountXCV = (m: M): number => getCountCV(m, getXP(m))

export const getPropXA = (m: M, prop: keyof N) => isArrayOfEqualValues(getXA(m).map(n => n[prop])) ? getX(m)[prop] : null
export const getPropXAF = (m: M, prop: keyof N) => isArrayOfEqualValues(getXAF(m).map(n => n[prop])) ? getX(m)[prop] : null

export const makeSpaceFromS = (m: M, p: P, length: number) => m.forEach(n => isSFDF(p, n.path) && n.path.splice(p.length - 1, 1, n.path.at(p.length - 1) as number + length))
export const makeSpaceFromCR = (m: M, p: P) => m.forEach(n => isCFDF(p, n.path) && n.path.splice(p.length - 2, 1, n.path.at(p.length - 2) as number + 1))
export const makeSpaceFromCC = (m: M, p: P) => m.forEach(n => isCFRF(p, n.path) && n.path.splice(p.length - 1, 1, n.path.at(p.length - 1) as number + 1))

export const getReselectR = (m: M) => ['r', getXRi(m) - 1] as P
export const getReselectS = (m: M) => getCountXASU(m) ? getXASU1P(m) : (isXDS(m) ? getSI2P(getXSFP(m)): getSI1P(getXSFP(m)))
export const getReselectCR = (m: M) => getCountXCU(m) ? getXACU1(m).map(n => n.path) : ( getCountXCV(m) >= 2 ? getXA(m).map(n => n.path) : [getXSI1P(m)] )
export const getReselectCC = (m: M) => getCountXCL(m) ? getXACL1(m).map(n => n.path) : ( getCountXCH(m) >= 2 ? getXA(m).map(n => n.path) : [getXSI1P(m)] )

export const fR = (m: M, n: N) => ['r', 0, ...n.path.slice(getXP(m).length)]
export const fS = (m: M, n: N) => ['s', (n.path.at(getXP(m).length - 1) as number) - getCountXASU(m), ...n.path.slice(getXP(m).length)]
export const fCR = (m: M, n: N) => ['c', (n.path.at(getXP(m).length - 2) as number) - getCountXCU(m), n.path.at(getXP(m).length - 1), ...n.path.slice(getXP(m).length)]
export const fCC = (m: M, n: N) => ['c', (n.path.at(getXP(m).length - 2) as number), (n.path.at(getXP(m).length - 1) as number) - getCountXCL(m), ...n.path.slice(getXP(m).length)]

export const m2cbR = (m: M) => structuredClone(getXAF(m).map(n => ({...n, path: fR(m, n)}))) as M
export const m2cbS = (m: M) => structuredClone(getXAF(m).map(n => ({...n, path: fS(m, n)}))) as M
export const m2cbCR = (m: M) => structuredClone(getXAF(m).map(n => ({...n, path: fCR(m, n)}))) as M
export const m2cbCC = (m: M) => structuredClone(getXAF(m).map(n => ({...n, path: fCC(m, n)}))) as M

export const tS = (ip: P, n: N) => [...ip.slice(0, -2), 's', (n.path.at(1) as number) + (ip.at(-1) as number), ...n.path.slice(2)]
export const tCR = (ip: P, n: N) => [...ip.slice(0, -3), 'c', (n.path.at(1) as number) + (ip.at(-2) as number), (n.path.at(2) as number), ...n.path.slice(3)]
export const tCC = (ip: P, n: N) => [...ip.slice(0, -3), 'c', (n.path.at(1) as number), (n.path.at(2) as number) + (ip.at(-1) as number), ...n.path.slice(3)]

export const cb2ipS = (cb: M, ip: P) => structuredClone(cb.map(n => ({...n, path: tS(ip, n)}))) as M
export const cb2ipCR = (cb: M, ip: P) => structuredClone(cb.map(n => ({...n, path: tCR(ip, n)}))) as M
export const cb2ipCC = (cb: M, ip: P) => structuredClone(cb.map(n => ({...n, path: tCC(ip, n)}))) as M

export const getEditedPath = (p: P) => getPathPattern(p).endsWith('c') ? [...p, 's', 0] as P : p
export const getEditedNode = (m: M, p: P) => getNodeByPath(m, getEditedPath(p))

export const getClosestStructParentPath = (p: P) => (getPathPattern(p).endsWith('ds') || getPathPattern(p).endsWith('ss')) ? p.slice(0, -2) : p.slice(0, -5)
export const getClosestStructParent = (m: M, p: P) => getNodeByPath(m, getClosestStructParentPath(p))
export const getClosestCellParentPath = (p: P) => p.slice(0, p.lastIndexOf('c') + 3)
export const getClosestCellParent = (m: M, p: P) => getNodeByPath(m, getClosestCellParentPath(p))

export const hasTaskRight = (m: M, ri: number) => +m.filter(n => n.path.at(1) === ri).some(n => n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4 && n.path[3] === 0)
export const hasTaskLeft = (m: M, ri: number) => +m.filter(n => n.path.at(1) === ri).some(n => n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4 && n.path[3] === 1)

export const getRootStartX = (m: M, n: N) => n.nodeStartX - getRXD1(m, getRi(n.path)).familyW - getTaskWidth(getG(m)) * hasTaskLeft(m, getRi(n.path)) - MARGIN_X
export const getRootStartY = (m: M, n: N) => n.nodeY - Math.max(...[getRXD0(m, getRi(n.path)).familyH, getRXD1(m, getRi(n.path)).familyH]) / 2 - MARGIN_Y
export const getRootW = (m: M, n: N) => getRXD0(m, getRi(n.path)).familyW + getRXD1(m, getRi(n.path)).familyW + n.selfW  + getTaskWidth(getG(m)) * (hasTaskLeft(m, getRi(n.path)) + hasTaskRight(m, getRi(n.path))) + 2 * MARGIN_X
export const getRootH = (m: M, n: N) => Math.max(...[getRXD0(m, getRi(n.path)).familyH, getRXD1(m, getRi(n.path)).familyH]) + 2 * MARGIN_Y
export const getRootMidX = (m: M, n: N) => getRootStartX(m, n) + getRootW(m, n) / 2
export const getRootMidY = (m: M, n: N) => getRootStartY(m, n) + getRootH(m, n) / 2
export const getRootEndX = (m: M, n: N) => getRootStartX(m, n) + getRootW(m, n)
export const getRootEndY = (m: M, n: N) => getRootStartY(m, n) + getRootH(m, n)
