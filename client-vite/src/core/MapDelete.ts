import {M} from "../state/MapStateTypes"
import {selectNode, selectNodeList} from "./MapSelect"
import {getReselectS, getReselectCR, getReselectCC, getReselectR, getG, getX, isNCD, isNCR, isNSD, getXAO, getXA, isNRD} from "./MapUtils"

const deleteConnections = (m: M) => {
  getG(m).connections = getG(m).connections.filter(el => el.fromNodeId !== getX(m).nodeId && el.toNodeId !== getX(m).nodeId)
}

export const deleteR = (m: M) => {
  const deleteNodeListO = getXAO(m)
  const deleteNodeIdListO = deleteNodeListO.map(n => n.nodeId)
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdListO.includes(n.nodeId)))
  const deleteNodeList = getXA(m)
  const deleteNodePathList = deleteNodeList.map(n => n.path)
  const deleteNodeIdList = deleteNodeList.map(n => n.nodeId)
  m.forEach(n => deleteNodePathList.map(dp => isNRD(dp, n.path) && n.path.splice(dp.length - 1, 1, n.path.at(dp.length - 1) as number - 1)))
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdList.includes(n.nodeId)))
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
  m.forEach(n => deleteNodePathList.map(dp => isNCD(dp, n.path) && n.path.splice(getX(m).path.length - 2, 1, n.path.at(getX(m).path.length - 2) as number - 1)))
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdList.includes(n.nodeId)))
}

export const deleteCC = (m: M) => {
  const deleteNodeListO = getXAO(m)
  const deleteNodeIdListO = deleteNodeListO.map(n => n.nodeId)
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdListO.includes(n.nodeId)))
  const deleteNodeList = getXA(m)
  const deleteNodePathList = deleteNodeList.map(n => n.path)
  const deleteNodeIdList = deleteNodeList.map(n => n.nodeId)
  m.forEach(n => deleteNodePathList.map(dp => isNCR(dp, n.path) && n.path.splice(getX(m).path.length - 1, 1, n.path.at(getX(m).path.length - 1) as number - 1)))
  m.splice(0, m.length, ...m.filter(n => !deleteNodeIdList.includes(n.nodeId)))
}

export const deleteReselectR = (m: M) => {
  const reselect = getReselectR(m)
  deleteConnections(m)
  deleteR(m)
  selectNode(m, reselect, 's')
}

export const deleteReselectS = (m: M) => {
  const reselect = getReselectS(m)
  deleteS(m)
  selectNode(m, reselect, 's')
}

export const deleteReselectCR = (m: M) => {
  const reselectList = getReselectCR(m)
  deleteCR(m)
  selectNodeList(m, reselectList, 's')
}

export const deleteReselectCC = (m: M) => {
  const reselectList = getReselectCC(m)
  deleteCC(m)
  selectNodeList(m, reselectList, 's')
}
