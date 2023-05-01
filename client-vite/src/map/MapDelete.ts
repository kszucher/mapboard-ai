import {M} from "../state/MapPropTypes";
import {selectNode, selectNodeList} from "./MapSelect";
import {decPiN, getNodeByPath, getSIL, isSD, isCFDF, getX, decPi, isCFRF, getReselectS, getReselectCR, getReselectCC} from "./MapUtils"

export const deleteS = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getSIL(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
}

export const deleteCR = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getSIL(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    isCFDF(getX(m).path, n.path) && Object.assign(n, {path: decPi(n.path, getX(m).path.length - 2)})
  }
}

export const deleteCC = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getSIL(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    isCFRF(getX(m).path, n.path) && Object.assign(n, {path: decPi(n.path, getX(m).path.length - 1)})
  }
}

export const deleteSelectS = (m: M) => {
  const reselectPath = getReselectS(m)
  deleteS(m)
  selectNode(m, reselectPath, 's')
}

export const deleteSelectCR = (m: M) => {
  const reselectPathList = getReselectCR(m)
  deleteCR(m)
  selectNodeList(m, reselectPathList, 's')
}

export const deleteSelectCC = (m: M) => {
  const reselectPathList = getReselectCC(m)
  deleteCC(m)
  selectNodeList(m, reselectPathList, 's')
}
