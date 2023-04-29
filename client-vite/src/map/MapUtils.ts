import isEqual from "react-fast-compare"
import {isArrayOfEqualValues} from "../core/Utils"
import {nSaveAlways, nSaveNever, nSaveOptional} from "../state/MapProps"
import {G, GN, M, N, P} from "../state/MapPropTypes"

export const sortPath = (a: GN, b: GN) => a.path.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('') > b.path.map((pi: any) => isNaN(pi) ? pi: 1000 + pi).join('') ? 1 : -1
export const sortNode = (a: GN, b: GN) => a.nodeId > b.nodeId ? 1 : -1

export const getNodeByPath = (m: M, p: P) => m.find(n => isEqual(n.path, p)) as GN
export const getNodeById = (m: M, nodeId: string) => m.find(n => n.nodeId === nodeId) as GN

export const getPathPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')
export const getPathDir = (p: P) => p[3] ? -1 : 1

export const getDefaultNode = (attributes?: any) => structuredClone({...nSaveAlways, ...nSaveOptional, ...nSaveNever, ...attributes})

export const incPi = (p: P, at: number) => structuredClone(p).map((p, i) => i === at ? p as number + 1 : p)
export const decPi = (p: P, at: number) => structuredClone(p).map((p, i) => i === at ? p as number - 1 : p)
export const incPiN = (p: P, at: number, n: number) => structuredClone(p).map((p, i) => i === at ? p as number + n : p)
export const decPiN = (p: P, at: number, n: number) => structuredClone(p).map((p, i) => i === at ? p as number - n : p)

export const isG = (p: P) => getPathPattern(p).endsWith('g')
export const isR = (p: P) => getPathPattern(p).endsWith('r')
export const isD = (p: P) => getPathPattern(p).endsWith('d')
export const isS = (p: P) => getPathPattern(p).endsWith('s')
export const isC = (p: P) => getPathPattern(p).endsWith('c')
export const isSU = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! < p.at(-1)!
export const isSD = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1)! > p.at(-1)!
export const isSO = (p: P, pt: P) => pt.length > p.length && isEqual(pt.slice(0, p.length), p)
export const isSF = (p: P, pt: P) => isEqual(p, pt) || isSO(p, pt)
export const isSO1 = (p: P, pt: P) => pt.length === p.length + 2 && isEqual(pt.slice(0, -2), p) && pt.at(-2) === 's'
export const isSD1 = (p: P, pt: P) => isSD(p, pt) && pt.at(-1) === p.at(-1) as number + 1
export const isSU1 = (p: P, pt: P) => isSU(p, pt) && pt.at(-1) === p.at(-1) as number - 1
export const isSUF = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! < p.at(-1)!
export const isSU1F = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! === p.at(-1)! as number - 1
export const isSDF = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! > p.at(-1)!
export const isSD1F = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1)! === p.at(-1)! as number + 1
export const isSFDF = (p: P, pt: P) => isSF(p, pt) || isSDF(p, pt)
export const isSV = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -1), p.slice(0, -1))
export const isCV = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-2) === p.at(-2)
export const isCH = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-1) === p.at(-1)
export const isCRF = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 1)! > p.at(-1)!
export const isCFRF = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 1)! >= p.at(-1)!
export const isCDF = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! > p.at(-2)!
export const isCFDF = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2)! >= p.at(-2)!

export const getIL = (p: P) => p.map((pi, i) => p.slice(0, i)).filter(pi => ['r', 'd', 's'].includes(pi.at(-2) as string) || pi.at(-3) === 'c' )
export const getSI1 = (p: P) => getIL(p).at(-1) as P
export const getSI2 = (p: P) => getIL(p).at(-2) as P
export const getSU1 = (p: P) => p.at(-1) as number > 0 ? [...p.slice(0, -1), p.at(-1) as number - 1] : p

export const getG = (m: M) => m.filter(n => n.path.length === 1).at(0) as G
export const getR0D0 = (m: M) => getNodeByPath(m, ['r', 0, 'd', 0])
export const getR0D1 = (m: M) => getNodeByPath(m, ['r', 0, 'd', 1])
export const getX = (m: M) => m.filter(n => n.path.length > 1).reduce((a, b) => a.selected > b.selected ? a : b)
export const getXP = (m: M) => getX(m).path
export const getXF = (m: M) => m.find(n => n.selected)!
export const getXFP = (m: M) => getXF(m).path
export const getXL = (m: M) => m.findLast(n => n.selected)!
export const getXLP = (m: M) => getXL(m).path
export const getXI1  = (m: M) => getSI1(getXP(m))
export const getXI2  = (m: M) => getSI2(getXP(m))
export const getXFSI1 = (m: M) => getSI1(getXFP(m))
export const getXFSU1 = (m: M) => getSU1(getXFP(m))
export const getXA = (m: M) => m.filter(n => n.selected)
export const getXAPL = (m: M) => getXA(m).map(n => n.path)
export const getXASF = (m: M) => m.filter(n => getXA(m).map(n => n.path).some(p => isSF(p, n.path)))
export const getXCR = (m: M) => incPi(getXP(m), getXP(m).length - 1)
export const getXCL = (m: M) => decPi(getXP(m), getXP(m).length - 1)
export const getXCD = (m: M) => incPi(getXP(m), getXP(m).length - 2)
export const getXCU = (m: M) => decPi(getXP(m), getXP(m).length - 2)
export const getXCCR = (m: M) => getXA(m).map(n => incPi(n.path, n.path.length - 1))
export const getXCCL = (m: M) => getXA(m).map(n => decPi(n.path, n.path.length - 1))
export const getXCRD = (m: M) => getXA(m).map(n => incPi(n.path, n.path.length - 2))
export const getXCRU = (m: M) => getXA(m).map(n => decPi(n.path, n.path.length - 2))

export const getCountD = (m: M, p: P) => p.length === 2 ? 2 : 0
export const getCountSO1 = (m: M, p: P) => m.filter(n => isSO1(p, n.path)).length
export const getCountSU = (m: M, p: P) => m.filter(n => isSU(p, n.path)).length
export const getCountSD = (m: M, p: P) => m.filter(n => isSD(p, n.path)).length
export const getCountR0D0S = (m: M) => m.filter(n => n.path.length === 6 && getPathDir(n.path) === 1 && isS(n.path)).length
export const getCountR0D1S  = (m: M) => m.filter(n => n.path.length === 6 && getPathDir(n.path) === -1 && isS(n.path)).length
export const getCountCH = (m: M, p: P) => m.filter(n => isCV(p, n.path)).length
export const getCountCV = (m: M, p: P) => m.filter(n => isCH(p, n.path)).length

export const getCountXFSU = (m: M) => getCountSU(m, getXFP(m))
export const getCountXLSD = (m: M) => getCountSD(m, getXLP(m))
export const getCountXFSU1SO1 = (m: M) => getCountSO1(m, getSU1(getXFP(m)))
export const getCountXSI1SU = (m: M) => getCountSU(m, getSI1(getXP(m)))
export const getCountXCU = (m: M) => getXP(m).at(-2) as number
export const getCountXCL = (m: M) => getXP(m).at(-1) as number
export const getCountXCH = (m: M) => getCountCH(m, getXP(m))
export const getCountXCV = (m: M) => getCountCV(m, getXP(m))

export const getPropXA = (m: M, prop: keyof N) => isArrayOfEqualValues(getXA(m).map(n => n[prop])) ? getX(m)[prop] : null
export const getPropXASSO = (m: M, prop: keyof N) => isArrayOfEqualValues(getXASF(m).map(n => n[prop])) ? getX(m)[prop] : null

export const isXR = (m: M) => isR(getXP(m)) && !m.find(n => n.selected && !isR(n.path))
export const isXS = (m: M) => isS(getXP(m)) && !m.find(n => n.selected && !isS(n.path))
export const isXDS = (m: M) => getXP(m).length === 6
export const isXSS = (m: M) => isS(getXP(m)) && getXA(m).map(n => n.path).every(p => isSV(getXP(m), p))
export const isXSSN = (m: M) => isXSS(m) && ((getXL(m).path.at(-1) as number) - (getXF(m).path.at(-1) as number)) === getXA(m).length - 1
export const isXC = (m: M) => isC(getXP(m)) && getXA(m).length === 1
export const isXCR = (m: M) => isC(getXP(m)) && getXA(m).length > 1 && getXA(m).map(n => n.path).every(p => isCV(getXP(m), p))
export const isXCC = (m: M) => isC(getXP(m)) && getXA(m).length > 1 && getXA(m).map(n => n.path).every(p => isCH(getXP(m), p))
export const isXCBR = (m: M) => isC(getXP(m)) && getCountXCL(m) === getCountXCH(m) - 1
export const isXCBL = (m: M) => isC(getXP(m)) && getCountXCL(m) === 0
export const isXCBD = (m: M) => isC(getXP(m)) && getCountXCU(m) === getCountXCV(m) - 1
export const isXCBU = (m: M) => isC(getXP(m)) && getCountXCU(m) === 0

export const setPropXA = (m: M, prop: keyof N, value: any) => getXA(m).forEach(n => Object.assign(n, {[prop]: value}))
export const setPropXASF = (m: M, prop: keyof N, value: any) => getXASF(m).forEach(n => Object.assign(n, {[prop]: value}))

export const incXSDF = (m: M) => m.filter(n => isSDF(getXP(m), n.path)).forEach(n => n.path = incPi(n.path, getXP(m).length - 1))
export const incXSFDF = (m: M) => m.filter(n => isSFDF(getXP(m), n.path)).forEach(n => n.path = incPi(n.path, getXP(m).length - 1))
export const incNXSI1DF = (m: M) => m.filter(n => isSDF(getSI1(getXP(m)), n.path)).forEach(n => n.path = incPiN(n.path, getXP(m).length - 1 - 2, getXA(m).length))
export const incXCRF = (m: M) => m.filter(n => isCRF(getXP(m), n.path)).forEach(n => n.path = incPi(n.path, getXP(m).length - 1))
export const incXCFRF = (m: M) => m.filter(n => isCFRF(getXP(m), n.path)).forEach(n => n.path = incPi(n.path, getXP(m).length - 1))
export const incXCDF = (m: M) => m.filter(n => isCDF(getXP(m), n.path)).forEach(n => n.path = incPi(n.path, getXP(m).length - 2))
export const incXCFDF = (m: M) => m.filter(n => isCFDF(getXP(m), n.path)).forEach(n => n.path = incPi(n.path, getXP(m).length - 2))

export const getReselectS = (m: M) => getCountXFSU(m) ? getXFSU1(m) : getXFSI1(m)
export const getReselectCR = (m: M) => getCountXCU(m) ? getXCRU(m) : ( getCountXCV(m) >= 2 ? getXAPL(m) : [getXI1(m)] )
export const getReselectCC = (m: M) => getCountXCL(m) ? getXCCL(m) : ( getCountXCH(m) >= 2 ? getXAPL(m) : [getXI1(m)] )

export const getOffsetXF = (m: M, p: P) => (p.at(getXP(m).length - 1) as number) - (getXF(m).path.at(-1) as number)
export const m2cb = (m: M) => structuredClone(getXASF(m).map(n => ({...n, path: ['s', getOffsetXF(m, n.path), ...n.path.slice(getXP(m).length)]}))) as GN[]
export const cb2ip = (cb: GN[], ip: P) => structuredClone(cb.map(n => ({...n, path: [...ip.slice(0, -2), 's', (ip.at(-1) as number) + (n.path.at(1) as number), ...n.path.slice(2)]}))) as GN[]

// export const cbSO = (m: M) => structuredClone(getXASF(m).map(n => ({...n, path: [...getXFSU1(m), 's', getCountXFSU1SO1(m) + getOffsetXF(m, n.path), ...n.path.slice(getXP(m).length)]}))) as GN[]
// export const cbSI = (m: M) => structuredClone(getXASF(m).map(n => ({...n, path: [...getXI2(m), 's', getCountXSI1SU(m) + 1 + getOffsetXF(m, n.path), ...n.path.slice(getXP(m).length)]}))) as GN[]
// export const cbSIR = (m: M) => structuredClone(getXASF(m).map(n => ({...n, path: ['r', 0, 'd', 1, 's', getCountR0D1S(m) + getOffsetXF(m, n.path), ...n.path.slice(getXP(m).length)]}))) as GN[]
// export const cbSIL = (m: M) => structuredClone(getXASF(m).map(n => ({...n, path: ['r', 0, 'd', 0, 's', getCountR0D0S(m) + getOffsetXF(m, n.path), ...n.path.slice(getXP(m).length)]}))) as GN[]
export const cbSD = (m: M) => structuredClone(getXASF(m).map(n => ({...n, path: [...getXI1(m), 's', getOffsetXF(m, n.path) + 1, ...n.path.slice(getXP(m).length)]}))) as GN[]
export const cbST = (m: M) => structuredClone(getXASF(m).map(n => ({...n, path: [...getXI1(m), 's', getOffsetXF(m, n.path), ...n.path.slice(getXP(m).length)]}))) as GN[]
export const cbSU = (m: M) => structuredClone(getXASF(m).map(n => ({...n, path: [...getXI1(m), 's', getOffsetXF(m, n.path) - 1, ...n.path.slice(getXP(m).length)]}))) as GN[]
export const cbSB = (m: M) => structuredClone(getXASF(m).map(n => ({...n, path: [...getXI1(m), 's', getOffsetXF(m, n.path) + getCountXFSU(m) + 1, ...n.path.slice(getXP(m).length)]}))) as GN[]

export const getEditedPath = (p: P) => getPathPattern(p).endsWith('c') ? [...p, 's', 0] as P : p
export const getEditedNode = (m: M, p: P) => getNodeByPath(m, getEditedPath(p))
export const getInsertParentNode = (m: M) => getNodeByPath(m, getXP(m).length === 2 ? ['r', 0, 'd', 0] as P: getXP(m))
export const getParentNodeByPath = (m: M, p: P) => getNodeByPath(m, getSI1(p)) as N
export const getClosestStructParentPath = (p: P) => (getPathPattern(p).endsWith('ds') || getPathPattern(p).endsWith('ss')) ? p.slice(0, -2) : p.slice(0, -5)
