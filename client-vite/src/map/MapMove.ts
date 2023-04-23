import {GN, M, N, P} from "../state/MapPropTypes"
import {decPiN, getCountXFSU1SO1, getNodeByPath, getPPList, getXF, getXFSU1, getXP, isSD, isXASSO, sortPath} from "./MapUtils";

const deleteStuff = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getPPList(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
}

const copyToClipboard = (m: M) => {
  const clipboard = [] as GN[]
  const xpl = getXP(m).length
  const xfi = getXF(m).path.at(-1) as number
  m.forEach(n => isXASSO(m, n.path) && clipboard.push(structuredClone({...n, path: ['s', n.path.at(xpl - 1) as number - xfi, ...n.path.slice(xpl)]} as GN)))
  return clipboard
}

export const moveSO = (m: M) => {
  const xfsu1 = getXFSU1(m)
  const cxfsu1so1 = getCountXFSU1SO1(m)
  const clipboard = copyToClipboard(m)
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
