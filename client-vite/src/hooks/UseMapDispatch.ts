import {Dispatch} from "redux"
import {getMapData, mapReducer, reCalc} from "../core/MapFlow"
import {copy} from "../core/Utils"
import {actions, getEditedNodeId, getMap, getTempMap} from "../core/EditorFlow"
import {mapFindById} from "../map/MapFindById";

export const useMapDispatch = (dispatch: Dispatch<any>, action: string, payload: any = {}) => {
  console.log('MAP_DISPATCH: ' + action, payload)
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
  if ([
    'insert_S_O',
    'insert_S_U',
    'insert_S_D',
    'startEdit'
  ].includes(action)
  ) {
    dispatch(actions.mutateMapStack(nm))
    dispatch(actions.mutateTempMap(nm))
  } else if ([
    'typeText',
    'moveTargetPreview',
    'selectTargetPreview',
  ].includes(action)
    || action === 'moveTarget' && !payload.moveTargetPath.length
    || action === 'selectTarget' && !payload.highlightTargetPathList.length
  ) {
    dispatch(actions.mutateTempMap(nm))
  } else {
    dispatch(actions.mutateMapStack(nm))
    dispatch(actions.mutateTempMap({}))
  }
  if ([
      'insert_S_O',
      'insert_S_U',
      'insert_S_D',
      'startEdit',
      'typeText'
    ].includes(action) &&
    getMapData(nm, nm.g.sc.lastPath).contentType !== 'image' &&
    getMapData(nm, nm.g.sc.lastPath).hasCell == false ) {
    dispatch(actions.setEditedNodeId(getMapData(nm, nm.g.sc.lastPath).nodeId))
  } else {
    dispatch(actions.setEditedNodeId(''))
  }
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
