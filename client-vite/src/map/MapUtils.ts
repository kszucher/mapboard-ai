import {G, GN, M, N, P} from "../state/MapPropTypes"
import {nSaveAlways, nSaveNever, nSaveOptional} from "../state/MapProps"
import {isArrayOfEqualValues} from "../core/Utils"
import isEqual from "react-fast-compare"

export const sortPath = (a, b) => a.path.map(el => isNaN(el) ? el: 1000 + el).join('') > b.path.map(el => isNaN(el) ? el: 1000 + el).join('') ? 1 : -1
export const sortNode = (a, b) => a.nodeId > b.nodeId ? 1 : -1

export const getPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')

export const isG = (p: P) => getPattern(p).endsWith('g')
export const isR = (p: P) => getPattern(p).endsWith('r')
export const isD = (p: P) => getPattern(p).endsWith('d')
export const isS = (p: P) => getPattern(p).endsWith('s')
export const isC = (p: P) => getPattern(p).endsWith('c')
export const isSO = (p: P, pt: P) => pt.length > p.length && isEqual(pt.slice(0, p.length), p)
export const isSO1 = (p: P, pt: P) => pt.length === p.length + 2 && isEqual(pt.slice(0, -2), p) && pt.at(-2) === 's'
export const isSSO = (p: P, pt: P) => isEqual(p, pt) || isSO(p, pt)
export const isSU = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) < p.at(-1)
export const isSD = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) > p.at(-1)
export const isSU1 = (p: P, pt: P) => isSU(p, pt) && pt.at(-1) === p.at(-1) - 1
export const isSD1 = (p: P, pt: P) => isSD(p, pt) && pt.at(-1) === p.at(-1) + 1
export const isSUO = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) < p.at(-1)
export const isSDO = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) > p.at(-1)
export const isSSODO = (p: P, pt: P) => isSSO(p, pt) || isSDO(p, pt)
export const isSameCR = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-2) === p.at(-2)
export const isSameCC = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-1) === p.at(-1)
export const isGtCR = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 1) > p.at(-1)
export const isGteCR = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 1) >= p.at(-1)
export const isGtCD = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) > p.at(-2)
export const isGteCD = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) >= p.at(-2)
export const isSelectedR = (m: M) => isR(getLS(m).path) && !m.find(n => n.selected && !isR(n.path))
export const isSelectedS = (m: M) => isS(getLS(m).path) && !m.find(n => n.selected && !isS(n.path))
export const isSelectedDS = (m: M) => getLS(m).path.length === 6
export const isSelectedC = (m: M) => isC(getLS(m).path) && !m.find(n => n.selected && !isC(n.path))
export const isSelectedCR = (m: M) => isC(getLS(m).path) && !m.find(n => n.selected && !isC(n.path) || !n.selected && isSameCR(getLS(m).path, n.path))
export const isSelectedCC = (m: M) => isC(getLS(m).path) && !m.find(n => n.selected && !isC(n.path) || !n.selected && isSameCC(getLS(m).path, n.path))

export const getParentPath = (p: P) => (getPattern(p).endsWith('d') || getPattern(p).endsWith('s')) ? p.slice(0, -2) : p.slice(0, -3)
export const getParentPathList = (p: P) => p.map((el, i) => p.slice(0, i)).filter(el => ['r', 'd', 's'].includes(el.at(-2)) || el.at(-3) === 'c' )
export const getEditedPath = (p: P) => getPattern(p).endsWith('c') ? [...p, 's', 0] : p
export const getPathDir = (p: P) => p[3] ? -1 : 1
export const getNodeById = (m: M, nodeId: string) => m.find(n => n.nodeId === nodeId) as GN
export const getNodeByPath = (m: M, p: P) => m.find(n => isEqual(n.path, p)) as GN
export const getParentNodeByPath = (m: M, p: P) => getNodeByPath(m, getParentPath(p)) as N
export const getG = (m: M) => m.filter(n => n.path.length === 1).at(0) as G
export const getLS = (m: M) => m.filter(n => n.path.length > 1).reduce((a, b) => a.selected > b.selected ? a : b)
export const getSI1 = (p: P) => (getPattern(p).endsWith('ds') || getPattern(p).endsWith('ss')) ? p.slice(0, -2) : p.slice(0, -5)
export const getSU1 = (m: M, p: P) => m.find(n => isSU1(p, n.path)) // we only need the path!!!
export const getDefaultNode = (attributes?: any) => structuredClone({...nSaveAlways, ...nSaveOptional, ...nSaveNever, ...attributes})
export const getEditedNode = (m: M, p: P) => getNodeByPath(m, getEditedPath(p))
export const getInsertParentNode = (m: M) => getNodeByPath(m, getLS(m).path.length === 2 ? ['r', 0, 'd', 0] as P: getLS(m).path)
export const getSelection = (m: M) => m.filter(n => n.selected)
export const getSelectionSSO = (m: M) => m.filter(n => getSelection(m).map(n => n.path).some(p => isSSO(p, n.path)))
export const getSelectionProp = (m: M, prop: keyof N) => isArrayOfEqualValues(getSelection(m).map(n => n[prop])) ? getLS(m)[prop] : null
export const getSelectionPropSSO = (m: M, prop: keyof N) => isArrayOfEqualValues(getSelectionSSO(m).map(n => n[prop])) ? getLS(m)[prop] : null
export const getCountD = (m: M, p: P) => p.length === 2 ? 2 : 0
export const getCountSO1 = (m: M, p: P) => m.filter(n => isSO1(p, n.path)).length
export const getCountSU = (m: M, p: P) => m.filter(n => isSU(p, n.path)).length
export const getCountCR = (m: M, p: P) => m.filter(n => isSameCR(p, n.path)).length
export const getCountCC = (m: M, p: P) => m.filter(n => isSameCC(p, n.path)).length

export const setSelection = (m: M, prop: keyof N, value: any) => getSelection(m).forEach(n => n[prop] = value)
export const setSelectionFamily = (m: M, prop: keyof N, value: any) => getSelectionSSO(m).forEach(n => n[prop] = value)

export const incPi = (p: P, at: number) => structuredClone(p).map((p, i) => i === at ? p + 1 : p)
export const decPi = (p: P, at: number) => structuredClone(p).map((p, i) => i === at ? p - 1 : p)
export const decPiN = (p: P, at: number, n: number) => structuredClone(p).map((p, i) => i === at ? p - n : p)
export const incPiLim = (p: P, at: number, limit: number) => structuredClone(p).map((pi, i) => i === at && pi < limit ? pi + 1 : pi)
export const decPiLim = (p: P, at: number, limit: number) => structuredClone(p).map((pi, i) => i === at && pi > limit ? pi - 1 : pi)
export const incSSODO = (m: M) => m.filter(n => isSSODO(getLS(m).path, n.path)).forEach(n => n.path = incPi(n.path, getLS(m).path.length - 1))
export const incSDO = (m: M) => m.filter(n => isSDO(getLS(m).path, n.path)).forEach(n => n.path = incPi(n.path, getLS(m).path.length - 1))
export const incGtCR = (m: M) => m.filter(n => isGtCR(getLS(m).path, n.path)).forEach(n => n.path = incPi(n.path, getLS(m).path.length - 1))
export const incGteCR = (m: M) => m.filter(n => isGteCR(getLS(m).path, n.path)).forEach(n => n.path = incPi(n.path, getLS(m).path.length - 1))
export const incGtCD = (m: M) => m.filter(n => isGtCD(getLS(m).path, n.path)).forEach(n => n.path = incPi(n.path, getLS(m).path.length - 2))
export const incGteCD = (m: M) => m.filter(n => isGteCD(getLS(m).path, n.path)).forEach(n => n.path = incPi(n.path, getLS(m).path.length - 2))
