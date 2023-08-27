import {M, P} from "../state/MapStateTypes"
import {selectNode, selectNodeList} from "./MapSelect"
import {getReselectS, getReselectCR, getReselectCC, getXP, getXRi, getReselectR, getG, getX, isNCD, isNCR, isNSD, getXAO, getXA} from "./MapUtils"

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
  const deleteNodeListO = getXAO(m)
  const deleteNodeIdListO = deleteNodeListO.map(n => n.nodeId)
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdListO.includes(n.nodeId)))
  const deleteNodeList = getXA(m)
  const deleteNodePathList = deleteNodeList.map(n => n.path)
  const deleteNodeIdList = deleteNodeList.map(n => n.nodeId)
  m.forEach(n => deleteNodePathList.map(dp => isNSD(dp, n.path) && n.path.splice(dp.length - 1, 1, n.path.at(dp.length - 1) as number - 1)))
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdList.includes(n.nodeId)))
}

export const deleteCR = (m: M) => {
  const deleteNodeListO = getXAO(m)
  const deleteNodeIdListO = deleteNodeListO.map(n => n.nodeId)
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdListO.includes(n.nodeId)))
  const deleteNodeList = getXA(m)
  const deleteNodePathList = deleteNodeList.map(n => n.path)
  const deleteNodeIdList = deleteNodeList.map(n => n.nodeId)
  m.forEach(n => deleteNodePathList.map(dp => isNCD(dp, n.path) && n.path.splice(getXP(m).length - 2, 1, n.path.at(getXP(m).length - 2) as number - 1)))
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdList.includes(n.nodeId)))
}

export const deleteCC = (m: M) => {
  const deleteNodeListO = getXAO(m)
  const deleteNodeIdListO = deleteNodeListO.map(n => n.nodeId)
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdListO.includes(n.nodeId)))
  const deleteNodeList = getXA(m)
  const deleteNodePathList = deleteNodeList.map(n => n.path)
  const deleteNodeIdList = deleteNodeList.map(n => n.nodeId)
  m.forEach(n => deleteNodePathList.map(dp => isNCR(dp, n.path) && n.path.splice(getXP(m).length - 1, 1, n.path.at(getXP(m).length - 1) as number - 1)))
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
