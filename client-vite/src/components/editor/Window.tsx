import {FC, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountQuasiSD, getCountQuasiSU, getCountXASD, getCountXASU, getLastIndexR, getMapMode, getX, getXC, getXS, isXACC, isXACR, isXAR, isXASVN, isXC, isXCB, isXCL, isXCR, isXCT, isXR, isXRS, isXS, mR, sortPath} from "../../queries/MapQueries.ts"
import {isUrl} from "../../utils/Utils"
import {AccessType, AlertDialogState, DialogState, MapMode, MidMouseMode, PageState} from "../../state/Enums"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {api, useOpenWorkspaceQuery} from "../../api/Api.ts"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../../state/NodeApiState"
import {getMap, mSelector} from "../../state/EditorState"
import {mapDeInit} from "../../reducers/MapDeInit"
import {M, N} from "../../state/MapStateTypes"
import {shortcutColors} from "../assets/Colors"

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
  const mapMode = getMapMode(m)
  const mExists = m && m.length
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const {data} = useOpenWorkspaceQuery()
  const {access} = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))

  const keydown = (e: KeyboardEvent) => {
    if (
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
    ckm === '---' && e.key === 'F2' && isXS(m) && getXS(m).contentType === 'text' && getXS(m).co1.length === 0 && md(MR.startEditAppend)
    ckm === '---' && e.key === 'Enter' && isXS(m) && md(MR.insertSD)
    ckm === '---' && e.key === 'Enter' && isXC(m) && md(MR.selectCD)
    ckm === '-s-' && e.key === 'Enter' && isXS(m) && md(MR.insertSU)
    ckm === '---' && e.key === 'Insert' && isXR(m) && md(MR.insertR)
    ckm === '---' && e.key === 'Insert' && isXS(m) && md(MR.insertSO)
    ckm === '---' && e.key === 'Insert' && isXC(m) && md(MR.insertSO)
    ckm === '---' && e.key === 'Tab' && isXR(m) && md(MR.insertR)
    ckm === '---' && e.key === 'Tab' && isXS(m) && md(MR.insertSO)
    ckm === '---' && e.key === 'Delete' && isXS(m) && md(MR.deleteS)
    ckm === '---' && e.key === 'Delete' && isXR(m) && getLastIndexR(m) > 0 && mR(m).some(ri => !ri.selected) && md(MR.deleteLR)
    ckm === '---' && e.key === 'Delete' && isXACR(m) && md(MR.deleteCR)
    ckm === '---' && e.key === 'Delete' && isXACC(m) && md(MR.deleteCC)
    ckm === '---' && e.code === 'Space' && isXR(m) && md(MR.selectSO)
    ckm === '---' && e.code === 'Space' && isXS(m) && getXS(m).co1.length > 0 && md(MR.selectCFF)
    ckm === '---' && e.code === 'Space' && isXC(m) && getXC(m).so1.length > 0 && md(MR.selectSF)
    ckm === '---' && e.code === 'Space' && isXACR(m) && md(MR.selectCFC0)
    ckm === '---' && e.code === 'Space' && isXACC(m) && md(MR.selectCFR0)
    ckm === '---' && e.code === 'Backspace' && isXS(m) && !getXS(m).path.includes('c') && md(MR.selectXR)
    ckm === '---' && e.code === 'Backspace' && isXS(m) && getXS(m).path.includes('c') && md(MR.selectXSIC)
    ckm === '---' && e.code === 'Backspace' && (isXC(m) || isXACR(m) || isXACC(m)) && md(MR.selectSI)
    ckm === '---' && e.code === 'Escape' && md(MR.selectXS)
    ckm === 'c--' && e.code === 'KeyC' && isXAR(m) && md(MR.copyLR)
    ckm === 'c--' && e.code === 'KeyC' && isXASVN(m) && md(MR.copyS)
    ckm === 'c--' && e.code === 'KeyX' && isXAR(m) && getLastIndexR(m) > 0 && md(MR.cutLR)
    ckm === 'c--' && e.code === 'KeyX' && isXASVN(m) && md(MR.cutS)
    ckm === 'c--' && e.code === 'KeyZ' && md(MR.redo)
    ckm === 'c--' && e.code === 'KeyY' && md(MR.undo)

    ckm === '---' && e.code === 'ArrowDown' && isXS(m) && getCountQuasiSD(m) > 0 && md(MR.selectSD)
    ckm === '---' && e.code === 'ArrowDown' && isXC(m) && !isXCB(m) && md(MR.selectCD)
    ckm === '---' && e.code === 'ArrowDown' && isXACR(m) && !isXCB(m) && md(MR.selectCD)
    ckm === 'c--' && e.code === 'ArrowDown' && isXR(m) && md(MR.offsetD)
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getCountXASD(m) === 0 && md(MR.moveST)
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getCountXASD(m) > 0 && md(MR.moveSD)
    ckm === 'c--' && e.code === 'ArrowDown' && isXACR(m) && !isXCB(m) && md(MR.moveCRD)
    ckm === '-s-' && e.code === 'ArrowDown' && isXS(m)  && getCountQuasiSD(m) > 0 && md(MR.selectAddSD)
    ckm === '-s-' && e.code === 'ArrowDown' && isXC(m) && md(MR.selectSameCC)
    ckm === '--a' && e.code === 'ArrowDown' && isXACR(m) && md(MR.insertCRD)

    ckm === '---' && e.code === 'ArrowUp' && isXS(m) && getCountQuasiSU(m) > 0 && md(MR.selectSU)
    ckm === '---' && e.code === 'ArrowUp' && isXC(m) && !isXCT(m) && md(MR.selectCU)
    ckm === '---' && e.code === 'ArrowUp' && isXACR(m) && !isXCT(m) && md(MR.selectCU)
    ckm === 'c--' && e.code === 'ArrowUp' && isXR(m) && md(MR.offsetU)
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getCountXASU(m) === 0 && md(MR.moveSB)
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getCountXASU(m) > 0 && md(MR.moveSU)
    ckm === 'c--' && e.code === 'ArrowUp' && isXACR(m) && !isXCT(m) && md(MR.moveCRU)
    ckm === '-s-' && e.code === 'ArrowUp' && isXS(m) && getCountQuasiSU(m) > 0 && md(MR.selectAddSU)
    ckm === '-s-' && e.code === 'ArrowUp' && isXC(m) && md(MR.selectSameCC)
    ckm === '--a' && e.code === 'ArrowUp' && isXACR(m) && md(MR.insertCRU)

    ckm === '---' && e.code === 'ArrowRight' && isXS(m) && getXS(m).so1.length > 0 && md(MR.selectSO)
    ckm === '---' && e.code === 'ArrowRight' && isXC(m) && !isXCR(m) && md(MR.selectCR)
    ckm === '---' && e.code === 'ArrowRight' && isXACC(m) && !isXCR(m) && md(MR.selectCR)
    ckm === 'c--' && e.code === 'ArrowRight' && isXR(m) && md(MR.offsetR)
    ckm === 'c--' && e.code === 'ArrowRight' && isXASVN(m) && getCountXASU(m) > 0 && md(MR.moveSO)
    ckm === 'c--' && e.code === 'ArrowRight' && isXACC(m) && !isXCR(m) && md(MR.moveCCR)
    ckm === '-s-' && e.code === 'ArrowRight' && isXS(m) && getXS(m).so1.length > 0 && getXS(m).selection === 's' && md(MR.selectFamilyX)
    ckm === '-s-' && e.code === 'ArrowRight' && isXC(m) && md(MR.selectSameCR)
    ckm === '--a' && e.code === 'ArrowRight' && isXACC(m) && md(MR.insertCCR)

    ckm === '---' && e.code === 'ArrowLeft' && isXS(m) && !isXRS(m) && !isXR(m) && md(MR.selectSI)
    ckm === '---' && e.code === 'ArrowLeft' && isXC(m) && !isXCL(m) && md(MR.selectCL)
    ckm === '---' && e.code === 'ArrowLeft' && isXACC(m) && !isXCL(m) && md(MR.selectCL)
    ckm === 'c--' && e.code === 'ArrowLeft' && isXR(m) && md(MR.offsetL)
    ckm === 'c--' && e.code === 'ArrowLeft' && isXASVN(m) && !isXRS(m) && md(MR.moveSI)
    ckm === 'c--' && e.code === 'ArrowLeft' && isXACC(m) && !isXCL(m) && md(MR.moveCCL)
    ckm === '-s-' && e.code === 'ArrowLeft' && isXS(m) && getXS(m).so1.length > 0 && getXS(m).selection === 's' && md(MR.selectFamilyX)
    ckm === '-s-' && e.code === 'ArrowLeft' && isXC(m) && md(MR.selectSameCR)
    ckm === '--a' && e.code === 'ArrowLeft' && isXACC(m) && md(MR.insertCCL)

    ckm === 'c--' && e.which >= 96 && e.which <= 105 && isXS(m) && md(MR.setTextColor, shortcutColors[e.which - 96])
    ckm === '---' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isXS(m) && getXS(m).contentType === 'text' && getXS(m).co1.length === 0 &&(m) && md(MR.startEditReplace)
    ckm === '-s-' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isXS(m) && getXS(m).contentType === 'text' && getXS(m).co1.length === 0 &&(m) && md(MR.startEditReplace)
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
                    isPastedLR && md(MR.pasteLR, text)
                    const hasCell = (mapJson as M).some(el => el.path.includes('c'))
                    if (hasCell && !getX(m).path.includes('c') || !hasCell) {
                      isPastedS && isXS(m) && md(MR.pasteSO, text)
                    }
                  } else {
                    window.alert('invalid map')
                  }
                } else {
                  if (isUrl(text)) {
                    isXS(m) && md(MR.insertSOLink, text)
                  } else {
                    isXS(m) && md(MR.insertSOText, text)
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
                  isXS(m) && md(MR.insertSOImage, response)
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
      mapMode !== MapMode.VIEW &&
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
  }, [pageState, dialogState, alertDialogState, access, mapMode, editedNodeId])

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
  
  const timeoutFun = () => {
    dispatch(api.endpoints.saveMap.initiate({
      mapId: getMapId(),
      frameId: getFrameId(),
      mapData: mapDeInit(getMap().filter((n: N) => (n.hasOwnProperty('path') && n.hasOwnProperty('nodeId'))))
    }))
    console.log('save by timeout')
  }

  useEffect(() => {
    if (mExists) {
      if (mapList.length > 1) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(timeoutFun, 1000)
      }
    }
  }, [m])

  return (
    <></>
  )
}
