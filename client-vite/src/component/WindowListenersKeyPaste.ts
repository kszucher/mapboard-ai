import {actions} from "../editor/EditorReducer"
import {isUrl} from "../core/Utils"
import {Dir} from "../core/Enums"
import {Dispatch} from "react";
import {getMap} from "../state/EditorState";
import {
  getLS,
  isCellColSelected,
  isCellRowSelected,
  isCellSelected,
  isDirStructSelected,
  isRootSelected,
  isStructSelected
} from "../map/MapUtils";
import {getDir} from "./MapSvgUtils";

const ckm = (e: any, condition: string) => (
  ['-', (+e.ctrlKey ? '1' : '0')].includes(condition[0]) &&
  ['-', (+e.shiftKey ? '1' : '0')].includes(condition[1]) &&
  ['-', (+e.altKey) ? '1' : '0'].includes(condition[2])
)

// const c2dt = (m: M, which: number) => {
//   const ls = getLS(m)
//   let dir
//   if (which === R) {
//     if (ls.path.length === 2) {dir = Dir.OR}
//     else if (ls.path.length === 6) {dir = ls.path[3] ? Dir.IR : Dir.O}
//     else {dir = ls.path[3] ? Dir.I : Dir.O}
//   } else if (which === L) {
//     if (ls.path.length === 2) {dir = Dir.OL}
//     else if (ls.path.length === 6) {dir = ls.path[3] ? Dir.O : Dir.IL}
//     else {dir = ls.path[3] ? Dir.O : Dir.I}
//   } else if (which === U) {
//     dir = Dir.U
//   } else if (which === D) {
//     dir = Dir.D
//   }
//   return { dir }
// }

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
  const dir = getDir(getLS(m))
  const dr = dir === 1
  const dl = dir === -1
  const r = isRootSelected(m)
  const s = isStructSelected(m)
  const ds = isDirStructSelected(m)
  const c = isCellSelected(m)
  const cr = isCellRowSelected(m)
  const cc = isCellColSelected(m)
  const ls = getLS(m)

  // console.log(code)
  // console.log({dl, dr, r, s, ds, c, cr, cc})

  const stateMachine = [
    [ kd, ckm(e, '000') && key === 'F1',                   true, s || c,          0, '',                         {},                              1 ],
    [ kd, ckm(e, '000') && key === 'F2',                   true, s || c,          1, 'startEditAppend',          {},                              1 ],
    [ kd, ckm(e, '000') && key === 'F3',                   true, s || c,          0, '',                         {},                              1 ],
    [ kd, ckm(e, '000') && key === 'F5',                   true, s || c,          0, '',                         {},                              0 ],
    [ kd, ckm(e, '000') && key === 'Enter',                true, s,               1, 'insert_S_D',               {},                              1 ],
    [ kd, ckm(e, '000') && key === 'Enter',                true, c && !cr && !cc, 1, 'select_C_IOUD',            {dir: Dir.D},                    1 ],
    [ kd, ckm(e, '010') && key === 'Enter',                true, s || c,          1, 'insert_S_U',               {},                              1 ],
    [ kd, ckm(e, '001') && key === 'Enter',                true, s,               1, 'cellify',                  {},                              1 ],
    [ kd, ckm(e, '000') && ['Insert','Tab'].includes(key), true, s,               1, 'insert_S_O',               {},                              1 ],
    [ kd, ckm(e, '000') && ['Insert','Tab'].includes(key), true, s || c,          1, 'insert_S_O',               {},                              1 ],
    [ kd, ckm(e, '000') && ['Insert','Tab'].includes(key), true, c && !cr && !cc, 1, 'select_C_IOUD',            {dir: Dir.O},                    1 ],
    [ kd, ckm(e, '000') && key === 'Delete',               true, s,               1, 'delete_S',                 {},                              1 ],
    [ kd, ckm(e, '000') && key === 'Delete',               true, cr || cc,        1, 'delete_CRCC',              {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Space',               true, s,               1, 'select_C_FF',              {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Space',               true, c && !cr && !cc, 1, 'select_S_F',               {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Space',               true, cr,              1, 'select_C_F_firstCol',      {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Space',               true, cc,              1, 'select_C_F_firstRow',      {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Backspace',           true, s,               1, 'select_C_B',               {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Backspace',           true, c,               1, 'select_S_B',               {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Backspace',           true, c,               1, 'select_S_BB',              {},                              1 ],
    [ kd, ckm(e, '000') && code === 'Escape',              true, s || c,          1, 'select_R',                 {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyA',                true, true,            1, 'select_all',               {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyM',                true, s || c,          0, 'createMapInMapDialog',     {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyC',                true, s || c,          1, 'copySelection',            {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyX',                true, s || c,          1, 'cutSelection',             {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyZ',                true, true,            0, 'redo',                     {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyY',                true, true,            0, 'undo',                     {},                              1 ],
    [ kd, ckm(e, '100') && code === 'KeyE',                true, s,               1, 'transpose',                {},                              1 ],

    [ kd, ckm(e, '000') && code === 'ArrowRight',          true, r,               1, 'select_S_OR',              {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowRight',          dr, s,                 1, 'select_S_O',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowRight',          dl, s,                 1, 'select_S_I',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowRight',          true, c && !cc,        1, 'select_C_R',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowRight',          true, cc,              1, 'select_CC_R',              {}, 1                              ], // ok
    [ kd, ckm(e, '100') && code === 'ArrowRight',          dr, s,                 1, 'move_S_O',                 {}, 1                              ],
    [ kd, ckm(e, '100') && code === 'ArrowRight',          dl, s,                 1, 'move_S_I',                 {}, 1                              ],
    [ kd, ckm(e, '010') && code === 'ArrowRight',          true, r,               1, 'select_S_family_OR',       {}, 1                              ], // ok
    [ kd, ckm(e, '010') && code === 'ArrowRight',          dr, s && ls.sCount,    1, 'select_S_family_O',        {}, 1                              ], // ok
    [ kd, ckm(e, '010') && code === 'ArrowRight',          true, c,               1, 'select_CR_SAME',           {}, 1                              ], // ok

    [ kd, ckm(e, '000') && code === 'ArrowLeft',           true, r,               1, 'select_S_OL',              {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowLeft',           dr, s,                 1, 'select_S_I',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowLeft',           dl, s,                 1, 'select_S_O',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowLeft',           true, c && !cc,        1, 'select_C_L',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowLeft',           true, cc,              1, 'select_CC_L',              {}, 1                              ], // ok
    [ kd, ckm(e, '100') && code === 'ArrowLeft',           dr, s,                 1, 'move_S_I',                 {}, 1                              ],
    [ kd, ckm(e, '100') && code === 'ArrowLeft',           dl, s,                 1, 'move_S_O',                 {}, 1                              ],
    [ kd, ckm(e, '010') && code === 'ArrowLeft',           true, r,               1, 'select_S_family_OL',       {}, 1                              ], // ok
    [ kd, ckm(e, '010') && code === 'ArrowLeft',           dl, s && ls.sCount,    1, 'select_S_family_O',        {}, 1                              ], // ok
    [ kd, ckm(e, '010') && code === 'ArrowLeft',           true, c,               1, 'select_CR_SAME',           {}, 1                              ], // ok

    [ kd, ckm(e, '000') && code === 'ArrowUp',             true, s,               1, 'select_S_U',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowUp',             true, c && !cr,        1, 'select_C_U',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowUp',             true, cr,              1, 'select_CR_U',              {}, 1                              ], // ok
    [ kd, ckm(e, '100') && code === 'ArrowUp',             dr, s,                 1, 'move_S_I',                 {}, 1                              ],
    [ kd, ckm(e, '100') && code === 'ArrowUp',             dl, s,                 1, 'move_S_O',                 {}, 1                              ],
    [ kd, ckm(e, '010') && code === 'ArrowUp',             true, c,               1, 'select_CC_SAME',           {}, 1                              ], // ok

    [ kd, ckm(e, '000') && code === 'ArrowDown',           true, s,               1, 'select_S_D',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowDown',           true, c && !cr,        1, 'select_C_D',               {}, 1                              ], // ok
    [ kd, ckm(e, '000') && code === 'ArrowDown',           true, cr,              1, 'select_CR_D',              {}, 1                              ], // ok
    [ kd, ckm(e, '100') && code === 'ArrowDown',           dr, s,                 1, 'move_S_I',                 {}, 1                              ],
    [ kd, ckm(e, '100') && code === 'ArrowDown',           dl, s,                 1, 'move_S_O',                 {}, 1                              ],
    [ kd, ckm(e, '010') && code === 'ArrowDown',           true, c,               1, 'select_CC_SAME',           {}, 1                              ], // ok

    // [ kd, ckm(e, '000') && [L,R,U,D].includes(which),      true, c && !cr && !cc, 1, 'select_C_IOUD',            {...c2dt(m, which)},             1 ],
    // [ kd, ckm(e, '100') && [L,R,U,D].includes(which),      true, s,               1, 'move_S_IOUD',              {...c2dt(m, which)},             1 ],
    // [ kd, ckm(e, '000') && [L,R].includes(which),          true, cc,              1, 'select_CC_IO',             {...c2dt(m, which)},             1 ],
    // [ kd, ckm(e, '100') && [L,R].includes(which),          true, cc,              1, 'move_CC_IO',               {...c2dt(m, which)},             1 ],
    // [ kd, ckm(e, '010') && [L,R].includes(which),          true, s,               1, 'selectDescendantsOut',     {...c2dt(m, which)},             1 ],
    // [ kd, ckm(e, '010') && [L,R].includes(which),          true, c,               1, 'select_CR_SAME',           {},                              1 ],
    // [ kd, ckm(e, '001') && [L,R].includes(which),          true, c, cc,           1, 'insert_CC_IO',             {...c2dt(m, which), b: false},   1 ],
    // [ kd, ckm(e, '001') && [L,R].includes(which),          true, c,               1, 'insert_CC_IO',             {...c2dt(m, which), b: true},    1 ],
    // [ kd, ckm(e, '000') && [U].includes(which),            true, cr,              1, 'select_CR_U',              {...c2dt(m, which)},             1 ],
    // [ kd, ckm(e, '000') && [D].includes(which),            true, cr,              1, 'select_CR_D' ,             {...c2dt(m, which)},             1 ],
    // [ kd, ckm(e, '100') && [U,D].includes(which),          true, cr,              1, 'move_CR_UD',               {...c2dt(m, which)},             1 ],
    // [ kd, ckm(e, '010') && [U,D].includes(which),          true, s,               1, 'select_S_IOUD',            {...c2dt(m, which), add: true},  1 ],
    // [ kd, ckm(e, '010') && [U,D].includes(which),          true, c,               1, 'select_CC_SAME',           {},                              1 ],
    // [ kd, ckm(e, '001') && [U,D].includes(which),          true, c || cr,         1, 'insert_CR_UD',             {...c2dt(m, which), b: false},   1 ],
    // [ kd, ckm(e, '001') && [U,D].includes(which),          true, c,               1, 'insert_CR_UD',             {...c2dt(m, which), b: true},    1 ],
    [ kd, ckm(e, '100') && which >= 96 && which <= 105,    true, s || c,          1, 'applyColorFromKey',        {currColor: which - 96},         1 ],
    [ kd, ckm(e, '0-0') && which >= 48,                    true, s || c,          1, 'startEditReplace',         {},                              0 ],
    [ pt, text.substring(0, 1) === '[',                    true, s,               1, 'insertNodesFromClipboard', {text},                          0 ],
    [ pt, text.substring(0, 2) === '\\[',                  true, s,               1, 'insert_S_O_equation',      {text},                          0 ],
    [ pt, isUrl(text),                                     true, s,               1, 'insert_S_O_elink',         {text},                          0 ],
    [ pt, true,                                            true, s,               1, 'insert_S_O_text',          {text},                          0 ],
    [ pi, true,                                            true, s,               1, 'insert_S_O_image',         {imageId, imageSize},            0 ],
  ] as any[]
  for (let i = 0; i < stateMachine.length; i++) {
    const [ eventTypeCondition, match, dirMatch, scopeMatch, isMapAction, type, payload, preventDefault ] = stateMachine[i]
    if (eventTypeCondition && match && dirMatch && scopeMatch) {
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
