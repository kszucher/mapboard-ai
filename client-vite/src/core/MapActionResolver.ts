import {isUrl} from "./Utils"
import {M} from "../state/MapPropTypes";
import {getX, isXACC, isXACR, isXC, isXDS, isXR, isXS, isXASVN, isXCR, isXCL, isXCB, isXCT, sortPath, getCountXASU, getCountXASD, getCountSC, getCountSS, getPathDir, getXP} from "./MapUtils"

const ckm = (e: any, condition: string) => [+e.ctrlKey ? 'c' : '-', +e.shiftKey ? 's' : '-', +e.altKey ? 'a' : '-'].join('') === condition

export const mapActionResolver = (pm: M, e: any, es: string, et: string | null, ep: any) => {
  const m = structuredClone(pm).sort(sortPath)
  const x = getX(m)
  const dr = getPathDir(x.path) === 1
  const dl = getPathDir(x.path) === -1
  const hasS = getCountSS(m, x.path) > 0
  const hasC = getCountSC(m, x.path) > 0
  const hasParentC = getXP(m).includes('c')
  const cti = x.contentType === 'image'
  const r = isXR(m)
  const s = isXS(m)
  const ds = isXDS(m)
  const xasvn = isXASVN(m)
  const c = isXC(m)
  const cr = isXACR(m)
  const cc = isXACC(m)
  const xcb = isXCB(m)
  const xct = isXCT(m)
  const xcr = isXCR(m)
  const xcl = isXCL(m)
  const xasd = getCountXASD(m) > 0
  const xasu = getCountXASU(m) > 0
  const editable = (r || s || c) && !cti && !hasC

  switch (true) {
    case (es === 'dmm' && ckm(e, '---')                                    && true                  ): return ({type: 'simulateDrag',             payload: ep})
    case (es === 'dmu' && ckm(e, '---')                                    && true                  ): return ({type: 'drag',                     payload: ep})
    case (es === 'dmdc' && ckm(e, '---')                                   && editable              ): return ({type: 'startEditAppend',          payload: ep})

    case (es === 'kd' && ckm(e, '---') && e.key === 'F1'                   && true                  ): return ({type: '',                         payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.key === 'F2'                   && editable              ): return ({type: 'startEditAppend',          payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.key === 'F3'                   && true                  ): return ({type: '',                         payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.key === 'F5'                   && true                  ): return ({type: '',                         payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.key === 'Enter'                && s                     ): return ({type: 'insertSD',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.key === 'Enter'                && c                     ): return ({type: 'selectCD',                 payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.key === 'Enter'                && s                     ): return ({type: 'insertSU',                 payload: ep})
    case (es === 'kd' && ckm(e, '--a') && e.key === 'Enter'                && s                     ): return ({type: 'cellify',                  payload: ep})
    case (es === 'kd' && ckm(e, '---') && ['Insert','Tab'].includes(e.key) && r                     ): return ({type: 'insertSOR',                payload: ep})
    case (es === 'kd' && ckm(e, '---') && ['Insert','Tab'].includes(e.key) && s                     ): return ({type: 'insertSO',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && ['Insert','Tab'].includes(e.key) && c                     ): return ({type: 'selectCO',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.key === 'Delete'               && s                     ): return ({type: 'deleteS',                  payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.key === 'Delete'               && cr                    ): return ({type: 'deleteCR',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.key === 'Delete'               && cc                    ): return ({type: 'deleteCC',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'Space'               && s && hasC             ): return ({type: 'selectCFF',                payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'Space'               && c && hasS             ): return ({type: 'selectSF',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'Space'               && c && !hasS            ): return ({type: 'insertSO',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'Space'               && cr                    ): return ({type: 'selectCFfirstCol',         payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'Space'               && cc                    ): return ({type: 'selectCFfirstRow',         payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'Backspace'           && s && hasParentC       ): return ({type: 'selectCB',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'Backspace'           && (c || cr || cc)       ): return ({type: 'selectSB',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'Escape'              && true                  ): return ({type: 'selectR',                  payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'KeyA'                && true                  ): return ({type: 'selectall',                payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'KeyM'                && true                  ): return ({type: 'createMapInMapDialog',     payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'KeyC'                && xasvn                 ): return ({type: 'copySelection',            payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'KeyX'                && xasvn                 ): return ({type: 'cutSelection',             payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'KeyZ'                && true                  ): return ({type: 'redo',                     payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'KeyY'                && true                  ): return ({type: 'undo',                     payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'KeyE'                && s                     ): return ({type: 'transpose',                payload: ep})

    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowDown'           && s                     ): return ({type: 'selectSD',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowDown'           && c && !xcb             ): return ({type: 'selectCD',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowDown'           && cr && !xcb            ): return ({type: 'selectCRD',                payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowDown'           && xasvn && !xasd        ): return ({type: 'moveST',                   payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowDown'           && xasvn && xasd         ): return ({type: 'moveSD',                   payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowDown'           && cr && !xcb            ): return ({type: 'moveCRD',                  payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowDown'           && s                     ): return ({type: 'selectSDtoo',              payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowDown'           && c                     ): return ({type: 'selectCCSAME',             payload: ep})
    case (es === 'kd' && ckm(e, '--a') && e.code === 'ArrowDown'           && cr                    ): return ({type: 'insertCRD',                payload: ep})

    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowUp'             && s                     ): return ({type: 'selectSU',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowUp'             && c && !xct             ): return ({type: 'selectCU',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowUp'             && cr && !xct            ): return ({type: 'selectCRU',                payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowUp'             && xasvn && !xasu        ): return ({type: 'moveSB',                   payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowUp'             && xasvn && xasu         ): return ({type: 'moveSU',                   payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowUp'             && cr && !xct            ): return ({type: 'moveCRU',                  payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowUp'             && s                     ): return ({type: 'selectSUtoo',              payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowUp'             && c                     ): return ({type: 'selectCCSAME',             payload: ep})
    case (es === 'kd' && ckm(e, '--a') && e.code === 'ArrowUp'             && cr                    ): return ({type: 'insertCRU',                payload: ep})

    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && r                     ): return ({type: 'selectSOR',                payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && dr && s               ): return ({type: 'selectSO',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && dl && ds              ): return ({type: 'selectR',                  payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && dl && s               ): return ({type: 'selectSI',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && dr && c && !xcr       ): return ({type: 'selectCR',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && dr && cc && !xcr      ): return ({type: 'selectCCR',                payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && dl && c && !xcl       ): return ({type: 'selectCL',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowRight'          && dl && cc && !xcl      ): return ({type: 'selectCCL',                payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowRight'          && dr && xasvn && xasu   ): return ({type: 'moveSO',                   payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowRight'          && dl && xasvn && !ds    ): return ({type: 'moveSI',                   payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowRight'          && dl && xasvn && ds     ): return ({type: 'moveSIL',                  payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowRight'          && dr && cc && !xcr      ): return ({type: 'moveCCR',                  payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowRight'          && dl && cc && !xcl      ): return ({type: 'moveCCL',                  payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowRight'          && r                     ): return ({type: 'selectSfamilyOR',          payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowRight'          && dr && s && hasS       ): return ({type: 'selectSfamilyO',           payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowRight'          && c                     ): return ({type: 'selectCRSAME',             payload: ep})
    case (es === 'kd' && ckm(e, '--a') && e.code === 'ArrowRight'          && dr && cc              ): return ({type: 'insertCCR',                payload: ep})
    case (es === 'kd' && ckm(e, '--a') && e.code === 'ArrowRight'          && dl && cc              ): return ({type: 'insertCCL',                payload: ep})

    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && r                     ): return ({type: 'selectSOL',                payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && dr && ds              ): return ({type: 'selectR',                  payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && dr && s               ): return ({type: 'selectSI',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && dl && s               ): return ({type: 'selectSO',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && dr && c && !xcl       ): return ({type: 'selectCL',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && dr && cc && !xcl      ): return ({type: 'selectCCL',                payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && dl && c && !xcr       ): return ({type: 'selectCR',                 payload: ep})
    case (es === 'kd' && ckm(e, '---') && e.code === 'ArrowLeft'           && dl && cc && !xcr      ): return ({type: 'selectCCR',                payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowLeft'           && dr && xasvn && !ds    ): return ({type: 'moveSI',                   payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowLeft'           && dr && xasvn && ds     ): return ({type: 'moveSIR',                  payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowLeft'           && dl && xasvn && xasu   ): return ({type: 'moveSO',                   payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowLeft'           && dr && cc && !xcl      ): return ({type: 'moveCCL',                  payload: ep})
    case (es === 'kd' && ckm(e, 'c--') && e.code === 'ArrowLeft'           && dl && cc && !xcr      ): return ({type: 'moveCCR',                  payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowLeft'           && r                     ): return ({type: 'selectSfamilyOL',          payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowLeft'           && dl && s && hasS       ): return ({type: 'selectSfamilyO',           payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.code === 'ArrowLeft'           && c                     ): return ({type: 'selectCRSAME',             payload: ep})
    case (es === 'kd' && ckm(e, '--a') && e.code === 'ArrowLeft'           && dr && cc              ): return ({type: 'insertCCL',                payload: ep})
    case (es === 'kd' && ckm(e, '--a') && e.code === 'ArrowLeft'           && dl && cc              ): return ({type: 'insertCCR',                payload: ep})

    case (es === 'kd' && ckm(e, 'c--') && e.which >= 96 && e.which <= 105  && s                     ): return ({type: 'applyColorFromKey',        payload: {currColor: e.which - 96}})
    case (es === 'kd' && ckm(e, '---') && e.which >= 48                    && editable              ): return ({type: 'startEditReplace',         payload: ep})
    case (es === 'kd' && ckm(e, '-s-') && e.which >= 48                    && editable              ): return ({type: 'startEditReplace',         payload: ep})

    case (es === 'pt' && ep.substring(0, 1) === '['                        && s                     ): return ({type: 'insertNodesFromClipboard', payload: ep})
    // fixme: no insertNodesFromClipboard for R
    case (es === 'pt' && ep.substring(0, 2) === '\\['                      && r                     ): return ({type: 'insertSOREquation',        payload: ep})
    case (es === 'pt' && ep.substring(0, 2) === '\\['                      && s                     ): return ({type: 'insertSOEquation',         payload: ep})
    case (es === 'pt' && isUrl(ep)                                         && r                     ): return ({type: 'insertSORLink',            payload: ep})
    case (es === 'pt' && isUrl(ep)                                         && s                     ): return ({type: 'insertSOLink',             payload: ep})
    case (es === 'pt' && true                                              && r                     ): return ({type: 'insertSORText',            payload: ep})
    case (es === 'pt' && true                                              && s                     ): return ({type: 'insertSOText',             payload: ep})
    case (es === 'pi' && true                                              && r                     ): return ({type: 'insertSORImage',           payload: ep})
    case (es === 'pi' && true                                              && s                     ): return ({type: 'insertSOImage',            payload: ep})

    case (es === 'ce' && et === 'insertTable'                              && r                     ): return ({type: 'insertSORTable',           payload: ep})
    case (es === 'ce' && et === 'insertTable'                              && s                     ): return ({type: 'insertSOTable',            payload: ep})
    case (es === 'ce' && et === 'setNote'                                  && true                  ): return ({type: 'setNote',                  payload: ep})

    case (es === 'ae' && et === 'insertGptSuggestions'                     && r                     ): return ({type: 'insertSLOR',               payload: ep})
    case (es === 'ae' && et === 'insertGptSuggestions'                     && s                     ): return ({type: 'insertSLO',                payload: ep})
    case (es === 'ae' && et === 'gptFillTable'                             && s && hasC             ): return ({type: 'fillTable',                payload: ep})

    default: return ({type: '', payload: ep})
  }
}
