import {copy, subsasgn} from "../core/Utils"
import {ML, MPartial} from "../state/MTypes"

export const mapAssembly = (dataLinear: ML) => {
  const copyDataLinear = copy(dataLinear)
  const dataLinearSorted = copyDataLinear.sort((a: any, b: any) => (a.path > b.path) ? 1 : -1)
  let dataNested = {}
  for (let i = 0; i < dataLinearSorted.length; i++) {
    subsasgn(dataNested, copy(dataLinearSorted[i].path), copy(dataLinearSorted[i])) // do we really need this copy again?
  }
  return dataNested as MPartial
}
