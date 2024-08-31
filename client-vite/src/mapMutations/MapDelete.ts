import {L, M, PL, T} from "../state/MapStateTypes"
import {mG, mL, mR, mS, mC, getXAS, getXAC} from "../mapQueries/MapQueries.ts"
import {sortPath} from "./MapSort.ts"

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
  for (const x of getXAS(m).reverse()) {
    deleteTL(m, [x, ...x.so, ...x.co])
    x.sd.flatMap(si => [si, ...si.so, ...si.co]).map(ti => ti.path[x.path.length - 1] -= 1)
  }
}

export const deleteCR = (m: M) => {
  for (const x of getXAC(m).reverse()) {
    deleteTL(m, [x, ...x.so]);
    [x.cd.at(-1)!, ...x.cd.at(-1)!.so].map(ti => ti.path[x.path.length - 2] -= 1)
  }
}

export const deleteCC = (m: M) => {
  for (const x of getXAC(m).reverse()) {
    deleteTL(m, [x, ...x.so]);
    [x.cr.at(-1)!, ...x.cr.at(-1)!.so].map(ti => ti.path[x.path.length - 1] -= 1)
  }
}
