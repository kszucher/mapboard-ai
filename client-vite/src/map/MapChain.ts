import {isSamePath} from "./MapUtils"
import {M} from "../state/MTypes"

export const mapChain = (mp: M) => {
  for (const n of mp) {
    n.dCount = mp.findLast(nt => nt.path.length === n.path.length + 2 && isSamePath(nt.path.slice(0, -2), n.path) && nt.path.at(-2) === 'd')?.path.at(-1) as number + 1 || 0
    n.sCount = mp.findLast(nt => nt.path.length === n.path.length + 2 && isSamePath(nt.path.slice(0, -2), n.path) && nt.path.at(-2) === 's')?.path.at(-1) as number + 1 || 0
    n.cRowCount = mp.findLast(nt => nt.path.length === n.path.length + 3 && isSamePath(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-2) as number + 1 || 0
    n.cColCount = mp.findLast(nt => nt.path.length === n.path.length + 3 && isSamePath(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-1) as number + 1 || 0
  }
}
