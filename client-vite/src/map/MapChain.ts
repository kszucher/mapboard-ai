import {M} from "../state/MapPropTypes"
import isEqual from "react-fast-compare"
import {get_D_count, get_S_O1_count} from "./MapUtils";

export const mapChain = (m: M) => {
  m.forEach(n => {
    n.dCount = get_D_count(m, n.path)
    n.sCount = get_S_O1_count(m, n.path)
    n.cRowCount = m.findLast(nt => nt.path.length === n.path.length + 3 && isEqual(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-2) as number + 1 || 0
    n.cColCount = m.findLast(nt => nt.path.length === n.path.length + 3 && isEqual(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-1) as number + 1 || 0
  })
}
