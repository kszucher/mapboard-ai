import {getNodeByPath} from "../core/MapUtils"
import {M} from "../state/MTypes"
import {G} from "../state/GPropsTypes"

export const mapTemplate = (mlp: M) => {
  const g = getNodeByPath(mlp, ['g']) as G
  for (const n of mlp) {

  }
}
