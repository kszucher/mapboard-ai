import {L, M, PL, PR, PS, PC} from "../state/MapStateTypes"
import {isRDO, mG, mL, mR, mS, mC, isREO, isSEO, isCEO, pathToS, idToS, sortPath, getXAS, getXAC, getXAR, getXC, idToC} from "../queries/MapQueries.ts"

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
  const xa = getXAR(m)
  const nonSelectedMinOffsetW = Math.min(...mR(m).map(ri => ri.offsetW))
  const nonSelectedMinOffsetH = Math.min(...mR(m).map(ri => ri.offsetH))
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m)
        .filter(li => xa.every(xti => xti.nodeId !== li.fromNodeId && xti.nodeId !== li.toNodeId))
        .map((li, i) => ({...li, path: ['l', i] as PL})),
      ...mR(m)
        .filter(ri => xa.every(xti => !isREO(xti.path, ri.path)))
        .map(ri => xa.some(xti => isRDO(xti.path, ri.path)) ? {...ri, path: ri.path.with(1, ri.path[1] - 1) as PR} : ri)
        .map(ri => ({...ri, offsetW: ri.offsetW - nonSelectedMinOffsetW, offsetH: ri.offsetH - nonSelectedMinOffsetH})),
      ...mS(m)
        .filter(si => xa.every(xti => !isREO(xti.path, si.path)))
        .map(si => xa.some(xti => isRDO(xti.path, si.path)) ? {...si, path: si.path.with(1, si.path.at(1) - 1) as PS} : si),
      ...mC(m)
        .filter(ci => xa.every(xti => !isREO(xti.path, ci.path)))
        .map(ci => xa.some(xti => isRDO(xti.path, ci.path)) ? {...ci, path: ci.path.with(1, ci.path.at(1) - 1) as PC} : ci)
    ].sort(sortPath)
  )
}

export const deleteS = (m: M) => {
  const xa = getXAS(m)
  m.splice(0, m.length,
    ...[
      ...mG(m),
      ...mL(m),
      ...mR(m),
      ...mS(m)
        .filter(si => xa.every(xti => !isSEO(xti.path, si.path)))
        .map(si => ({...si, path: si.path.map((pi, i) => si.path.at(i - 1) === 's' ? pi - pathToS(m, si.path.slice(0, i + 1) as PS).su.map(nid => idToS(m, nid)).filter(si => si.selected).length : pi) as PS})),
      ...mC(m)
        .filter(ci => xa.every(xti => !isSEO(xti.path, ci.path)))
        .map(ci => ({...ci, path: ci.path.map((pi, i) => ci.path.at(i - 1) === 's' ? pi - pathToS(m, ci.path.slice(0, i + 1) as PS).su.map(nid => idToS(m, nid)).filter(si => si.selected).length : pi) as PC})),
    ].sort(sortPath)
  )
}

export const deleteCR = (m: M) => {
  const xa = getXAC(m)
  const cd = getXAC(m).flatMap(ci => ci.cd)
  const crIndex = getXC(m).path.indexOf('c') + 1
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mR(m), ...mC(m), ...mS(m).filter(si => xa.every(xti => !isCEO(xti.path, si.path)))])
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mR(m), ...mS(m), ...mC(m).filter(ci => xa.every(xti => !isCEO(xti.path, ci.path)))])
  cd.map(nid => idToC(m, nid)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) - 1))
  cd.map(nid => idToC(m, nid)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) - 1))
  m.sort(sortPath)
}

export const deleteCC = (m: M) => {
  const xa = getXAC(m)
  const cd = getXAC(m).flatMap(ci => ci.cr)
  const ccIndex = getXC(m).path.indexOf('c') + 2
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mR(m), ...mC(m), ...mS(m).filter(si => xa.every(xti => !isCEO(xti.path, si.path)))])
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mR(m), ...mS(m), ...mC(m).filter(ci => xa.every(xti => !isCEO(xti.path, ci.path)))])
  cd.map(nid => idToC(m, nid)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) - 1))
  cd.map(nid => idToC(m, nid)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) - 1))
  m.sort(sortPath)
}
