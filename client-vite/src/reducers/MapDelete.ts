import {M} from "../state/MapStateTypes"
import {selectNode, selectNodeList} from "./MapSelect"
import {getReselectS, getReselectCR, getReselectCC, getReselectR, getG, getX, isCD, isCR, getXA, isRDO, getNodeById, getSIPL, isSD, isSDO, getXAEO, mG, mL, mT, isSEO} from "../selectors/MapSelector"

export const deleteL = () => {}

const deleteXL = (m: M) => {
  getG(m).connections = getG(m).connections.filter(el => el.fromNodeId !== getX(m).nodeId && el.toNodeId !== getX(m).nodeId)
}

export const deleteR = (m: M) => {
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mT(m)
      .filter(t => getXAEO(m).every(xn => !isSEO(xn.path, t.path)))
      .map(t => getXA(m).some(xn => isRDO(xn.path, t.path))
        ? {...t, path: [...t.path.slice(0, getX(m).path.length - 1), t.path.at(getX(m).path.length - 1) as number - 1, ...t.path.slice(getX(m).path.length)]}
        : t
      )
    ]
  )
}

export const deleteS = (m: M) => {
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mT(m)
      .filter(t => getXAEO(m).every(xn => !isSEO(xn.path, t.path)))
      .map(t => getXA(m).some(xn => isSDO(xn.path, t.path))
        ? {...t, path:
            [...getSIPL(t.path), t.path]
              .map(sip => [...sip.slice(0, -1), sip.at(-1) as number - getXA(m).map(xn => +isSD(xn.path, sip)).reduce((a, b) => a + b, 0)])
              .reduce((a, b) => a.concat(b.slice(a.length)), [])
        }
        : t
      )
    ]
  )
}

export const deleteCR = (m: M) => {
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mT(m)
      .filter(t => getXAEO(m).every(xn => !isSEO(xn.path, t.path)))
      .map(t => getXA(m).some(xn => isCD(xn.path, t.path))
        ? {...t, path: [...t.path.slice(0, getX(m).path.length - 2), t.path.at(getX(m).path.length - 2) as number - 1, ...t.path.slice(getX(m).path.length - 1)]}
        : t
      )
    ]
  )
}

export const deleteCC = (m: M) => {
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mT(m)
      .filter(t => getXAEO(m).every(xn => !isSEO(xn.path, t.path)))
      .map(t => getXA(m).some(xn => isCR(xn.path, t.path))
        ? {...t, path: [...t.path.slice(0, getX(m).path.length - 1), t.path.at(getX(m).path.length - 1) as number - 1, ...t.path.slice(getX(m).path.length)]}
        : t
      )
    ]
  )
}

export const deleteReselectR = (m: M) => {
  const reselect = getReselectR(m).nodeId
  deleteXL(m)
  deleteR(m)
  selectNode(m, getNodeById(m, reselect), 's')
}

export const deleteReselectS = (m: M) => {
  const reselect = getReselectS(m).nodeId
  deleteS(m)
  selectNode(m, getNodeById(m, reselect), 's')
}

export const deleteReselectCR = (m: M) => {
  const reselectList = getReselectCR(m).map(t => t.nodeId)
  deleteCR(m)
  selectNodeList(m, reselectList.map(nodeId => getNodeById(m, nodeId)), 's')
}

export const deleteReselectCC = (m: M) => {
  const reselectList = getReselectCC(m).map(t => t.nodeId)
  deleteCC(m)
  selectNodeList(m, reselectList.map(nodeId => getNodeById(m, nodeId)), 's')
}
