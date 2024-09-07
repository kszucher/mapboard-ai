import {FC, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {getLastIndexR, getXC, getXS, isAXCC, isAXCR, isAXSN, isAXC, isAXC1, isAXS, mR, isAXSS, getFXS, getLXS, isAXR, isAXRS, isAXCS, hasQuasiSD, hasQuasiSU, getXR} from "../mapQueries/MapQueries.ts"
import {isUrl} from "../utils/Utils.ts"
import {AccessType, AlertDialogState, DialogState, MidMouseMode, PageState} from "../state/Enums.ts"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer.ts"
import {api, useOpenWorkspaceQuery} from "../api/Api.ts"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState.ts"
import {getMap, mSelector} from "../state/EditorState.ts"
import {M} from "../state/MapStateTypes.ts"
import {shortcutColors} from "../componentsColors/Colors.ts"
import {getRR, getRL, getRD, getRU} from "../mapQueries/MapFindNearestR.ts"

export let timeoutId: NodeJS.Timeout
let mapListener: AbortController
let midMouseListener: AbortController

export const Window: FC = () => {
  const midMouseMode = useSelector((state: RootState) => state.editor.midMouseMode)
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const dialogState = useSelector((state: RootState) => state.editor.dialogState)
  const alertDialogState = useSelector((state: RootState) => state.editor.alertDialogState)
  const commitList = useSelector((state: RootState) => state.editor.commitList)
  const m = (useSelector((state:RootState) => mSelector(state)))
  const mExists = m && m.length
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const {data} = useOpenWorkspaceQuery()
  const {access} = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MM, payload? : any) => dispatch(actions.mapReducer({type, payload}))

  const keydown = (e: KeyboardEvent) => {
    if (
      +e.ctrlKey && e.code === 'KeyD' ||
      +e.ctrlKey && e.code === 'KeyZ' ||
      +e.ctrlKey && e.code === 'KeyY' ||
      +e.ctrlKey && e.which >= 96 && e.which <= 105 ||
      e.which < 48 ||
      e.key === 'F1' ||
      e.key === 'F3'
    ) {e.preventDefault()
    }
    const m = getMap()
    const ckm = [
      +e.ctrlKey ? 'c' : '-',
      +e.shiftKey ? 's' : '-',
      +e.altKey ? 'a' : '-'
    ].join('')
    
    if (ckm === '---' && e.key === 'F2' && isAXS(m) && getXS(m).contentType === 'text' && getXS(m).co1.length === 0) dispatch(actions.startEditAppend())
    if (ckm === '---' && e.key === 'Enter' && isAXS(m)) dm(MM.insertSD)
    if (ckm === '-s-' && e.key === 'Enter' && isAXS(m)) dm(MM.insertSU)
    if (ckm === '---' && e.key === 'Insert' && isAXR(m)) dm(MM.insertR)
    if (ckm === '---' && e.key === 'Insert' && isAXS(m)) dm(MM.insertSSO)
    if (ckm === '---' && e.key === 'Insert' && isAXC1(m)) dm(MM.insertCSO)
    if (ckm === '---' && e.key === 'Tab' && isAXR(m)) dm(MM.insertR)
    if (ckm === '---' && e.key === 'Tab' && isAXS(m)) dm(MM.insertSSO)
    if (ckm === '---' && e.key === 'Tab' && isAXC1(m)) dm(MM.insertCSO)
    if (ckm === '---' && e.key === 'Delete' && isAXSN(m) && getFXS(m).su.length > 0) dm(MM.deleteSJumpSU)
    if (ckm === '---' && e.key === 'Delete' && isAXSN(m) && getFXS(m).su.length === 0 && getLXS(m).sd.length > 0) dm(MM.deleteSJumpSD)
    if (ckm === '---' && e.key === 'Delete' && isAXSN(m) && isAXSS(m) && getFXS(m).su.length === 0 && getLXS(m).sd.length === 0) dm(MM.deleteSJumpSI)
    if (ckm === '---' && e.key === 'Delete' && isAXSN(m) && isAXCS(m) && getFXS(m).su.length === 0 && getLXS(m).sd.length === 0) dm(MM.deleteSJumpCI)
    if (ckm === '---' && e.key === 'Delete' && isAXS(m) && !isAXSN(m)) dm(MM.deleteSJumpR)
    if (ckm === '---' && e.key === 'Delete' && isAXR(m) && getLastIndexR(m) > 0 && mR(m).some(ri => !ri.selected)) dm(MM.deleteLRSC)
    if (ckm === '---' && e.key === 'Delete' && isAXCR(m) && getXC(m).cu.length > 0) dm(MM.deleteCRJumpU)
    if (ckm === '---' && e.key === 'Delete' && isAXCR(m) && getXC(m).cu.length === 0 && getXC(m).cd.length > 0) dm(MM.deleteCRJumpD)
    if (ckm === '---' && e.key === 'Delete' && isAXCR(m) && getXC(m).cu.length === 0 && getXC(m).cd.length === 0) dm(MM.deleteCRJumpSI)
    if (ckm === '---' && e.key === 'Delete' && isAXCC(m) && getXC(m).cl.length > 0) dm(MM.deleteCCJumpL)
    if (ckm === '---' && e.key === 'Delete' && isAXCC(m) && getXC(m).cl.length === 0 && getXC(m).cr.length > 0) dm(MM.deleteCCJumpR)
    if (ckm === '---' && e.key === 'Delete' && isAXCC(m) && getXC(m).cl.length === 0 && getXC(m).cr.length === 0) dm(MM.deleteCCJumpSI)
    if (ckm === '---' && e.code === 'Space' && !isAXR(m) && !isAXS(m) && !isAXC(m)) dm(MM.selectFirstR)
    if (ckm === '---' && e.code === 'Space' && isAXR(m)) dm(MM.selectRSO)
    if (ckm === '---' && e.code === 'Space' && isAXS(m) && getXS(m).co1.length > 0) dm(MM.selectCFF)
    if (ckm === '---' && e.code === 'Space' && isAXC1(m) && getXC(m).so1.length > 0) dm(MM.selectCSO)
    if (ckm === '---' && e.code === 'Space' && isAXCR(m)) dm(MM.selectCFC0)
    if (ckm === '---' && e.code === 'Space' && isAXCC(m)) dm(MM.selectCFR0)
    if (ckm === '---' && e.code === 'Backspace' && isAXR(m)) dm(MM.unselect)
    if (ckm === '---' && e.code === 'Backspace' && isAXS(m) && !getXS(m).path.includes('c')) dm(MM.selectXSIR)
    if (ckm === '---' && e.code === 'Backspace' && isAXS(m) && getXS(m).path.includes('c')) dm(MM.selectXSIC)
    if (ckm === '---' && e.code === 'Backspace' && isAXC(m)) dm(MM.selectXCIS)
    if (ckm === '---' && e.code === 'Escape' && isAXS(m) && !getXS(m).path.includes('c')) dm(MM.selectXSIRS)
    if (ckm === '---' && e.code === 'Escape' && isAXS(m) && getXS(m).path.includes('c')) dm(MM.selectXSICS)
    if (ckm === 'c--' && e.code === 'KeyC' && isAXR(m)) dm(MM.copyLR)
    if (ckm === 'c--' && e.code === 'KeyC' && isAXSN(m)) dm(MM.copyS)
    if (ckm === 'c--' && e.code === 'KeyX' && isAXR(m) && getLastIndexR(m) > 0) dm(MM.cutLRJumpR)
    if (ckm === 'c--' && e.code === 'KeyX' && isAXSN(m) && isAXRS(m) && getFXS(m).su.length === 0 && getLXS(m).sd.length === 0) dm(MM.cutSJumpRI)
    if (ckm === 'c--' && e.code === 'KeyX' && isAXSN(m) && isAXSS(m) && getFXS(m).su.length > 0) dm(MM.cutSJumpSU)
    if (ckm === 'c--' && e.code === 'KeyX' && isAXSN(m) && isAXSS(m) && getFXS(m).su.length === 0 && getLXS(m).sd.length > 0) dm(MM.cutSJumpSD)
    if (ckm === 'c--' && e.code === 'KeyX' && isAXSN(m) && isAXSS(m) && getFXS(m).su.length === 0 && getLXS(m).sd.length === 0) dm(MM.cutSJumpSI)
    if (ckm === 'c--' && e.code === 'KeyX' && isAXSN(m) && isAXCS(m) && getFXS(m).su.length === 0 && getLXS(m).sd.length === 0) dm(MM.cutSJumpCI)
    if (ckm === 'c--' && e.code === 'KeyD' && isAXR(m)) dm(MM.duplicateR)
    if (ckm === 'c--' && e.code === 'KeyD' && isAXS(m)) dm(MM.duplicateS)
    if (ckm === 'c--' && e.code === 'KeyZ') dispatch(actions.redo())
    if (ckm === 'c--' && e.code === 'KeyY') dispatch(actions.undo())

    if (ckm === '---' && e.code === 'ArrowDown' && isAXR(m) && getRD(m, getXR(m))) dm(MM.selectRD)
    if (ckm === '---' && e.code === 'ArrowDown' && isAXS(m) && hasQuasiSD(m)) dm(MM.selectSD)
    if (ckm === '---' && e.code === 'ArrowDown' && isAXCS(m) && getLXS(m).sd.length === 0 && getXS(m).ci1!.cd.at(-1)?.so1.length) dm(MM.selectDCS)
    if (ckm === '---' && e.code === 'ArrowDown' && isAXC1(m) && getXC(m).cd.length > 0) dm(MM.selectDC)
    if (ckm === '---' && e.code === 'ArrowDown' && isAXCR(m) && getXC(m).cd.length > 0) dm(MM.selectDCL)
    if (ckm === 'c--' && e.code === 'ArrowDown' && isAXR(m)) dm(MM.offsetD)
    if (ckm === 'c--' && e.code === 'ArrowDown' && isAXSN(m) && getLXS(m).sd.length === 0) dm(MM.moveST)
    if (ckm === 'c--' && e.code === 'ArrowDown' && isAXSN(m) && getLXS(m).sd.length > 0) dm(MM.moveSD)
    if (ckm === 'c--' && e.code === 'ArrowDown' && isAXCR(m) && getXC(m).cd.length > 0) dm(MM.moveCRD)
    if (ckm === '-s-' && e.code === 'ArrowDown' && isAXS(m) && hasQuasiSD(m)) dm(MM.selectAddSD)
    if (ckm === '-s-' && e.code === 'ArrowDown' && isAXC1(m)) dm(MM.selectSameCC)
    if (ckm === '--a' && e.code === 'ArrowDown' && isAXCR(m)) dm(MM.insertCRD)
    
    if (ckm === '---' && e.code === 'ArrowUp' && isAXR(m) && getRU(m, getXR(m))) dm(MM.selectRU)
    if (ckm === '---' && e.code === 'ArrowUp' && isAXS(m) && hasQuasiSU(m)) dm(MM.selectSU)
    if (ckm === '---' && e.code === 'ArrowUp' && isAXCS(m) && getFXS(m).su.length === 0 && getXS(m).ci1!.cu.at(-1)?.so1.length) dm(MM.selectUCS)
    if (ckm === '---' && e.code === 'ArrowUp' && isAXC1(m) && getXC(m).cu.length > 0) dm(MM.selectUC)
    if (ckm === '---' && e.code === 'ArrowUp' && isAXCR(m) && getXC(m).cu.length > 0) dm(MM.selectUCL)
    if (ckm === 'c--' && e.code === 'ArrowUp' && isAXR(m)) dm(MM.offsetU)
    if (ckm === 'c--' && e.code === 'ArrowUp' && isAXSN(m) && getFXS(m).su.length === 0) dm(MM.moveSB)
    if (ckm === 'c--' && e.code === 'ArrowUp' && isAXSN(m) && getFXS(m).su.length > 0) dm(MM.moveSU)
    if (ckm === 'c--' && e.code === 'ArrowUp' && isAXCR(m) && getXC(m).cu.length > 0) dm(MM.moveCRU)
    if (ckm === '-s-' && e.code === 'ArrowUp' && isAXS(m) && hasQuasiSU(m)) dm(MM.selectAddSU)
    if (ckm === '-s-' && e.code === 'ArrowUp' && isAXC1(m)) dm(MM.selectSameCC)
    if (ckm === '--a' && e.code === 'ArrowUp' && isAXCR(m)) dm(MM.insertCRU)
    
    if (ckm === '---' && e.code === 'ArrowRight' && isAXR(m) && getRR(m, getXR(m))) dm(MM.selectRR)
    if (ckm === '---' && e.code === 'ArrowRight' && isAXS(m) && getXS(m).so1.length > 0 && (getXS(m).lastSelectedChild < 0 || getXS(m).lastSelectedChild > getXS(m).so1.length)) dm(MM.selectSSO)
    if (ckm === '---' && e.code === 'ArrowRight' && isAXS(m) && getXS(m).so1.length > 0 && getXS(m).lastSelectedChild >= 0 && getXS(m).lastSelectedChild < getXS(m).so1.length) dm(MM.selectSSOLast)
    if (ckm === '---' && e.code === 'ArrowRight' && isAXCS(m) && getXS(m).so1.length === 0 && getXS(m).ci1!.cr.at(-1)?.so1.length) dm(MM.selectRCS)
    if (ckm === '---' && e.code === 'ArrowRight' && isAXC1(m) && getXC(m).cr.length > 0) dm(MM.selectRC)
    if (ckm === '---' && e.code === 'ArrowRight' && isAXCC(m) && getXC(m).cr.length > 0) dm(MM.selectRCL)
    if (ckm === 'c--' && e.code === 'ArrowRight' && isAXR(m)) dm(MM.offsetR)
    if (ckm === 'c--' && e.code === 'ArrowRight' && isAXSN(m) && getFXS(m).su.length > 0) dm(MM.moveSO)
    if (ckm === 'c--' && e.code === 'ArrowRight' && isAXCC(m) && getXC(m).cr.length > 0) dm(MM.moveCCR)
    if (ckm === '-s-' && e.code === 'ArrowRight' && isAXS(m) && getXS(m).so1.length > 0 && getXS(m).selection === 's') dm(MM.selectFamilyX)
    if (ckm === '-s-' && e.code === 'ArrowRight' && isAXC1(m)) dm(MM.selectSameCR)
    if (ckm === '--a' && e.code === 'ArrowRight' && isAXCC(m)) dm(MM.insertCCR)
    
    if (ckm === '---' && e.code === 'ArrowLeft' && isAXR(m) && getRL(m, getXR(m))) dm(MM.selectRL)
    if (ckm === '---' && e.code === 'ArrowLeft' && isAXSS(m)) dm(MM.selectSI)
    if (ckm === '---' && e.code === 'ArrowLeft' && isAXCS(m) && getXS(m).ci1!.cl.at(-1)?.so1.length) dm(MM.selectLCS)
    if (ckm === '---' && e.code === 'ArrowLeft' && isAXC1(m) && getXC(m).cl.length > 0) dm(MM.selectLC)
    if (ckm === '---' && e.code === 'ArrowLeft' && isAXCC(m) && getXC(m).cl.length > 0) dm(MM.selectLCL)
    if (ckm === 'c--' && e.code === 'ArrowLeft' && isAXR(m)) dm(MM.offsetL)
    if (ckm === 'c--' && e.code === 'ArrowLeft' && isAXSN(m) && isAXSS(m)) dm(MM.moveSI)
    if (ckm === 'c--' && e.code === 'ArrowLeft' && isAXCC(m) && getXC(m).cl.length > 0) dm(MM.moveCCL)
    if (ckm === '-s-' && e.code === 'ArrowLeft' && isAXS(m) && getXS(m).so1.length > 0 && getXS(m).selection === 's') dm(MM.selectFamilyX)
    if (ckm === '-s-' && e.code === 'ArrowLeft' && isAXC1(m)) dm(MM.selectSameCR)
    if (ckm === '--a' && e.code === 'ArrowLeft' && isAXCC(m)) dm(MM.insertCCL)
    
    if (ckm === 'c--' && e.which >= 96 && e.which <= 105 && isAXS(m)) dm(MM.setTextColor, shortcutColors[e.which - 96])
    if (ckm === '---' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isAXS(m) && getXS(m).contentType === 'text' && getXS(m).co1.length === 0 &&(m)) dispatch(actions.startEditReplace())
    if (ckm === '-s-' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isAXS(m) && getXS(m).contentType === 'text' && getXS(m).co1.length === 0 &&(m)) dispatch(actions.startEditReplace())
  }

  const paste = (e: Event) => {
    e.preventDefault()
    const m = getMap()
    navigator.permissions.query({name: "clipboard-write" as PermissionName}).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.read().then(item => {
          const type = item[0].types[0]
          if (type === 'text/plain') {
            navigator.clipboard.readText()
              .then(text => {
                let isValidJson = true
                try { JSON.parse(text) } catch { isValidJson = false }
                if (isValidJson) {
                  const mapJson = JSON.parse(text)
                  const isValidMap = Array.isArray(mapJson) && mapJson.length && mapJson.every(el =>
                    Object.hasOwn(el, 'path') && Array.isArray(el.path) &&
                    Object.hasOwn(el, 'nodeId') && typeof el.nodeId === 'string'
                  )
                  if (isValidMap) {
                    const isPastedLR = mapJson.at(-1).path.at(0) === 'r'
                    const isPastedS = mapJson.at(-1).path.at(0) === 's'
                    if (isAXR(m)) {
                      if (isPastedLR) dm(MM.pasteLR, text)
                      if (isPastedS) dm(MM.pasteRSO, text)
                    } else if (isAXS(m)) {
                      const hasCell = (mapJson as M).some(el => el.path.includes('c'))
                      if (hasCell && !getXS(m).path.includes('c') || !hasCell) {
                        if (isPastedS) dm(MM.pasteSSO, text)
                      }
                    } else if (isAXC1(m)) {
                      if (isPastedS) dm(MM.pasteCSO, text)
                    } else if (isAXCC(m)) {
                      // do nothing
                    } else if (isAXCR(m)) {
                      // do nothing
                    } else {
                      if (isPastedLR) dm(MM.pasteLR, text)
                    }
                  } else {
                    window.alert('invalid componentsMap')
                  }
                } else {
                  if (isUrl(text)) {
                    if (isAXS(m)) dm(MM.insertSSOLink, text)
                  } else {
                    if( isAXS(m)) dm(MM.insertSSOText, text)
                  }
                }
              })
          } else if (type === 'image/png') {
            item[0].getType('image/png').then(image => {
              const formData = new FormData()
              formData.append('upl', image, 'image.png')
              const address = process.env.NODE_ENV === 'development'
                ? 'http://127.0.0.1:8082/feta'
                : 'https://mapboard-server.herokuapp.com/feta'
              fetch(address, {method: 'post', body: formData})
                .then(response => response.json().then(response => {
                  if (isAXS(m)) dm(MM.insertSSOImage, response)
                }))
            })
          }
        })
      }
    })
  }

  const mouseup = () => {
    dispatch(actions.clearConnectionStart())
  }

  const contextmenu = (e: MouseEvent) => {
    e.preventDefault()
  }

  const wheel = (e: WheelEvent) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (
      pageState === PageState.WS &&
      dialogState === DialogState.NONE &&
      alertDialogState === AlertDialogState.NONE &&
      access === AccessType.EDIT &&
      editedNodeId === ''
    ) {
      console.log('WINDOW EVENT LISTENERS ADDED')
      mapListener = new AbortController()
      const {signal} = mapListener
      window.addEventListener("keydown", keydown, {signal})
      window.addEventListener("paste", paste, {signal})
      window.addEventListener("mouseup", mouseup, {signal})
      window.addEventListener("contextmenu", contextmenu, {signal})
    } else {
      console.log('WINDOW EVENT LISTENERS REMOVED')
      if (mapListener) {
        mapListener.abort()
      }
    }
    return () => {
      if (mapListener) {
        mapListener.abort()
      }
    }
  }, [pageState, dialogState, alertDialogState, access, editedNodeId])

  useEffect(() => {
    if (midMouseMode === MidMouseMode.ZOOM) {
      console.log('MID MOUSE PREVENTION ADDED')
      midMouseListener = new AbortController()
      const {signal} = midMouseListener
      window.addEventListener("wheel", wheel, {signal, passive: false})
    } else {
      console.log('MID MOUSE PREVENTION REMOVED')
      if (midMouseListener) {
        midMouseListener.abort()
      }
    }
    return () => {
      if (midMouseListener) {
        midMouseListener.abort()
      }
    }
  }, [midMouseMode])

  useEffect(() => {
    if (mExists) {
      if (commitList.length > 1) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => dispatch(api.endpoints.saveMapAssembler.initiate()), 1000)
      }
    }
  }, [m])

  return (
    <></>
  )
}
