import {N, NL} from "../types/DefaultProps";
import {isEqual} from "./Utils";

// LINEAR
export const getNodeById = (ml: NL[], nodeId: string) => (ml.find((n: NL) => n.nodeId === nodeId) as N)
export const getNodeByPath = (ml: NL[], path: any[]) => (ml.find((n: NL) => isEqual(n.path, path)) as N)
