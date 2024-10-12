import {getG, getLastIndexL, getLastIndexR} from "../mapQueries/MapQueries.ts"
import {L, M, R} from "../mapState/MapStateTypes.ts"
import {unselectNodes} from "./MapSelect"

export const insertL = (m: M, partialL: Partial<L>) => {
  m.push(<L>{path: ['l', getLastIndexL(m) + 1], ...partialL})
}

export const insertR = (m: M) => {
  const lastIndexR = getLastIndexR(m)
  unselectNodes(m)
  m.push(<R>{path: ['r', lastIndexR + 1], selected: 1, offsetW: getG(m).selfW, offsetH: getG(m).selfH})
}
