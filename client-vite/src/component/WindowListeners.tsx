import {FC, useEffect} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {getColors} from '../core/Colors'
import {getCoords, getNativeEvent} from "./MapDivUtils"
import {getMapData, getSavedMapData} from '../core/MapFlow'
import {AccessTypes, PageState} from "../core/Enums"
import {useMapDispatch} from "../hooks/UseMapDispatch"
import {mapFindNearest} from "../map/MapFindNearest"
import {mapFindOverPoint} from "../map/MapFindOverPoint"
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
  const { density, alignment } = m?.g || gSaveOptional
  const { data } = useOpenWorkspaceQuery(undefined, { skip:  pageState === PageState.AUTH  })
  const { colorMode, mapId, frameId, access } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch()
  const mapDispatch = (action: string, payload?: any) => useMapDispatch(dispatch, action, payload)

  // TIMEOUT
  const timeoutFun = () => {
    dispatch(api.endpoints.saveMap.initiate({ mapId: getMapId(), frameId: getFrameId(), mapData: getSavedMapData(getMap()) }))
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
    const {path, which} = getNativeEvent(e)
    if (path.find((el: any) => el.id === 'mapSvgOuter')) {
      if (whichDown === 0) {
        whichDown = which;
        // @ts-ignore
        (window.getSelection ? window.getSelection() : document.selection).empty()
        elapsed = 0
        let lastOverPath = []
        const m = getMap()
        if (which === 1 || which === 3) {
          [fromX, fromY] = getCoords(e)
          isTaskClicked = path.find((el: any) => el.id === 'taskCircle')
          lastOverPath = mapFindOverPoint.start(m, fromX, fromY)
          isNodeClicked = lastOverPath.length !== 0
        }
        if (which === 1) {
          if (isTaskClicked) {
          } else if (isNodeClicked) {
            let ln = getMapData(m, lastOverPath)
            if (ln.linkType === '') {
              if (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey) {
                mapDispatch('selectStruct', {lastOverPath})
              } else {
                mapDispatch('selectStructToo', {lastOverPath})
              }
            } else {
              whichDown = 0
              if (ln.linkType === 'internal') {
                const ln = getMapData(m, lastOverPath)
                dispatch(api.endpoints.selectMap.initiate({mapId: ln.link, frameId: ''}))
              } else if (ln.linkType === 'external') {
                window.open(ln.link, '_blank')
                window.focus()
              }
            }
          } else {
          }
        } else if (which === 2) {
        } else if (which === 3) {
          if (isNodeClicked) {
            if (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey) {
              mapDispatch('selectStructFamily', {lastOverPath})
            } else {
              mapDispatch('selectStructToo', {lastOverPath}) // TODO: selectStructFamily too
            }
          }
        }
      }
    }
  }

  const mousemove = (e: MouseEvent) => {
    e.preventDefault()
    const {which} = getNativeEvent(e)
    const m = getMap()
    if (whichDown === which) {
      elapsed++
      if (which === 1) {
        if (isTaskClicked) {
        } else if (isNodeClicked) {
          const [toX, toY] = getCoords(e)
          const { moveData } = mapFindNearest.find(m, toX, toY)
          mapDispatch('moveTargetPreview', { moveData })
        } else {
          const [toX, toY] = getCoords(e)
          const { highlightTargetPathList, selectionRect } = mapFindOverRectangle.find(m, fromX, fromY, toX, toY)
          dispatch(actions.setSelectionRect(selectionRect))
          mapDispatch('selectTargetPreview', { highlightTargetPathList, selectionRect })
        }
      } else if (which === 2) {
        const { movementX, movementY } = e
        const m = getMap()
        orient(m, 'shouldScroll', { movementX, movementY })
      }
    }
  }

  const mouseup = (e: MouseEvent) => {
    e.preventDefault()
    const {which} = getNativeEvent(e)
    const m = getMap()
    if (whichDown === which) {
      whichDown = 0
      if (elapsed) {
        if (which === 1) {
          if (isTaskClicked) {
          } else if (isNodeClicked) {
            const [toX, toY] = getCoords(e)
            const { moveData, moveTargetPath, moveTargetIndex } = mapFindNearest.find(m, toX, toY)
            mapDispatch('moveTargetPreview', { moveData })
            mapDispatch('moveTarget', { moveTargetPath, moveTargetIndex })
          } else {
            const [toX, toY] = getCoords(e)
            const { highlightTargetPathList, selectionRect } = mapFindOverRectangle.find(m, fromX, fromY, toX, toY)
            dispatch(actions.setSelectionRect([]))
            mapDispatch('selectTarget', { highlightTargetPathList })
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
    const {path} = getNativeEvent(e)
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

  const paste = (e: ClipboardEvent) => {
    e.preventDefault()
    navigator.permissions.query({name: "clipboard-write" as PermissionName}).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.read().then(item => {
          const type = item[0].types[0]
          if (type === 'text/plain') {
            navigator.clipboard.readText().then(text => useEventMiddleware({clipboardPasteTextEvent: { text }}, dispatch))
          } else if (type === 'image/png') {
            item[0].getType('image/png').then(image => {
              const formData = new FormData()
              formData.append('upl', image, 'image.png')
              let address = process.env.NODE_ENV === 'development'
                ? 'http://127.0.0.1:8082/feta'
                : 'https://mapboard-server.herokuapp.com/feta'
              fetch(address, { method: 'post', body: formData }).then(response =>
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
    window.addEventListener("wheel", wheel, { signal, passive: false })
  }

  const removeLandingListeners = () => {
    if (landingAreaListener !== undefined) {
      landingAreaListener.abort()
    }
  }

  const addMapListeners = () => {
    mapAreaListener = new AbortController()
    const {signal} = mapAreaListener
    window.addEventListener("contextmenu", contextmenu, { signal })
    window.addEventListener('resize', resize, { signal })
    window.addEventListener('popstate', popstate, { signal })
    window.addEventListener('dblclick', dblclick, { signal })
    // window.addEventListener('mousedown', mousedown, { signal })
    // window.addEventListener('mousemove', mousemove, { signal })
    // window.addEventListener('mouseup', mouseup, { signal })
    window.addEventListener("keydown", keydown, { signal })
    //@ts-ignore
    window.addEventListener("paste", paste, { signal })
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
    const root = document.querySelector(':root') as HTMLElement
    root.style.setProperty('--main-color', getColors(colorMode).MAIN_COLOR)
    root.style.setProperty('--page-background-color', getColors(colorMode).PAGE_BACKGROUND)
    root.style.setProperty('--map-background-color', getColors(colorMode).MAP_BACKGROUND)
    root.style.setProperty('--button-color', getColors(colorMode).BUTTON_COLOR)
  }, [colorMode])

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
