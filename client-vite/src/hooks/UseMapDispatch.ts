// @ts-nocheck

import { Dispatch } from "redux"
import {orient} from "../map/MapVisualizeHolderDiv"
import {getEditedPath, getMap, getMapData, getTempMap, mapReducer, reCalc} from "../core/MapFlow"
import {copy} from "../core/Utils"
import {mapDeInit} from "../map/MapDeInit"
import {actions} from "../core/EditorFlow"

// this will eventually become a pure reducer...
export const useMapDispatch = (dispatch: Dispatch<any>, action: string, payload: any = {}) => {
  console.log('MAP_DISPATCH: ' + action)
  const editedPath = getEditedPath()
  const currM = getMap()
  if (['shouldLoad', 'shouldResize', 'shouldCenter', 'shouldScroll'].includes(action)) {
    orient(currM, action, payload)
  } else {
    // finish edit
    if (editedPath.length && [
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

    // console.log('editedPathNext', editedPathNext)
    // dispatch
    if (!['typeText'].includes(action)) {
      const currMSimplified = mapDeInit.start(copy(currM))
      const nextMSimplified = mapDeInit.start(copy(nextM))
      if (JSON.stringify(currMSimplified) !== JSON.stringify(nextMSimplified)) {
        dispatch(actions.mutateMapStack({data: nextM}))
        // tehát az van, hogy NEM változik a map és ezért az edited se kommittolódik...
      }
    }

    if ([
      'contentTypeToText',
      'deleteContent',
      'typeText',
      'insert_O_S',
      'insert_U_S',
      'insert_D_S',
      'moveTargetPreview',
      'selectTargetPreview',
    ].includes(action)) {
      console.log('mutate temp map')
      dispatch(actions.mutateTempMap({data: nextM}))
    }

    // start edit
    const editedPathNext = ([
      'contentTypeToText',
      'deleteContent',
      'typeText',
      'insert_O_S',
      'insert_U_S',
      'insert_D_S'
    ].includes(action)) ? nextM.sc.lastPath : []
    dispatch(actions.setEditedPath({editedPath: editedPathNext}))
  }
}

// bug: equation after edit but no change does not finish edit
// bug: finish edit on empty node copies the wrong stuff

// final notes: there are scenarios where we only use tempMap, and there is where we add a real AND a temp map too in case of finish edit
// philosophy: only tempMap will actually be able to be edited!!! so if we put the listener up, it already needs to be tempMap!!!
// this way we will have a super clear separation
// we are close, we just need to figure out what reacts to what
