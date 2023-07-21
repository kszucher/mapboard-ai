import {FC, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {AccessTypes, PageState} from "../state/Enums"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {mapActionResolver} from "../core/MapActionResolver"
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState, getFrameId, getMapId} from "../state/ApiState"
import {getMap, mSelector} from "../state/EditorState"
import {mapDeInit} from "../core/MapDeInit"

let namedInterval: NodeJS.Timeout
let isIntervalRunning = false
export let timeoutId: NodeJS.Timeout
let mapAreaListener: AbortController

export const WindowListeners: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const {data} = useOpenWorkspaceQuery()
  const {access} = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()

  // TIMEOUT
  const timeoutFun = () => {
    dispatch(api.endpoints.saveMap.initiate({
      mapId: getMapId(),
      frameId: getFrameId(),
      mapData: mapDeInit(getMap())
    }))
    console.log('saved by timeout')
  }

  // LANDING LISTENERS
  const wheel = (e: WheelEvent) => {
    // e.preventDefault()
    if (!isIntervalRunning) {
      namedInterval = setInterval(function () {
        clearInterval(namedInterval)
        isIntervalRunning = false
        if (Math.sign(e.deltaY) === 1) {
          // dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'redo', null)))
        } else {
          // dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'undo', null)))
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
    if (
      (+e.ctrlKey && e.code === 'KeyZ') ||
      (+e.ctrlKey && e.code === 'KeyY') ||
      (+e.ctrlKey && e.which >= 96 && e.which <= 105) ||
      (e.which < 48)
    ) {
      e.preventDefault()
    }
    dispatch(actions.mapAction(mapActionResolver(getMap(), e, 'kd', null, null)))
  }

  const paste = (e: Event) => {
    e.preventDefault()
    navigator.permissions.query({name: "clipboard-write" as PermissionName}).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.read().then(item => {
          const type = item[0].types[0]
          if (type === 'text/plain') {
            navigator.clipboard.readText()
              .then(text => dispatch(actions.mapAction(mapActionResolver(getMap(), null, 'pt', null, text))))
          } else if (type === 'image/png') {
            item[0].getType('image/png').then(image => {
              const formData = new FormData()
              formData.append('upl', image, 'image.png')
              let address = process.env.NODE_ENV === 'development'
                ? 'http://127.0.0.1:8082/feta'
                : 'https://mapboard-server.herokuapp.com/feta'
              fetch(address, {method: 'post', body: formData})
                .then(response => response.json().then(response => dispatch(actions.mapAction(mapActionResolver(getMap(), null, 'pi', null, response)))))
            })
          }
        })
      }
    })
  }

  const addMapListeners = () => {
    mapAreaListener = new AbortController()
    const {signal} = mapAreaListener
    window.addEventListener("contextmenu", contextmenu, {signal})
    window.addEventListener("keydown", keydown, {signal})
    window.addEventListener("paste", paste, {signal})
    window.addEventListener("wheel", wheel, {signal, passive: false})
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
