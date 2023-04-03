import {FC, useEffect} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {AccessTypes, PageState} from "../core/Enums"
import {actions} from "../core/EditorReducer"
import {useEventMiddleware} from "../hooks/UseEventMiddleware"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../state/ApiState"
import {getMap} from "../state/EditorState"
import {mapRemoveHelperProps} from "../map/MapRemoveHelperProps"

let namedInterval: NodeJS.Timeout
let isIntervalRunning = false
export let timeoutId: NodeJS.Timeout
let mapAreaListener: AbortController
let landingAreaListener: AbortController

export const WindowListeners: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const m = useSelector((state: RootStateOrAny) => state.editor.mapList[state.editor.mapListIndex])
  const mExists = m && m.length
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const {data} = useOpenWorkspaceQuery()
  const {access} = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch()

  // TIMEOUT
  const timeoutFun = () => {
    dispatch(api.endpoints.saveMap.initiate({
      mapId: getMapId(),
      frameId: getFrameId(),
      mapData: mapRemoveHelperProps(getMap())
    }))
    console.log('saved by timeout')
  }

  // LANDING LISTENERS
  const wheel = (e: WheelEvent) => {
    e.preventDefault()
    if (!isIntervalRunning) {
      namedInterval = setInterval(function () {
        clearInterval(namedInterval)
        isIntervalRunning = false
        if (Math.sign(e.deltaY) === 1) {
          dispatch(actions.redo())
        } else {
          dispatch(actions.undo())
        }
      }, 100)
    }
    isIntervalRunning = true
  }

  // MAP LISTENERS
  const contextmenu = (e: MouseEvent) => {
    e.preventDefault()
  }

  const keydown = (e: KeyboardEvent) => {
    useEventMiddleware({keyboardEvent: e}, dispatch)
  }

  const paste = (e: Event) => {
    e.preventDefault()
    navigator.permissions.query({name: "clipboard-write" as PermissionName}).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.read().then(item => {
          const type = item[0].types[0]
          if (type === 'text/plain') {
            navigator.clipboard.readText().then(text => useEventMiddleware({clipboardPasteTextEvent: {text}}, dispatch))
          } else if (type === 'image/png') {
            item[0].getType('image/png').then(image => {
              const formData = new FormData()
              formData.append('upl', image, 'image.png')
              let address = process.env.NODE_ENV === 'development'
                ? 'http://127.0.0.1:8082/feta'
                : 'https://mapboard-server.herokuapp.com/feta'
              fetch(address, {method: 'post', body: formData}).then(response =>
                response.json().then(response => useEventMiddleware({clipboardPasteImageEvent: response}, dispatch))
              )
            })
          }
        })
      }
    })
  }

  const addLandingListeners = () => {
    landingAreaListener = new AbortController()
    const {signal} = landingAreaListener
    window.addEventListener("wheel", wheel, {signal, passive: false})
  }

  const removeLandingListeners = () => {
    if (landingAreaListener !== undefined) {
      landingAreaListener.abort()
    }
  }

  const addMapListeners = () => {
    mapAreaListener = new AbortController()
    const {signal} = mapAreaListener
    window.addEventListener("contextmenu", contextmenu, {signal})
    window.addEventListener("keydown", keydown, {signal})
    window.addEventListener("paste", paste, {signal})
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
      removeLandingListeners()
    } else {
      if (pageState === PageState.WS) {
        if (access === AccessTypes.EDIT) {
          console.log('ADDED')
          addMapListeners()
        } else if (access === AccessTypes.VIEW) {
          // TODO figure out view listeners
        }
      } else if (pageState === PageState.DEMO) {
        addLandingListeners()
      }
    }
    return () => {
      removeMapListeners()
      removeLandingListeners()
    }
  }, [pageState, access, editedNodeId])

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
