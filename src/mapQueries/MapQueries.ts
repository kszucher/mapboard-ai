import isEqual from "react-fast-compare"
import {NodeMode} from "../consts/Enums.ts"
import {sortPath} from "../mapMutations/MapSort.ts"
import {G, L, M, N, PR, R, T} from "../mapState/MapStateTypes.ts"
import {excludeEntries, hasTrues} from "../utils/Utils"
import {isG, isL, isR, isT} from "./PathQueries.ts"

export const mapArrayToObject = (m: M): object => Object.fromEntries(m.map(n => [n.nodeId, excludeEntries(n, ['nodeId'])]))
export const mapObjectToArray = (obj: object): M => Object.entries(obj).map(el => ({nodeId: el[0], ...el[1]} as N))

export const mG = (m: M): G[] => m.filter(n => isG(n.path)) as G[]
export const mL = (m: M): L[] => m.filter(n => isL(n.path)) as L[]
export const mR = (m: M): R[] => m.filter(n => isR(n.path)) as R[]
export const mT = (m: M): T[] => m.filter(n => isT(n.path)) as T[]

export const pathToR = (m: M, p: PR) => mR(m).find(ri => isEqual(ri.path, p)) as R

export const idToL = (m: M, nodeId: string) => mL(m).find(li => li.nodeId === nodeId) as L
export const idToR = (m: M, nodeId: string) => mR(m).find(ri => ri.nodeId === nodeId) as R

export const getG = (m: M): G => mG(m).at(0) as G

export const getXR = (m: M): R => mR(m).filter(ri => ri.selected).reduce((a, b) => a.selected > b.selected ? a : b, {} as R)

export const getAXR = (m: M): R[] => mR(m).filter(ri => ri.selected).sort(sortPath)

export const getLastIndexL = (m: M): number => Math.max(-1, ...mL(m).map(li => li.path.at(-1) as number))
export const getLastIndexR = (m: M): number => Math.max(-1, ...mR(m).map(ri => ri.path.at(-1) as number))

export const isAXL = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isL(el.path)))
export const isAXR = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isR(el.path)))

export const isExistingLink = (m: M, l: L): boolean => mL(m).some(li =>
  l.fromNodeId === li.fromNodeId &&
  l.toNodeId === li.toNodeId &&
  l.fromNodeSide  === li.fromNodeSide &&
  l.toNodeSide === li.toNodeSide
)

export const getNodeMode = (m: M) => {
  if (isAXL(m)) return NodeMode.EDIT_LINE
  else if (isAXR(m)) return NodeMode.EDIT_ROOT
  else return NodeMode.VIEW
}
