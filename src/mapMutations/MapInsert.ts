import {getG, getLastIndexL, getLastIndexR} from "../mapQueries/MapQueries.ts"
import {L, LPartial, M, R} from "../mapState/MapStateTypes.ts"
import {unselectNodes} from "./MapSelect"

export const insertL = (m: M, lPartial: Omit<LPartial, 'nodeId' | 'path'>) => {
  m.push({path: ['l', getLastIndexL(m) + 1], ...lPartial} as L)
}

export const insertR = (m: M) => {
  const lastIndexR = getLastIndexR(m)
  unselectNodes(m)
  m.push({path: ['r', lastIndexR + 1], selected: 1, offsetW: getG(m).selfW, offsetH: getG(m).selfH} as R)
}
