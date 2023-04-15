import {actions} from "../editor/EditorReducer"
import {isUrl} from "../core/Utils"
import {Dir} from "../core/Enums"
import {Dispatch} from "react";
import {M} from "../state/MTypes"
import {getMap} from "../state/EditorState";
import {getG, getLS, isCellRowSelected, isCellSelected, isStructSelected} from "../map/MapUtils";

const { L, U, R, D } = { L: 37, U: 38, R: 39, D: 40 }

const ckm = (e: any, condition: string) => (
  ['-', (+e.ctrlKey ? '1' : '0')].includes(condition[0]) &&
  ['-', (+e.shiftKey ? '1' : '0')].includes(condition[1]) &&
  ['-', (+e.altKey) ? '1' : '0'].includes(condition[2])
)

const c2dt = (m: M, which: number) => {
  const ls = getLS(m)
  let dir
  if (which === R) {
    if (ls.path.length === 2) {dir = Dir.OR}
    else if (ls.path.length === 6) {dir = ls.path[3] ? Dir.IR : Dir.O}
    else {dir = ls.path[3] ? Dir.I : Dir.O}
  } else if (which === L) {
    if (ls.path.length === 2) {dir = Dir.OL}
    else if (ls.path.length === 6) {dir = ls.path[3] ? Dir.O : Dir.IL}
    else {dir = ls.path[3] ? Dir.O : Dir.I}
  } else if (which === U) {
    dir = Dir.U
  } else if (which === D) {
    dir = Dir.D
  }
  return { dir }
}

export const windowListenersKeyPaste = (
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
  const g = getG(m)

  const stateMachine = [
    [ kd, ckm(e, '000') && key === 'F1',                   ['s', 'c'],             0, '',                         {},                              1 ],
    [ kd, ckm(e, '000') && key === 'F2',                   ['s', 'c'],             1, 'startEditAppend',          {},                              1 ],
    [ kd, ckm(e, '000') && key === 'F3',                   ['s', 'c'],             0, '',                         {},                              1 ],
    [ kd, ckm(e, '000') && key === 'F5',                   ['s', 'c'],             0, '',                         {},                              0 ],
    [ kd, ckm(e, '000') && key === 'Enter',                ['s'],                  1, 'insert_S_D',               {},                              1 ],
    [ kd, ckm(e, '000') && key === 'Enter',                ['c'],                  1, 'select_C_IOUD',            {dir: Dir.D},              1 ],
    [ kd, ckm(e, '010') && key === 'Enter',                ['s', 'c'],             1, 'insert_S_U',               {},                              1 ],
    [ kd, ckm(e, '001') && key === 'Enter',                ['s'],                  1, 'cellify',                  {},                              1 ],
    [ kd, ckm(e, '000') && ['Insert','Tab'].includes(key), ['s'],                  1, 'insert_S_O',               {},                              1 ],
    [ kd, ckm(e, '000') && ['Insert','Tab'].includes(key), ['s', 'c'],             1, 'insert_S_O',               {},                              1 ],
    [ kd, ckm(e, '000') && ['Insert','Tab'].includes(key), ['c'],                  1, 'select_C_IOUD',            {dir: Dir.O},              1 ],
    [ kd, ckm(e, '000') && key === 'Delete',               ['s'],                  1, 'delete_S',                 {},                              1 ],
    [ kd, ckm(e, '000') && key === 'Delete',               ['cr', 'cc'],           1, 'delete_CRCC',              {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Space',               ['s'],                  1, 'select_C_FF',              {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Space',               ['c'],                  1, 'select_S_F',               {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Space',               ['c'],                  0, '',                         {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Space',               ['cr', 'cc'],           1, 'select_C_F',               {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Backspace',           ['s'],                  1, 'select_C_B',               {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Backspace',           ['c', 'cr', 'cc'],      1, 'select_S_B',               {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Backspace',           ['c'],                  1, 'select_S_BB',              {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Escape',              ['s', 'c'],             1, 'select_R',                 {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyA',                ['s', 'c'],             1, 'select_all',               {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyM',                ['s', 'c'],             0, 'createMapInMapDialog',     {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyC',                ['s', 'c'],             1, 'copySelection',            {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyX',                ['s', 'c'],             1, 'cutSelection',             {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyZ',                ['s', 'c', 'cr', 'cc'], 0, 'redo',                     {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyY',                ['s', 'c', 'cr', 'cc'], 0, 'undo',                     {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyE',                ['s'],                  1, 'transpose',                {},                              1 ],
    [ kd, ckm(e, '000') && [L,R,U,D].includes(which),      ['s'],                  1, 'select_S_IOUD',            {...c2dt(m, which), add: false}, 1 ],
    [ kd, ckm(e, '000') && [L,R,U,D].includes(which),      ['c'],                  1, 'select_C_IOUD',            {...c2dt(m, which)},             1 ],
    [ kd, ckm(e, '100') && [L,R,U,D].includes(which),      ['s'],                  1, 'move_S_IOUD',              {...c2dt(m, which)},             1 ],
    [ kd, ckm(e, '000') && [L,R].includes(which),          ['cc'],                 1, 'select_CC_IO',             {...c2dt(m, which)},             1 ],
    [ kd, ckm(e, '100') && [L,R].includes(which),          ['cc'],                 1, 'move_CC_IO',               {...c2dt(m, which)},             1 ],
    [ kd, ckm(e, '010') && [L,R].includes(which),          ['s'],                  1, 'selectDescendantsOut',     {...c2dt(m, which)},             1 ],
    [ kd, ckm(e, '010') && [L,R].includes(which),          ['c'],                  1, 'select_CR_SAME',           {},                              1 ],
    [ kd, ckm(e, '001') && [L,R].includes(which),          ['c', 'cc'],            1, 'insert_CC_IO',             {...c2dt(m, which), b: false},   1 ],
    [ kd, ckm(e, '001') && [L,R].includes(which),          ['c'],                  1, 'insert_CC_IO',             {...c2dt(m, which), b: true},    1 ],
    [ kd, ckm(e, '000') && [U,D].includes(which),          ['cr'],                 1, 'select_CR_UD',             {...c2dt(m, which)},             1 ],
    [ kd, ckm(e, '100') && [U,D].includes(which),          ['cr'],                 1, 'move_CR_UD',               {...c2dt(m, which)},             1 ],
    [ kd, ckm(e, '010') && [U,D].includes(which),          ['s'],                  1, 'select_S_IOUD',            {...c2dt(m, which), add: true},  1 ],
    [ kd, ckm(e, '010') && [U,D].includes(which),          ['c'],                  1, 'select_CC_SAME',           {},                              1 ],
    [ kd, ckm(e, '001') && [U,D].includes(which),          ['c', 'cr'],            1, 'insert_CR_UD',             {...c2dt(m, which), b: false},   1 ],
    [ kd, ckm(e, '001') && [U,D].includes(which),          ['c'],                  1, 'insert_CR_UD',             {...c2dt(m, which), b: true},    1 ],
    [ kd, ckm(e, '100') && which >= 96 && which <= 105,    ['s', 'c'],             1, 'applyColorFromKey',        {currColor: which - 96},         1 ],
    [ kd, ckm(e, '0-0') && which >= 48,                    ['s', 'c'],             1, 'startEditReplace',         {},                              0 ],
    [ pt, text.substring(0, 1) === '[',                    ['s'],                  1, 'insertNodesFromClipboard', {text},                          0 ],
    [ pt, text.substring(0, 2) === '\\[',                  ['s'],                  1, 'insert_S_O_equation',      {text},                          0 ],
    [ pt, isUrl(text),                                     ['s'],                  1, 'insert_S_O_elink',         {text},                          0 ],
    [ pt, true,                                            ['s'],                  1, 'insert_S_O_text',          {text},                          0 ],
    [ pi, true,                                            ['s'],                  1, 'insert_S_O_image',         {imageId, imageSize},            0 ],
  ] as any[]
  for (let i = 0; i < stateMachine.length; i++) {
    const [ eventTypeCondition, match, scope, isMapAction, type, payload, preventDefault ] = stateMachine[i]
    let realScope
    if (isStructSelected(m)) {
      realScope = 's'
    } else if (isCellSelected(m)) {
      realScope = 'c'
      if (isCellRowSelected(m))
        realScope = 'cr'
      if (isCellSelected(m))
        realScope = 'cc'
    }
    if (eventTypeCondition && match === true && scope.includes(realScope)) {
      if (preventDefault === 1 && kd) {
        someEvent.keyboardEvent && someEvent.keyboardEvent.preventDefault()
      }
      if (type.length) {
        if (isMapAction) {
          dispatch(actions.mapAction({type, payload}))
        } else {
          dispatch({type: 'editor/' + type, payload})
        }
      }
      break
    }
  }
}
