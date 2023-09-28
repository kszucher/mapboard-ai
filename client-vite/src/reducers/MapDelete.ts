import {L, M, P} from "../state/MapStateTypes"
import {selectNode, selectNodeList} from "./MapSelect"
import {getReselectS, getReselectCR, getReselectCC, getReselectR, getX, isCD, isCR, getXA, isRDO, getNodeById, getSIPL, isSD, isSDO, getXAEO, mG, mL, mT, isSEO} from "../selectors/MapSelector"

export const deleteL = (m: M, l: L) => {
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m)
        .filter(li =>  li.nodeId !== l.nodeId)
        .map((li, i) => ({...li, path: ['l', i] as P})),
      ...mT(m)
    ]
  )
}

export const deleteR = (m: M) => {
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m)
        .filter(li => getXA(m).every(xti => xti.nodeId !== li.fromNodeId && xti.nodeId !== li.toNodeId))
        .map((li, i) => ({...li, path: ['l', i] as P})),
      ...mT(m)
        .filter(ti => getXAEO(m).every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => getXA(m).some(xti => isRDO(xti.path, ti.path))
          ? {...ti, path: [...ti.path.slice(0, getX(m).path.length - 1), ti.path.at(getX(m).path.length - 1) as number - 1, ...ti.path.slice(getX(m).path.length)]}
          : ti
        )
    ]
  )
}

export const deleteS = (m: M) => {
  m.splice(0, m.length, ...[...mG(m), ...mL(m),
      ...mT(m)
        .filter(ti => getXAEO(m).every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => getXA(m).some(xti => isSDO(xti.path, ti.path))
          ? {...ti, path:
              [...getSIPL(ti.path), ti.path]
                .map(sip => [...sip.slice(0, -1), sip.at(-1) as number - getXA(m).map(xti => +isSD(xti.path, sip)).reduce((a, b) => a + b, 0)])
                .reduce((a, b) => a.concat(b.slice(a.length)), [])
          }
          : ti
        )
    ]
  )
}

export const deleteCR = (m: M) => {
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m),
      ...mT(m)
        .filter(ti => getXAEO(m).every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => getXA(m).some(xti => isCD(xti.path, ti.path))
          ? {...ti, path: [...ti.path.slice(0, getX(m).path.length - 2), ti.path.at(getX(m).path.length - 2) as number - 1, ...ti.path.slice(getX(m).path.length - 1)]}
          : ti
        )
    ]
  )
}

export const deleteCC = (m: M) => {
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m),
      ...mT(m)
        .filter(ti => getXAEO(m).every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => getXA(m).some(xti => isCR(xti.path, ti.path))
          ? {...ti, path: [...ti.path.slice(0, getX(m).path.length - 1), ti.path.at(getX(m).path.length - 1) as number - 1, ...ti.path.slice(getX(m).path.length)]}
          : ti
        )
    ]
  )
}

export const deleteReselectR = (m: M) => {
  const reselect = getReselectR(m).nodeId
  deleteR(m)
  selectNode(m, getNodeById(m, reselect), 's')
}

export const deleteReselectS = (m: M) => {
  const reselect = getReselectS(m).nodeId
  deleteS(m)
  selectNode(m, getNodeById(m, reselect), 's')
}

export const deleteReselectCR = (m: M) => {
  const reselectList = getReselectCR(m).map(ti => ti.nodeId)
  deleteCR(m)
  selectNodeList(m, reselectList.map(nodeId => getNodeById(m, nodeId)), 's')
}

export const deleteReselectCC = (m: M) => {
  const reselectList = getReselectCC(m).map(ti => ti.nodeId)
  deleteCC(m)
  selectNodeList(m, reselectList.map(nodeId => getNodeById(m, nodeId)), 's')
}
