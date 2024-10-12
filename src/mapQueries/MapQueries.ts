import isEqual from "react-fast-compare"
import {NodeMode} from "../consts/Enums.ts"
import {sortPath} from "../mapMutations/MapSort.ts"
import {G, L, M, N, PR, R, T} from "../mapState/MapStateTypes.ts"
import {excludeEntries, hasTrues} from "../utils/Utils"
import {isG, isL, isR, isT} from "./PathQueries.ts"

export const mapArrayToObject = (m: M): object => Object.fromEntries(m.map(n => [n.nodeId, excludeEntries(n, ['nodeId'])]))
export const mapObjectToArray = (obj: object): M => Object.entries(obj).map(el => ({nodeId: el[0], ...el[1]} as N))

export const mG = (m: M): G[] => <G[]>m.filter(n => isG(n.path))
export const mL = (m: M): L[] => <L[]>m.filter(n => isL(n.path))
export const mR = (m: M): R[] => <R[]>m.filter(n => isR(n.path))
export const mT = (m: M): T[] => <T[]>m.filter(n => isT(n.path))

export const pathToR = (m: M, p: PR) => mR(m).find(ri => isEqual(ri.path, p)) as R

export const idToL = (m: M, nodeId: string) => <L>mL(m).find(li => li.nodeId === nodeId)
export const idToR = (m: M, nodeId: string) => <R>mR(m).find(ri => ri.nodeId === nodeId)

export const getG = (m: M): G => <G>mG(m).at(0)

export const getXR = (m: M): R => mR(m).filter(ri => ri.selected).reduce((a, b) => a.selected > b.selected ? a : b, <R>{})

export const getAXR = (m: M): R[] => mR(m).filter(ri => ri.selected).sort(sortPath)

export const getLastIndexL = (m: M): number => Math.max(-1, ...mL(m).map(li => <number>li.path.at(-1)))
export const getLastIndexR = (m: M): number => Math.max(-1, ...mR(m).map(ri => <number>ri.path.at(-1)))

export const isAXL = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isL(el.path)))
export const isAXR = (m: M): boolean => hasTrues(mT(m).filter(ti => ti.selected).map(el => isR(el.path)))

export const isExistingLink = (m: M, partialL: Partial<L>): boolean => mL(m).some(li =>
  partialL.fromNodeId === li.fromNodeId &&
  partialL.toNodeId === li.toNodeId &&
  partialL.fromNodeSide  === li.fromNodeSide &&
  partialL.toNodeSide === li.toNodeSide
)

export const getNodeMode = (m: M) => {
  if (isAXL(m)) return NodeMode.EDIT_LINE
  else if (isAXR(m)) return NodeMode.EDIT_ROOT
  else return NodeMode.VIEW
}
