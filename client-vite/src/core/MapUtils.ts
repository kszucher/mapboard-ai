import {isEqual} from "./Utils"
import {ML, NL} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

// LINEAR
export const getNodeById = (ml: ML, nodeId: string) => (ml.find((n: NL) => n.nodeId === nodeId) as N)
export const getNodeByPath = (ml: ML, path: any[]) => (ml.find((n: NL) => isEqual(n.path, path)) as N)
