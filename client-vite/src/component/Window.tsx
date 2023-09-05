import {FC, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getCountQuasiSU, getCountQuasiSD, getCountXASD, getCountXASU, getCountXCO1, getCountXRD0S, getCountXRD1S, getCountXSO1, getX, getXRi, isDirL, isDirR, isXACC, isXACR, isXASVN, isXC, isXCB, isXCL, isXCR, isXCT, isXDS, isXR, isXS, sortPath, getXRD0, getXRD1} from "../core/MapUtils"
import {isUrl} from "../core/Utils";
import {AccessTypes, PageState} from "../state/Enums"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../state/ApiState"
import {getMap, mSelector} from "../state/EditorState"
import {mapDeInit} from "../core/MapDeInit"
import {GN} from "../state/MapStateTypes"

export let timeoutId: NodeJS.Timeout
let mapAreaListener: AbortController

export const Window: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const {data} = useOpenWorkspaceQuery()
  const {access} = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()

  const keydown = (e: KeyboardEvent) => {
    if ((+e.ctrlKey && e.code === 'KeyZ') || (+e.ctrlKey && e.code === 'KeyY') || (+e.ctrlKey && e.which >= 96 && e.which <= 105) || (e.which < 48)) {e.preventDefault()}
    const m = structuredClone(getMap()).sort(sortPath)
    const ckm = [+e.ctrlKey ? 'c' : '-', +e.shiftKey ? 's' : '-', +e.altKey ? 'a' : '-'].join('')

    ckm === '---' && e.key === 'F1' && dispatch(actions.mapAction({type: '', payload: null}))
    ckm === '---' && e.key === 'F2' && (isXR(m) || isXS(m)) && getX(m).contentType === 'text' && getCountXCO1(m) === 0 && dispatch(actions.mapAction({type: 'startEditAppend', payload: null}))
    ckm === '---' && e.key === 'F3' && dispatch(actions.mapAction({type: '', payload: null}))
    ckm === '---' && e.key === 'F5' && dispatch(actions.mapAction({type: '', payload: null}))
    ckm === '---' && e.key === 'Enter' && isXS(m) && dispatch(actions.mapAction({type: 'insertSD', payload: null}))
    ckm === '---' && e.key === 'Enter' && isXC(m) && dispatch(actions.mapAction({type: 'selectCD', payload: null}))
    ckm === '-s-' && e.key === 'Enter' && isXS(m) && dispatch(actions.mapAction({type: 'insertSU', payload: null}))
    ckm === '--a' && e.key === 'Enter' && isXS(m) && dispatch(actions.mapAction({type: 'cellify', payload: null}))
    ckm === '---' && ['Insert','Tab'].includes(e.key) && isXR(m) && dispatch(actions.mapAction({type: 'insertSOR', payload: null}))
    ckm === '---' && ['Insert','Tab'].includes(e.key) && isXS(m) && dispatch(actions.mapAction({type: 'insertSO', payload: null}))
    ckm === '---' && ['Insert','Tab'].includes(e.key) && isXC(m) && dispatch(actions.mapAction({type: 'selectCO', payload: null}))
    ckm === '---' && e.key === 'Delete' && isXS(m) && dispatch(actions.mapAction({type: 'deleteS', payload: null}))
    ckm === '---' && e.key === 'Delete' && isXR(m) && getXRi(m) > 0 && dispatch(actions.mapAction({type: 'deleteR', payload: null}))
    ckm === '---' && e.key === 'Delete' && isXACR(m) && dispatch(actions.mapAction({type: 'deleteCR', payload: null}))
    ckm === '---' && e.key === 'Delete' && isXACC(m) && dispatch(actions.mapAction({type: 'deleteCC', payload: null}))
    ckm === '---' && e.code === 'Space' && isXS(m) && getCountXCO1(m) > 0 && dispatch(actions.mapAction({type: 'selectCFF', payload: null}))
    ckm === '---' && e.code === 'Space' && isXC(m) && getCountXSO1(m) > 0 && dispatch(actions.mapAction({type: 'selectSF', payload: null}))
    ckm === '---' && e.code === 'Space' && isXC(m) && getCountXSO1(m) === 0 && dispatch(actions.mapAction({type: 'insertSO', payload: null}))
    ckm === '---' && e.code === 'Space' && isXACR(m) && dispatch(actions.mapAction({type: 'selectCFfirstCol', payload: null}))
    ckm === '---' && e.code === 'Space' && isXACC(m) && dispatch(actions.mapAction({type: 'selectCFfirstRow', payload: null}))
    ckm === '---' && e.code === 'Backspace' && isXS(m) && getX(m).path.includes('c') && dispatch(actions.mapAction({type: 'selectCB', payload: null}))
    ckm === '---' && e.code === 'Backspace' && (isXC(m) || isXACR(m) || isXACC(m)) && dispatch(actions.mapAction({type: 'selectSB', payload: null}))
    ckm === '---' && e.code === 'Escape' && dispatch(actions.mapAction({type: 'selectR0', payload: null}))
    ckm === 'c--' && e.code === 'KeyA' && dispatch(actions.mapAction({type: 'selectall', payload: null}))
    ckm === 'c--' && e.code === 'KeyM' && dispatch(actions.mapAction({type: 'createMapInMapDialog', payload: null}))
    ckm === 'c--' && e.code === 'KeyC' && isXR(m) && dispatch(actions.mapAction({type: 'copyR', payload: null}))
    ckm === 'c--' && e.code === 'KeyC' && isXASVN(m) && dispatch(actions.mapAction({type: 'copyS', payload: null}))
    ckm === 'c--' && e.code === 'KeyX' && isXASVN(m) && dispatch(actions.mapAction({type: 'cutS', payload: null}))
    ckm === 'c--' && e.code === 'KeyZ' && dispatch(actions.mapAction({type: 'redo', payload: null}))
    ckm === 'c--' && e.code === 'KeyY' && dispatch(actions.mapAction({type: 'undo', payload: null}))

    ckm === '---' && e.code === 'ArrowDown' && isXS(m) && getCountQuasiSD(m) > 0 && dispatch(actions.mapAction({type: 'selectSD', payload: null}))
    ckm === '---' && e.code === 'ArrowDown' && isXC(m) && !isXCB(m) && dispatch(actions.mapAction({type: 'selectCD', payload: null}))
    ckm === '---' && e.code === 'ArrowDown' && isXACR(m) && !isXCB(m) && dispatch(actions.mapAction({type: 'selectCD', payload: null}))
    ckm === 'c--' && e.code === 'ArrowDown' && isXR(m) && getXRi(m) > 0 && dispatch(actions.mapAction({type: 'offsetD', payload: null}))
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getCountXASD(m) === 0 && dispatch(actions.mapAction({type: 'moveST', payload: null}))
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getCountXASD(m) > 0 && dispatch(actions.mapAction({type: 'moveSD', payload: null}))
    ckm === 'c--' && e.code === 'ArrowDown' && isXACR(m) && !isXCB(m) && dispatch(actions.mapAction({type: 'moveCRD', payload: null}))
    ckm === '-s-' && e.code === 'ArrowDown' && isXS(m)  && getCountQuasiSD(m) > 0 && dispatch(actions.mapAction({type: 'selectSDtoo', payload: null}))
    ckm === '-s-' && e.code === 'ArrowDown' && isXC(m) && dispatch(actions.mapAction({type: 'selectCCSAME', payload: null}))
    ckm === '--a' && e.code === 'ArrowDown' && isXACR(m) && dispatch(actions.mapAction({type: 'insertCRD', payload: null}))

    ckm === '---' && e.code === 'ArrowUp' && isXS(m) && getCountQuasiSU(m) > 0 && dispatch(actions.mapAction({type: 'selectSU', payload: null}))
    ckm === '---' && e.code === 'ArrowUp' && isXC(m) && !isXCT(m) && dispatch(actions.mapAction({type: 'selectCU', payload: null}))
    ckm === '---' && e.code === 'ArrowUp' && isXACR(m) && !isXCT(m) && dispatch(actions.mapAction({type: 'selectCU', payload: null}))
    ckm === 'c--' && e.code === 'ArrowUp' && isXR(m) && getXRi(m) > 0 && dispatch(actions.mapAction({type: 'offsetU', payload: null}))
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getCountXASU(m) === 0 && dispatch(actions.mapAction({type: 'moveSB', payload: null}))
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getCountXASU(m) > 0 && dispatch(actions.mapAction({type: 'moveSU', payload: null}))
    ckm === 'c--' && e.code === 'ArrowUp' && isXACR(m) && !isXCT(m) && dispatch(actions.mapAction({type: 'moveCRU', payload: null}))
    ckm === '-s-' && e.code === 'ArrowUp' && isXS(m) && getCountQuasiSU(m) > 0 && dispatch(actions.mapAction({type: 'selectSUtoo', payload: null}))
    ckm === '-s-' && e.code === 'ArrowUp' && isXC(m) && dispatch(actions.mapAction({type: 'selectCCSAME', payload: null}))
    ckm === '--a' && e.code === 'ArrowUp' && isXACR(m) && dispatch(actions.mapAction({type: 'insertCRU', payload: null}))

    ckm === '---' && e.code === 'ArrowRight' && isXR(m) && getCountXRD0S(m) > 0 && dispatch(actions.mapAction({type: 'selectSOR', payload: null}))
    ckm === '---' && e.code === 'ArrowRight' && isDirR(m) && isXS(m) && getCountXSO1(m) > 0 && dispatch(actions.mapAction({type: 'selectSO', payload: null}))
    ckm === '---' && e.code === 'ArrowRight' && isDirL(m) && isXDS(m) && dispatch(actions.mapAction({type: 'selectXRi', payload: null}))
    ckm === '---' && e.code === 'ArrowRight' && isDirL(m) && !isXDS(m) && isXS(m) && dispatch(actions.mapAction({type: 'selectSI', payload: null}))
    ckm === '---' && e.code === 'ArrowRight' && isDirR(m) && isXC(m) && !isXCR(m) && dispatch(actions.mapAction({type: 'selectCR', payload: null}))
    ckm === '---' && e.code === 'ArrowRight' && isDirR(m) && isXACC(m) && !isXCR(m) && dispatch(actions.mapAction({type: 'selectCR', payload: null}))
    ckm === '---' && e.code === 'ArrowRight' && isDirL(m) && isXC(m) && !isXCL(m) && dispatch(actions.mapAction({type: 'selectCL', payload: null}))
    ckm === '---' && e.code === 'ArrowRight' && isDirL(m) && isXACC(m) && !isXCL(m) && dispatch(actions.mapAction({type: 'selectCL', payload: null}))
    ckm === 'c--' && e.code === 'ArrowRight' && isXR(m) && getXRi(m) > 0 && dispatch(actions.mapAction({type: 'offsetR', payload: null}))
    ckm === 'c--' && e.code === 'ArrowRight' && isDirR(m) && isXASVN(m) && getCountXASU(m) > 0 && dispatch(actions.mapAction({type: 'moveSO', payload: null}))
    ckm === 'c--' && e.code === 'ArrowRight' && isDirL(m) && isXASVN(m) && !isXDS(m) && dispatch(actions.mapAction({type: 'moveSI', payload: null}))
    ckm === 'c--' && e.code === 'ArrowRight' && isDirL(m) && isXASVN(m) && isXDS(m) && dispatch(actions.mapAction({type: 'moveSIL', payload: null}))
    ckm === 'c--' && e.code === 'ArrowRight' && isDirR(m) && isXACC(m) && !isXCR(m) && dispatch(actions.mapAction({type: 'moveCCR', payload: null}))
    ckm === 'c--' && e.code === 'ArrowRight' && isDirL(m) && isXACC(m) && !isXCL(m) && dispatch(actions.mapAction({type: 'moveCCL', payload: null}))
    ckm === '-s-' && e.code === 'ArrowRight' && isXR(m) && getCountXRD0S(m) > 0 && !getXRD0(m).selected && dispatch(actions.mapAction({type: 'selectF', payload: {path: getXRD0(m).path}}))
    ckm === '-s-' && e.code === 'ArrowRight' && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && dispatch(actions.mapAction({type: 'selectF', payload: {path: getX(m).path}}))
    ckm === '-s-' && e.code === 'ArrowRight' && isXC(m) && dispatch(actions.mapAction({type: 'selectCRSAME', payload: null}))
    ckm === '--a' && e.code === 'ArrowRight' && isDirR(m) && isXACC(m) && dispatch(actions.mapAction({type: 'insertCCR', payload: null}))
    ckm === '--a' && e.code === 'ArrowRight' && isDirL(m) && isXACC(m) && dispatch(actions.mapAction({type: 'insertCCL', payload: null}))

    ckm === '---' && e.code === 'ArrowLeft' && isXR(m) && getCountXRD1S(m) > 0 && dispatch(actions.mapAction({type: 'selectSOL', payload: null}))
    ckm === '---' && e.code === 'ArrowLeft' && isDirL(m) && isXS(m) && getCountXSO1(m) > 0 && dispatch(actions.mapAction({type: 'selectSO', payload: null}))
    ckm === '---' && e.code === 'ArrowLeft' && isDirR(m) && isXDS(m) && dispatch(actions.mapAction({type: 'selectXRi', payload: null}))
    ckm === '---' && e.code === 'ArrowLeft' && isDirR(m) && !isXDS(m) && isXS(m) && dispatch(actions.mapAction({type: 'selectSI', payload: null}))
    ckm === '---' && e.code === 'ArrowLeft' && isDirR(m) && isXC(m) && !isXCL(m) && dispatch(actions.mapAction({type: 'selectCL', payload: null}))
    ckm === '---' && e.code === 'ArrowLeft' && isDirR(m) && isXACC(m) && !isXCL(m) && dispatch(actions.mapAction({type: 'selectCL', payload: null}))
    ckm === '---' && e.code === 'ArrowLeft' && isDirL(m) && isXC(m) && !isXCR(m) && dispatch(actions.mapAction({type: 'selectCR', payload: null}))
    ckm === '---' && e.code === 'ArrowLeft' && isDirL(m) && isXACC(m) && !isXCR(m) && dispatch(actions.mapAction({type: 'selectCR', payload: null}))
    ckm === 'c--' && e.code === 'ArrowLeft' && isXR(m) && getXRi(m) > 0 && dispatch(actions.mapAction({type: 'offsetL', payload: null}))
    ckm === 'c--' && e.code === 'ArrowLeft' && isDirR(m) && isXASVN(m) && !isXDS(m) && dispatch(actions.mapAction({type: 'moveSI', payload: null}))
    ckm === 'c--' && e.code === 'ArrowLeft' && isDirR(m) && isXASVN(m) && isXDS(m) && dispatch(actions.mapAction({type: 'moveSIR', payload: null}))
    ckm === 'c--' && e.code === 'ArrowLeft' && isDirL(m) && isXASVN(m) && getCountXASU(m) > 0 && dispatch(actions.mapAction({type: 'moveSO', payload: null}))
    ckm === 'c--' && e.code === 'ArrowLeft' && isDirR(m) && isXACC(m) && !isXCL(m) && dispatch(actions.mapAction({type: 'moveCCL', payload: null}))
    ckm === 'c--' && e.code === 'ArrowLeft' && isDirL(m) && isXACC(m) && !isXCR(m) && dispatch(actions.mapAction({type: 'moveCCR', payload: null}))
    ckm === '-s-' && e.code === 'ArrowLeft' && isXR(m) && getCountXRD1S(m) > 0 && !getXRD1(m).selected && dispatch(actions.mapAction({type: 'selectF', payload: {path: getXRD1(m).path}}))
    ckm === '-s-' && e.code === 'ArrowLeft' && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && dispatch(actions.mapAction({type: 'selectF', payload: {path: getX(m).path}}))
    ckm === '-s-' && e.code === 'ArrowLeft' && isXC(m) && dispatch(actions.mapAction({type: 'selectCRSAME', payload: null}))
    ckm === '--a' && e.code === 'ArrowLeft' && isDirR(m) && isXACC(m) && dispatch(actions.mapAction({type: 'insertCCL', payload: null}))
    ckm === '--a' && e.code === 'ArrowLeft' && isDirL(m) && isXACC(m) && dispatch(actions.mapAction({type: 'insertCCR', payload: null}))

    ckm === 'c--' && e.which >= 96 && e.which <= 105 && isXS(m) && dispatch(actions.mapAction({type: 'applyColorFromKey', payload: {currColor: e.which - 96}}))
    ckm === '---' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && (isXR(m) || isXS(m)) && getX(m).contentType === 'text' && getCountXCO1(m) === 0 &&(m) && dispatch(actions.mapAction({type: 'startEditReplace', payload: null}))
    ckm === '-s-' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && (isXR(m) || isXS(m)) && getX(m).contentType === 'text' && getCountXCO1(m) === 0 &&(m) && dispatch(actions.mapAction({type: 'startEditReplace', payload: null}))
  }

  const paste = (e: Event) => {
    e.preventDefault()
    const m = structuredClone(getMap()).sort(sortPath)
    navigator.permissions.query({name: "clipboard-write" as PermissionName}).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.read().then(item => {
          const type = item[0].types[0]
          if (type === 'text/plain') {
            navigator.clipboard.readText()
              .then(text => {
                text.substring(0, 1) !== '[' && isXR(m) && dispatch(actions.mapAction({type: 'insertSORText', payload: text}))
                text.substring(0, 1) !== '[' && isXS(m) && dispatch(actions.mapAction({type: 'insertSOText', payload: text}))
                text.substring(0, 1) === '[' && isXR(m) && dispatch(actions.mapAction({type: 'pasteSOR', payload: text}))
                text.substring(0, 1) === '[' && isXS(m) && dispatch(actions.mapAction({type: 'pasteSO', payload: text}))
                text.substring(0, 2) === '\\[' && isXR(m) && dispatch(actions.mapAction({type: 'insertSOREquation', payload: text}))
                text.substring(0, 2) === '\\[' && isXS(m) && dispatch(actions.mapAction({type: 'insertSOEquation', payload: text}))
                isUrl(text) && isXR(m) && dispatch(actions.mapAction({type: 'insertSORLink', payload: text}))
                isUrl(text) && isXS(m) && dispatch(actions.mapAction({type: 'insertSOLink', payload: text}))
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
                  isXR(m) && dispatch(actions.mapAction({type: 'insertSORImage', payload: response}))
                  isXS(m) && dispatch(actions.mapAction({type: 'insertSOImage', payload: response}))
                }))
            })
          }
        })
      }
    })
  }

  const mouseup = (e: MouseEvent) => {
    dispatch(actions.resetConnectionStart())
  }

  const wheel = (e: WheelEvent) => {
    e.preventDefault()
    dispatch(actions.closeContextMenu())
  }

  const contextmenu = (e: MouseEvent) => {
    e.preventDefault()
  }

  const addMapListeners = () => {
    mapAreaListener = new AbortController()
    const {signal} = mapAreaListener
    window.addEventListener("keydown", keydown, {signal})
    window.addEventListener("paste", paste, {signal})
    window.addEventListener("wheel", wheel, {signal, passive: false})
    window.addEventListener("mouseup", mouseup, {signal})
    window.addEventListener("contextmenu", contextmenu, {signal})
  }

  const removeMapListeners = () => {
    if (mapAreaListener !== undefined) {
      mapAreaListener.abort()
    }
  }

  useEffect(() => {
    if (editedNodeId) {
      console.log('REMOVED')
      removeMapListeners()
    } else {
      if (pageState === PageState.WS) {
        if (access === AccessTypes.EDIT) {
          console.log('ADDED')
          addMapListeners()
        } else if (access === AccessTypes.VIEW) {
          // TODO figure out view listeners
        }
      }
    }
    return () => {
      removeMapListeners()
    }
  }, [pageState, access, editedNodeId])

  const timeoutFun = () => {
    dispatch(api.endpoints.saveMap.initiate({
      mapId: getMapId(),
      frameId: getFrameId(),
      mapData: mapDeInit(getMap().filter((gn: GN) => (gn.hasOwnProperty('path') && gn.hasOwnProperty('nodeId'))))
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
