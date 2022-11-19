// @ts-nocheck

import { Dispatch } from "redux"
import {orient} from "../map/MapVisualizeHolderDiv"
import {getIsEditing, getMap, getMapData, getTempMap, mapReducer, reCalc} from "../core/MapFlow"
import {copy} from "../core/Utils"
import {mapDeInit} from "../map/MapDeInit"
import {actions} from "../core/EditorFlow"

// this will eventually become a pure reducer...
export const useMapDispatch = (dispatch: Dispatch<any>, action: string, payload: any = {}) => {
  console.log('MAP_DISPATCH: ' + action)
  const isEditing = getIsEditing()
  const currM = getMap()
  if (['shouldLoad', 'shouldResize', 'shouldCenter', 'shouldScroll'].includes(action)) {
    orient(currM, action, payload)
  } else {
    if (isEditing && [
      'finishEdit',
      'selectStruct',
      'selectStructToo',
      'selectStructFamily',
      'setTaskStatus',
      'insert_U_S',
      'insert_D_S',
      'insert_O_S'
    ].includes(action)) {
      const tempMap = getTempMap()
      Object.assign(payload, {contentToSave: getMapData(tempMap, tempMap.sc.lastPath).content})
    }
    const nextM = reCalc(currM, mapReducer(copy(currM), action, payload))

    if (['changeDensity', 'changeAlignment', 'moveTarget'].includes(action)) {
      orient(nextM, 'shouldCenter', {}) // react to density and alignment directly, but as a call for moveTarget
      // how to be reactive for moveTarget???
      // easiest solution: we have a useEffect that actually CAN react to width change, but make it optional to the user
      // what I use is somewhat a centered but left aligned, and we are now touching user requirements
      // make it reactive and uniform and later think about the users
    }

    const isEditingNext = ['contentTypeToText', 'deleteContent', 'typeText', 'insert_U_S', 'insert_D_S', 'insert_O_S'].includes(action)
    if (['contentTypeToText', 'deleteContent', 'typeText', 'moveTargetPreview', 'selectTargetPreview'].includes(action)) {
      dispatch(actions.mutateTempMap({data: nextM, isEditing: isEditingNext}))
    } else {
      const currMSimplified = mapDeInit.start(copy(currM))
      const nextMSimplified = mapDeInit.start(copy(nextM))
      if (JSON.stringify(currMSimplified) !== JSON.stringify(nextMSimplified)) {
        dispatch(actions.mutateMapStack({data: nextM, isEditing: isEditingNext}))
      }
    }
  }
}
