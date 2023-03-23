import {isEqual} from "./Utils"
import {ML, NL, Path} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

// LINEAR
export const getNodeById = (ml: ML, nodeId: string) => (ml.find((n: NL) => n.nodeId === nodeId) as N)
export const getNodeByPath = (ml: ML, path: Path) => (ml.find((n: NL) => isEqual(n.path, path)) as N)
export const isSubNode = (p: Path, pt: Path) => pt.length > p.length && isEqual(p, pt.slice(0, p.length))

// NESTED
export const getDefaultNode = (attributes?: any) => ({d: [], s: [], c: [[]], content: '', ...attributes})
