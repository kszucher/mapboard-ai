import {M, T} from "../state/MapStateTypes"
import {mL, mR, getXAS, getXAC, idToL} from "../mapQueries/MapQueries.ts"

const deleteTL = (m: M, tl: T[]) => tl.map(x => m.findIndex(ti => ti === x)).sort((a, b) => b - a).forEach(index => index !== - 1 && m.splice(index, 1))

export const deleteL = (m: M, lNodeId: string) => {
  deleteTL(m, [idToL(m, lNodeId)])
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
    deleteTL(m, [x, ...x.so])
    x.cd.flatMap(ci => [ci, ...ci.so]).map(ti => ti.path[x.path.length - 2] -= 1)
  }
}

export const deleteCC = (m: M) => {
  for (const x of getXAC(m).reverse()) {
    deleteTL(m, [x, ...x.so])
    x.cr.flatMap(ci => [ci, ...ci.so]).map(ti => ti.path[x.path.length - 1] -= 1)
  }
}
