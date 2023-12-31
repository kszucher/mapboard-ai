import {FC, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountQuasiSU, getCountQuasiSD, getCountXASD, getCountXASU, getCountXCO1, getCountXSO1, getX, getLastIndexR, isXACC, isXACR, isXASVN, isXC, isXCB, isXCL, isXCR, isXCT, isXR, isXRS, isXS, sortPath, isXAR, mTR} from "../../selectors/MapQueries.ts"
import {isUrl} from "../../utils/Utils"
import {AccessType, DialogState, PageState} from "../../state/Enums"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../../state/NodeApiState"
import {getMap, getScrollOverride, mSelector} from "../../state/EditorState"
import {mapDeInit} from "../../reducers/MapDeInit"
import {N} from "../../state/MapStateTypes"
import {shortcutColors} from "../assets/Colors"

export let timeoutId: NodeJS.Timeout
let mapAreaListener: AbortController

export const Window: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const dialogState = useSelector((state: RootState) => state.editor.dialogState)
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const m = (useSelector((state:RootState) => mSelector(state)))
  const mExists = m && m.length
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const {data} = useOpenWorkspaceQuery()
  const {access} = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()

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

    ckm === '---' && e.key === 'F2' && isXS(m) && getX(m).contentType === 'text' && getCountXCO1(m) === 0 && dispatch(actions.mapAction({type: MR.startEditAppend, payload: null}))
    ckm === '---' && e.key === 'Enter' && isXS(m) && dispatch(actions.mapAction({type: MR.insertSD, payload: null}))
    ckm === '---' && e.key === 'Enter' && isXC(m) && dispatch(actions.mapAction({type: MR.selectCD, payload: null}))
    ckm === '-s-' && e.key === 'Enter' && isXS(m) && dispatch(actions.mapAction({type: MR.insertSU, payload: null}))
    ckm === '---' && ['Insert','Tab'].includes(e.key) && (isXS(m) || isXR(m)) && dispatch(actions.mapAction({type: MR.insertSO, payload: null}))
    ckm === '---' && e.key === 'Delete' && isXS(m) && dispatch(actions.mapAction({type: MR.deleteS, payload: null}))
    ckm === '---' && e.key === 'Delete' && isXR(m) && getLastIndexR(m) > 0 && mTR(m).some(ri => !ri.selected) && dispatch(actions.mapAction({type: MR.deleteLR, payload: null}))
    ckm === '---' && e.key === 'Delete' && isXACR(m) && dispatch(actions.mapAction({type: MR.deleteCR, payload: null}))
    ckm === '---' && e.key === 'Delete' && isXACC(m) && dispatch(actions.mapAction({type: MR.deleteCC, payload: null}))
    ckm === '---' && e.code === 'Space' && isXR(m) && dispatch(actions.mapAction({type: MR.selectSO, payload: null}))
    ckm === '---' && e.code === 'Space' && isXS(m) && getCountXCO1(m) > 0 && dispatch(actions.mapAction({type: MR.selectCFF, payload: null}))
    ckm === '---' && e.code === 'Space' && isXC(m) && getCountXSO1(m) > 0 && dispatch(actions.mapAction({type: MR.selectSF, payload: null}))
    ckm === '---' && e.code === 'Space' && isXACR(m) && dispatch(actions.mapAction({type: MR.selectCFC0, payload: null}))
    ckm === '---' && e.code === 'Space' && isXACC(m) && dispatch(actions.mapAction({type: MR.selectCFR0, payload: null}))
    ckm === '---' && e.code === 'Backspace' && isXRS(m) && dispatch(actions.mapAction({type: MR.selectXR, payload: null}))
    ckm === '---' && e.code === 'Backspace' && isXS(m) && getX(m).path.includes('c') && dispatch(actions.mapAction({type: MR.selectXSIC, payload: null}))
    ckm === '---' && e.code === 'Backspace' && (isXC(m) || isXACR(m) || isXACC(m)) && dispatch(actions.mapAction({type: MR.selectSI, payload: null}))
    ckm === '---' && e.code === 'Escape' && dispatch(actions.mapAction({type: MR.selectXR, payload: null}))
    ckm === 'c--' && e.code === 'KeyA' && dispatch(actions.mapAction({type: MR.selectSA, payload: null}))
    ckm === 'c--' && e.code === 'KeyC' && isXAR(m) && dispatch(actions.mapAction({type: MR.copyLR, payload: null}))
    ckm === 'c--' && e.code === 'KeyC' && isXASVN(m) && dispatch(actions.mapAction({type: MR.copyS, payload: null}))
    ckm === 'c--' && e.code === 'KeyX' && isXAR(m) && getLastIndexR(m) > 0 && dispatch(actions.mapAction({type: MR.cutLR, payload: null}))
    ckm === 'c--' && e.code === 'KeyX' && isXASVN(m) && dispatch(actions.mapAction({type: MR.cutS, payload: null}))
    ckm === 'c--' && e.code === 'KeyZ' && dispatch(actions.mapAction({type: MR.redo, payload: null}))
    ckm === 'c--' && e.code === 'KeyY' && dispatch(actions.mapAction({type: MR.undo, payload: null}))

    ckm === '---' && e.code === 'ArrowDown' && isXS(m) && getCountQuasiSD(m) > 0 && dispatch(actions.mapAction({type: MR.selectSD, payload: null}))
    ckm === '---' && e.code === 'ArrowDown' && isXC(m) && !isXCB(m) && dispatch(actions.mapAction({type: MR.selectCD, payload: null}))
    ckm === '---' && e.code === 'ArrowDown' && isXACR(m) && !isXCB(m) && dispatch(actions.mapAction({type: MR.selectCD, payload: null}))
    ckm === 'c--' && e.code === 'ArrowDown' && isXR(m) && dispatch(actions.mapAction({type: MR.offsetD, payload: null}))
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getCountXASD(m) === 0 && dispatch(actions.mapAction({type: MR.moveST, payload: null}))
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getCountXASD(m) > 0 && dispatch(actions.mapAction({type: MR.moveSD, payload: null}))
    ckm === 'c--' && e.code === 'ArrowDown' && isXACR(m) && !isXCB(m) && dispatch(actions.mapAction({type: MR.moveCRD, payload: null}))
    ckm === '-s-' && e.code === 'ArrowDown' && isXS(m)  && getCountQuasiSD(m) > 0 && dispatch(actions.mapAction({type: MR.selectTooSD, payload: null}))
    ckm === '-s-' && e.code === 'ArrowDown' && isXC(m) && dispatch(actions.mapAction({type: MR.selectSameCC, payload: null}))
    ckm === '--a' && e.code === 'ArrowDown' && isXACR(m) && dispatch(actions.mapAction({type: MR.insertCRD, payload: null}))

    ckm === '---' && e.code === 'ArrowUp' && isXS(m) && getCountQuasiSU(m) > 0 && dispatch(actions.mapAction({type: MR.selectSU, payload: null}))
    ckm === '---' && e.code === 'ArrowUp' && isXC(m) && !isXCT(m) && dispatch(actions.mapAction({type: MR.selectCU, payload: null}))
    ckm === '---' && e.code === 'ArrowUp' && isXACR(m) && !isXCT(m) && dispatch(actions.mapAction({type: MR.selectCU, payload: null}))
    ckm === 'c--' && e.code === 'ArrowUp' && isXR(m) && dispatch(actions.mapAction({type: MR.offsetU, payload: null}))
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getCountXASU(m) === 0 && dispatch(actions.mapAction({type: MR.moveSB, payload: null}))
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getCountXASU(m) > 0 && dispatch(actions.mapAction({type: MR.moveSU, payload: null}))
    ckm === 'c--' && e.code === 'ArrowUp' && isXACR(m) && !isXCT(m) && dispatch(actions.mapAction({type: MR.moveCRU, payload: null}))
    ckm === '-s-' && e.code === 'ArrowUp' && isXS(m) && getCountQuasiSU(m) > 0 && dispatch(actions.mapAction({type: MR.selectTooSU, payload: null}))
    ckm === '-s-' && e.code === 'ArrowUp' && isXC(m) && dispatch(actions.mapAction({type: MR.selectSameCC, payload: null}))
    ckm === '--a' && e.code === 'ArrowUp' && isXACR(m) && dispatch(actions.mapAction({type: MR.insertCRU, payload: null}))

    ckm === '---' && e.code === 'ArrowRight' && isXS(m) && getCountXSO1(m) > 0 && dispatch(actions.mapAction({type: MR.selectSO, payload: null}))
    ckm === '---' && e.code === 'ArrowRight' && isXC(m) && !isXCR(m) && dispatch(actions.mapAction({type: MR.selectCR, payload: null}))
    ckm === '---' && e.code === 'ArrowRight' && isXACC(m) && !isXCR(m) && dispatch(actions.mapAction({type: MR.selectCR, payload: null}))
    ckm === 'c--' && e.code === 'ArrowRight' && isXR(m) && dispatch(actions.mapAction({type: MR.offsetR, payload: null}))
    ckm === 'c--' && e.code === 'ArrowRight' && isXASVN(m) && getCountXASU(m) > 0 && dispatch(actions.mapAction({type: MR.moveSO, payload: null}))
    ckm === 'c--' && e.code === 'ArrowRight' && isXACC(m) && !isXCR(m) && dispatch(actions.mapAction({type: MR.moveCCR, payload: null}))
    ckm === '-s-' && e.code === 'ArrowRight' && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && dispatch(actions.mapAction({type: MR.selectFamilyX, payload: null}))
    ckm === '-s-' && e.code === 'ArrowRight' && isXC(m) && dispatch(actions.mapAction({type: MR.selectSameCR, payload: null}))
    ckm === '--a' && e.code === 'ArrowRight' && isXACC(m) && dispatch(actions.mapAction({type: MR.insertCCR, payload: null}))

    ckm === '---' && e.code === 'ArrowLeft' && isXS(m) && !isXRS(m) && !isXR(m) && dispatch(actions.mapAction({type: MR.selectSI, payload: null}))
    ckm === '---' && e.code === 'ArrowLeft' && isXC(m) && !isXCL(m) && dispatch(actions.mapAction({type: MR.selectCL, payload: null}))
    ckm === '---' && e.code === 'ArrowLeft' && isXACC(m) && !isXCL(m) && dispatch(actions.mapAction({type: MR.selectCL, payload: null}))
    ckm === 'c--' && e.code === 'ArrowLeft' && isXR(m) && dispatch(actions.mapAction({type: MR.offsetL, payload: null}))
    ckm === 'c--' && e.code === 'ArrowLeft' && isXASVN(m) && !isXRS(m) && dispatch(actions.mapAction({type: MR.moveSI, payload: null}))
    ckm === 'c--' && e.code === 'ArrowLeft' && isXACC(m) && !isXCL(m) && dispatch(actions.mapAction({type: MR.moveCCL, payload: null}))
    ckm === '-s-' && e.code === 'ArrowLeft' && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && dispatch(actions.mapAction({type: MR.selectFamilyX, payload: null}))
    ckm === '-s-' && e.code === 'ArrowLeft' && isXC(m) && dispatch(actions.mapAction({type: MR.selectSameCR, payload: null}))
    ckm === '--a' && e.code === 'ArrowLeft' && isXACC(m) && dispatch(actions.mapAction({type: MR.insertCCL, payload: null}))

    ckm === 'c--' && e.which >= 96 && e.which <= 105 && isXS(m) && dispatch(actions.mapAction({type: MR.setTextColor, payload: shortcutColors[e.which - 96]}))
    ckm === '---' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isXS(m) && getX(m).contentType === 'text' && getCountXCO1(m) === 0 &&(m) && dispatch(actions.mapAction({type: MR.startEditReplace, payload: null}))
    ckm === '-s-' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isXS(m) && getX(m).contentType === 'text' && getCountXCO1(m) === 0 &&(m) && dispatch(actions.mapAction({type: MR.startEditReplace, payload: null}))
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
                  let mapJson = JSON.parse(text)
                  let isValidMap = Array.isArray(mapJson) && mapJson.every(el =>
                    el.hasOwnProperty('path') && Array.isArray(el.path) &&
                    el.hasOwnProperty('nodeId') && typeof el.nodeId === 'string'
                  )
                  if (isValidMap) {
                    const isPastedLR = mapJson.at(-1).path.at(0) === 'r'
                    const isPastedS = mapJson.at(-1).path.at(0) === 's'
                    isPastedLR && dispatch(actions.mapAction({type: MR.pasteLR, payload: text}))
                    isPastedS && isXS(m) && dispatch(actions.mapAction({type: MR.pasteSO, payload: text}))
                  } else {
                    window.alert('invalid map')
                  }
                } else {
                  if (isUrl(text)) {
                    isXS(m) && dispatch(actions.mapAction({type: MR.insertSOLink, payload: text}))
                  } else {
                    isXS(m) && dispatch(actions.mapAction({type: MR.insertSOText, payload: text}))
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
                  isXS(m) && dispatch(actions.mapAction({type: MR.insertSOImage, payload: response}))
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

  const wheel = (e: WheelEvent) => {
    if (getScrollOverride()) {
      e.preventDefault()
    }
  }

  const contextmenu = (e: MouseEvent) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (editedNodeId) {
      console.log('REMOVED')
      if (mapAreaListener !== undefined) {
        mapAreaListener.abort()
      }
    } else {
      if (pageState === PageState.WS && dialogState === DialogState.NONE) {
        if (access === AccessType.EDIT) {
          console.log('ADDED')
          mapAreaListener = new AbortController()
          const {signal} = mapAreaListener
          window.addEventListener("keydown", keydown, {signal})
          window.addEventListener("paste", paste, {signal})
          window.addEventListener("wheel", wheel, {signal, passive: false})
          window.addEventListener("mouseup", mouseup, {signal})
          window.addEventListener("contextmenu", contextmenu, {signal})
        } else if (access === AccessType.VIEW) {
          mapAreaListener = new AbortController()
          const {signal} = mapAreaListener
          window.addEventListener("wheel", wheel, {signal, passive: false})
        }
      }
    }
    return () => {
      if (mapAreaListener !== undefined) {
        mapAreaListener.abort()
      }
    }
  }, [pageState, dialogState, access, editedNodeId])

  const timeoutFun = () => {
    dispatch(nodeApi.endpoints.saveMap.initiate({
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
