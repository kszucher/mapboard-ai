import {getXR, mR} from "../mapQueries/MapQueries.ts"
import {M, R} from "../mapState/MapStateTypes.ts"

export const selectR = (m: M, ri: R) => {
  unselectNodes(m)
  ri.selected = 1
}

export const selectAddR = (m: M, ri: R) => {
  ri.selected = getXR(m).selected + 1
}

export const selectRL = (m: M, rList: R[]) => {
  unselectNodes(m)
  rList.forEach((ri, i) => ri.selected = i + 1)
}

export const unselectNodes = (m: M) => {
  mR(m).forEach(ri => Object.assign(ri, {selected: 0, selection: 's'}))
}

export const unselectR = (ri: R) => {
  ri.selected = 0
}
