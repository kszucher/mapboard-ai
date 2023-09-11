import {M} from "../state/MapStateTypes"
import {selectNode, selectNodeList} from "./MapSelect"
import {getReselectS, getReselectCR, getReselectCC, getReselectR, getG, getX, isNCD, isNCR, getXAO, getXA, isNRD, getNodeById, getSIPL, isSD, isNSD} from "../selectors/MapSelectorUtils"

const deleteConnections = (m: M) => {
  getG(m).connections = getG(m).connections.filter(el => el.fromNodeId !== getX(m).nodeId && el.toNodeId !== getX(m).nodeId)
}

export const deleteR = (m: M) => {
  m.splice(0, m.length, ...m
    .filter(n => !getXAO(m).map(n => n.nodeId).includes(n.nodeId))
    .filter(n => !getXA(m).map(n => n.nodeId).includes(n.nodeId))
    .map(n => getXA(m).some(xn => isNRD(xn.path, n.path)) ? {...n, path: [...n.path.slice(0, getX(m).path.length - 1), n.path.at(getX(m).path.length - 1) as number - 1, ...n.path.slice(getX(m).path.length)]} : n)
  )
}

export const deleteS = (m: M) => {
  m.splice(0, m.length, ...m
    .filter(n => !getXAO(m).map(n => n.nodeId).includes(n.nodeId))
    .filter(n => !getXA(m).map(n => n.nodeId).includes(n.nodeId))
    .map(n => getXA(m).some(xn => isNSD(xn.path, n.path))
      ? {...n, path:
          [...getSIPL(n.path), n.path]
            .map(sip => [...sip.slice(0, -1), sip.at(-1) as number - getXA(m).map(xn => +isSD(xn.path, sip)).reduce((a, b) => a + b, 0)])
            .reduce((a, b) => a.concat(b.slice(a.length)), [])
      }
      : n
    )
  )
}

export const deleteCR = (m: M) => {
  m.splice(0, m.length, ...m
    .filter(n => !getXAO(m).map(n => n.nodeId).includes(n.nodeId))
    .filter(n => !getXA(m).map(n => n.nodeId).includes(n.nodeId))
    .map(n => getXA(m).some(xn => isNCD(xn.path, n.path))
      ? {...n, path: [...n.path.slice(0, getX(m).path.length - 2), n.path.at(getX(m).path.length - 2) as number - 1, ...n.path.slice(getX(m).path.length - 1)]}
      : n
    )
  )
}

export const deleteCC = (m: M) => {
  m.splice(0, m.length, ...m
    .filter(n => !getXAO(m).map(n => n.nodeId).includes(n.nodeId))
    .filter(n => !getXA(m).map(n => n.nodeId).includes(n.nodeId))
    .map(n => getXA(m).some(xn => isNCR(xn.path, n.path))
      ? {...n, path: [...n.path.slice(0, getX(m).path.length - 1), n.path.at(getX(m).path.length - 1) as number - 1, ...n.path.slice(getX(m).path.length)]}
      : n
    )
  )
}

export const deleteReselectR = (m: M) => {
  const reselect = getReselectR(m).nodeId
  deleteConnections(m)
  deleteR(m)
  selectNode(m, getNodeById(m, reselect), 's')
}

export const deleteReselectS = (m: M) => {
  const reselect = getReselectS(m).nodeId
  deleteS(m)
  selectNode(m, getNodeById(m, reselect), 's')
}

export const deleteReselectCR = (m: M) => {
  const reselectList = getReselectCR(m).map(n => n.nodeId)
  deleteCR(m)
  selectNodeList(m, reselectList.map(nodeId => getNodeById(m, nodeId)), 's')
}

export const deleteReselectCC = (m: M) => {
  const reselectList = getReselectCC(m).map(n => n.nodeId)
  deleteCC(m)
  selectNodeList(m, reselectList.map(nodeId => getNodeById(m, nodeId)), 's')
}
