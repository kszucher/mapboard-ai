import {Dispatch} from "redux"
import {getMapData, mapReducer, reCalc} from "../core/MapFlow"
import {copy} from "../core/Utils"
import {mapDeInit} from "../map/MapDeInit"
import {actions, getEditedNodeId, getMap, getTempMap} from "../core/EditorFlow"
import {mapFindById} from "../map/MapFindById";

export const useMapDispatch = (dispatch: Dispatch<any>, action: string, payload: any = {}) => {
  console.log('MAP_DISPATCH: ' + action)
  const editedNodeId = getEditedNodeId()
  const currM = getMap()
  if (editedNodeId.length && [
    'finishEdit',
    'selectStruct',
    'selectStructToo',
    'selectStructFamily',
    'setTaskStatus',
    'insert_S_O'
  ].includes(action)) {
    const tempMap = getTempMap()
    const editedPath = getMapData(currM, mapFindById.start(currM, editedNodeId)).path
    const contentToSave = getMapData(tempMap, editedPath).content
    Object.assign(payload, {contentToSave})
  }
  const nextM = reCalc(currM, mapReducer(copy(currM), action, payload))
  if (![
    'typeText',
    'moveTargetPreview',
    'selectTargetPreview',
  ].includes(action)) {
    if (
      JSON.stringify(mapDeInit.start(copy(currM))) !==
      JSON.stringify(mapDeInit.start(copy(nextM)))
    ) {
      dispatch(actions.mutateMapStackResetTempMap({data: nextM}))
    }
  }
  if ([
    'insert_S_O',
    'insert_S_U',
    'insert_S_D',
    'startEdit',
    'typeText',
    'moveTargetPreview',
    'selectTargetPreview',
  ].includes(action)) {
    dispatch(actions.mutateTempMap({data: nextM}))
  }
  const nextEditedPathString = ([
      'insert_S_O',
      'insert_S_U',
      'insert_S_D',
      'startEdit',
      'typeText',
    ].includes(action)
    && getMapData(nextM, nextM.sc.lastPath).contentType !== 'image'
    && getMapData(nextM, nextM.sc.lastPath).hasCell == false
  )
    ? getMapData(nextM, nextM.sc.lastPath).nodeId
    : ''
  dispatch(actions.setEditedNodeId(nextEditedPathString))
  if (action === 'moveTargetPreview') {
    dispatch(actions.setMoveTarget(payload))
  }
  if (action === 'moveTarget') {
    dispatch(actions.setMoveTarget([]))
  }
  if (action === 'selectTargetPreview') {
    dispatch(actions.setSelectTarget(payload))
  }
  if (action === 'selectTarget') {
    dispatch(actions.setSelectTarget([]))
  }
}
