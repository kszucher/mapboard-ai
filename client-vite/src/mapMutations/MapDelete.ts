import {L, M, PL, PR, PS, PC} from "../state/MapStateTypes"
import {mG, mL, mR, mS, mC, pathToS, getXAS, getXAC, getXAR, getXC} from "../mapQueries/MapQueries.ts"
import {sortPath} from "./MapSort.ts"
import {isRDO, isREO, isSEO} from "../mapQueries/PathQueries.ts"

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

export const deleteLRSC = (m: M) => {
  const xac = getXAR(m)
  const nonSelectedMinOffsetW = Math.min(...mR(m).filter(ri => !ri.selected).map(ri => ri.offsetW))
  const nonSelectedMinOffsetH = Math.min(...mR(m).filter(ri => !ri.selected).map(ri => ri.offsetH))
  m.splice(0, m.length, ...[
      ...mG(m),
      ...mL(m)
        .filter(li => xac.every(xti => xti.nodeId !== li.fromNodeId && xti.nodeId !== li.toNodeId))
        .map((li, i) => ({...li, path: ['l', i] as PL})),
      ...mR(m)
        .filter(ri => xac.every(xti => !isREO(xti.path, ri.path)))
        .map(ri => xac.some(xti => isRDO(xti.path, ri.path)) ? {...ri, path: ri.path.with(1, ri.path.at(1) as number - 1) as PR} : ri)
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
  const xa = getXAS(m)
  m.splice(0, m.length,
    ...[
      ...mG(m),
      ...mL(m),
      ...mR(m),
      ...mS(m)
        .filter(si => xa.every(xti => !isSEO(xti.path, si.path)))
        .map(si => ({...si, path: si.path.map((pi, i) => si.path.at(i - 1) === 's' ? pi - pathToS(m, si.path.slice(0, i + 1) as PS).su.filter(si => si.selected).length : pi) as PS})),
      ...mC(m)
        .filter(ci => xa.every(xti => !isSEO(xti.path, ci.path)))
        .map(ci => ({...ci, path: ci.path.map((pi, i) => ci.path.at(i - 1) === 's' ? pi - pathToS(m, ci.path.slice(0, i + 1) as PS).su.filter(si => si.selected).length : pi) as PC})),
    ].sort(sortPath)
  )
}

export const deleteCR = (m: M) => {
  const pos = getXC(m).path.length - 2
  getXAC(m).map(ci => ci.cd.at(-1)!).flatMap(ci => [ci, ...ci.so]).map(ti => ti.path[pos] -= 1)
  getXAC(m).flatMap(ci => [ci, ...ci.so]).map(x => m.findIndex(ti => ti === x)).sort((a, b) => b - a).forEach(index => m.splice(index, 1))
}

export const deleteCC = (m: M) => {
  const pos = getXC(m).path.length - 1
  getXAC(m).map(ci => ci.cr.at(-1)!).flatMap(ci => [ci, ...ci.so]).map(ti => ti.path[pos] -= 1)
  getXAC(m).flatMap(ci => [ci, ...ci.so]).map(x => m.findIndex(ti => ti === x)).sort((a, b) => b - a).forEach(index => m.splice(index, 1))
}
