import {isSamePath} from "../core/MapUtils"
import {M} from "../state/MTypes"

export const mapChain = (mlp: M) => {
  for (const n of mlp) {
    n.dCount = mlp.findLast(nt => nt.path.length === n.path.length + 2 && isSamePath(nt.path.slice(0, -2), n.path) && nt.path.at(-2) === 'd')?.path.at(-1) as number + 1 || 0
    n.sCount = mlp.findLast(nt => nt.path.length === n.path.length + 2 && isSamePath(nt.path.slice(0, -2), n.path) && nt.path.at(-2) === 's')?.path.at(-1) as number + 1 || 0
    n.cRowCount = mlp.findLast(nt => nt.path.length === n.path.length + 3 && isSamePath(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-2) as number + 1 || 0
    n.cColCount = mlp.findLast(nt => nt.path.length === n.path.length + 3 && isSamePath(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-1) as number + 1 || 0
  }
}
