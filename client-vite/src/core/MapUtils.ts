import {isEqual} from "./Utils"
import {ML, GN, Path} from "../state/MTypes"

// LINEAR
export const getNodeById = (ml: ML, nodeId: string) => (ml.find((n: GN) => n.nodeId === nodeId))
export const getNodeByPath = (ml: ML, path: Path) => (ml.find((n: GN) => isEqual(n.path, path)))
export const isSubNode = (p: Path, pt: Path) => pt.length > p.length && isEqual(p, pt.slice(0, p.length))

// NESTED
export const getDefaultNode = (attributes?: any) => ({d: [], s: [], c: [[]], content: '', ...attributes})
