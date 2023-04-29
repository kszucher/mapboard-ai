import {M} from "../state/MapPropTypes"
import {decPiN, getNodeByPath, getIL, isSD, sortPath, incNXSI1DF, cbSO, cbSI, cbSIR, cbSIL} from "./MapUtils";

const deleteStuff = (m: M) => {
  for (let i = m.length - 1; i > 0; i--) {
    const n = m[i]
    const parentPathList = [...getIL(n.path), n.path]
    parentPathList.some(p => getNodeByPath(m, p).selected) && m.splice(i, 1)
    parentPathList.forEach(p => n.path = decPiN(n.path, p.length - 1, m.filter(n => n.selected && isSD(n.path, p)).length))
  }
}

export const moveSO = (m: M) => {
  const clipboard = cbSO(m)
  deleteStuff(m)
  m.push(...clipboard)
  m.sort(sortPath)
}

export const moveSI = (m: M) => {
  const clipboard = cbSI(m)
  incNXSI1DF(m)
  deleteStuff(m)
  m.push(...clipboard)
  m.sort(sortPath)
}

export const moveSIR = (m: M) => {
  const clipboard = cbSIR(m)
  deleteStuff(m)
  m.push(...clipboard)
  m.sort(sortPath)
}

export const moveSIL = (m: M) => {
  const clipboard = cbSIL(m)
  deleteStuff(m)
  m.push(...clipboard)
  m.sort(sortPath)
}

export const moveSD = (m: M) => {
  // decN



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
