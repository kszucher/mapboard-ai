import {M, N} from "../types/DefaultProps";
import {copy, isEqual} from "./Utils";
import {mapDisassembly} from "../map/MapDisassembly";

export const getNodeById = (ml: N[], nodeId: string) => (ml.find((n: N) => n.nodeId === nodeId) as N)
export const getNodeByPath = (ml: N[], path: any[]) => (ml.find((n: N) => isEqual(n.path, path)) as N)
export const m2ml = (m: M) => (
  mapDisassembly.start(copy(m))
    .sort((a: any, b: any) => (a.nodeId > b.nodeId) ? 1 : -1)
    .filter((el: any) => el.path.length > 1)
)
