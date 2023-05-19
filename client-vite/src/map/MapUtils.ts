import isEqual from "react-fast-compare"
import {isArrayOfEqualValues} from "../core/Utils"
import {G, GN, M, N, P} from "../state/MapPropTypes"

export const sortPath = (a: GN, b: GN) => a.path.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('') > b.path.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('') ? 1 : -1
export const sortNode = (a: GN, b: GN) => a.nodeId > b.nodeId ? 1 : -1

export const getNodeByPath = (m: M, p: P) => m.find(n => isEqual(n.path, p)) as GN
export const getNodeById = (m: M, nodeId: string) => m.find(n => n.nodeId === nodeId) as GN

export const getPathPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')
export const getPathDir = (p: P) => p[3] ? -1 : 1

export const incPi = (p: P, at: number) => structuredClone(p).map((p, i) => i === at ? p as number + 1 : p)
export const decPi = (p: P, at: number) => structuredClone(p).map((p, i) => i === at ? p as number - 1 : p)
export const incPiN = (p: P, at: number, n: number) => structuredClone(p).map((p, i) => i === at ? p as number + n : p)
export const decPiN = (p: P, at: number, n: number) => structuredClone(p).map((p, i) => i === at ? p as number - n : p)

export const isG = (p: P) => getPathPattern(p).endsWith('g')
export const isR = (p: P) => getPathPattern(p).endsWith('r')
export const isD = (p: P) => getPathPattern(p).endsWith('d')
export const isS = (p: P) => getPathPattern(p).endsWith('s')
export const isC = (p: P) => getPathPattern(p).endsWith('c')

export const getSU1 = (p: P) => p.at(-1) as number > 0 ? [...p.slice(0, -1), p.at(-1) as number - 1] : p
export const getSIL = (p: P) => p.map((pi, i) => p.slice(0, i)).filter(pi => ['r', 'd', 's'].includes(pi.at(-2) as string) || pi.at(-3) === 'c' )
export const getSI1 = (p: P) => getSIL(p).at(-1) as P
export const getSI2 = (p: P) => getSIL(p).at(-2) as P

export const isSD = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! > p.at(-1)!
export const isSU = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! < p.at(-1)!
export const isSO = (p: P, pt: P) => pt.length > p.length && isEqual(pt.slice(0, p.length), p)
export const isSS = (p: P, pt: P) => pt.length === p.length + 2 && isEqual(pt.slice(0, -2), p) && pt.at(-2) === 's'
export const isSC = (p: P, pt: P) => pt.length === p.length + 3 && isEqual(pt.slice(0, -3), p) && pt.at(-3) === 'c'
export const isSCR0S = (p: P, pt: P) => pt.length === p.length + 5 && isEqual(pt.slice(0, -5), p) && pt.at(-4) === 0 && pt.at(-1) === 0
export const isSCC0S = (p: P, pt: P) => pt.length === p.length + 5 && isEqual(pt.slice(0, -5), p) && pt.at(-3) === 0 && pt.at(-1) === 0
export const isSF = (p: P, pt: P) => isEqual(p, pt) || isSO(p, pt)
export const isSDF = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! > p.at(-1)!
export const isSFDF = (p: P, pt: P) => isSF(p, pt) || isSDF(p, pt)
export const isSV = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -1), p.slice(0, -1))
export const isCV = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-2) === p.at(-2)
export const isCH = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-1) === p.at(-1)
export const isCFRF = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 1)! >= p.at(-1)!
export const isCFDF = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! >= p.at(-2)!

export const getCountD = (m: M, p: P) => p.length === 2 ? 2 : 0
export const getCountSD = (m: M, p: P) => m.filter(n => isSD(p, n.path)).length
export const getCountSU = (m: M, p: P) => m.filter(n => isSU(p, n.path)).length
export const getCountSS = (m: M, p: P) => m.filter(n => isSS(p, n.path)).length
export const getCountSC = (m: M, p: P) => m.filter(n => isSC(p, n.path)).length
export const getCountR0D0S = (m: M) => m.filter(n => n.path.length === 6 && getPathDir(n.path) === 1 && isS(n.path)).length
export const getCountR0D1S  = (m: M) => m.filter(n => n.path.length === 6 && getPathDir(n.path) === -1 && isS(n.path)).length
export const getCountCH = (m: M, p: P) => m.filter(n => isCV(p, n.path)).length
export const getCountCV = (m: M, p: P) => m.filter(n => isCH(p, n.path)).length

export const getG = (m: M) => m.filter(n => n.path.length === 1).at(0) as G
export const getX = (m: M) => m.filter(n => n.path.length > 1).reduce((a, b) => a.selected > b.selected ? a : b)
export const getXP = (m: M) => getX(m).path
export const getSXF = (m: M) => m.find(n => n.selected)!
export const getSXFP = (m: M) => getSXF(m).path
export const getSXL = (m: M) => m.findLast(n => n.selected)!
export const getSXLP = (m: M) => getSXL(m).path
export const getSXI1  = (m: M) => getSI1(getXP(m))
export const getSXI2 = (m: M) => getSI2(getXP(m))
export const getCXD = (m: M) => incPi(getXP(m), getXP(m).length - 2)
export const getCXU = (m: M) => decPi(getXP(m), getXP(m).length - 2)
export const getCXR = (m: M) => incPi(getXP(m), getXP(m).length - 1)
export const getCXL = (m: M) => decPi(getXP(m), getXP(m).length - 1)

export const getXA = (m: M) => m.filter(n => n.selected)
export const getSXAU1 = (m: M) => getSU1(getSXFP(m))
export const getSXAI1 = (m: M) => getSI1(getSXFP(m))
export const getSXAF = (m: M) => m.filter(n => getXA(m).map(n => n.path).some(p => isSF(p, n.path)))
export const getSXSCR0S = (m: M) => m.filter(n => isSCR0S(getXP(m), n.path))
export const getSXSCC0S = (m: M) => m.filter(n => isSCC0S(getXP(m), n.path))
export const getCXAD = (m: M) => getXA(m).map(n => incPi(n.path, n.path.length - 2))
export const getCXAU = (m: M) => getXA(m).map(n => decPi(n.path, n.path.length - 2))
export const getCXAR = (m: M) => getXA(m).map(n => incPi(n.path, n.path.length - 1))
export const getCXAL = (m: M) => getXA(m).map(n => decPi(n.path, n.path.length - 1))

export const getCountSXAD = (m: M) => getCountSD(m, getSXLP(m))
export const getCountSXAU = (m: M) => getCountSU(m, getSXFP(m))
export const getCountSXAU1O1 = (m: M) => getCountSS(m, getSXAU1(m))
export const getCountSXO1 = (m: M) => getCountSS(m, getXP(m))
export const getCountSXI1U = (m: M) => getCountSU(m, getSI1(getXP(m)))
export const getCountSCR = (m: M, p: P) =>  getCountCV(m, [...p, 'c', 0, 0])
export const getCountSCC = (m: M, p: P) =>  getCountCH(m, [...p, 'c', 0, 0])
export const getCountCXU = (m: M) => getXP(m).at(-2) as number
export const getCountCXL = (m: M) => getXP(m).at(-1) as number
export const getCountCXH = (m: M) => getCountCH(m, getXP(m))
export const getCountCXV = (m: M) => getCountCV(m, getXP(m))

export const getPropXA = (m: M, prop: keyof N) => isArrayOfEqualValues(getXA(m).map(n => n[prop])) ? getX(m)[prop] : null
export const getPropXASSO = (m: M, prop: keyof N) => isArrayOfEqualValues(getSXAF(m).map(n => n[prop])) ? getX(m)[prop] : null

export const isRX = (m: M) => isR(getXP(m)) && !m.find(n => n.selected && !isR(n.path))
export const isSX = (m: M) => isS(getXP(m)) && !m.find(n => n.selected && !isS(n.path))
export const isDSX = (m: M) => getXP(m).length === 6
export const isSXAV = (m: M) => isS(getXP(m)) && getXA(m).map(n => n.path).every(p => isSV(getXP(m), p))
export const isSXAVN = (m: M) => isSXAV(m) && ((getSXLP(m).at(-1) as number) - (getSXF(m).path.at(-1) as number)) === getXA(m).length - 1
export const isCX = (m: M) => isC(getXP(m)) && getXA(m).length === 1
export const isCRXA = (m: M) => isC(getXP(m)) && getXA(m).length > 1 && getXA(m).map(n => n.path).every(p => isCV(getXP(m), p))
export const isCCXA = (m: M) => isC(getXP(m)) && getXA(m).length > 1 && getXA(m).map(n => n.path).every(p => isCH(getXP(m), p))
export const isCXB = (m: M) => isC(getXP(m)) && getCountCXU(m) === getCountCXV(m) - 1
export const isCXT = (m: M) => isC(getXP(m)) && getCountCXU(m) === 0
export const isCXR = (m: M) => isC(getXP(m)) && getCountCXL(m) === getCountCXH(m) - 1
export const isCXL = (m: M) => isC(getXP(m)) && getCountCXL(m) === 0

export const setPropXA = (m: M, prop: keyof N, value: any) => getXA(m).forEach(n => Object.assign(n, {[prop]: value}))
export const setPropXASF = (m: M, prop: keyof N, value: any) => getSXAF(m).forEach(n => Object.assign(n, {[prop]: value}))

export const makeSpaceFromS = (m: M, p: P, length: number) => m.filter(n => isSFDF(p, n.path)).forEach(n => n.path = incPiN(n.path, p.length - 1, length))
export const makeSpaceFromCR = (m: M, p: P) => m.filter(n => isCFDF(p, n.path)).forEach(n => n.path = incPi(n.path, p.length - 2))
export const makeSpaceFromCC = (m: M, p: P) => m.filter(n => isCFRF(p, n.path)).forEach(n => n.path = incPi(n.path, p.length - 1))

export const getReselectS = (m: M) => getCountSXAU(m) ? getSXAU1(m) : getSXAI1(m)
export const getReselectCR = (m: M) => getCountCXU(m) ? getCXAU(m) : ( getCountCXV(m) >= 2 ? getXA(m).map(n => n.path) : [getSXI1(m)] )
export const getReselectCC = (m: M) => getCountCXL(m) ? getCXAL(m) : ( getCountCXH(m) >= 2 ? getXA(m).map(n => n.path) : [getSXI1(m)] )

export const m2cbS = (m: M) => structuredClone(getSXAF(m).map(n =>
  ({...n, path: ['s', (n.path.at(getXP(m).length - 1) as number) - getCountSXAU(m), ...n.path.slice(getXP(m).length)]}))) as GN[]
export const m2cbCR = (m: M) => structuredClone(getSXAF(m).map(n =>
  ({...n, path: ['c', (n.path.at(getXP(m).length - 2) as number) - getCountCXU(m), n.path.at(getXP(m).length - 1), ...n.path.slice(getXP(m).length)]}))) as GN[]
export const m2cbCC = (m: M) => structuredClone(getSXAF(m).map(n =>
  ({...n, path: ['c', (n.path.at(getXP(m).length - 2) as number), (n.path.at(getXP(m).length - 1) as number) - getCountCXL(m), ...n.path.slice(getXP(m).length)]}))) as GN[]

export const cb2ipS = (cb: GN[], ip: P) => structuredClone(cb.map(n =>
  ({...n, path: [...ip.slice(0, -2), 's', (n.path.at(1) as number) + (ip.at(-1) as number), ...n.path.slice(2)]}))) as GN[]
export const cb2ipCR = (cb: GN[], ip: P) => structuredClone(cb.map(n =>
  ({...n, path: [...ip.slice(0, -3), 'c', (n.path.at(1) as number) + (ip.at(-2) as number), (n.path.at(2) as number), ...n.path.slice(3)]}))) as GN[]
export const cb2ipCC = (cb: GN[], ip: P) => structuredClone(cb.map(n =>
  ({...n, path: [...ip.slice(0, -3), 'c', (n.path.at(1) as number), (n.path.at(2) as number) + (ip.at(-1) as number), ...n.path.slice(3)]}))) as GN[]

export const getEditedPath = (p: P) => getPathPattern(p).endsWith('c') ? [...p, 's', 0] as P : p
export const getEditedNode = (m: M, p: P) => getNodeByPath(m, getEditedPath(p))
export const getParentNodeByPath = (m: M, p: P) => getNodeByPath(m, getSI1(p)) as N
export const getClosestStructParentPath = (p: P) => (getPathPattern(p).endsWith('ds') || getPathPattern(p).endsWith('ss')) ? p.slice(0, -2) : p.slice(0, -5)
