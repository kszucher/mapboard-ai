import {L, M, PL, T, PS, PC} from "../state/MapStateTypes"
import {mG, mL, mR, mS, mC, pathToS, getXAS, getXAC, getXC} from "../mapQueries/MapQueries.ts"
import {sortPath} from "./MapSort.ts"
import {isSEO} from "../mapQueries/PathQueries.ts"

const deleteTL = (m: M, tl: T[]) => tl.map(x => m.findIndex(ti => ti === x)).sort((a, b) => b - a).forEach(index => m.splice(index, 1))

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
  const selectedRL = mR(m).filter(ri => ri.selected)
  const nonSelectedRL = mR(m).filter(ri => !ri.selected)
  const selectedL = mL(m).filter(li => selectedRL.map(ri => ri.nodeId).some(id => li.fromNodeId === id || li.toNodeId === id))
  const nonSelectedL = mL(m).filter(li => selectedRL.map(ri => ri.nodeId).every(id => li.fromNodeId !== id  && li.toNodeId !== id))
  const rMap = new Map(nonSelectedRL.map(((ri, i) => [ri.path.at(1), i])))
  nonSelectedRL.flatMap(ri => [ri, ...ri.so, ...ri.co]).map((ti) => ti.path[1] = rMap.get(ti.path.at(1)))
  const nonSelectedMinOffsetW = Math.min(...nonSelectedRL.map(ri => ri.offsetW))
  const nonSelectedMinOffsetH = Math.min(...nonSelectedRL.map(ri => ri.offsetH))
  nonSelectedRL.map(ri => {ri.offsetW -= nonSelectedMinOffsetW; ri.offsetH -= nonSelectedMinOffsetH})
  nonSelectedL.map((li, i) => li.path[1] = i)
  deleteTL(m, selectedRL.flatMap(ti => [ti, ...ti.so, ...ti.co]))
  deleteTL(m, selectedL)
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
  deleteTL(m, getXAC(m).flatMap(ci => [ci, ...ci.so]))
}

export const deleteCC = (m: M) => {
  const pos = getXC(m).path.length - 1
  getXAC(m).map(ci => ci.cr.at(-1)!).flatMap(ci => [ci, ...ci.so]).map(ti => ti.path[pos] -= 1)
  deleteTL(m, getXAC(m).flatMap(ci => [ci, ...ci.so]))
}
