import {N, NPartial} from "../state/MapStateTypes.ts"
import {sortablePath} from "../mapQueries/PathQueries.ts"

export const sortPath = (a: N, b: N) => sortablePath(a.path) > sortablePath(b.path) ? 1 : -1
export const sortNode = (a: NPartial, b: NPartial) => a.nodeId > b.nodeId ? 1 : -1
