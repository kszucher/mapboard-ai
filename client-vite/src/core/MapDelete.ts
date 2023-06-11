import {M} from "../state/MapPropTypes"
import {selectNode, selectNodeList} from "./MapSelect"
import {decPiN, getNodeByPath, getSIL, isSD, isCFDF, decPi, isCFRF, getReselectS, getReselectCR, getReselectCC, getXA, getXP} from "./MapUtils"

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
    if (!getXA(m).length) break
    isCFDF(getXP(m), n.path) && Object.assign(n, {path: decPi(n.path, getXP(m).length - 2)})
  }
}

export const deleteCC = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getSIL(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    if (!getXA(m).length) break
    isCFRF(getXP(m), n.path) && Object.assign(n, {path: decPi(n.path, getXP(m).length - 1)})
  }
}

export const deleteReselectS = (m: M) => {
  const reselectPath = getReselectS(m)
  deleteS(m)
  selectNode(m, reselectPath, 's')
}

export const deleteReselectCR = (m: M) => {
  const reselectPathList = getReselectCR(m)
  deleteCR(m)
  selectNodeList(m, reselectPathList, 's')
}

export const deleteReselectCC = (m: M) => {
  const reselectPathList = getReselectCC(m)
  deleteCC(m)
  selectNodeList(m, reselectPathList, 's')
}
