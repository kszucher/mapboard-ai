import {getXR, mR} from "../mapQueries/MapQueries.ts"
import {M, R} from "../mapState/MapStateTypes.ts"

export const mapSelect = {
  R: (m: M, ri: R) => {
    mapUnselect.Nodes(m)
    ri.selected = 1
  },

  RAdd: (m: M, ri: R) => {
    ri.selected = getXR(m).selected + 1
  },

  RL: (m: M, rList: R[]) => {
    mapUnselect.Nodes(m)
    rList.forEach((ri, i) => ri.selected = i + 1)
  },
}

export const mapUnselect = {
  Nodes: (m: M) => {
    mR(m).forEach(ri => ri.selected = 0)
  },

  R: (ri: R) => {
    ri.selected = 0
  },
}
