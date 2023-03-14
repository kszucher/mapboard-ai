import {M} from "../types/DefaultProps"
import {actions,  getMap} from "../core/EditorFlow"
import {isUrl} from "../core/Utils"
import {Dir} from "../core/Enums"
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

  const stateMachine = [
    [ kd, ckm(e, '000') && key === 'F1',                   ['s', 'c'],             1, '',                         {}                              ],
    [ kd, ckm(e, '000') && key === 'F2',                   ['s', 'c'],             1, 'startEditAppend',          {}                              ],
    [ kd, ckm(e, '000') && key === 'F3',                   ['s', 'c'],             1, '',                         {}                              ],
    [ kd, ckm(e, '000') && key === 'F5',                   ['s', 'c'],             0, '',                         {}                              ],
    [ kd, ckm(e, '000') && key === 'Enter',                ['s'],                  1, 'insert_S_D',               {}                              ],
    [ kd, ckm(e, '000') && key === 'Enter',                ['c'],                  1, 'select_C_IOUD',            {direction: Dir.D}              ],
    [ kd, ckm(e, '010') && key === 'Enter',                ['s', 'c'],             1, 'insert_S_U',               {}                              ],
    [ kd, ckm(e, '001') && key === 'Enter',                ['s'],                  1, 'cellify',                  {}                              ],
    [ kd, ckm(e, '000') && ['Insert','Tab'].includes(key), ['s'],                  1, 'insert_S_O',               {}                              ],
    [ kd, ckm(e, '000') && ['Insert','Tab'].includes(key), ['s', 'c'],             1, 'insert_S_O',               {}                              ],
    [ kd, ckm(e, '000') && ['Insert','Tab'].includes(key), ['c'],                  1, 'select_C_IOUD',            {direction: Dir.O}              ],
    [ kd, ckm(e, '000') && key === 'Delete',               ['s'],                  1, 'delete_S',                 {}                              ],
    [ kd, ckm(e, '000') && key === 'Delete',               ['cr', 'cc'],           1, 'delete_CRCC',              {}                              ],
    [ kd, ckm(e, '000') && code === 'Space',               ['s'],                  1, 'select_C_FF',              {}                              ],
    [ kd, ckm(e, '000') && code === 'Space',               ['c'],                  1, 'select_S_F',               {}                              ],
    [ kd, ckm(e, '000') && code === 'Space',               ['c'],                  1, '',                         {}                              ],
    [ kd, ckm(e, '000') && code === 'Space',               ['cr', 'cc'],           1, 'select_C_F',               {}                              ],
    [ kd, ckm(e, '000') && code === 'Backspace',           ['s'],                  1, 'select_C_B',               {}                              ],
    [ kd, ckm(e, '000') && code === 'Backspace',           ['c', 'cr', 'cc'],      1, 'select_S_B',               {}                              ],
    [ kd, ckm(e, '000') && code === 'Backspace',           ['c'],                  1, 'select_S_BB',              {}                              ],
    [ kd, ckm(e, '000') && code === 'Escape',              ['s', 'c'],             1, 'select_R',                 {}                              ],
    [ kd, ckm(e, '100') && code === 'KeyA',                ['s', 'c'],             1, 'select_all',               {}                              ],
    [ kd, ckm(e, '100') && code === 'KeyM',                ['s', 'c'],             1, 'createMapInMapDialog',     {}                              ],
    [ kd, ckm(e, '100') && code === 'KeyC',                ['s', 'c'],             1, 'copySelection',            {}                              ],
    [ kd, ckm(e, '100') && code === 'KeyX',                ['s', 'c'],             1, 'cutSelection',             {}                              ],
    [ kd, ckm(e, '100') && code === 'KeyZ',                ['s', 'c', 'cr', 'cc'], 1, 'redo',                     {}                              ],
    [ kd, ckm(e, '100') && code === 'KeyY',                ['s', 'c', 'cr', 'cc'], 1, 'undo',                     {}                              ],
    [ kd, ckm(e, '100') && code === 'KeyE',                ['s'],                  1, 'transpose',                {}                              ],
    [ kd, ckm(e, '000') && [L,R,U,D].includes(which),      ['s'],                  1, 'select_S_IOUD',            {...c2dt(m, which), add: false} ],
    [ kd, ckm(e, '000') && [L,R,U,D].includes(which),      ['c'],                  1, 'select_C_IOUD',            {...c2dt(m, which)}             ],
    [ kd, ckm(e, '100') && [L,R,U,D].includes(which),      ['s'],                  1, 'move_S_IOUD',              {...c2dt(m, which)}             ],
    [ kd, ckm(e, '000') && [L,R].includes(which),          ['cc'],                 1, 'select_CC_UD',             {...c2dt(m, which)}             ],
    [ kd, ckm(e, '100') && [L,R].includes(which),          ['cc'],                 1, 'move_CC_IO',               {...c2dt(m, which)}             ],
    [ kd, ckm(e, '010') && [L,R].includes(which),          ['s'],                  1, 'selectDescendantsOut',     {code}                          ],
    [ kd, ckm(e, '010') && [L,R].includes(which),          ['c'],                  1, 'select_CR_IO',             {}                              ],
    [ kd, ckm(e, '001') && [L,R].includes(which),          ['c', 'cc'],            1, 'insert_CC_IO',             {...c2dt(m, which), b: false}   ],
    [ kd, ckm(e, '001') && [L,R].includes(which),          ['c'],                  1, 'insert_CC_IO',             {...c2dt(m, which), b: true}    ],
    [ kd, ckm(e, '000') && [U,D].includes(which),          ['cr'],                 1, 'select_CR_UD',             {...c2dt(m, which)}             ],
    [ kd, ckm(e, '100') && [U,D].includes(which),          ['cr'],                 1, 'move_CR_UD',               {...c2dt(m, which)}             ],
    [ kd, ckm(e, '010') && [U,D].includes(which),          ['s'],                  1, 'select_S_IOUD',            {...c2dt(m, which), add: true}  ],
    [ kd, ckm(e, '010') && [U,D].includes(which),          ['c'],                  1, 'select_CC_IO',             {}                              ],
    [ kd, ckm(e, '001') && [U,D].includes(which),          ['c', 'cr'],            1, 'insert_CR_UD',             {...c2dt(m, which), b: false}   ],
    [ kd, ckm(e, '001') && [U,D].includes(which),          ['c'],                  1, 'insert_CR_UD',             {...c2dt(m, which), b: true}    ],
    [ kd, ckm(e, '100') && which >= 96 && which <= 105,    ['s', 'c'],             1, 'applyColorFromKey',        {currColor: which - 96}         ],
    [ kd, ckm(e, '0-0') && which >= 48,                    ['s', 'c'],             0, 'startEditReplace',         {}                              ],
    [ pt, text.substring(0, 1) === '[',                    ['s'],                  0, 'insertNodesFromClipboard', {text}                          ],
    [ pt, text.substring(0, 2) === '\\[',                  ['s'],                  0, 'insert_S_O_equation',      {text}                          ],
    [ pt, isUrl(text),                                     ['s'],                  0, 'insert_S_O_elink',         {text}                          ],
    [ pt, true,                                            ['s'],                  0, 'insert_S_O_text',          {text}                          ],
    // [ pt, true,                                            ['s'],                  0, 'append_text',              {text}                          ],
    [ pi, true,                                            ['s'],                  0, 'insert_S_O_image',         {imageId, imageSize}            ],
  ] as any[]
  for (let i = 0; i < stateMachine.length; i++) {
    const [ eventTypeCondition, match, scope, preventDefault, type, payload ] = stateMachine[i]
    if (eventTypeCondition && match === true && scope.includes(m.g.sc.scope)) {
      if (preventDefault === 1 && kd) {
        someEvent.keyboardEvent && someEvent.keyboardEvent.preventDefault()
      }
      if (type === 'undo') {
        dispatch(actions.undo())
      } else if (type === 'redo') {
        dispatch(actions.redo())
      } else if (type === 'createMapInMapDialog') {
        // TODO
      } else if (type === 'startEditReplace') {
        dispatch(actions.startEditReplace())
      } else if (type === 'startEditAppend') {
        dispatch(actions.startEditAppend())
      } else if (type === '') {
        // do nothing
      } else {
        dispatch(actions.genericMapAction({type, payload}))
      }
      break
    }
  }
}
