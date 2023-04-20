import {G, GN, M, N, P} from "../state/MapPropTypes"
import {nSaveAlways, nSaveNever, nSaveOptional} from "../state/MapProps"
import {isArrayOfEqualValues} from "../core/Utils"
import isEqual from "react-fast-compare"

export const sortPath = (a, b) => a.path.map(el => isNaN(el) ? el: 1000 + el).join('') > b.path.map(el => isNaN(el) ? el: 1000 + el).join('') ? 1 : -1
export const sortNode = (a, b) => a.nodeId > b.nodeId ? 1 : -1

export const getPattern = (p: P) => p.filter(pi => isNaN(pi as any)).join('')

export const is_G = (p: P) => getPattern(p).endsWith('g')
export const is_R = (p: P) => getPattern(p).endsWith('r')
export const is_D = (p: P) => getPattern(p).endsWith('d')
export const is_S = (p: P) => getPattern(p).endsWith('s')
export const is_C = (p: P) => getPattern(p).endsWith('c')
export const is_S_O = (p: P, pt: P) => pt.length > p.length && isEqual(pt.slice(0, p.length), p)
export const is_S_O1 = (p: P, pt: P) => pt.length === p.length + 2 && isEqual(pt.slice(0, -2), p) && pt.at(-2) === 's'
export const is_S_S_O = (p: P, pt: P) => isEqual(p, pt) || is_S_O(p, pt)
export const is_S_U = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) < p.at(-1)
export const is_S_D = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(-1) > p.at(-1)
export const is_S_U1 = (p: P, pt: P) => is_S_U(p, pt) && pt.at(-1) === p.at(-1) - 1
export const is_S_D1 = (p: P, pt: P) => is_S_D(p, pt) && pt.at(-1) === p.at(-1) + 1
export const is_S_U_O = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) < p.at(-1)
export const is_S_D_O = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 1), p.slice(0, -1)) && pt.at(p.length - 1) > p.at(-1)
export const is_S_S_O_D_O = (p: P, pt: P) => is_S_S_O(p, pt) || is_S_D_O(p, pt)
export const is_same_CR = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-2) === p.at(-2)
export const is_same_CC = (p: P, pt: P) => pt.length === p.length && isEqual(pt.slice(0, -2), p.slice(0, -2)) && pt.at(-1) === p.at(-1)
export const is_gt_C_R = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 1) > p.at(-1)
export const is_gte_C_R = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 1) >= p.at(-1)
export const is_gt_C_D = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) > p.at(-2)
export const is_gte_C_D = (p: P, pt: P) => pt.length >= p.length && isEqual(pt.slice(0, p.length - 2), p.slice(0, -2)) && pt.at(p.length - 2) >= p.at(-2)
export const isRootSelected = (m: M) => is_R(get_LS(m).path) && !m.find(n => n.selected && !is_R(n.path))
export const isStructSelected = (m: M) => is_S(get_LS(m).path) && !m.find(n => n.selected && !is_S(n.path))
export const isDirStructSelected = (m: M) => get_LS(m).path.length === 6
export const isCellSelected = (m: M) => is_C(get_LS(m).path) && !m.find(n => n.selected && !is_C(n.path))
export const isCellRowSelected = (m: M) => is_C(get_LS(m).path) && !m.find(n => n.selected && !is_C(n.path) || !n.selected && is_same_CR(get_LS(m).path, n.path))
export const isCellColSelected = (m: M) => is_C(get_LS(m).path) && !m.find(n => n.selected && !is_C(n.path) || !n.selected && is_same_CC(get_LS(m).path, n.path))

export const getParentPath = (p: P) => (getPattern(p).endsWith('d') || getPattern(p).endsWith('s')) ? p.slice(0, -2) : p.slice(0, -3)
export const getParentPathList = (p: P) => p.map((el, i) => p.slice(0, i)).filter(el => ['r', 'd', 's'].includes(el.at(-2)) || el.at(-3) === 'c' )
export const getClosestStructParentPath = (p: P) => (getPattern(p).endsWith('ds') || getPattern(p).endsWith('ss')) ? p.slice(0, -2) : p.slice(0, -5)
export const getClosestStructChildPath = (p: P) => getPattern(p).endsWith('c') ? [...p, 's', 0] : p
export const getPathDir = (p: P) => p[3] ? -1 : 1
export const getNodeById = (m: M, nodeId: string) => m.find(n => n.nodeId === nodeId) as GN
export const getNodeByPath = (m: M, p: P) => m.find(n => isEqual(n.path, p)) as GN
export const getParentNodeByPath = (m: M, p: P) => getNodeByPath(m, getParentPath(p)) as N
export const get_G = (m: M) => m.filter(n => n.path.length === 1).at(0) as G
export const get_LS = (m: M) => m.filter(n => n.path.length > 1).reduce((a, b) => a.selected > b.selected ? a : b)
export const get_S_U1 = (m: M, p: P) => m.find(n => is_S_U1(p, n.path))
export const getDefaultNode = (attributes?: any) => structuredClone({...nSaveAlways, ...nSaveOptional, ...nSaveNever, ...attributes})
export const getEditedNode = (m: M, p: P) => getNodeByPath(m, getClosestStructChildPath(p))
export const getInsertParentNode = (m: M) => getNodeByPath(m, get_LS(m).path.length === 2 ? ['r', 0, 'd', 0] as P: get_LS(m).path)
export const getSelection = (m: M) => m.filter(n => n.selected)
export const getSelection_S_S_O = (m: M) => m.filter(n => getSelection(m).map(n => n.path).some(p => is_S_S_O(p, n.path)))
export const getSelection_S_D_O = (m: M) => m.filter(n => getSelection(m).map(n => n.path).some(p => is_S_D_O(p, n.path)))
export const getSelectionProp = (m: M, prop: keyof N) => isArrayOfEqualValues(getSelection(m).map(n => n[prop])) ? get_LS(m)[prop] : null
export const getSelectionProp_S_S_O = (m: M, prop: keyof N) => isArrayOfEqualValues(getSelection_S_S_O(m).map(n => n[prop])) ? get_LS(m)[prop] : null
export const getCount_D = (m: M, p: P) => p.length === 2 ? 2 : 0
export const getCount_S_O1 = (m: M, p: P) => m.filter(n => is_S_O1(p, n.path)).length
export const getCount_S_U = (m: M, p: P) => m.filter(n => is_S_U(p, n.path)).length
export const getCount_CR = (m: M, p: P) => m.filter(n => is_same_CR(p, n.path)).length
export const getCount_CC = (m: M, p: P) => m.filter(n => is_same_CC(p, n.path)).length

export const setSelection = (m: M, prop: keyof N, value: any) => getSelection(m).forEach(n => n[prop] = value)
export const setSelectionFamily = (m: M, prop: keyof N, value: any) => getSelection_S_S_O(m).forEach(n => n[prop] = value)

export const inc_pi = (p: P, at: number) => structuredClone(p).map((p, i) => i === at ? p + 1 : p)
export const dec_pi = (p: P, at: number) => structuredClone(p).map((p, i) => i === at ? p - 1 : p)
export const dec_pi_n = (p: P, at: number, n: number) => structuredClone(p).map((p, i) => i === at ? p - n : p)
export const inc_pi_lim = (p: P, at: number, limit: number) => structuredClone(p).map((pi, i) => i === at && pi < limit ? pi + 1 : pi)
export const dec_pi_lim = (p: P, at: number, limit: number) => structuredClone(p).map((pi, i) => i === at && pi > limit ? pi - 1 : pi)
export const inc_S_S_O_D_O = (m: M) => m.filter(n => is_S_S_O_D_O(get_LS(m).path, n.path)).forEach(n => n.path = inc_pi(n.path, get_LS(m).path.length - 1))
export const inc_S_D_O = (m: M) => m.filter(n => is_S_D_O(get_LS(m).path, n.path)).forEach(n => n.path = inc_pi(n.path, get_LS(m).path.length - 1))
export const inc_gt_C_R = (m: M) => m.filter(n => is_gt_C_R(get_LS(m).path, n.path)).forEach(n => n.path = inc_pi(n.path, get_LS(m).path.length - 1))
export const inc_gte_C_R = (m: M) => m.filter(n => is_gte_C_R(get_LS(m).path, n.path)).forEach(n => n.path = inc_pi(n.path, get_LS(m).path.length - 1))
export const inc_gt_C_D = (m: M) => m.filter(n => is_gt_C_D(get_LS(m).path, n.path)).forEach(n => n.path = inc_pi(n.path, get_LS(m).path.length - 2))
export const inc_gte_C_D = (m: M) => m.filter(n => is_gte_C_D(get_LS(m).path, n.path)).forEach(n => n.path = inc_pi(n.path, get_LS(m).path.length - 2))
