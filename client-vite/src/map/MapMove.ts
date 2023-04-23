import {GN, M, N, P} from "../state/MapPropTypes"
import {
  decPiN,
  getCountXFSU1SO1,
  getNodeByPath,
  getPPList,
  getXASSO,
  getXF,
  getXFSU1,
  getXP,
  isSD,
  sortPath
} from "./MapUtils";

const deleteStuff = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getPPList(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
}

const getOffset = (m: M, p: P) => (p.at(getXP(m).length - 1) as number) - (getXF(m).path.at(-1) as number)
const toClipboard = (m: M) => structuredClone(getXASSO(m).map(n => ({...n, path: ['s', getOffset(m, n.path), ...n.path.slice(getXP(m).length)]}))) as GN[]

export const moveSO = (m: M) => {
  const xfsu1 = getXFSU1(m)
  const cxfsu1so1 = getCountXFSU1SO1(m)
  const clipboard = toClipboard(m)
  deleteStuff(m)
  clipboard.forEach(n => n.path = structuredClone([...xfsu1, 's', cxfsu1so1 + (n.path.at(1) as number) , ...n.path.slice(2)] as P))
  m.push(...clipboard)
  m.sort(sortPath)
}

export const moveSI = (m: M) => {

}

export const moveSIR = (m: M) => {

}

export const moveSIL = (m: M) => {

}

export const moveSD = (m: M) => {

}

export const moveSU = (m: M) => {

}
