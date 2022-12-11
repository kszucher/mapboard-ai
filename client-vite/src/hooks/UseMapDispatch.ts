import {Dispatch} from "redux"
import {getMapData, mapReducer, reCalc} from "../core/MapFlow"
import {copy} from "../core/Utils"
import {mapDeInit} from "../map/MapDeInit"
import {actions, getEditedNodeId, getMap, getTempMap} from "../core/EditorFlow"
import {mapFindById} from "../map/MapFindById";

export const useMapDispatch = (dispatch: Dispatch<any>, action: string, payload: any = {}) => {
  console.log('MAP_DISPATCH: ' + action)
  const editedNodeId = getEditedNodeId()
  if (editedNodeId.length && [
    'finishEdit',
    'selectStruct',
    'selectStructToo',
    'selectStructFamily',
    'setTaskStatus',
    'insert_S_O'
  ].includes(action)) {
    const tm = getTempMap()
    const editedPath = getMapData(tm, mapFindById.start(tm, editedNodeId)).path
    const contentToSave = getMapData(tm, editedPath).content
    Object.assign(payload, {contentToSave})
  }
  const m = getMap()
  const nm = reCalc(m, mapReducer(copy(m), action, payload))
  if (![
    'typeText',
    'moveTargetPreview',
    'selectTargetPreview',
  ].includes(action)) {
    if (
      JSON.stringify(mapDeInit.start(copy(m))) !==
      JSON.stringify(mapDeInit.start(copy(nm)))
    ) {
      dispatch(actions.mutateMapStackResetTempMap({data: nm}))
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
    dispatch(actions.mutateTempMap({data: nm}))
  }
  const nextEditedPathString = ([
      'insert_S_O',
      'insert_S_U',
      'insert_S_D',
      'startEdit',
      'typeText',
    ].includes(action)
    && getMapData(nm, nm.sc.lastPath).contentType !== 'image'
    && getMapData(nm, nm.sc.lastPath).hasCell == false
  )
    ? getMapData(nm, nm.sc.lastPath).nodeId
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
