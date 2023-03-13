import {M} from "../types/DefaultProps"
import {actions, getEditedNodeId, getMap} from "../core/EditorFlow"
import {copy, isUrl} from "../core/Utils"
import {Dir} from "../core/Enums"
import {getMapData, mapReducer, reCalc} from "../core/MapFlow"
import {Dispatch} from "react";

const { L, U, R, D } = { L: 37, U: 38, R: 39, D: 40 }

const ckm = (e: any, condition: string) => (
  ['-', (+e.ctrlKey ? '1' : '0')].includes(condition[0]) &&
  ['-', (+e.shiftKey ? '1' : '0')].includes(condition[1]) &&
  ['-', (+e.altKey) ? '1' : '0'].includes(condition[2])
)

const c2dt = (m: M, which: number) => {
  const {lastPath} = m.g.sc
  let direction
  if (which === R) {
    if (lastPath.length === 2) {direction = Dir.OR}
    else if (lastPath.length === 6) {direction = lastPath[3] ? Dir.IR : Dir.O}
    else {direction = lastPath[3] ? Dir.I : Dir.O}
  } else if (which === L) {
    if (lastPath.length === 2) {direction = Dir.OL}
    else if (lastPath.length === 6) {direction = lastPath[3] ? Dir.O : Dir.IL}
    else {direction = lastPath[3] ? Dir.O : Dir.I}
  } else if (which === U) {
    direction = Dir.U
  } else if (which === D) {
    direction = Dir.D
  }
  return { direction }
}

const findEditedNodeId = (m: M) => (
  m.g.sc.scope === 'c'
    ? getMapData(m, m.g.sc.lastPath).s[0].nodeId
    : getMapData(m, m.g.sc.lastPath).nodeId
)

export const useEventMiddleware = (
  someEvent: {
    mouseEvent?: MouseEvent
    keyboardEvent?: KeyboardEvent | { key: any, code: any, which: any, preventDefault: Function }
    clipboardPasteTextEvent?: { text: string }
    clipboardPasteImageEvent?: { imageId: string, imageSize: { width: number, height: number } }
  },
  dispatch: Dispatch<any>
) => {
  const kd = 'keyboardEvent' in someEvent
  const pt = 'clipboardPasteTextEvent' in someEvent
  const pi = 'clipboardPasteImageEvent' in someEvent

  const e = kd ? someEvent.keyboardEvent : { event: { ctrlKey: undefined, shiftKey: undefined, altKey: undefined } }
  const { key, code, which } = someEvent.keyboardEvent ? someEvent.keyboardEvent : { key: undefined, code: undefined, which: undefined }
  const { text } = someEvent.clipboardPasteTextEvent ? someEvent.clipboardPasteTextEvent : { text: '' }
  const { imageId, imageSize } = someEvent.clipboardPasteImageEvent ? someEvent.clipboardPasteImageEvent : { imageId: undefined, imageSize: undefined }

  const m = getMap()
  const editedNodeId = getEditedNodeId()

  const stateMachine = [
    [ kd, 0, ckm(e, '000') && key === 'F1',                   ['s', 'c'],             1, '',                         {}                              ],
    [ kd, 0, ckm(e, '000') && key === 'F2',                   ['s', 'c'],             1, 'startEdit',                {}                              ],
    [ kd, 0, ckm(e, '000') && key === 'F3',                   ['s', 'c'],             1, '',                         {}                              ],
    [ kd, 0, ckm(e, '000') && key === 'F5',                   ['s', 'c'],             0, '',                         {}                              ],
    [ kd, 0, ckm(e, '000') && key === 'Enter',                ['s'],                  1, 'insert_S_D',               {}                              ],
    [ kd, 0, ckm(e, '000') && key === 'Enter',                ['c'],                  1, 'select_C_IOUD',            {direction: Dir.D}              ],
    [ kd, 0, ckm(e, '010') && key === 'Enter',                ['s', 'c'],             1, 'insert_S_U',               {}                              ],
    [ kd, 0, ckm(e, '001') && key === 'Enter',                ['s'],                  1, 'cellify',                  {}                              ],
    [ kd, 0, ckm(e, '000') && ['Insert','Tab'].includes(key), ['s'],                  1, 'insert_S_O',               {}                              ],
    [ kd, 1, ckm(e, '000') && ['Insert','Tab'].includes(key), ['s', 'c'],             1, 'insert_S_O',               {}                              ],
    [ kd, 0, ckm(e, '000') && ['Insert','Tab'].includes(key), ['c'],                  1, 'select_C_IOUD',            {direction: Dir.O}              ],
    [ kd, 0, ckm(e, '000') && key === 'Delete',               ['s'],                  1, 'delete_S',                 {}                              ],
    [ kd, 0, ckm(e, '000') && key === 'Delete',               ['cr', 'cc'],           1, 'delete_CRCC',              {}                              ],
    [ kd, 0, ckm(e, '000') && code === 'Space',               ['s'],                  1, 'select_C_FF',              {}                              ],
    [ kd, 0, ckm(e, '000') && code === 'Space',               ['c'],                  1, 'select_S_F',               {}                              ],
    [ kd, 0, ckm(e, '000') && code === 'Space',               ['c'],                  1, '',                         {}                              ],
    [ kd, 0, ckm(e, '000') && code === 'Space',               ['cr', 'cc'],           1, 'select_C_F',               {}                              ],
    [ kd, 0, ckm(e, '000') && code === 'Backspace',           ['s'],                  1, 'select_C_B',               {}                              ],
    [ kd, 0, ckm(e, '000') && code === 'Backspace',           ['c', 'cr', 'cc'],      1, 'select_S_B',               {}                              ],
    [ kd, 0, ckm(e, '000') && code === 'Backspace',           ['c'],                  1, 'select_S_BB',              {}                              ],
    [ kd, 0, ckm(e, '000') && code === 'Escape',              ['s', 'c'],             1, 'select_R',                 {}                              ],
    [ kd, 0, ckm(e, '100') && code === 'KeyA',                ['s', 'c'],             1, 'select_all',               {}                              ],
    [ kd, 0, ckm(e, '100') && code === 'KeyM',                ['s', 'c'],             1, 'createMapInMapDialog',     {}                              ],
    [ kd, 0, ckm(e, '100') && code === 'KeyC',                ['s', 'c'],             1, 'copySelection',            {}                              ],
    [ kd, 0, ckm(e, '100') && code === 'KeyX',                ['s', 'c'],             1, 'cutSelection',             {}                              ],
    [ kd, 0, ckm(e, '100') && code === 'KeyZ',                ['s', 'c', 'cr', 'cc'], 1, 'redo',                     {}                              ],
    [ kd, 0, ckm(e, '100') && code === 'KeyY',                ['s', 'c', 'cr', 'cc'], 1, 'undo',                     {}                              ],
    [ kd, 0, ckm(e, '100') && code === 'KeyE',                ['s'],                  1, 'transpose',                {}                              ],
    [ kd, 0, ckm(e, '000') && [L,R,U,D].includes(which),      ['s'],                  1, 'select_S_IOUD',            {...c2dt(m, which), add: false} ],
    [ kd, 0, ckm(e, '000') && [L,R,U,D].includes(which),      ['c'],                  1, 'select_C_IOUD',            {...c2dt(m, which)}             ],
    [ kd, 0, ckm(e, '100') && [L,R,U,D].includes(which),      ['s'],                  1, 'move_S_IOUD',              {...c2dt(m, which)}             ],
    [ kd, 0, ckm(e, '010') && [L,R].includes(which),          ['s'],                  1, 'selectDescendantsOut',     {code}                          ],
    [ kd, 0, ckm(e, '010') && [L,R].includes(which),          ['c'],                  1, 'select_CR_IO',             {}                              ],
    [ kd, 0, ckm(e, '000') && [L,R].includes(which),          ['cc'],                 1, 'select_CC_UD',             {...c2dt(m, which)}             ],
    [ kd, 0, ckm(e, '001') && [L,R].includes(which),          ['c', 'cc'],            1, 'insert_CC_IO',             {...c2dt(m, which), b: false}   ],
    [ kd, 0, ckm(e, '001') && [L,R].includes(which),          ['c'],                  1, 'insert_CC_IO',             {...c2dt(m, which), b: true}    ],
    [ kd, 0, ckm(e, '100') && [L,R].includes(which),          ['cc'],                 1, 'move_CC_IO',               {...c2dt(m, which)}             ],
    [ kd, 0, ckm(e, '010') && [U,D].includes(which),          ['s'],                  1, 'select_S_IOUD',            {...c2dt(m, which), add: true}  ],
    [ kd, 0, ckm(e, '010') && [U,D].includes(which),          ['c'],                  1, 'select_CC_IO',             {}                              ],
    [ kd, 0, ckm(e, '000') && [U,D].includes(which),          ['cr'],                 1, 'select_CR_UD',             {...c2dt(m, which)}             ],
    [ kd, 0, ckm(e, '001') && [U,D].includes(which),          ['c', 'cr'],            1, 'insert_CR_UD',             {...c2dt(m, which), b: false}   ],
    [ kd, 0, ckm(e, '001') && [U,D].includes(which),          ['c'],                  1, 'insert_CR_UD',             {...c2dt(m, which), b: true}    ],
    [ kd, 0, ckm(e, '100') && [U,D].includes(which),          ['cr'],                 1, 'move_CR_UD',               {...c2dt(m, which)}             ],
    [ kd, 0, ckm(e, '100') && which >= 96 && which <= 105,    ['s', 'c'],             1, 'applyColorFromKey',        {currColor: which - 96}         ],
    [ kd, 0, ckm(e, '0-0') && which >= 48,                    ['s', 'c'],             0, 'setEditedNodeId',          {}                              ],
    [ pt, 0, text.substring(0, 1) === '[',                    ['s'],                  0, 'insertNodesFromClipboard', {text}                          ],
    [ pt, 0, text.substring(0, 2) === '\\[',                  ['s'],                  0, 'insert_S_O_equation',      {text}                          ],
    [ pt, 0, isUrl(text),                                     ['s'],                  0, 'insert_S_O_elink',         {text}                          ],
    [ pt, 0, true,                                            ['s'],                  0, 'insert_S_O_text',          {text}                          ],
    [ pt, 1, true,                                            ['s'],                  0, 'append_text',              {text}                          ],
    [ pi, 0, true,                                            ['s'],                  0, 'insert_S_O_image',         {imageId, imageSize}            ],

    // todo: div events

  ] as any[]
  for (let i = 0; i < stateMachine.length; i++) {
    const [ eventTypeCondition, isEditing, match, scope, preventDefault, action, payload ] = stateMachine[i]
    if (eventTypeCondition && !!isEditing === editedNodeId.length > 0 && match === true && scope.includes(m.g.sc.scope)) {
      if (preventDefault === 1 && kd) {
        someEvent.keyboardEvent && someEvent.keyboardEvent.preventDefault()
      }
      if (action === 'undo') {
        dispatch(actions.undo)
      } else if (action === 'redo') {
        dispatch(actions.redo)
      } else if (action === 'createMapInMapDialog') {
        // TODO
      } else if (action === 'setEditedNodeId') {
        dispatch(actions.setEditedNodeId(findEditedNodeId(m)))
      } else if (action === 'startEdit') {
        const nm = reCalc(m, mapReducer(copy(m), 'startEdit', {}))
        dispatch(actions.mutateMapStack(nm))
        dispatch(actions.mutateTempMap(nm))
        dispatch(actions.setEditedNodeId(findEditedNodeId(m)))
        dispatch(actions.setEditType('append'))

      } else if (action === 'finishEdit') {



      } else if (action === '') {

      } else if (action === '') {

      } else if (action === '') {

      } else if (action === '') {
        // do nothing
      } else {
        const nm = reCalc(m, mapReducer(copy(m), action as string, payload))
        dispatch(actions.mutateMapStack(nm))
        dispatch(actions.mutateTempMap({}))
      }
      break
    }
  }
}
