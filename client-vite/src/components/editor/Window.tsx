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
  const dm = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))

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

    ckm === '---' && e.key === 'F2' && isXS(m) && getX(m).contentType === 'text' && getCountXCO1(m) === 0 && dm(MR.startEditAppend)
    ckm === '---' && e.key === 'Enter' && isXS(m) && dm(MR.insertSD)
    ckm === '---' && e.key === 'Enter' && isXC(m) && dm(MR.selectCD)
    ckm === '-s-' && e.key === 'Enter' && isXS(m) && dm(MR.insertSU)
    ckm === '---' && ['Insert','Tab'].includes(e.key) && (isXS(m) || isXR(m)) && dm(MR.insertSO)
    ckm === '---' && e.key === 'Delete' && isXS(m) && dm(MR.deleteS)
    ckm === '---' && e.key === 'Delete' && isXR(m) && getLastIndexR(m) > 0 && mTR(m).some(ri => !ri.selected) && dm(MR.deleteLR)
    ckm === '---' && e.key === 'Delete' && isXACR(m) && dm(MR.deleteCR)
    ckm === '---' && e.key === 'Delete' && isXACC(m) && dm(MR.deleteCC)
    ckm === '---' && e.code === 'Space' && isXR(m) && dm(MR.selectSO)
    ckm === '---' && e.code === 'Space' && isXS(m) && getCountXCO1(m) > 0 && dm(MR.selectCFF)
    ckm === '---' && e.code === 'Space' && isXC(m) && getCountXSO1(m) > 0 && dm(MR.selectSF)
    ckm === '---' && e.code === 'Space' && isXACR(m) && dm(MR.selectCFC0)
    ckm === '---' && e.code === 'Space' && isXACC(m) && dm(MR.selectCFR0)
    ckm === '---' && e.code === 'Backspace' && isXRS(m) && dm(MR.selectXR)
    ckm === '---' && e.code === 'Backspace' && isXS(m) && getX(m).path.includes('c') && dm(MR.selectXSIC)
    ckm === '---' && e.code === 'Backspace' && (isXC(m) || isXACR(m) || isXACC(m)) && dm(MR.selectSI)
    ckm === '---' && e.code === 'Escape' && dm(MR.selectXR)
    ckm === 'c--' && e.code === 'KeyA' && dm(MR.selectSA)
    ckm === 'c--' && e.code === 'KeyC' && isXAR(m) && dm(MR.copyLR)
    ckm === 'c--' && e.code === 'KeyC' && isXASVN(m) && dm(MR.copyS)
    ckm === 'c--' && e.code === 'KeyX' && isXAR(m) && getLastIndexR(m) > 0 && dm(MR.cutLR)
    ckm === 'c--' && e.code === 'KeyX' && isXASVN(m) && dm(MR.cutS)
    ckm === 'c--' && e.code === 'KeyZ' && dm(MR.redo)
    ckm === 'c--' && e.code === 'KeyY' && dm(MR.undo)

    ckm === '---' && e.code === 'ArrowDown' && isXS(m) && getCountQuasiSD(m) > 0 && dm(MR.selectSD)
    ckm === '---' && e.code === 'ArrowDown' && isXC(m) && !isXCB(m) && dm(MR.selectCD)
    ckm === '---' && e.code === 'ArrowDown' && isXACR(m) && !isXCB(m) && dm(MR.selectCD)
    ckm === 'c--' && e.code === 'ArrowDown' && isXR(m) && dm(MR.offsetD)
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getCountXASD(m) === 0 && dm(MR.moveST)
    ckm === 'c--' && e.code === 'ArrowDown' && isXASVN(m) && getCountXASD(m) > 0 && dm(MR.moveSD)
    ckm === 'c--' && e.code === 'ArrowDown' && isXACR(m) && !isXCB(m) && dm(MR.moveCRD)
    ckm === '-s-' && e.code === 'ArrowDown' && isXS(m)  && getCountQuasiSD(m) > 0 && dm(MR.selectTooSD)
    ckm === '-s-' && e.code === 'ArrowDown' && isXC(m) && dm(MR.selectSameCC)
    ckm === '--a' && e.code === 'ArrowDown' && isXACR(m) && dm(MR.insertCRD)

    ckm === '---' && e.code === 'ArrowUp' && isXS(m) && getCountQuasiSU(m) > 0 && dm(MR.selectSU)
    ckm === '---' && e.code === 'ArrowUp' && isXC(m) && !isXCT(m) && dm(MR.selectCU)
    ckm === '---' && e.code === 'ArrowUp' && isXACR(m) && !isXCT(m) && dm(MR.selectCU)
    ckm === 'c--' && e.code === 'ArrowUp' && isXR(m) && dm(MR.offsetU)
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getCountXASU(m) === 0 && dm(MR.moveSB)
    ckm === 'c--' && e.code === 'ArrowUp' && isXASVN(m) && getCountXASU(m) > 0 && dm(MR.moveSU)
    ckm === 'c--' && e.code === 'ArrowUp' && isXACR(m) && !isXCT(m) && dm(MR.moveCRU)
    ckm === '-s-' && e.code === 'ArrowUp' && isXS(m) && getCountQuasiSU(m) > 0 && dm(MR.selectTooSU)
    ckm === '-s-' && e.code === 'ArrowUp' && isXC(m) && dm(MR.selectSameCC)
    ckm === '--a' && e.code === 'ArrowUp' && isXACR(m) && dm(MR.insertCRU)

    ckm === '---' && e.code === 'ArrowRight' && isXS(m) && getCountXSO1(m) > 0 && dm(MR.selectSO)
    ckm === '---' && e.code === 'ArrowRight' && isXC(m) && !isXCR(m) && dm(MR.selectCR)
    ckm === '---' && e.code === 'ArrowRight' && isXACC(m) && !isXCR(m) && dm(MR.selectCR)
    ckm === 'c--' && e.code === 'ArrowRight' && isXR(m) && dm(MR.offsetR)
    ckm === 'c--' && e.code === 'ArrowRight' && isXASVN(m) && getCountXASU(m) > 0 && dm(MR.moveSO)
    ckm === 'c--' && e.code === 'ArrowRight' && isXACC(m) && !isXCR(m) && dm(MR.moveCCR)
    ckm === '-s-' && e.code === 'ArrowRight' && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && dm(MR.selectFamilyX)
    ckm === '-s-' && e.code === 'ArrowRight' && isXC(m) && dm(MR.selectSameCR)
    ckm === '--a' && e.code === 'ArrowRight' && isXACC(m) && dm(MR.insertCCR)

    ckm === '---' && e.code === 'ArrowLeft' && isXS(m) && !isXRS(m) && !isXR(m) && dm(MR.selectSI)
    ckm === '---' && e.code === 'ArrowLeft' && isXC(m) && !isXCL(m) && dm(MR.selectCL)
    ckm === '---' && e.code === 'ArrowLeft' && isXACC(m) && !isXCL(m) && dm(MR.selectCL)
    ckm === 'c--' && e.code === 'ArrowLeft' && isXR(m) && dm(MR.offsetL)
    ckm === 'c--' && e.code === 'ArrowLeft' && isXASVN(m) && !isXRS(m) && dm(MR.moveSI)
    ckm === 'c--' && e.code === 'ArrowLeft' && isXACC(m) && !isXCL(m) && dm(MR.moveCCL)
    ckm === '-s-' && e.code === 'ArrowLeft' && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && dm(MR.selectFamilyX)
    ckm === '-s-' && e.code === 'ArrowLeft' && isXC(m) && dm(MR.selectSameCR)
    ckm === '--a' && e.code === 'ArrowLeft' && isXACC(m) && dm(MR.insertCCL)

    ckm === 'c--' && e.which >= 96 && e.which <= 105 && isXS(m) && dm(MR.setTextColor, shortcutColors[e.which - 96])
    ckm === '---' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isXS(m) && getX(m).contentType === 'text' && getCountXCO1(m) === 0 &&(m) && dm(MR.startEditReplace)
    ckm === '-s-' && e.which >= 48 && ![91,92,93].includes(e.which) && e.key !== 'F2' && isXS(m) && getX(m).contentType === 'text' && getCountXCO1(m) === 0 &&(m) && dm(MR.startEditReplace)
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
                    isPastedLR && dm(MR.pasteLR, text)
                    isPastedS && isXS(m) && dm(MR.pasteSO, text)
                  } else {
                    window.alert('invalid map')
                  }
                } else {
                  if (isUrl(text)) {
                    isXS(m) && dm(MR.insertSOLink, text)
                  } else {
                    isXS(m) && dm(MR.insertSOText, text)
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
                  isXS(m) && dm(MR.insertSOImage, response)
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
