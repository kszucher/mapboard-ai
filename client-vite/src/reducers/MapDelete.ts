import {L, M, PL, PR, PS, PC} from "../state/MapStateTypes"
import {isRDO, mG, mL, mR, mS, mC, isREO, pathToS, idToS, sortPath, getXAS, getXAC, getXAR, getXC, idToC} from "../queries/MapQueries.ts"

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
  const xac = getXAR(m)
  const nonSelectedMinOffsetW = Math.min(...mR(m).map(ri => ri.offsetW))
  const nonSelectedMinOffsetH = Math.min(...mR(m).map(ri => ri.offsetH))
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m)
        .filter(li => xac.every(xti => xti.nodeId !== li.fromNodeId && xti.nodeId !== li.toNodeId))
        .map((li, i) => ({...li, path: ['l', i] as PL})),
      ...mR(m)
        .filter(ri => xac.every(xti => !isREO(xti.path, ri.path)))
        .map(ri => xac.some(xti => isRDO(xti.path, ri.path)) ? {...ri, path: ri.path.with(1, ri.path[1] - 1) as PR} : ri)
        .map(ri => ({...ri, offsetW: ri.offsetW - nonSelectedMinOffsetW, offsetH: ri.offsetH - nonSelectedMinOffsetH})),
      ...mS(m)
        .filter(si => xac.every(xti => !isREO(xti.path, si.path)))
        .map(si => xac.some(xti => isRDO(xti.path, si.path)) ? {...si, path: si.path.with(1, si.path.at(1) - 1) as PS} : si),
      ...mC(m)
        .filter(ci => xac.every(xti => !isREO(xti.path, ci.path)))
        .map(ci => xac.some(xti => isRDO(xti.path, ci.path)) ? {...ci, path: ci.path.with(1, ci.path.at(1) - 1) as PC} : ci)
    ].sort(sortPath)
  )
}

export const deleteS = (m: M) => {
  const xaso = getXAS(m).flatMap(si => si.so)
  const xaco = getXAS(m).flatMap(si => si.co)
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mR(m), ...mS(m).filter(si => !xaso.includes(si.nodeId)), ...mC(m).filter(si => !xaco.includes(si.nodeId))])
  mS(m).toReversed().forEach(si => si.path.forEach((pi, i) => si.path.at(i - 1) === 's' && si.path.splice(i, 1, pi - pathToS(m, si.path.slice(0, i + 1) as PS)?.su.map(nid => idToS(m, nid)).filter(si => si.selected).length || 0)))
  mC(m).toReversed().forEach(ci => ci.path.forEach((pi, i) => ci.path.at(i - 1) === 's' && ci.path.splice(i, 1, pi - pathToS(m, ci.path.slice(0, i + 1) as PS)?.su.map(nid => idToS(m, nid)).filter(si => si.selected).length || 0)))
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mR(m), ...mS(m).filter(si => !si.selected), ...mC(m)])
  m.sort(sortPath)
}

export const deleteCR = (m: M) => {
  const xac = getXAC(m).map(ci => ci.nodeId)
  const xacso = getXAC(m).flatMap(si => si.so)
  const xacd = getXAC(m).flatMap(ci => ci.cd)
  const xacdso = getXAC(m).flatMap(ci => ci.cd).map(nid => idToC(m, nid)).flatMap(ci => ci.so)
  const crIndex = getXC(m).path.indexOf('c') + 1
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mR(m), ...mS(m).filter(si => !xacso.includes(si.nodeId)), ...mC(m).filter(ci => !xac.includes(ci.nodeId))])
  xacd.map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) - 1))
  xacdso.map(nid => idToS(m, nid)).forEach(si => si?.path.splice(crIndex, 1, si.path.at(crIndex) - 1))
  m.sort(sortPath)
}

export const deleteCC = (m: M) => {
  const xac = getXAC(m).map(ci => ci.nodeId)
  const xacso = getXAC(m).flatMap(si => si.so)
  const xacr = getXAC(m).flatMap(ci => ci.cr)
  const xacrso = getXAC(m).flatMap(ci => ci.cr).map(nid => idToC(m, nid)).flatMap(ci => ci.so)
  const ccIndex = getXC(m).path.indexOf('c') + 2
  m.splice(0, m.length, ...[...mG(m), ...mL(m), ...mR(m), ...mS(m).filter(si => !xacso.includes(si.nodeId)), ...mC(m).filter(ci => !xac.includes(ci.nodeId))])
  xacr.map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) - 1))
  xacrso.map(nid => idToS(m, nid)).forEach(si => si?.path.splice(ccIndex, 1, si.path.at(ccIndex) - 1))
  m.sort(sortPath)
}
