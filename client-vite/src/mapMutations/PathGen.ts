import {C, CPartial, L, LPartial, PC, PL, PR, PS, R, RPartial, S, SPartial} from "../state/MapStateTypes.ts"
import {genNodeId, IS_TESTING} from "../utils/Utils.ts"

export const genNodeL = (el: PL, attributes?: Omit<LPartial, 'path' | 'nodeId'>) => ({nodeId: IS_TESTING ? '_' + el.join('') : genNodeId(), path: el, ...attributes} as L)
export const genNodeR = (el: PR, attributes?: Omit<RPartial, 'path' | 'nodeId'>) => ({nodeId: IS_TESTING ? '_' + el.join('') : genNodeId(), path: el, ...attributes} as R)
export const genNodeS = (el: PS, attributes?: Omit<SPartial, 'path' | 'nodeId'>) => ({nodeId: IS_TESTING ? '_' + el.join('') : genNodeId(), path: el, ...attributes} as S)
export const genNodeC = (el: PC, attributes?: Omit<CPartial, 'path' | 'nodeId'>) => ({nodeId: IS_TESTING ? '_' + el.join('') : genNodeId(), path: el, ...attributes} as C)
