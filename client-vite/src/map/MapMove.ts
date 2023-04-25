import {GN, M, N, P} from "../state/MapPropTypes"
import {
  decPiN,
  getCountXFSU1SO1,
  getNodeByPath,
  getIPL,
  getXASF,
  getXF,
  getXFSU1,
  getXP,
  getXI2,
  isSD,
  sortPath,
  getCountXSI1SU,
  incSI1DF,
} from "./MapUtils";

const deleteStuff = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getIPL(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
}

const getOffsetXF = (m: M, p: P) => (p.at(getXP(m).length - 1) as number) - (getXF(m).path.at(-1) as number)

export const moveSO = (m: M) => {
  const cb = structuredClone(getXASF(m).map(n => ({...n, path: [...getXFSU1(m), 's', getCountXFSU1SO1(m) + getOffsetXF(m, n.path), ...n.path.slice(getXP(m).length)]}))) as GN[]
  deleteStuff(m)
  m.push(...cb)
  m.sort(sortPath)
}

export const moveSI = (m: M) => {
  const cb = structuredClone(getXASF(m).map(n => ({...n, path: [...getXI2(m), 's', getCountXSI1SU(m) + getOffsetXF(m, n.path), ...n.path.slice(getXP(m).length)]}))) as GN[]
  incSI1DF(m)
  deleteStuff(m)
  m.push(...cb)
  m.sort(sortPath)
}

export const moveSIR = (m: M) => {

}

export const moveSIL = (m: M) => {

}

export const moveSD = (m: M) => {

}

export const moveSU = (m: M) => {

}
