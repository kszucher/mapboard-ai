import {L, M, PL, PR, PS, PC} from "../state/MapStateTypes"
import {getX, isCD, isCR, getXA, isRDO, mG, mL, mR, mS, mC, isREO, isSEO, isCEO, pathToS, idToS, sortPath,} from "../queries/MapQueries.ts"

export const deleteL = (m: M, l: L) => {
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m)
        .filter(li =>  li.nodeId !== l.nodeId)
        .map((li, i) => ({...li, path: ['l', i] as PL})),
      ...mR(m),
      ...mS(m),
      ...mC(m),
    ].sort(sortPath)
  )
}

export const deleteLR = (m: M) => {
  const xa = getXA(m)
  const nonSelectedMinOffsetW = Math.min(...mR(m).map(ri => ri.offsetW))
  const nonSelectedMinOffsetH = Math.min(...mR(m).map(ri => ri.offsetH))
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m)
        .filter(li => xa.every(xti => xti.nodeId !== li.fromNodeId && xti.nodeId !== li.toNodeId))
        .map((li, i) => ({...li, path: ['l', i] as PL})),
      ...mR(m)
        .filter(ti => xa.every(xti => !isREO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isRDO(xti.path, ti.path)) ? {...ti, path: ti.path.with(1, ti.path[1] - 1) as PR} : ti)
        .map(ti => ({...ti, offsetW: ti.offsetW - nonSelectedMinOffsetW, offsetH: ti.offsetH - nonSelectedMinOffsetH})),
      ...mS(m)
        .filter(ti => xa.every(xti => !isREO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isRDO(xti.path, ti.path)) ? {...ti, path: ti.path.with(1, ti.path.at(1) - 1) as PS} : ti),
      ...mC(m)
        .filter(ti => xa.every(xti => !isREO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isRDO(xti.path, ti.path)) ? {...ti, path: ti.path.with(1, ti.path.at(1) - 1) as PC} : ti)
    ].sort(sortPath)
  )
}

export const deleteS = (m: M) => {
  const xa = getXA(m)
  m.splice(0, m.length,
    ...[
      ...mG(m),
      ...mL(m),
      ...mR(m),
      ...mS(m)
        .filter(ti => xa.every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => ({...ti, path: ti.path.map((pi, i) => ti.path.at(i - 1) === 's' ? pi - pathToS(m, ti.path.slice(0, i + 1) as PS).su.map(ii => idToS(m, ii)).filter(si => si.selected).length : pi) as PS})),
      ...mC(m)
        .filter(ti => xa.every(xti => !isSEO(xti.path, ti.path)))
        .map(ti => ({...ti, path: ti.path.map((pi, i) => ti.path.at(i - 1) === 's' ? pi - pathToS(m, ti.path.slice(0, i + 1) as PS).su.map(ii => idToS(m, ii)).filter(si => si.selected).length : pi) as PC})),
    ].sort(sortPath)
  )
}

export const deleteCR = (m: M) => {
  const xa = getXA(m)
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m),
      ...mR(m),
      ...mS(m)
        .filter(ti => xa.every(xti => !isCEO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isCD(xti.path, ti.path)) ? {...ti, path: ti.path.with(getX(m).path.length - 2, ti.path.at(getX(m).path.length - 2) - 1) as PS} : ti),
      ...mC(m)
        .filter(ti => xa.every(xti => !isCEO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isCD(xti.path, ti.path)) ? {...ti, path: ti.path.with(getX(m).path.length - 2, ti.path.at(getX(m).path.length - 2) - 1) as PC} : ti)
    ].sort(sortPath)
  )
}

export const deleteCC = (m: M) => {
  const xa = getXA(m)
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m),
      ...mR(m),
      ...mS(m)
        .filter(ti => xa.every(xti => !isCEO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isCR(xti.path, ti.path)) ? {...ti, path: ti.path.with(getX(m).path.length - 1, ti.path.at(getX(m).path.length - 1) - 1) as PS} : ti),
      ...mC(m)
        .filter(ti => xa.every(xti => !isCEO(xti.path, ti.path)))
        .map(ti => xa.some(xti => isCR(xti.path, ti.path)) ? {...ti, path: ti.path.with(getX(m).path.length - 1, ti.path.at(getX(m).path.length - 1) - 1) as PC} : ti)
    ].sort(sortPath)
  )
}
