import {actions} from "../editor/EditorReducer"
import {isUrl} from "../core/Utils"
import {Dispatch} from "react"
import {getMap} from "../state/EditorState"
import {getX, isCCXA, isCRXA, isCX, isDSX, isRX, isSX, isSXAVN, isCXR, isCXL, isCXB, isCXT, sortPath, getCountSXAU, getCountSXAD} from "../map/MapUtils"
import {getDir} from "./MapSvgUtils"

const ckm = (e: any, condition: string) => (
  [(+e.ctrlKey ? 'c' : '-')].includes(condition[0]) &&
  [(+e.shiftKey ? 's' : '-')].includes(condition[1]) &&
  [(+e.altKey) ? 'a' : '-'].includes(condition[2])
)

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

  const m = structuredClone((getMap())).sort(sortPath)
  const ls = getX(m)
  const dir = getDir(getX(m))
  const dr = dir === 1
  const dl = dir === -1
  const r = isRX(m) // hasS?
  const s = isSX(m)
  const ds = isDSX(m)
  const sxavn = isSXAVN(m)
  const c = isCX(m)
  const cr = isCRXA(m)
  const cc = isCCXA(m)
  const cxb = isCXB(m)
  const cxt = isCXT(m)
  const cxr = isCXR(m)
  const cxl = isCXL(m)
  const sxad = getCountSXAD(m)
  const sxau = getCountSXAU(m)

  console.log({c,cr,cc, sxavn})

  const stateMachine = [
    [ kd, ckm(e, '---') && key === 'F1',                   true,  true,            0, '',                         {}, 1 ],
    [ kd, ckm(e, '---') && key === 'F2',                   true,  r || s || c,     1, 'startEditAppend',          {}, 1 ],
    [ kd, ckm(e, '---') && key === 'F3',                   true,  true,            0, '',                         {}, 1 ],
    [ kd, ckm(e, '---') && key === 'F5',                   true,  true,            0, '',                         {}, 0 ],
    [ kd, ckm(e, '---') && key === 'Enter',                true,  s,               1, 'insert_S_D',               {}, 1 ],
    [ kd, ckm(e, '---') && key === 'Enter',                true,  c,               1, 'select_C_D',               {}, 1 ],
    [ kd, ckm(e, '-s-') && key === 'Enter',                true,  s,               1, 'insert_S_U',               {}, 1 ],
    [ kd, ckm(e, '--a') && key === 'Enter',                true,  s,               1, 'cellify',                  {}, 1 ],
    [ kd, ckm(e, '---') && ['Insert','Tab'].includes(key), true,  s,               1, 'insert_S_O',               {}, 1 ],
    [ kd, ckm(e, '---') && ['Insert','Tab'].includes(key), true,  c,               1, 'select_C_O',               {}, 1 ],
    [ kd, ckm(e, '---') && key === 'Delete',               true,  s,               1, 'delete_S',                 {}, 1 ],
    [ kd, ckm(e, '---') && key === 'Delete',               true,  cr,              1, 'delete_CR',                {}, 1 ],
    [ kd, ckm(e, '---') && key === 'Delete',               true,  cc,              1, 'delete_CC',                {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Space',               true,  s,               1, 'select_C_FF',              {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Space',               true,  c,               1, 'select_S_F',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Space',               true,  cr,              1, 'select_C_F_firstCol',      {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Space',               true,  cc,              1, 'select_C_F_firstRow',      {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Backspace',           true,  s,               1, 'select_C_B',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Backspace',           true,  c || cr || cc,   1, 'select_S_B',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Escape',              true,  true,            1, 'select_R',                 {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyA',                true,  true,            1, 'select_all',               {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyM',                true,  true,            0, 'createMapInMapDialog',     {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyC',                true,  s,               1, 'copySelection',            {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyX',                true,  s,               1, 'cutSelection',             {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyZ',                true,  true,            0, 'redo',                     {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyY',                true,  true,            0, 'undo',                     {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyE',                true,  s,               1, 'transpose',                {}, 1 ],

    [ kd, ckm(e, '---') && code === 'ArrowDown',           true,  s,               1, 'select_S_D',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowDown',           true,  c && !cxb,       1, 'select_C_D',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowDown',           true,  cr && !cxb,      1, 'select_CR_D',              {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowDown',           true,  sxavn && !sxad,  1, 'move_S_T',                 {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowDown',           true,  sxavn && sxad,   1, 'move_S_D',                 {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowDown',           true,  cr && !cxb,      1, 'move_CR_D',                {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowDown',           true,  s,               1, 'select_S_D_too',           {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowDown',           true,  c,               1, 'select_CC_SAME',           {}, 1 ],
    [ kd, ckm(e, '--a') && code === 'ArrowDown',           true,  cr,              1, 'insert_CR_D',              {}, 1 ],

    [ kd, ckm(e, '---') && code === 'ArrowUp',             true,  s,               1, 'select_S_U',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowUp',             true,  c && !cxt,       1, 'select_C_U',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowUp',             true,  cr && !cxt,      1, 'select_CR_U',              {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowUp',             true,  sxavn && !sxau,  1, 'move_S_B',                 {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowUp',             true,  sxavn && sxau,   1, 'move_S_U',                 {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowUp',             true,  cr && !cxt,      1, 'move_CR_U',                {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowUp',             true,  s,               1, 'select_S_U_too',           {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowUp',             true,  c,               1, 'select_CC_SAME',           {}, 1 ],
    [ kd, ckm(e, '--a') && code === 'ArrowUp',             true,  cr,              1, 'insert_CR_U',              {}, 1 ],

    [ kd, ckm(e, '---') && code === 'ArrowRight',          true,  r,               1, 'select_S_OR',              {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowRight',          dr,    s,               1, 'select_S_O',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowRight',          dl,    s,               1, 'select_S_I',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowRight',          true,  c && !cxr,       1, 'select_C_R',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowRight',          true,  cc && !cxr,      1, 'select_CC_R',              {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowRight',          dr,    sxavn && sxau,   1, 'move_S_O',                 {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowRight',          dl,    sxavn && !ds,    1, 'move_S_I',                 {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowRight',          dl,    sxavn && ds,     1, 'move_S_I_L',               {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowRight',          true,  cc && !cxr,      1, 'move_CC_R',                {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowRight',          true,  r,               1, 'select_S_family_OR',       {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowRight',          dr,    s && ls.sCount,  1, 'select_S_family_O',        {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowRight',          true,  c,               1, 'select_CR_SAME',           {}, 1 ],
    [ kd, ckm(e, '--a') && code === 'ArrowRight',          true,  cc,              1, 'insert_CC_R',              {}, 1 ],

    [ kd, ckm(e, '---') && code === 'ArrowLeft',           true,  r,               1, 'select_S_OL',              {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowLeft',           dr,    s,               1, 'select_S_I',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowLeft',           dl,    s,               1, 'select_S_O',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowLeft',           true,  c && !cxl,       1, 'select_C_L',               {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowLeft',           true,  cc && !cxl,      1, 'select_CC_L',              {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowLeft',           dr,    sxavn && !ds,    1, 'move_S_I',                 {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowLeft',           dr,    sxavn && ds,     1, 'move_S_I_R',               {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowLeft',           dl,    sxavn && sxau,   1, 'move_S_O',                 {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowLeft',           true,  cc && !cxl,      1, 'move_CC_L',                {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowLeft',           true,  r,               1, 'select_S_family_OL',       {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowLeft',           dl,    s && ls.sCount,  1, 'select_S_family_O',        {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowLeft',           true,  c,               1, 'select_CR_SAME',           {}, 1 ],
    [ kd, ckm(e, '--a') && code === 'ArrowLeft',           true,  cc,              1, 'insert_CC_L',              {}, 1 ],

    [ kd, ckm(e, 'c--') && which >= 96 && which <= 105,    true,  s,               1, 'applyColorFromKey',        {currColor: which - 96}, 1 ],
    [ kd, ckm(e, '---') && which >= 48,                    true,  s || c,          1, 'startEditReplace',         {}, 0 ],
    [ kd, ckm(e, '-s-') && which >= 48,                    true,  s || c,          1, 'startEditReplace',         {}, 0 ],
    [ pt, text.substring(0, 1) === '[',                    true,  s,               1, 'insertNodesFromClipboard', {text}, 0 ],
    [ pt, text.substring(0, 2) === '\\[',                  true,  s,               1, 'insert_S_O_equation',      {text}, 0 ],
    [ pt, isUrl(text),                                     true,  s,               1, 'insert_S_O_elink',         {text}, 0 ],
    [ pt, true,                                            true,  s,               1, 'insert_S_O_text',          {text}, 0 ],
    [ pi, true,                                            true,  s,               1, 'insert_S_O_image',         {imageId, imageSize}, 0 ],
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
