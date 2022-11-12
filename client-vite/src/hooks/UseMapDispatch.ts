import { Dispatch } from "redux"
import {orient} from "../map/MapVisualizeHolderDiv"
import {getMap, mapReducer, reCalc, reDraw} from "../core/MapFlow"
import {copy} from "../core/Utils"
import {mapDeInit} from "../map/MapDeInit"
import {actions} from "../core/EditorFlow"

export const useMapDispatch = (dispatch: Dispatch<any>, colorMode: any, action: string, payload: any) => {
  console.log('MAP_DISPATCH: ' + action)
  const currM = getMap()
  if (['shouldLoad', 'shouldResize', 'shouldCenter', 'shouldScroll'].includes(action)) {
    orient(currM, action, payload)
  } else {
    const nextM = reCalc(mapReducer(copy(currM), action, payload))
    if (['changeDensity', 'changeAlignment', 'moveTarget'].includes(action)) {
      orient(nextM, 'shouldCenter', {})
    }
    if (['typeText', 'startEdit', 'moveTargetPreview', 'selectTargetPreview'].includes(action)) {
      reDraw(nextM, colorMode)
    } else {
      const currMSimplified = mapDeInit.start(copy(currM))
      const nextMSimplified = mapDeInit.start(copy(nextM))
      if (JSON.stringify(currMSimplified) !== JSON.stringify(nextMSimplified)) {
        dispatch(actions.mutateMapStack(nextM))
      }
    }
  }
}
