import {M} from "../state/MapPropTypes"
import isEqual from "react-fast-compare"

export const mapChain = (m: M) => {
  m.forEach(n => {
    n.dCount = m.findLast(nt => nt.path.length === n.path.length + 2 && isEqual(nt.path.slice(0, -2), n.path) && nt.path.at(-2) === 'd')?.path.at(-1) as number + 1 || 0
    n.sCount = m.findLast(nt => nt.path.length === n.path.length + 2 && isEqual(nt.path.slice(0, -2), n.path) && nt.path.at(-2) === 's')?.path.at(-1) as number + 1 || 0
    n.cRowCount = m.findLast(nt => nt.path.length === n.path.length + 3 && isEqual(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-2) as number + 1 || 0
    n.cColCount = m.findLast(nt => nt.path.length === n.path.length + 3 && isEqual(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-1) as number + 1 || 0
  })
}
