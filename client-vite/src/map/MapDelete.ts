import {M} from "../state/MapPropTypes";
import {selectNode, selectNodeList} from "./MapSelect";
import {decPiN, getNodeByPath, getPPList, isSD, isGteCD, getX, decPi, isGteCR, getReselectS, getReselectCR, getReselectCC, getCountXCR, getCountXCC} from "./MapUtils"

export const deleteSelectS = (m: M) => {
  const reselectPath = getReselectS(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getPPList(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
  selectNode(m, reselectPath, 's')
}

export const deleteSelectCR = (m: M) => {
  const reselectPathList = getReselectCR(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getPPList(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    isGteCD(getX(m).path, n.path) && Object.assign(n, {path: decPi(n.path, getX(m).path.length - 2)})
  }
  selectNodeList(m, reselectPathList, 's')
}

export const deleteSelectCC = (m: M) => {
  const reselectPathList = getReselectCC(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getPPList(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    isGteCR(getX(m).path, n.path) && Object.assign(n, {path: decPi(n.path, getX(m).path.length - 1)})
  }
  selectNodeList(m, reselectPathList, 's')
}
