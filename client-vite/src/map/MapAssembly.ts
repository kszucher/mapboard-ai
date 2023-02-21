import {copy, subsasgn} from "../core/Utils"
import {MPartial} from "../types/DefaultProps";

export const mapAssembly = (dataLinear: any) => {
  const copyDataLinear = copy(dataLinear)
  const dataLinearSorted = copyDataLinear.sort((a: any, b: any) => (a.path > b.path) ? 1 : -1)
  let dataNested = {}
  for (let i = 0; i < dataLinearSorted.length; i++) {
    subsasgn(dataNested, copy(dataLinearSorted[i].path), copy(dataLinearSorted[i]))
  }
  return dataNested as MPartial
}
