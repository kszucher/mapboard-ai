import {M} from "../state/MapPropTypes"
import isEqual from "react-fast-compare"
import {getCountD, getCountSS} from "./MapUtils";

export const mapChain = (m: M) => {
  m.forEach(n => {
    n.dCount = getCountD(m, n.path)
    n.sCount = getCountSS(m, n.path)
  })
}
