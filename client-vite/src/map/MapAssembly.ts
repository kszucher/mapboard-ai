// @ts-nocheck

import {copy, subsasgn} from "../core/Utils"

export const mapAssembly = (dataLinear) => {
  let dataNested = {...dataLinear[0]} // can contain "path" but it is no longer required
  for (let i = 1; i < dataLinear.length; i++) {
    subsasgn(dataNested, copy(dataLinear[i].path), copy(dataLinear[i]))
  }
  return dataNested
}
