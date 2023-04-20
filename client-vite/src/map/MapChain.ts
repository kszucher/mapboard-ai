import {M} from "../state/MapPropTypes"
import isEqual from "react-fast-compare"
import {getCount_D, getCount_S_O1} from "./MapUtils";

export const mapChain = (m: M) => {
  m.forEach(n => {
    n.dCount = getCount_D(m, n.path)
    n.sCount = getCount_S_O1(m, n.path)
    // TODO remove the following, because mostly it is just needed as a boolean, or for calculating matrices that will be replaced with queries
    n.cRowCount = m.findLast(nt => nt.path.length === n.path.length + 3 && isEqual(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-2) as number + 1 || 0
    n.cColCount = m.findLast(nt => nt.path.length === n.path.length + 3 && isEqual(nt.path.slice(0, -3), n.path) && nt.path.at(-3) === 'c')?.path.at(-1) as number + 1 || 0
  })
}
