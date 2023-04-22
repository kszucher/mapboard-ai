import {M} from "../state/MapPropTypes";
import {selectNode, selectNodeList} from "./MapSelect";
import {
  decPiN,
  getCCL,
  getCountXFLSU,
  getCRU, getX,
  getXFSI1,
  getXFSU1,
  getNodeByPath,
  getParentPathList,
  isGtCR, isGteCR,
  isSD
} from "./MapUtils"

export const deleteSelectS = (m: M) => {
  const reselectPath = getCountXFLSU(m) ? getXFSU1(m) : getXFSI1(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const pathList = [...getParentPathList(n.path), n.path]
    pathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    pathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
  selectNode(m, reselectPath, 's')
}

export const deleteSelectCR = (m: M) => {
  const reselectPathList = getCRU(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const pathList = [...getParentPathList(n.path), n.path]
    pathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1) // ez valszeg itt is igaz... we need to WRITE the test... for a 2x3 matrix or something!!!
    // TODO start here, write the test... and things will fall in place
    pathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
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
