import {L, M, PL, PT} from "../state/MapStateTypes"
import {selectT, selectTL} from "./MapSelect"
import {getReselectS, getReselectCR, getReselectCC, getReselectR, getX, isCD, isCR, getXA, isRDO, getNodeById, getRDSCIPL, isSD, isSDO, mG, mL, mT, isSEO, mTR, getRootStartX, getRootStartY, isR} from "../selectors/MapSelector"

export const deleteL = (m: M, l: L) => {
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m)
        .filter(li =>  li.nodeId !== l.nodeId)
        .map((li, i) => ({...li, path: ['l', i] as PL})
        ),
      ...mT(m)
    ]
  )
}

export const deleteLR = (m: M) => {
  const xa = getXA(m)
  const nonSelectedMinOffsetW = Math.min(...mTR(m).map(ri => ri.offsetW))
  const nonSelectedMinOffsetH = Math.min(...mTR(m).map(ri => ri.offsetH))
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m)
        .filter(li => xa.every(xti => xti.nodeId !== li.fromNodeId && xti.nodeId !== li.toNodeId))
        .map((li, i) => ({...li, path: ['l', i] as PL})
        ),
      ...mT(m)
        .filter(ti => xa.every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isRDO(xti.path, ti.path)) ? {...ti, path: [...ti.path.slice(0, getX(m).path.length - 1), ti.path.at(getX(m).path.length - 1) - 1, ...ti.path.slice(getX(m).path.length)] as PT} : ti)
        .map(ti => isR(ti.path) ? {...ti, offsetW: ti.offsetW - nonSelectedMinOffsetW, offsetH: ti.offsetH - nonSelectedMinOffsetH} : ti)
    ]
  )
}

export const deleteS = (m: M) => {
  const xa = getXA(m)
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m),
      ...mT(m)
        .filter(ti => xa.every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isSDO(xti.path, ti.path))
          ? {...ti, path:
              [...getRDSCIPL(ti.path), ti.path]
                .map(sip => [...sip.slice(0, -1), sip.at(-1) - xa.map(xti => +isSD(xti.path, sip)).reduce((a, b) => a + b, 0)])
                .reduce((a, b) => a.concat(b.slice(a.length)), []) as PT
          }
          : ti
        )
    ]
  )
}

export const deleteCR = (m: M) => {
  const xa = getXA(m)
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m),
      ...mT(m)
        .filter(ti => xa.every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isCD(xti.path, ti.path))
          ? {...ti, path: [...ti.path.slice(0, getX(m).path.length - 2), ti.path.at(getX(m).path.length - 2) - 1, ...ti.path.slice(getX(m).path.length - 1)] as PT}
          : ti
        )
    ]
  )
}

export const deleteCC = (m: M) => {
  const xa = getXA(m)
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m),
      ...mT(m)
        .filter(ti => xa.every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isCR(xti.path, ti.path))
          ? {...ti, path: [...ti.path.slice(0, getX(m).path.length - 1), ti.path.at(getX(m).path.length - 1) - 1, ...ti.path.slice(getX(m).path.length)] as PT}
          : ti
        )
    ]
  )
}

export const deleteReselectLR = (m: M) => {
  const reselect = getReselectR(m).nodeId
  deleteLR(m)
  selectT(m, getNodeById(m, reselect), 's')
}

export const deleteReselectS = (m: M) => {
  const reselect = getReselectS(m).nodeId
  deleteS(m)
  selectT(m, getNodeById(m, reselect), 's')
}

export const deleteReselectCR = (m: M) => {
  const reselectList = getReselectCR(m).map(ti => ti.nodeId)
  deleteCR(m)
  selectTL(m, reselectList.map(nodeId => getNodeById(m, nodeId)), 's')
}

export const deleteReselectCC = (m: M) => {
  const reselectList = getReselectCC(m).map(ti => ti.nodeId)
  deleteCC(m)
  selectTL(m, reselectList.map(nodeId => getNodeById(m, nodeId)), 's')
}
