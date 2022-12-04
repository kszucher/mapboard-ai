// @ts-nocheck

import {actions, getEditedPathString, getMap, sagaActions} from "../core/EditorFlow";
import {isUrl, toPathString} from "../core/Utils";
import {Dir} from "../core/Types";

const { L, U, R, D } = { L: 37, U: 38, R: 39, D: 40 }

const ckm = (e, condition) => (
  ['-', (+e.ctrlKey ? '1' : '0')].includes(condition[0]) &&
  ['-', (+e.shiftKey ? '1' : '0')].includes(condition[1]) &&
  ['-', (+e.altKey) ? '1' : '0'].includes(condition[2])
)

const c2dt = (m, which) => {
  const {lastPath} = m.sc
  let direction = ''
  if (which === R) {
    if (lastPath.length === 2) {direction = Dir.OR}
    else if (lastPath.length === 6) {direction = lastPath[3] ? Dir.IR : Dir.O}
    else {direction = lastPath[3] ? Dir.I : Dir.O}
  } else if (which === L) {
    if (lastPath.length === 2) {direction = Dir.OL}
    else if (lastPath.length === 6) {direction = lastPath[3] ? Dir.O : Dir.IL}
    else {direction = lastPath[3] ? Dir.O : Dir.I}
  } else if (which === U) {direction = Dir.U
  } else if (which === D) {direction = Dir.D
  }
  return { direction }
}

export const useEventToAction = (event, eventType, eventPayload, dispatch, mapDispatch) => {

  // console.log(eventType)

  const e = eventType === 'kd' ? event : { event: { ctrlKey: undefined, shiftKey: undefined, altKey: undefined } }
  const { key, code, which } = eventType === 'kd' ? eventPayload : { key: undefined, code: undefined, which: undefined }
  const { text } = eventType === 'pt' ? eventPayload : { text: '' }
  const { imageId, imageSize } = eventType === 'pi' ? eventPayload : { imageId: undefined, imageSize: undefined }

  const m = getMap()
  const editedPathString = getEditedPathString()

  // possibly include conditions such as hasCell, or contentType (not for now, as this is a very sparse matrix)
  const keyStateMachineDb = [
    [ 'eventTypeCondition', 'isEditing', 'match', 'scope', 'preventDefault', 'actionType', 'action', 'payload' ],
    [ 'kd', 0, ckm(e, '000') && key === 'F1',                   ['s', 'c', 'm'],    1, 'm',  '',                                  {}                              ],
    [ 'kd', 0, ckm(e, '000') && key === 'F2',                   ['s', 'm'],         1, 'm',  'startEdit',                         {}                              ],
    [ 'kd', 0, ckm(e, '000') && key === 'F3',                   ['s', 'c', 'm'],    1, 'm',  '',                                  {}                              ],
    [ 'kd', 0, ckm(e, '000') && key === 'F5',                   ['s', 'c', 'm'],    0, 'm',  '',                                  {}                              ],
    [ 'kd', 0, ckm(e, '000') && key === 'Enter',                ['s'],              1, 'm',  'insert_S_D',                        {}                              ],
    [ 'kd', 0, ckm(e, '000') && key === 'Enter',                ['m'],              1, 'm',  'select_M_IOUD',                     {direction: Dir.D}              ],
    [ 'kd', 1, ckm(e, '000') && key === 'Enter',                ['s', 'm'],         1, 'm',  'finishEdit',                        {}                              ],
    [ 'kd', 0, ckm(e, '010') && key === 'Enter',                ['s', 'm'],         1, 'm',  'insert_S_U',                        {}                              ],
    [ 'kd', 0, ckm(e, '001') && key === 'Enter',                ['s'],              1, 'm',  'cellify',                           {}                              ],
    [ 'kd', 0, ckm(e, '000') && ['Insert','Tab'].includes(key), ['s'],              1, 'm',  'insert_S_O',                        {}                              ],
    [ 'kd', 1, ckm(e, '000') && ['Insert','Tab'].includes(key), ['s', 'm'],         1, 'm',  'insert_S_O',                        {}                              ],
    [ 'kd', 0, ckm(e, '000') && ['Insert','Tab'].includes(key), ['m'],              1, 'm',  'select_M_IOUD',                     {direction: Dir.O}              ],
    [ 'kd', 0, ckm(e, '000') && key === 'Delete',               ['s'],              1, 'm',  'delete_S',                          {}                              ],
    [ 'kd', 0, ckm(e, '000') && key === 'Delete',               ['cr', 'cc'],       1, 'm',  'delete_CRCC',                       {}                              ],
    [ 'kd', 0, ckm(e, '000') && code === 'Space',               ['s'],              1, 'm',  'select_M_FF',                       {}                              ],
    [ 'kd', 0, ckm(e, '000') && code === 'Space',               ['m'],              1, 'm',  'select_S_F',                        {}                              ],
    [ 'kd', 0, ckm(e, '000') && code === 'Space',               ['c'],              1, 'm',  '',                                  {}                              ],
    [ 'kd', 0, ckm(e, '000') && code === 'Space',               ['cr', 'cc'],       1, 'm',  'select_M_F',                        {}                              ],
    [ 'kd', 0, ckm(e, '000') && code === 'Backspace',           ['s'],              1, 'm',  'select_M_B',                        {}                              ],
    [ 'kd', 0, ckm(e, '000') && code === 'Backspace',           ['c', 'cr', 'cc'],  1, 'm',  'select_S_B',                        {}                              ],
    [ 'kd', 0, ckm(e, '000') && code === 'Backspace',           ['m'],              1, 'm',  'select_S_BB',                       {}                              ],
    [ 'kd', 0, ckm(e, '000') && code === 'Escape',              ['s', 'c', 'm'],    1, 'm',  'select_R',                          {}                              ],
    [ 'kd', 0, ckm(e, '100') && code === 'KeyA',                ['s', 'c', 'm'],    1, 'm',  'select_all',                        {}                              ],
    [ 'kd', 0, ckm(e, '100') && code === 'KeyM',                ['s', 'c', 'm'],    1, 'sa', 'createMapInMap',                    {}                              ],
    [ 'kd', 0, ckm(e, '100') && code === 'KeyC',                ['s', 'c', 'm'],    1, 'm',  'copySelection',                     {}                              ],
    [ 'kd', 0, ckm(e, '100') && code === 'KeyX',                ['s', 'c', 'm'],    1, 'm',  'cutSelection',                      {}                              ],
    [ 'kd', 0, ckm(e, '100') && code === 'KeyS',                ['s', 'c', 'm'],    1, 'sa', 'saveMap',                           {}                              ],
    [ 'kd', 0, ckm(e, '100') && code === 'KeyZ',                ['any'],            1, 'a',  'redo',                              {}                              ],
    [ 'kd', 0, ckm(e, '100') && code === 'KeyY',                ['any'],            1, 'a',  'undo',                              {}                              ],
    [ 'kd', 0, ckm(e, '100') && code === 'KeyE',                ['s'],              1, 'm',  'transpose',                         {}                              ],
    [ 'kd', 0, ckm(e, '000') && [L,R,U,D].includes(which),      ['s'],              1, 'm',  'select_S_IOUD',                     {...c2dt(m, which), add: false} ],
    [ 'kd', 0, ckm(e, '000') && [L,R,U,D].includes(which),      ['m'],              1, 'm',  'select_M_IOUD',                     {...c2dt(m, which)}             ],
    [ 'kd', 0, ckm(e, '100') && [L,R,U,D].includes(which),      ['s'],              1, 'm',  'move_S_IOUD',                       {...c2dt(m, which)}             ],
    [ 'kd', 0, ckm(e, '010') && [L,R].includes(which),          ['s'],              1, 'm',  'selectDescendantsOut',              {code}                          ],
    [ 'kd', 0, ckm(e, '010') && [L,R].includes(which),          ['c', 'm'],         1, 'm',  'select_CR_IO',                      {}                              ],
    [ 'kd', 0, ckm(e, '000') && [L,R].includes(which),          ['cc'],             1, 'm',  'select_CC_UD',                      {...c2dt(m, which)}             ],
    [ 'kd', 0, ckm(e, '001') && [L,R].includes(which),          ['c', 'cc'],        1, 'm',  'insert_CC_IO',                      {...c2dt(m, which), b: false}   ],
    [ 'kd', 0, ckm(e, '001') && [L,R].includes(which),          ['m'],              1, 'm',  'insert_CC_IO',                      {...c2dt(m, which), b: true}    ],
    [ 'kd', 0, ckm(e, '100') && [L,R].includes(which),          ['cc'],             1, 'm',  'move_CC_IO',                        {...c2dt(m, which)}             ],
    [ 'kd', 0, ckm(e, '010') && [U,D].includes(which),          ['s'],              1, 'm',  'select_S_IOUD',                     {...c2dt(m, which), add: true}  ],
    [ 'kd', 0, ckm(e, '010') && [U,D].includes(which),          ['c', 'm'],         1, 'm',  'select_CC_IO',                      {}                              ],
    [ 'kd', 0, ckm(e, '000') && [U,D].includes(which),          ['cr'],             1, 'm',  'select_CR_UD',                      {...c2dt(m, which)}             ],
    [ 'kd', 0, ckm(e, '001') && [U,D].includes(which),          ['c', 'cr'],        1, 'm',  'insert_CR_UD',                      {...c2dt(m, which), b: false}   ],
    [ 'kd', 0, ckm(e, '001') && [U,D].includes(which),          ['m'],              1, 'm',  'insert_CR_UD',                      {...c2dt(m, which), b: true}    ],
    [ 'kd', 0, ckm(e, '100') && [U,D].includes(which),          ['cr'],             1, 'm',  'move_CR_UD',                        {...c2dt(m, which)}             ],
    [ 'kd', 0, ckm(e, '100') && which >= 96 && which <= 105,    ['s', 'm'],         1, 'm',  'applyColorFromKey',                 {currColor: which - 96}         ],
    [ 'kd', 0, ckm(e, '0-0') && which >= 48,                    ['s', 'm'],         0, 'a',  'setEditedPathString',               toPathString(m.sc.lastPath)     ],
    [ 'pt', 0, text.substring(0, 1) === '[',                    ['s'],             -1, 'm',  'insertMapFromClipboard',            {text}                          ],
    [ 'pt', 0, text.substring(0, 2) === '\\[',                  ['s'],             -1, 'm',  'insert_S_O_equation',               {text}                          ],
    [ 'pt', 0, isUrl(text),                                     ['s'],             -1, 'm',  'insert_S_O_elink',                  {text}                          ],
    [ 'pt', 0, true,                                            ['s'],             -1, 'm',  'insert_S_O_text',                   {text}                          ],
    [ 'pt', 1, true,                                            ['s'],             -1, 'm',  'append_text',                       {text}                          ],
    [ 'pi', 0, true,                                            ['s'],             -1, 'm',  'insert_S_O_image',                  {imageId, imageSize}            ],
  ]
  let keyStateMachine = {}
  for (let i = 0; i < keyStateMachineDb.length; i++) {
    for (let h = 0; h < keyStateMachineDb[0].length; h++) {
      keyStateMachine[keyStateMachineDb[0][h]] = keyStateMachineDb[i][h]
    }
    const { eventTypeCondition, isEditing, match, scope, preventDefault, actionType, action, payload } = keyStateMachine
    if (
      eventTypeCondition === eventType &&
      !!isEditing === editedPathString.length > 0 &&
      match === true
      && (scope[0] === 'any' || scope.includes(m.sc.scope))
    ) {
      if (preventDefault === 1) {
        event.preventDefault()
      }
      switch (actionType) {
        case 'a': dispatch(actions[action](payload)); break
        case 'sa': dispatch(sagaActions[action](payload)); break
        case 'm': mapDispatch(action, payload); break
      }
      break
    }
  }
}
