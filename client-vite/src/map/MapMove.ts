import {M} from "../state/MapPropTypes"
import {decPiN, getNodeByPath, getIL, isSD, sortPath, incXSI1DF, cbSO, cbSI} from "./MapUtils";

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
  incXSI1DF(m)
  deleteStuff(m)
  m.push(...clipboard)
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
