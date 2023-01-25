// @ts-nocheck

import {copy, subsasgn} from "../core/Utils"

export const mapAssembly = (dataLinear) => {
  const copyDataLinear = copy(dataLinear)
  const dataLinearSorted = copyDataLinear.sort((a, b) => (a.path > b.path) ? 1 : -1)
  let dataNested = {}
  for (let i = 0; i < dataLinearSorted.length; i++) {
    subsasgn(dataNested, copy(dataLinearSorted[i].path), copy(dataLinearSorted[i]))
  }
  return dataNested
}
