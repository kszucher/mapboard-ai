import {FC, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {MM} from "../../reducers/MapMutationEnum.ts"
import {getLastIndexR, getXC, getXS, getLCS, isXACC, isXACR, isXASVN, isXC, isXAS, mR, sortPath, getRCS, getUCS, getDCS, isXASS, getXFS, getXLS, isXAR, isXARS, isXACS, getQuasiSD, getQuasiSU, getXR} from "../../queries/MapQueries.ts"
import {isUrl} from "../../utils/Utils"
import {AccessType, AlertDialogState, DialogState, MidMouseMode, PageState} from "../../state/Enums"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {api, useOpenWorkspaceQuery} from "../../api/Api.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/ApiState.ts"
import {getMap, mSelector} from "../../state/EditorState"
import {M} from "../../state/MapStateTypes"
import {shortcutColors} from "../colors/Colors.ts"
import {getRR, getRL, getRD, getRU} from "../../queries/MapFindNearestR.ts"

export let timeoutId: NodeJS.Timeout
let mapListener: AbortController
let midMouseListener: AbortController

export const Window: FC = () => {
  const midMouseMode = useSelector((state: RootState) => state.editor.midMouseMode)
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const dialogState = useSelector((state: RootState) => state.editor.dialogState)
  const alertDialogState = useSelector((state: RootState) => state.editor.alertDialogState)
  const mapList = useSelector((state: RootState) => state.editor.mapList)
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
    const m = getMap().slice().sort(sortPath)
    const ckm = [
      +e.ctrlKey ? 'c' : '-',
      +e.shiftKey ? 's' : '-',
      +e.altKey ? 'a' : '-'
    ].join('')
    ckm === '---' && e.key === 'F2' && isXAS(m) && getXS(m).contentType === 'text' && getXS(m).co1.length === 0 && dispatch(actions.startEditAppend())
    ckm === '---' && e.key === 'Enter' && isXAS(m) && dm(MM.insertSD)
    ckm === '---' && e.key === 'Enter' && isXC(m) && dm(MM.selectCD)
    ckm === '-s-' && e.key === 'Enter' && isXAS(m) && dm(MM.insertSU)
    ckm === '---' && e.key === 'Insert' && isXAR(m) && dm(MM.insertR)
    ckm === '---' && e.key === 'Insert' && isXAS(m) && dm(MM.insertSSO)
    ckm === '---' && e.key === 'Insert' && isXC(m) && dm(MM.insertCSO)
    ckm === '---' && e.key === 'Tab' && isXAR(m) && dm(MM.insertR)
    ckm === '---' && e.key === 'Tab' && isXAS(m) && dm(MM.insertSSO)
    ckm === '---' && e.key === 'Tab' && isXC(m) && dm(MM.insertCSO)
    ckm === '---' && e.key === 'Delete' && isXASVN(m) && getXFS(m).su.length > 0 && dm(MM.deleteSJumpSU)
    ckm === '---' && e.key === 'Delete' && isXASVN(m) && getXFS(m).su.length === 0 && getXLS(m).sd.length > 0 && dm(MM.deleteSJumpSD)
    ckm === '---' && e.key === 'Delete' && isXASVN(m) && isXASS(m) && getXFS(m).su.length === 0 && getXLS(m).sd.length === 0 && dm(MM.deleteSJumpSI)
    ckm === '---' && e.key === 'Delete' && isXASVN(m) && isXACS(m) && getXFS(m).su.length === 0 && getXLS(m).sd.length === 0 && dm(MM.deleteSJumpCI)
    ckm === '---' && e.key === 'Delete' && isXAS(m) && !isXASVN(m) && dm(MM.deleteSJumpR)
    ckm === '---' && e.key === 'Delete' && isXAR(m) && getLastIndexR(m) > 0 && mR(m).some(ri => !ri.selected) && dm(MM.deleteLR)
    ckm === '---' && e.key === 'Delete' && isXACR(m) && getXC(m).cu.length > 0 && dm(MM.deleteCRJumpU)
    ckm === '---' && e.key === 'Delete' && isXACR(m) && getXC(m).cu.length === 0 && getXC(m).cd.length > 0 && dm(MM.deleteCRJumpD)
    ckm === '---' && e.key === 'Delete' && isXACR(m) && getXC(m).cu.length === 0 && getXC(m).cd.length === 0 && dm(MM.deleteCRJumpSI)
    ckm === '---' && e.key === 'Delete' && isXACC(m) && getXC(m).cl.length > 0 && dm(MM.deleteCCJumpL)
    ckm === '---' && e.key === 'Delete' && isXACC(m) && getXC(m).cl.length === 0 && getXC(m).cr.length > 0 && dm(MM.deleteCCJumpR)
    ckm === '---' && e.key === 'Delete' && isXACC(m) && getXC(m).cl.length === 0 && getXC(m).cr.length === 0 && dm(MM.deleteCCJumpSI)
    ckm === '---' && e.code === 'Space' && !isXAR(m) && !isXAS(m) && !isXC(m) && !isXACR(m) && !isXACC(m) && dm(MM.selectFirstR)
    ckm === '---' && e.code === 'Space' && isXAR(m) && dm(MM.selectRSO)
    ckm === '---' && e.code === 'Space' && isXAS(m) && getXS(m).co1.length > 0 && dm(MM.selectCFF)
    ckm === '---' && e.code === 'Space' && isXC(m) && getXC(m).so1.length > 0 && dm(MM.selectCSO)
    ckm === '---' && e.code === 'Space' && isXACR(m) && dm(MM.selectCFC0)
    ckm === '---' && e.code === 'Space' && isXACC(m) && dm(MM.selectCFR0)
    ckm === '---' && e.code === 'Backspace' && isXAR(m) && dm(MM.unselect)
    ckm === '---' && e.code === 'Backspace' && isXAS(m) && !getXS(m).path.includes('c') && dm(MM.selectXSIR)
    ckm === '---' && e.code === 'Backspace' && isXAS(m) && getXS(m).path.includes('c') && dm(MM.selectXSIC)
    ckm === '---' && e.code === 'Backspace' && (isXC(m) || isXACR(m) || isXACC(m)) && dm(MM.selectXCIS)
    ckm === '---' && e.code === 'Escape' && isXAS(m) && !getXS(m).path.includes('c') && dm(MM.selectXSIRS)
    ckm === '---' && e.code === 'Escape' && isXAS(m) && getXS(m).path.includes('c') && dm(MM.selectXSICS)
    ckm === 'c--' && e.code === 'KeyC' && isXAR(m) && dm(MM.copyLR)
    ckm === 'c--' && e.code === 'KeyC' && isXASVN(m) && dm(MM.copyS)
    ckm === 'c--' && e.code === 'KeyX' && isXAR(m) && getLastIndexR(m) > 0 && dm(MM.cutLR)
    ckm === 'c--' && e.code === 'KeyX' && isXASVN(m) && isXARS(m) && getXFS(m).su.length === 0 && getXLS(m).sd.length === 0 && dm(MM.cutSJumpRI)
    ckm === 'c--' && e.code === 'KeyX' && isXASVN(m) && isXASS(m) && getXFS(m).su.length > 0 && dm(MM.cutSJumpSU)
    ckm === 'c--' && e.code === 'KeyX' && isXASVN(m) && isXASS(m) && getXFS(m).su.length === 0 && getXLS(m).sd.length > 0 && dm(MM.cutSJumpSD)
    ckm === 'c--' && e.code === 'KeyX' && isXASVN(m) && isXASS(m) && getXFS(m).su.length === 0 && getXLS(m).sd.length === 0 && dm(MM.cutSJumpSI)
    ckm === 'c--' && e.code === 'KeyX' && isXASVN(m) && isXACS(m) && getXFS(m).su.length === 0 && getXLS(m).sd.length === 0 && dm(MM.cutSJumpCI)
    ckm === 'c--' && e.code === 'KeyD' && isXAR(m) && dm(MM.duplicateR)
    ckm === 'c--' && e.code === 'KeyD' && isXAS(m) && dm(MM.duplicateS)
    ckm === 'c--' && e.code === 'KeyZ' && dispatch(actions.redo())
    ckm === 'c--' && e.code === 'KeyY' && dispatch(actions.undo())

    ckm === '---' && e.code === 'ArrowDown' && isXAR(m) && getRD(m, getXR(m)) && dm(MM.selectRD)
    ckm === '---' && e.code === 'ArrowDown' && isXAS(m) && getQuasiSD(m) && dm(MM.selectSD)
    ckm === '---' && e.code === 'ArrowDown' && isXACS(m) && getXLS(m).sd.length === 0 && getDCS(m) && dm(MM.selectDCS)
    ckm === '---' && e.code === 'ArrowDown' && isXC(m) && getXC(m).cd.length > 0 && dm(MM.selectCD)
    ckm === '---' && e.code === 'ArrowDown' && isXACR(m) && getXC(m).cd.length > 0 && dm(MM.selectCD)
    ckm === 'c--' && e.code === 'ArrowDown' && isXAR(m) && dm(MM.offsetD)
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getXLS(m).sd.length === 0 && dm(MM.moveST)
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getXLS(m).sd.length > 0 && dm(MM.moveSD)
    ckm === 'c--' && e.code === 'ArrowDown' && isXACR(m) && getXC(m).cd.length > 0 && dm(MM.moveCRD)
    ckm === '-s-' && e.code === 'ArrowDown' && isXAS(m) && getQuasiSD(m) && dm(MM.selectAddSD)
    ckm === '-s-' && e.code === 'ArrowDown' && isXC(m) && dm(MM.selectSameCC)
    ckm === '--a' && e.code === 'ArrowDown' && isXACR(m) && dm(MM.insertCRD)

    ckm === '---' && e.code === 'ArrowUp' && isXAR(m) && getRU(m, getXR(m)) && dm(MM.selectRU)
    ckm === '---' && e.code === 'ArrowUp' && isXAS(m) && getQuasiSU(m) && dm(MM.selectSU)
    ckm === '---' && e.code === 'ArrowUp' && isXACS(m) && getXFS(m).su.length === 0 && getUCS(m) && dm(MM.selectUCS)
    ckm === '---' && e.code === 'ArrowUp' && isXC(m) && getXC(m).cu.length > 0 && dm(MM.selectCU)
    ckm === '---' && e.code === 'ArrowUp' && isXACR(m) && getXC(m).cu.length > 0 && dm(MM.selectCU)
    ckm === 'c--' && e.code === 'ArrowUp' && isXAR(m) && dm(MM.offsetU)
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getXFS(m).su.length === 0 && dm(MM.moveSB)
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getXFS(m).su.length > 0 && dm(MM.moveSU)
    ckm === 'c--' && e.code === 'ArrowUp' && isXACR(m) && getXC(m).cu.length > 0 && dm(MM.moveCRU)
    ckm === '-s-' && e.code === 'ArrowUp' && isXAS(m) && getQuasiSU(m) && dm(MM.selectAddSU)
    ckm === '-s-' && e.code === 'ArrowUp' && isXC(m) && dm(MM.selectSameCC)
    ckm === '--a' && e.code === 'ArrowUp' && isXACR(m) && dm(MM.insertCRU)

    ckm === '---' && e.code === 'ArrowRight' && isXAR(m) && getRR(m, getXR(m)) && dm(MM.selectRR)
    ckm === '---' && e.code === 'ArrowRight' && isXAS(m) && getXS(m).so1.length > 0 && (getXS(m).lastSelectedChild < 0 || getXS(m).lastSelectedChild > getXS(m).so1.length) && dm(MM.selectSSO)
    ckm === '---' && e.code === 'ArrowRight' && isXAS(m) && getXS(m).so1.length > 0 && getXS(m).lastSelectedChild >= 0 && getXS(m).lastSelectedChild < getXS(m).so1.length && dm(MM.selectSSOLast)
    ckm === '---' && e.code === 'ArrowRight' && isXACS(m) && getXS(m).so1.length === 0 && getRCS(m) && dm(MM.selectRCS)
    ckm === '---' && e.code === 'ArrowRight' && isXC(m) && getXC(m).cr.length > 0 && dm(MM.selectCR)
    ckm === '---' && e.code === 'ArrowRight' && isXACC(m) && getXC(m).cr.length > 0 && dm(MM.selectCR)
    ckm === 'c--' && e.code === 'ArrowRight' && isXAR(m) && dm(MM.offsetR)
    ckm === 'c--' && e.code === 'ArrowRight' && isXASVN(m) && getXFS(m).su.length > 0 && dm(MM.moveSO)
    ckm === 'c--' && e.code === 'ArrowRight' && isXACC(m) && getXC(m).cr.length > 0 && dm(MM.moveCCR)
    ckm === '-s-' && e.code === 'ArrowRight' && isXAS(m) && getXS(m).so1.length > 0 && getXS(m).selection === 's' && dm(MM.selectFamilyX)
    ckm === '-s-' && e.code === 'ArrowRight' && isXC(m) && dm(MM.selectSameCR)
    ckm === '--a' && e.code === 'ArrowRight' && isXACC(m) && dm(MM.insertCCR)

    ckm === '---' && e.code === 'ArrowLeft' && isXAR(m) && getRL(m, getXR(m)) && dm(MM.selectRL)
    ckm === '---' && e.code === 'ArrowLeft' && isXASS(m) && dm(MM.selectSI)
    ckm === '---' && e.code === 'ArrowLeft' && isXACS(m) && getLCS(m) && dm(MM.selectLCS)
    ckm === '---' && e.code === 'ArrowLeft' && isXC(m) && getXC(m).cl.length > 0 && dm(MM.selectCL)
    ckm === '---' && e.code === 'ArrowLeft' && isXACC(m) && getXC(m).cl.length > 0 && dm(MM.selectCL)
    ckm === 'c--' && e.code === 'ArrowLeft' && isXAR(m) && dm(MM.offsetL)
    ckm === 'c--' && e.code === 'ArrowLeft' && isXASVN(m) && isXASS(m) && dm(MM.moveSI)
    ckm === 'c--' && e.code === 'ArrowLeft' && isXACC(m) && getXC(m).cl.length > 0 && dm(MM.moveCCL)
    ckm === '-s-' && e.code === 'ArrowLeft' && isXAS(m) && getXS(m).so1.length > 0 && getXS(m).selection === 's' && dm(MM.selectFamilyX)
    ckm === '-s-' && e.code === 'ArrowLeft' && isXC(m) && dm(MM.selectSameCR)
    ckm === '--a' && e.code === 'ArrowLeft' && isXACC(m) && dm(MM.insertCCL)

    ckm === 'c--' && e.which >= 96 && e.which <= 105 && isXAS(m) && dm(MM.setTextColor, shortcutColors[e.which - 96])
    ckm === '---' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isXAS(m) && getXS(m).contentType === 'text' && getXS(m).co1.length === 0 &&(m) && dispatch(actions.startEditReplace())
    ckm === '-s-' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isXAS(m) && getXS(m).contentType === 'text' && getXS(m).co1.length === 0 &&(m) && dispatch(actions.startEditReplace())
  }

  const paste = (e: Event) => {
    e.preventDefault()
    const m = getMap().slice().sort(sortPath)
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
                  let isValidMap = Array.isArray(mapJson) && mapJson.every(el =>
                    el.hasOwnProperty('path') && Array.isArray(el.path) &&
                    el.hasOwnProperty('nodeId') && typeof el.nodeId === 'string'
                  )
                  if (isValidMap) {
                    const isPastedLR = mapJson.at(-1).path.at(0) === 'r'
                    const isPastedS = mapJson.at(-1).path.at(0) === 's'
                    if (isXAR(m)) {
                      isPastedLR && dm(MM.pasteLR, text)
                      isPastedS && dm(MM.pasteRSO, text)
                    } else if (isXAS(m)) {
                      const hasCell = (mapJson as M).some(el => el.path.includes('c'))
                      if (hasCell && !getXS(m).path.includes('c') || !hasCell) {
                        isPastedS && dm(MM.pasteSSO, text)
                      }
                    } else if (isXC(m)) {
                      isPastedS && dm(MM.pasteCSO, text)
                    } else if (isXACC(m)) {
                      // do nothing
                    } else if (isXACR(m)) {
                      // do nothing
                    } else {
                      isPastedLR && dm(MM.pasteLR, text)
                    }
                  } else {
                    window.alert('invalid map')
                  }
                } else {
                  if (isUrl(text)) {
                    isXAS(m) && dm(MM.insertSSOLink, text)
                  } else {
                    isXAS(m) && dm(MM.insertSSOText, text)
                  }
                }
              })
          } else if (type === 'image/png') {
            item[0].getType('image/png').then(image => {
              const formData = new FormData()
              formData.append('upl', image, 'image.png')
              let address = process.env.NODE_ENV === 'development'
                ? 'http://127.0.0.1:8082/feta'
                : 'https://mapboard-server.herokuapp.com/feta'
              fetch(address, {method: 'post', body: formData})
                .then(response => response.json().then(response => {
                  isXAS(m) && dm(MM.insertSSOImage, response)
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
      if (mapList.length > 1) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => dispatch(api.endpoints.saveMapAssembler.initiate()), 1000)
      }
    }
  }, [m])

  return (
    <></>
  )
}
