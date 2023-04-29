import {M, P} from "../state/MapPropTypes"
import {
  decPiN,
  getNodeByPath,
  getIL,
  isSD,
  sortPath,
  incNXSI1DF,
  cbSD,
  m2cb,
  getXFSU1,
  getCountXFSU1SO1,
  cb2ip,
  getXI2,
  getCountXSI1SU,
  getCountR0D1S,
  getCountR0D0S,
} from "./MapUtils"

const deleteStuff = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getIL(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
}

export const moveSO = (m: M) => {
  const ip = [...getXFSU1(m), 's', getCountXFSU1SO1(m)] as P
  const cb = m2cb(m)
  deleteStuff(m)
  m.push(...cb2ip(cb, ip))
  m.sort(sortPath)
}

export const moveSI = (m: M) => {
  const ip = [...getXI2(m), 's', getCountXSI1SU(m) + 1] as P
  const cb = m2cb(m)
  incNXSI1DF(m)
  deleteStuff(m)
  m.push(...cb2ip(cb, ip))
  m.sort(sortPath)
}

export const moveSIR = (m: M) => {
  const ip = ['r', 0, 'd', 1, 's', getCountR0D1S(m)] as P
  const cb = m2cb(m)
  deleteStuff(m)
  m.push(...cb2ip(cb, ip))
  m.sort(sortPath)
}

export const moveSIL = (m: M) => {
  const ip = ['r', 0, 'd', 0, 's', getCountR0D0S(m)] as P
  const cb = m2cb(m)
  deleteStuff(m)
  m.push(...cb2ip(cb, ip))
  m.sort(sortPath)
}

export const moveSD = (m: M) => {
  const clipboard =  cbSD(m)
  deleteStuff(m)

  m.push(...clipboard)
  m.sort(sortPath)
}

export const moveST = (m: M) => {

}

export const moveSU = (m: M) => {

}

export const moveSB = (m: M) => {

}

export const moveCCI = (m: M) => {

}

export const moveCCO = (m: M) => {

}

export const moveCRD = (m: M) => {

}

export const moveCRU = (m: M) => {

}
