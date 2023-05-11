import {isUrl} from "../core/Utils"
import {getMap} from "../state/EditorState"
import {getX, isCCXA, isCRXA, isCX, isDSX, isRX, isSX, isSXAVN, isCXR, isCXL, isCXB, isCXT, sortPath, getCountSXAU, getCountSXAD} from "./MapUtils"
import {getDir} from "../component/MapSvgUtils"

const ckm = (e: any, condition: string) => [+e.ctrlKey ? 'c' : '-', +e.shiftKey ? 's' : '-', +e.altKey ? 'a' : '-'].join('') === condition

export const mapActionResolver = (e: any, et: string, ep: any) => {
  const m = structuredClone((getMap())).sort(sortPath)
  const x = getX(m)
  const dr = getDir(x) === 1
  const dl = getDir(x) === -1
  const hasS = x.sCount > 0
  const ctt = x.contentType === 'text'
  const r = isRX(m)
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
  const sxad = getCountSXAD(m) > 0
  const sxau = getCountSXAU(m) > 0

  switch (true) {
    case (et === 'me' && ckm(e, '---')                                     && true                  ): return ({type: 'startEditAppend',          payload: {}})

    case (et === 'kd' && ckm(e, '---') && e.key === 'F1'                   && true                  ): return ({type: '',                         payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.key === 'F2'                   && (r || s || c)         ): return ({type: 'startEditAppend',          payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.key === 'F3'                   && true                  ): return ({type: '',                         payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.key === 'F5'                   && true                  ): return ({type: '',                         payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.key === 'Enter'                && s                     ): return ({type: 'insertSD',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.key === 'Enter'                && c                     ): return ({type: 'selectCD',                 payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.key === 'Enter'                && s                     ): return ({type: 'insertSU',                 payload: {}})
    case (et === 'kd' && ckm(e, '--a') && e.key === 'Enter'                && s                     ): return ({type: 'cellify',                  payload: {}})
    case (et === 'kd' && ckm(e, '---') && ['Insert','Tab'].includes(e.key) && r                     ): return ({type: 'insertSOR',                payload: {}})
    case (et === 'kd' && ckm(e, '---') && ['Insert','Tab'].includes(e.key) && s                     ): return ({type: 'insertSO',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && ['Insert','Tab'].includes(e.key) && c                     ): return ({type: 'selectCO',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.key === 'Delete'               && s                     ): return ({type: 'deleteS',                  payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.key === 'Delete'               && cr                    ): return ({type: 'deleteCR',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.key === 'Delete'               && cc                    ): return ({type: 'deleteCC',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'Space'               && s                     ): return ({type: 'selectCFF',                payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'Space'               && c                     ): return ({type: 'selectSF',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'Space'               && cr                    ): return ({type: 'selectCFfirstCol',         payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'Space'               && cc                    ): return ({type: 'selectCFfirstRow',         payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'Backspace'           && s                     ): return ({type: 'selectCB',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'Backspace'           && (c || cr || cc)       ): return ({type: 'selectSB',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'Escape'              && true                  ): return ({type: 'selectR',                  payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'KeyA'                && true                  ): return ({type: 'selectall',                payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'KeyM'                && true                  ): return ({type: 'createMapInMapDialog',     payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'KeyC'                && sxavn                 ): return ({type: 'copySelection',            payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'KeyX'                && sxavn                 ): return ({type: 'cutSelection',             payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'KeyZ'                && true                  ): return ({type: 'redo',                     payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'KeyY'                && true                  ): return ({type: 'undo',                     payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'KeyE'                && s                     ): return ({type: 'transpose',                payload: {}})

    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowDown'           && s                     ): return ({type: 'selectSD',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowDown'           && c && !cxb             ): return ({type: 'selectCD',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowDown'           && cr && !cxb            ): return ({type: 'selectCRD',                payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowDown'           && sxavn && !sxad        ): return ({type: 'moveST',                   payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowDown'           && sxavn && sxad         ): return ({type: 'moveSD',                   payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowDown'           && cr && !cxb            ): return ({type: 'moveCRD',                  payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowDown'           && s                     ): return ({type: 'selectSDtoo',              payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowDown'           && c                     ): return ({type: 'selectCCSAME',             payload: {}})
    case (et === 'kd' && ckm(e, '--a') && e.code === 'ArrowDown'           && cr                    ): return ({type: 'insertCRD',                payload: {}})

    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowUp'             && s                     ): return ({type: 'selectSU',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowUp'             && c && !cxt             ): return ({type: 'selectCU',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowUp'             && cr && !cxt            ): return ({type: 'selectCRU',                payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowUp'             && sxavn && !sxau        ): return ({type: 'moveSB',                   payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowUp'             && sxavn && sxau         ): return ({type: 'moveSU',                   payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowUp'             && cr && !cxt            ): return ({type: 'moveCRU',                  payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowUp'             && s                     ): return ({type: 'selectSUtoo',              payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowUp'             && c                     ): return ({type: 'selectCCSAME',             payload: {}})
    case (et === 'kd' && ckm(e, '--a') && e.code === 'ArrowUp'             && cr                    ): return ({type: 'insertCRU',                payload: {}})

    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && r                     ): return ({type: 'selectSOR',                payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && dr && s               ): return ({type: 'selectSO',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && dl && s               ): return ({type: 'selectSI',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && c && !cxr             ): return ({type: 'selectCR',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && cc && !cxr            ): return ({type: 'selectCCR',                payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowRight'          && dr && sxavn && sxau   ): return ({type: 'moveSO',                   payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowRight'          && dl && sxavn && !ds    ): return ({type: 'moveSI',                   payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowRight'          && dl && sxavn && ds     ): return ({type: 'moveSIL',                  payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowRight'          && cc && !cxr            ): return ({type: 'moveCCR',                  payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowRight'          && r                     ): return ({type: 'selectSfamilyOR',          payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowRight'          && dr && s && hasS       ): return ({type: 'selectSfamilyO',           payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowRight'          && c                     ): return ({type: 'selectCRSAME',             payload: {}})
    case (et === 'kd' && ckm(e, '--a') && e.code === 'ArrowRight'          && cc                    ): return ({type: 'insertCCR',                payload: {}})

    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && r                     ): return ({type: 'selectSOL',                payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && dr && s               ): return ({type: 'selectSI',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && dl && s               ): return ({type: 'selectSO',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && c && !cxl             ): return ({type: 'selectCL',                 payload: {}})
    case (et === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && cc && !cxl            ): return ({type: 'selectCCL',                payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowLeft'           && dr && sxavn && !ds    ): return ({type: 'moveSI',                   payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowLeft'           && dr && sxavn && ds     ): return ({type: 'moveSIR',                  payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowLeft'           && dl && sxavn && sxau   ): return ({type: 'moveSO',                   payload: {}})
    case (et === 'kd' && ckm(e, 'c--') && e.code === 'ArrowLeft'           && cc && !cxl            ): return ({type: 'moveCCL',                  payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowLeft'           && r                     ): return ({type: 'selectSfamilyOL',          payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowLeft'           && dl && s && hasS       ): return ({type: 'selectSfamilyO',           payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.code === 'ArrowLeft'           && c                     ): return ({type: 'selectCRSAME',             payload: {}})
    case (et === 'kd' && ckm(e, '--a') && e.code === 'ArrowLeft'           && cc                    ): return ({type: 'insertCCL',                payload: {}})

    case (et === 'kd' && ckm(e, 'c--') && e.which >= 96 && e.which <= 105  && s                     ): return ({type: 'applyColorFromKey',        payload: {currColor: e.which - 96}})
    case (et === 'kd' && ckm(e, '---') && e.which >= 48                    && (s || c)              ): return ({type: 'startEditReplace',         payload: {}})
    case (et === 'kd' && ckm(e, '-s-') && e.which >= 48                    && (s || c)              ): return ({type: 'startEditReplace',         payload: {}})
    case (et === 'pt' && ep.text.substring(0, 1) === '['                   && s                     ): return ({type: 'insertNodesFromClipboard', payload: {text: ep.text}})
    case (et === 'pt' && ep.text.substring(0, 2) === '\\['                 && r                     ): return ({type: 'insertSOR',                payload: {contentType: 'equation', content: ep.text}})
    case (et === 'pt' && ep.text.substring(0, 2) === '\\['                 && s                     ): return ({type: 'insertSO',                 payload: {contentType: 'equation', content: ep.text}})
    case (et === 'pt' && isUrl(ep.text)                                    && r                     ): return ({type: 'insertSOR',                payload: {contentType: 'text', content: ep.text, linkType: 'external', link: ep.text}})
    case (et === 'pt' && isUrl(ep.text)                                    && s                     ): return ({type: 'insertSO',                 payload: {contentType: 'text', content: ep.text, linkType: 'external', link: ep.text}})
    case (et === 'pt' && true                                              && r                     ): return ({type: 'insertSOR',                payload: {contentType: 'text', content: ep.text}})
    case (et === 'pt' && true                                              && s                     ): return ({type: 'insertSO',                 payload: {contentType: 'text', content: ep.text}})
    case (et === 'pi' && true                                              && r                     ): return ({type: 'insertSOR',                payload: {contentType: 'image', content: ep.imageId, imageW: ep.imageSize.width, imageH: ep.imageSize.height}})
    case (et === 'pi' && true                                              && s                     ): return ({type: 'insertSO',                 payload: {contentType: 'image', content: ep.imageId, imageW: ep.imageSize.width, imageH: ep.imageSize.height}})
    case (et === 'ce' && ep.type === 'insertTable'                         && r                     ): return ({type: 'insertSORTable',           payload: ep.payload})
    case (et === 'ce' && ep.type === 'insertTable'                         && s                     ): return ({type: 'insertSOTable',            payload: ep.payload})

    default: return ({type: '', payload: {}})
  }
}
