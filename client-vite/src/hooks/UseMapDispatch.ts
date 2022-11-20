// @ts-nocheck

import {Dispatch} from "redux"
import {orient} from "../map/MapVisualizeHolderDiv"
import {getMapData, mapReducer, reCalc} from "../core/MapFlow"
import {copy, toPath, toPathString} from "../core/Utils"
import {mapDeInit} from "../map/MapDeInit"
import {actions, getEditedPathString, getMap, getTempMap} from "../core/EditorFlow"

// this will eventually become a pure reducer...
export const useMapDispatch = (dispatch: Dispatch<any>, action: string, payload: any = {}) => {
  console.log('MAP_DISPATCH: ' + action)
  const editedPathString = getEditedPathString()
  const currM = getMap()
  if (['shouldLoad', 'shouldResize', 'shouldCenter', 'shouldScroll'].includes(action)) {
    orient(currM, action, payload)
  } else {
    // finish edit
    if (editedPathString.length && [
      'finishEdit',
      'selectStruct',
      'selectStructToo',
      'selectStructFamily',
      'setTaskStatus',
      'insert_O_S'
    ].includes(action)) {
      const tempMap = getTempMap()
      const editedPath = toPath(editedPathString)
      const contentToSave = getMapData(tempMap, editedPath).content
      Object.assign(payload, {contentToSave})
    }
    // reducer
    const nextM = reCalc(currM, mapReducer(copy(currM), action, payload))
    if (['changeDensity', 'changeAlignment', 'moveTarget'].includes(action)) {
      orient(nextM, 'shouldCenter', {}) // react to density and alignment directly, but as a call for moveTarget
      // how to be reactive for moveTarget???
      // easiest solution: we have a useEffect that actually CAN react to width change, but make it optional to the user
      // what I use is somewhat a centered but left aligned, and we are now touching user requirements
      // make it reactive and uniform and later think about the users
    }
    // map
    if (![
      'typeText',
      'moveTargetPreview',
      'selectTargetPreview',
    ].includes(action)) {
      const currMSimplified = mapDeInit.start(copy(currM))
      const nextMSimplified = mapDeInit.start(copy(nextM))
      if (JSON.stringify(currMSimplified) !== JSON.stringify(nextMSimplified)) {
        // console.log('mutate map')
        dispatch(actions.mutateMapStack({data: nextM}))
      }
    }
    // temp map
    if ([
      'insert_O_S',
      'insert_U_S',
      'insert_D_S',
      'startEdit',
      'typeText',
      'moveTargetPreview',
      'selectTargetPreview',
    ].includes(action)) {
      // console.log('mutate temp map')
      dispatch(actions.mutateTempMap({data: nextM}))
    }
    // start edit
    const nextEditedPathString = ([
        'insert_O_S',
        'insert_U_S',
        'insert_D_S',
        'startEdit',
        'typeText',
      ].includes(action) &&
      getMapData(nextM, nextM.sc.lastPath).contentType !== 'image' &&
      getMapData(nextM, nextM.sc.lastPath).hasCell === 0
    )
      ? toPathString(nextM.sc.lastPath)
      : ''
    dispatch(actions.setEditedPathString(nextEditedPathString))
  }
}
