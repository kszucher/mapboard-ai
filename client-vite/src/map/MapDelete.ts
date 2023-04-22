import {M} from "../state/MapPropTypes";
import {selectNode, selectNodeList} from "./MapSelect";
import {
  decPiN,
  getCCL,
  getCountXFLSU,
  getCRU,
  getXFSI1,
  getXFSU1,
  getNodeByPath,
  getParentPathList,
  isSD,
  isGteCD, getX, decPi
} from "./MapUtils"

export const deleteSelectS = (m: M) => {
  const reselectPath = getCountXFLSU(m) ? getXFSU1(m) : getXFSI1(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getParentPathList(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
  selectNode(m, reselectPath, 's')
}

export const deleteSelectCR = (m: M) => {
  const reselectPathList = getCRU(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getParentPathList(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    isGteCD(getX(m).path, n.path) && Object.assign(n, {path: decPi(n.path, getX(m).path.length - 2)})
  }
  selectNodeList(m, reselectPathList, 's')
}

export const deleteSelectCC = (m: M) => {
  const reselectPathList = getCCL(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]

  }
  selectNodeList(m, reselectPathList, 's')
}
