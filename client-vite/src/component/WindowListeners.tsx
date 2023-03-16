import {FC, ReactFragment, useEffect} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {getColors} from '../core/Colors'
import {getCoords} from "./MapDivUtils"
import {getMapData, getSavedMapData} from '../core/MapFlow'
import {AccessTypes, PageState} from "../core/Enums"
import {useMapDispatch} from "../hooks/UseMapDispatch"
import {mapFindNearest} from "../map/MapFindNearest"
import {mapFindOverRectangle} from "../map/MapFindOverRectangle"
import {actions, defaultUseOpenWorkspaceQueryState, getMap, getMapId, getFrameId} from "../core/EditorFlow"
import {useEventMiddleware} from "../hooks/UseEventMiddleware"
import {orient} from "../map/MapVisualizeHolderDiv"
import {gSaveOptional} from "../core/DefaultProps"
import {api, useOpenWorkspaceQuery} from "../core/Api"

let whichDown = 0
let fromX = 0
let fromY = 0
let elapsed = 0
let namedInterval: NodeJS.Timeout
let isIntervalRunning = false
let isNodeClicked = false
let isTaskClicked = false
let mapAreaListener: AbortController
let landingAreaListener: AbortController
export let timeoutId: NodeJS.Timeout

export const WindowListeners: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const m = useSelector((state: RootStateOrAny) => state.editor.mapList[state.editor.mapListIndex])
  const mExists = m && Object.keys(m).length
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const {density, alignment} = m?.g || gSaveOptional
  const {data} = useOpenWorkspaceQuery()
  const {colorMode, mapId, frameId, access} = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch()
  const mapDispatch = (action: string, payload?: any) => useMapDispatch(dispatch, action, payload)

  // TIMEOUT
  const timeoutFun = () => {
    dispatch(api.endpoints.saveMap.initiate({
      mapId: getMapId(),
      frameId: getFrameId(),
      mapData: getSavedMapData(getMap())
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

  const resize = () => {
    const m = getMap()
    orient(m, 'shouldResize', {})
  }

  const popstate = () => {
  }

  const mousedown = (e: MouseEvent) => {
    e.preventDefault()
    console.log(e.composedPath())
    const path = e.composedPath()
    const {which} = e
    if (path.find((el: any) => el.id === 'mapSvgOuter')) {
      // TODO: trigger this @mapSvgOuter, and consider TRIGGERING adding the move/up listeners THERE, and the whole move/select flow shall be encapsulated THERE
      if (whichDown === 0) {
        whichDown = which;
        elapsed = 0
        if (which === 1 || which === 3) {
          [fromX, fromY] = getCoords(e)
        }
      }
    }
  }

  const mousemove = (e: MouseEvent) => {
    e.preventDefault()
    const {which} = e
    const m = getMap()
    if (whichDown === which) {
      elapsed++
      if (which === 1) {
        if (isTaskClicked) {
        } else if (isNodeClicked) {
          const [toX, toY] = getCoords(e)
          const {moveData} = mapFindNearest.find(m, toX, toY)
          mapDispatch('moveTargetPreview', {moveData})
        } else {
          const [toX, toY] = getCoords(e)
          const {highlightTargetPathList, selectionRect} = mapFindOverRectangle.find(m, fromX, fromY, toX, toY)
          dispatch(actions.setSelectionRect(selectionRect))
          mapDispatch('selectTargetPreview', {highlightTargetPathList, selectionRect})
        }
      } else if (which === 2) {
        const {movementX, movementY} = e
        const m = getMap()
        orient(m, 'shouldScroll', {movementX, movementY})
      }
    }
  }

  const mouseup = (e: MouseEvent) => {
    e.preventDefault()
    const {which} = e
    const m = getMap()
    if (whichDown === which) {
      whichDown = 0
      if (elapsed) {
        if (which === 1) {
          if (isTaskClicked) {
          } else if (isNodeClicked) {
            const [toX, toY] = getCoords(e)
            const {moveData, moveTargetPath, moveTargetIndex} = mapFindNearest.find(m, toX, toY)
            mapDispatch('moveTargetPreview', {moveData})
            mapDispatch('moveTarget', {moveTargetPath, moveTargetIndex})
          } else {
            const [toX, toY] = getCoords(e)
            const {highlightTargetPathList, selectionRect} = mapFindOverRectangle.find(m, fromX, fromY, toX, toY)
            dispatch(actions.setSelectionRect([]))
            mapDispatch('selectTarget', {highlightTargetPathList})
          }
        }
      } else {
        if (which === 1) {
          if (isNodeClicked) {
          } else if (isTaskClicked) {
          } else {
            mapDispatch('select_R')
          }
        }
      }
    }
  }

  const dblclick = (e: MouseEvent) => {
    e.preventDefault()
    const path = e.composedPath()
    if (path.find((el: any) => el.id === 'mapSvgOuter')) {
      if (isNodeClicked) {
        // mapDispatch('startEdit')
      } else {
        const m = getMap()
        orient(m, 'shouldCenter', {})
      }
    }
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
    window.addEventListener('resize', resize, {signal})
    window.addEventListener('popstate', popstate, {signal})
    window.addEventListener('dblclick', dblclick, {signal})
    window.addEventListener('mousedown', mousedown, { signal })
    window.addEventListener('mousemove', mousemove, { signal })
    window.addEventListener('mouseup', mouseup, { signal })
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

  useEffect(() => {
    if (mapId !== '') {
      orient(m, 'shouldLoad', {})
    }
  }, [mapId, frameId])

  useEffect(() => {
    if (mapId !== '') {
      orient(m, 'shouldCenter', {})
    }
  }, [density, alignment]) // TODO figure out how to react to the end of moveTarget

  return (
    <></>
  )
}
