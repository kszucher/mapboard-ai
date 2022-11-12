// @ts-nocheck

import {orient} from "../map/MapVisualizeHolderDiv";
import {getM, mapReducer, reCalc, reDraw} from "../core/MapFlow";
import {copy} from "../core/Utils";
import {mapDeInit} from "../map/MapDeInit";
import {actions} from "../core/EditorFlow";

export const useMapDispatch = (dispatch, colorMode, action, payload) => {
  console.log('MAP_DISPATCH: ' + action)
  if (['shouldLoad', 'shouldResize', 'shouldCenter', 'shouldScroll'].includes(action)) {
    orient(action, payload)
  } else {
    const currM = getM()
    const nextM = reCalc(mapReducer(copy(currM), action, payload))
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
