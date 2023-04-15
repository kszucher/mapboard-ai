import {G, GN, M, N, P, PathItem} from "../state/MapPropTypes"
import {nSaveAlways, nSaveNever, nSaveOptional} from "../state/MapProps"
import {isArrayOfEqualValues} from "../core/Utils"
import isEqual from "react-fast-compare"

// SORT
export const sortPath = (a, b) => a.path.map(el => isNaN(el) ? el: 1000 + el).join('') > b.path.map(el => isNaN(el) ? el: 1000 + el).join('') ? 1 : -1
export const sortNode = (a, b) => a.nodeId > b.nodeId ? 1 : -1
// GET
export const getPattern = (p: P) => p.filter((el: PathItem) => isNaN(el as any)).join('')
export const getParentPath = (p: P) => (getPattern(p).endsWith('d') || getPattern(p).endsWith('s')) ? p.slice(0, -2) : p.slice(0, -3)
export const getClosestStructParentPath = (p: P) => (getPattern(p).endsWith('ds') || getPattern(p).endsWith('ss')) ? p.slice(0, -2) : p.slice(0, -5)
export const getClosestStructChildPath = (p: P) => getPattern(p).endsWith('c') ? [...p, 's', 0] : p
export const getPathDir = (p: P) => p[3] ? -1 : 1
export const getNodeById = (m: M, nodeId: string) => m.find(n => n.nodeId === nodeId) as GN
export const getNodeByPath = (m: M, p: P) => m.find(n => isEqual(n.path, p)) as GN
export const getParentNodeByPath = (m: M, p: P) => getNodeByPath(m, getParentPath(p)) as N
export const getG = (m: M) => m.filter(n => n.path.length === 1).at(0) as G
export const getLS = (m: M) => m.filter(n => n.path.length > 1).reduce((a, b) => a.selected > b.selected ? a : b)
export const getDefaultNode = (attributes?: any) => structuredClone({...nSaveAlways, ...nSaveOptional, ...nSaveNever, ...attributes})
export const getEditedNode = (m: M, p: P) => getNodeByPath(m, getClosestStructChildPath(p))
export const getInsertParentNode = (m: M) => getNodeByPath(m, getLS(m).path.length === 2 ? ['r', 0, 'd', 0] as P: getLS(m).path)
export const getSelection = (m: M) => m.filter(n => n.selected)
export const getSelectionFamily = (m: M) => m.filter(n => getSelection(m).map(n => n.path).some(p => isFamilyPath(p, n.path)))
export const getSelectionProp = (m: M, prop: keyof N) => isArrayOfEqualValues(getSelection(m).map((n: N) => n[prop])) ? getLS(m)[prop] : null
export const getSelectionFamilyProp = (m: M, prop: keyof N) => isArrayOfEqualValues(getSelectionFamily(m).map((n: N) => n[prop])) ? getLS(m)[prop] : null
// SET
export const incrementPathItemAt = (p: P, at: number) => structuredClone(p).map((pi, i) => i === at ? pi + 1 : pi)
export const setSelection = (m: M, prop: keyof N, value: any) => getSelection(m).forEach(n => n[prop] = value)
export const setSelectionFamily = (m: M, prop: keyof N, value: any) => getSelectionFamily(m).forEach(n => n[prop] = value)
// BOOLEAN
export const isG = (p: P) => getPattern(p).endsWith('g')
export const isR = (p: P) => getPattern(p).endsWith('r')
export const isD = (p: P) => getPattern(p).endsWith('d')
export const isS = (p: P) => getPattern(p).endsWith('s')
export const isC = (p: P) => getPattern(p).endsWith('c')
export const isDescendantPath = (p: P, pt: P) => pt.length > p.length && isEqual(p, pt.slice(0, p.length))
export const isFamilyPath = (p: P, pt: P) => isEqual(p, pt) || isDescendantPath(p, pt)
export const isUpperSiblingPath = (p: P, pt: P) => p.length === pt.length && isEqual(p.slice(0, -1), pt.slice(0, p.length - 1)) && p.at(-1) > pt.at(-1)
export const isLowerSiblingPath = (p: P, pt: P) => p.length === pt.length && isEqual(p.slice(0, -1), pt.slice(0, p.length - 1)) && p.at(-1) < pt.at(-1)
export const isLowerSiblingFamilyPath = (p: P, pt: P) => p.length <= pt.length && isEqual(p.slice(0, -1), pt.slice(0, p.length - 1)) && p.at(-1) < pt.at(p.length - 1)
// TODO distinguish isLower or isAnyLower... and the ones we have are the "ANY"
export const isFamilyOrLowerSiblingFamilyPath = (p: P, pt: P) => isFamilyPath(p, pt) || isLowerSiblingFamilyPath(p, pt)
export const isCellRowSiblingPath = (p: P, pt: P) => p.length === pt.length && p.join('').startsWith(pt.slice(0, -2).join('')) && p.at(-2) === pt.at(-2)
export const isCellColSiblingPath = (p: P, pt: P) => p.length === pt.length && p.join('').startsWith(pt.slice(0, -2).join('')) && p.at(-1) === pt.at(-1)
export const isPrecedingCellRowSiblingPath = (p: P, pt: P) => isCellRowSiblingPath(p, pt) && p.at(-1) > pt.at(-1)
export const isPrecedingCellColSiblingPath = (p: P, pt: P) => isCellColSiblingPath(p, pt) && p.at(-2) > pt.at(-2)
export const haveSameParent = (p: P, pt: P) => isEqual(getParentPath(p), getParentPath(pt)) // FIXME call this isSiblingPath...

export const isRootSelected = (m: M) => isR(getLS(m).path) && !m.find(n => n.selected && !isR(n.path))
export const isStructSelected = (m: M) => isS(getLS(m).path) && !m.find(n => n.selected && !isS(n.path))
export const isCellSelected = (m: M) => isC(getLS(m).path) && !m.find(n => n.selected && !isC(n.path))
export const isCellRowSelected = (m: M) => isC(getLS(m).path) && !m.find(n => n.selected && !isC(n.path) || !n.selected && isCellRowSiblingPath(getLS(m).path, n.path))
export const isCellColSelected = (m: M) => isC(getLS(m).path) && !m.find(n => n.selected && !isC(n.path) || !n.selected && isCellColSiblingPath(getLS(m).path, n.path))
