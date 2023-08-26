import {M, P} from "../state/MapStateTypes"
import {selectNode, selectNodeList} from "./MapSelect"
import {getNodeByPath, getSIL, isSD, getReselectS, getReselectCR, getReselectCC, getXA, getXP, getXRi, getReselectR, getG, getX, isSF, isND, isNR} from "./MapUtils"

const decPiN = (p: P, at: number, n: number) => structuredClone(p).map((p, i) => i === at ? p as number - n : p)

export const deleteR = (m: M) => {
  const g = getG(m)
  const xn = getX(m)
  g.connections = g.connections.filter(el => el.fromNodeId !== xn.nodeId && el.toNodeId !== xn.nodeId)
  const ri = getXRi(m)
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    n.path.at(1) as number === ri && m.splice(i, 1)
  }
}

export const deleteS = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getSIL(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
}

export const deleteCR = (m: M) => {
  const deleteNodeList = m.filter(n => getXA(m).some(xn => isSF(xn.path, n.path)))
  const deleteNodePathList = deleteNodeList.map(n => n.path)
  const deleteNodeIdList = deleteNodeList.map(n => n.nodeId)
  m.forEach(n => deleteNodePathList.some(dp => isND(dp, n.path)) && n.path.splice(getXP(m).length - 2, 1, n.path.at(getXP(m).length - 2) as number - 1))
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdList.includes(n.nodeId)))
}

export const deleteCC = (m: M) => {
  const deleteNodeList = m.filter(n => getXA(m).some(xn => isSF(xn.path, n.path)))
  const deleteNodePathList = deleteNodeList.map(n => n.path)
  const deleteNodeIdList = deleteNodeList.map(n => n.nodeId)
  m.forEach(n => deleteNodePathList.some(dp => isNR(dp, n.path)) && n.path.splice(getXP(m).length - 1, 1, n.path.at(getXP(m).length - 1) as number - 1))
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdList.includes(n.nodeId)))
}

export const deleteReselectR = (m: M) => {
  const reselectPath = getReselectR(m)
  deleteR(m)
  selectNode(m, reselectPath, 's')
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
