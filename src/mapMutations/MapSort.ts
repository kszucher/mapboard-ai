import {N, NPartial, P} from "../state/MapStateTypes.ts"

export const sortablePath = (p: P): string => p.map((pi: any) => isNaN(pi) ? pi : 1000 + pi).join('')
export const sortPath = (a: N, b: N) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
export const sortNode = (a: NPartial, b: NPartial) => a.nodeId > b.nodeId ? 1 : -1
