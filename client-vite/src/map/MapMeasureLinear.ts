import {getNodeByPath} from "../core/MapUtils"
import {ML} from "../state/MTypes"
import {G} from "../state/GPropsTypes"
import {N} from "../state/NPropsTypes"

export const mapMeasureLinear = (mlp: ML) => {
  const g = getNodeByPath(mlp, ['g']) as G
  const r0 = getNodeByPath(mlp, ['r', 0]) as N
  const r0d0 = getNodeByPath(mlp, ['r', 0, 'd', 0]) as N
  const r0d1 = getNodeByPath(mlp, ['r', 0, 'd', 1]) as N

  for (let i = mlp.length - 1; i > - 1; i--) {

  }
}
