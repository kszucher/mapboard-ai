import {M, P} from "../state/MapPropTypes"
import {
  decPiN,
  getNodeByPath,
  getSIL,
  isSD,
  sortPath,
  m2cb,
  getXFSU1,
  getCountXFSU1SO1,
  cb2ip,
  getXI2,
  getCountXSI1SU,
  getCountR0D1S,
  getCountR0D0S,
  getXI1,
  makeSpaceFrom,
  getCountXLSD,
  getXFPSU1,
  getXFPSD1,
  getXLPSD2,
} from "./MapUtils"

export const deleteStuff = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getSIL(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
}

export const move = (m: M, insertPath: P, spacePath: P) => {
  const cb = m2cb(m)
  makeSpaceFrom(m, spacePath)
  deleteStuff(m)
  m.push(...cb2ip(cb, insertPath))
  m.sort(sortPath)
}

export const moveSO = (m: M) => move(m, [...getXFSU1(m), 's', getCountXFSU1SO1(m)] as P, [] as P)
export const moveSI = (m: M) => move(m, [...getXI2(m), 's', getCountXSI1SU(m) + 1] as P, [...getXI2(m), 's', getCountXSI1SU(m) + 1] as P)
export const moveSIR = (m: M) => move(m, ['r', 0, 'd', 1, 's', getCountR0D1S(m)] as P, [] as P)
export const moveSIL = (m: M) => move(m, ['r', 0, 'd', 0, 's', getCountR0D0S(m)] as P, [] as P)
export const moveSD = (m: M) => move(m, getXFPSD1(m),  getXLPSD2(m))
export const moveST = (m: M) => move(m, [...getXI1(m), 's', 0] as P, [...getXI1(m), 's', 0] as P)
export const moveSU = (m: M) => move(m, getXFPSU1(m), getXFPSU1(m))
export const moveSB = (m: M) => move(m, [...getXI1(m), 's', getCountXLSD(m)] as P, [] as P)

export const moveCCI = (m: M) => {

}

export const moveCCO = (m: M) => {

}

export const moveCRD = (m: M) => {

}

export const moveCRU = (m: M) => {

}
