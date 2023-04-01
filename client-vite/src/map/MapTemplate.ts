import {getNodeByPath} from "../core/MapUtils"
import {ML} from "../state/MTypes"
import {G} from "../state/GPropsTypes"

export const mapTemplate = (mlp: ML) => {
  const g = getNodeByPath(mlp, ['g']) as G
  for (const n of mlp) {

  }
}
