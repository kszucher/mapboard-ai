import {copy, subsasgn} from "../core/Utils"
import {ML, MPartial, NL} from "../state/MTypes"

export const mapAssembly = (ml: ML) => {
  const mlp = copy(ml).sort((a: NL, b: NL) => (a.path > b.path) ? 1 : -1)
  let m = {}
  for (let i = 0; i < mlp.length; i++) {
    subsasgn(m, copy(mlp[i].path), copy(mlp[i])) // do we really need this copy again?
  }
  return m as MPartial
}
