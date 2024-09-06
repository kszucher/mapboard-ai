import {MPartial} from "../state/MapStateTypes.ts"
import isEqual from "react-fast-compare"
import {excludeKeys} from "../utils/Utils.ts"

const recursiveMerge = (current: any, updates: any): {V0?: any, V1?: any} => {
  for (const key of Object.keys(updates)) {
    if (!current.hasOwnProperty(key) || typeof updates[key] !== 'object') current[key] = updates[key]
    else recursiveMerge(current[key], updates[key])
  }
  return current
}

export const mapDiff = (arr0: MPartial, arr1: MPartial) => (
  Object.fromEntries(
    Object.entries(
      recursiveMerge(
        Object.fromEntries(arr0.map(n => [n.nodeId, {V0: excludeKeys(n, ['nodeId'])}])),
        Object.fromEntries(arr1.map(n => [n.nodeId, {V1: excludeKeys(n, ['nodeId'])}])))
    ).map(el => (
        el[1].hasOwnProperty('V0') && !el[1].hasOwnProperty('V1') && [el[0], null] ||
        !el[1].hasOwnProperty('V0') && el[1].hasOwnProperty('V1') && [el[0], el[1].V1] ||
        el[1].hasOwnProperty('V0') && el[1].hasOwnProperty('V1') && isEqual(el[1].V0, el[1].V1) && [] ||
        el[1].hasOwnProperty('V0') && el[1].hasOwnProperty('V1') && !isEqual(el[1].V0, el[1].V1) && [el[0], (
          Object.fromEntries(
            Object.entries(
              recursiveMerge(
                Object.fromEntries(Object.entries(el[1].V0).map(el => [el[0], {V0: el[1]}])),
                Object.fromEntries(Object.entries(el[1].V1).map(el => [el[0], {V1: el[1]}])),
              )
            ).map(el => (
                el[1].hasOwnProperty('V0') && !el[1].hasOwnProperty('V1') && [el[0], null] ||
                !el[1].hasOwnProperty('V0') && el[1].hasOwnProperty('V1') && [el[0], el[1].V1] ||
                el[1].hasOwnProperty('V0') && el[1].hasOwnProperty('V1') && isEqual(el[1].V0, el[1].V1) && [] ||
                el[1].hasOwnProperty('V0') && el[1].hasOwnProperty('V1') && !isEqual(el[1].V0, el[1].V1) && [el[0], el[1].V1]
              )
            )
          )
        )]
      )
    )
  )
)
