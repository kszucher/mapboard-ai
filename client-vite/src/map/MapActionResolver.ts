import {SyntheticEvent} from "react"
import {isUrl} from "../core/Utils"
import {getMap} from "../state/EditorState"
import {getX, isCCXA, isCRXA, isCX, isDSX, isRX, isSX, isSXAVN, isCXR, isCXL, isCXB, isCXT, sortPath, getCountSXAU, getCountSXAD} from "./MapUtils"
import {getDir} from "../component/MapSvgUtils"

const ckm = (e: any, condition: string) => (
  [(+e.ctrlKey ? 'c' : '-')].includes(condition[0]) &&
  [(+e.shiftKey ? 's' : '-')].includes(condition[1]) &&
  [(+e.altKey) ? 'a' : '-'].includes(condition[2])
)

export const mapActionResolver = (
  someEvent: {
    syntheticEvent?: SyntheticEvent
    keyboardEvent?: KeyboardEvent | { key: any, code: any, which: any, preventDefault: Function }
    clipboardPasteTextEvent?: { text: string }
    clipboardPasteImageEvent?: { imageId: string, imageSize: { width: number, height: number } }
    componentEvent?: { type: string, payload: any}
  }): {type: string, payload: any} => {
  const se = 'mouseEvent' in someEvent
  const kd = 'keyboardEvent' in someEvent
  const pt = 'clipboardPasteTextEvent' in someEvent
  const pi = 'clipboardPasteImageEvent' in someEvent
  const ce = 'componentEvent' in someEvent

  const e = kd ? someEvent.keyboardEvent : { event: { ctrlKey: undefined, shiftKey: undefined, altKey: undefined } }
  const { key, code, which } = someEvent.keyboardEvent ? someEvent.keyboardEvent : { key: undefined, code: undefined, which: undefined }
  const { text } = someEvent.clipboardPasteTextEvent ? someEvent.clipboardPasteTextEvent : { text: '' }
  const { imageId, imageSize } = someEvent.clipboardPasteImageEvent ? someEvent.clipboardPasteImageEvent : { imageId: undefined, imageSize: undefined }
  const { type, payload } = someEvent.componentEvent ? someEvent.componentEvent : { type: undefined, payload: undefined }

  const m = structuredClone((getMap())).sort(sortPath)
  const x = getX(m)
  // TODO ct = contentType
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

  // console.log({c,cr,cc, sxavn})

  const stateMachine = [
    [ se, ckm(e, '---'),                                   true,  true,            1, 'startEditAppend',          {}, 1 ],

    [ kd, ckm(e, '---') && key === 'F1',                   true,  true,            0, '',                         {}, 1 ],
    [ kd, ckm(e, '---') && key === 'F2',                   true,  r || s || c,     1, 'startEditAppend',          {}, 1 ],
    [ kd, ckm(e, '---') && key === 'F3',                   true,  true,            0, '',                         {}, 1 ],
    [ kd, ckm(e, '---') && key === 'F5',                   true,  true,            0, '',                         {}, 0 ],
    [ kd, ckm(e, '---') && key === 'Enter',                true,  s,               1, 'insertSD',                 {}, 1 ],
    [ kd, ckm(e, '---') && key === 'Enter',                true,  c,               1, 'selectCD',                 {}, 1 ],
    [ kd, ckm(e, '-s-') && key === 'Enter',                true,  s,               1, 'insertSU',                 {}, 1 ],
    [ kd, ckm(e, '--a') && key === 'Enter',                true,  s,               1, 'cellify',                  {}, 1 ],
    [ kd, ckm(e, '---') && ['Insert','Tab'].includes(key), true,  r,               1, 'insertSOR',                {}, 1 ],
    [ kd, ckm(e, '---') && ['Insert','Tab'].includes(key), true,  s,               1, 'insertSO',                 {}, 1 ],
    [ kd, ckm(e, '---') && ['Insert','Tab'].includes(key), true,  c,               1, 'selectCO',                 {}, 1 ],
    [ kd, ckm(e, '---') && key === 'Delete',               true,  s,               1, 'deleteS',                  {}, 1 ],
    [ kd, ckm(e, '---') && key === 'Delete',               true,  cr,              1, 'deleteCR',                 {}, 1 ],
    [ kd, ckm(e, '---') && key === 'Delete',               true,  cc,              1, 'deleteCC',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Space',               true,  s,               1, 'selectCFF',                {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Space',               true,  c,               1, 'selectSF',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Space',               true,  cr,              1, 'selectCFfirstCol',         {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Space',               true,  cc,              1, 'selectCFfirstRow',         {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Backspace',           true,  s,               1, 'selectCB',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Backspace',           true,  c || cr || cc,   1, 'selectSB',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'Escape',              true,  true,            1, 'selectR',                  {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyA',                true,  true,            1, 'selectall',                {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyM',                true,  true,            0, 'createMapInMapDialog',     {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyC',                true,  sxavn,           1, 'copySelection',            {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyX',                true,  sxavn,           1, 'cutSelection',             {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyZ',                true,  true,            1, 'redo',                     {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyY',                true,  true,            1, 'undo',                     {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'KeyE',                true,  s,               1, 'transpose',                {}, 1 ],

    [ kd, ckm(e, '---') && code === 'ArrowDown',           true,  s,               1, 'selectSD',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowDown',           true,  c && !cxb,       1, 'selectCD',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowDown',           true,  cr && !cxb,      1, 'selectCRD',                {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowDown',           true,  sxavn && !sxad,  1, 'moveST',                   {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowDown',           true,  sxavn && sxad,   1, 'moveSD',                   {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowDown',           true,  cr && !cxb,      1, 'moveCRD',                  {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowDown',           true,  s,               1, 'selectSDtoo',              {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowDown',           true,  c,               1, 'selectCCSAME',             {}, 1 ],
    [ kd, ckm(e, '--a') && code === 'ArrowDown',           true,  cr,              1, 'insertCRD',                {}, 1 ],

    [ kd, ckm(e, '---') && code === 'ArrowUp',             true,  s,               1, 'selectSU',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowUp',             true,  c && !cxt,       1, 'selectCU',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowUp',             true,  cr && !cxt,      1, 'selectCRU',                {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowUp',             true,  sxavn && !sxau,  1, 'moveSB',                   {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowUp',             true,  sxavn && sxau,   1, 'moveSU',                   {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowUp',             true,  cr && !cxt,      1, 'moveCRU',                  {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowUp',             true,  s,               1, 'selectSUtoo',              {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowUp',             true,  c,               1, 'selectCCSAME',             {}, 1 ],
    [ kd, ckm(e, '--a') && code === 'ArrowUp',             true,  cr,              1, 'insertCRU',                {}, 1 ],

    [ kd, ckm(e, '---') && code === 'ArrowRight',          true,  r,               1, 'selectSOR',                {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowRight',          dr,    s,               1, 'selectSO',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowRight',          dl,    s,               1, 'selectSI',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowRight',          true,  c && !cxr,       1, 'selectCR',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowRight',          true,  cc && !cxr,      1, 'selectCCR',                {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowRight',          dr,    sxavn && sxau,   1, 'moveSO',                   {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowRight',          dl,    sxavn && !ds,    1, 'moveSI',                   {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowRight',          dl,    sxavn && ds,     1, 'moveSIL',                  {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowRight',          true,  cc && !cxr,      1, 'moveCCR',                  {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowRight',          true,  r,               1, 'selectSfamilyOR',          {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowRight',          dr,    s && x.sCount,   1, 'selectSfamilyO',           {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowRight',          true,  c,               1, 'selectCRSAME',             {}, 1 ],
    [ kd, ckm(e, '--a') && code === 'ArrowRight',          true,  cc,              1, 'insertCCR',                {}, 1 ],

    [ kd, ckm(e, '---') && code === 'ArrowLeft',           true,  r,               1, 'selectSOL',                {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowLeft',           dr,    s,               1, 'selectSI',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowLeft',           dl,    s,               1, 'selectSO',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowLeft',           true,  c && !cxl,       1, 'selectCL',                 {}, 1 ],
    [ kd, ckm(e, '---') && code === 'ArrowLeft',           true,  cc && !cxl,      1, 'selectCCL',                {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowLeft',           dr,    sxavn && !ds,    1, 'moveSI',                   {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowLeft',           dr,    sxavn && ds,     1, 'moveSIR',                  {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowLeft',           dl,    sxavn && sxau,   1, 'moveSO',                   {}, 1 ],
    [ kd, ckm(e, 'c--') && code === 'ArrowLeft',           true,  cc && !cxl,      1, 'moveCCL',                  {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowLeft',           true,  r,               1, 'selectSfamilyOL',          {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowLeft',           dl,    s && x.sCount,   1, 'selectSfamilyO',           {}, 1 ],
    [ kd, ckm(e, '-s-') && code === 'ArrowLeft',           true,  c,               1, 'selectCRSAME',             {}, 1 ],
    [ kd, ckm(e, '--a') && code === 'ArrowLeft',           true,  cc,              1, 'insertCCL',                {}, 1 ],

    [ kd, ckm(e, 'c--') && which >= 96 && which <= 105,    true,  s,               1, 'applyColorFromKey',        {currColor: which - 96}, 1 ],
    [ kd, ckm(e, '---') && which >= 48,                    true,  s || c,          1, 'startEditReplace',         {}, 0 ],
    [ kd, ckm(e, '-s-') && which >= 48,                    true,  s || c,          1, 'startEditReplace',         {}, 0 ],
    [ pt, text.substring(0, 1) === '[',                    true,  s,               1, 'insertNodesFromClipboard', {text}, 0 ],
    [ pt, text.substring(0, 2) === '\\[',                  true,  r,               1, 'insertSOR',                {contentType: 'equation', content: text}, 0 ],
    [ pt, text.substring(0, 2) === '\\[',                  true,  s,               1, 'insertSO',                 {contentType: 'equation', content: text}, 0 ],
    [ pt, isUrl(text),                                     true,  r,               1, 'insertSOR',                {contentType: 'text', content: text, linkType: 'external', link: text}, 0 ],
    [ pt, isUrl(text),                                     true,  s,               1, 'insertSO',                 {contentType: 'text', content: text, linkType: 'external', link: text}, 0 ],
    [ pt, true,                                            true,  r,               1, 'insertSOR',                {contentType: 'text', content: text}, 0 ],
    [ pt, true,                                            true,  s,               1, 'insertSO',                 {contentType: 'text', content: text}, 0 ],
    [ pi, true,                                            true,  r,               1, 'insertSOR',                {contentType: 'image', content: imageId, imageW: imageSize?.width, imageH: imageSize?.height}, 0 ],
    [ pi, true,                                            true,  s,               1, 'insertSO',                 {contentType: 'image', content: imageId, imageW: imageSize?.width, imageH: imageSize?.height}, 0 ],

    [ ce, type === 'insertTable',                          true,  r,               1, 'insertSORTable',           payload, 0 ],
    [ ce, type === 'insertTable',                          true,  s,               1, 'insertSOTable',            payload, 0 ],
  ] as any[]
  for (let i = 0; i < stateMachine.length; i++) {
    const [ eventTypeCondition, match, dirMatch, scopeMatch, isMapAction, type, payload, preventDefault ] = stateMachine[i]
    if (eventTypeCondition && match && dirMatch && scopeMatch) {
      if (preventDefault === 1 && kd) {
        someEvent.keyboardEvent && someEvent.keyboardEvent.preventDefault()
      }
      if (type.length) {
        if (isMapAction) {
          return {type, payload}
        } else {
          return {type: 'editor/' + type, payload}
        }
      }
      break
    }
  }
  return {type: '', payload: undefined}
}
