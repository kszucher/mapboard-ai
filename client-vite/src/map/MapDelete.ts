import {M} from "../state/MapPropTypes";
import {selectNode} from "./MapSelect";
import {decPiN, getCountLSU, getLSI1, getLSU1, getNodeByPath, getParentPathList, isSD} from "./MapUtils"

export const deleteSelection = (m: M) => {
  const reselectPath = getCountLSU(m) ? getLSU1(m) : getLSI1(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const pathList = [...getParentPathList(n.path), n.path]
    pathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    pathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
  selectNode(m, reselectPath, 's')
}

export const deleteCR = (m: M) => {

}

export const deleteCC = (m: M) => {

}
