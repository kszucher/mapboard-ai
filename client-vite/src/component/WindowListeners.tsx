// @ts-nocheck

import {FC, useEffect} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {addListener, isAnyOf} from "@reduxjs/toolkit";
import {getColors} from '../core/Colors'
import {getCoords, getNativeEvent, setEndOfContentEditable} from "../core/DomUtils"
import {getMapData, reDraw} from '../core/MapFlow'
import {AccessTypes, PageState} from "../core/Types"
import {useMapDispatch} from "../hooks/UseMapDispatch";
import {mapFindNearest} from "../map/MapFindNearest"
import {mapFindOverPoint} from "../map/MapFindOverPoint"
import {mapFindOverRectangle} from "../map/MapFindOverRectangle"
import {actions, defaultUseOpenWorkspaceQueryState, getMap, getMapSaveProps} from "../core/EditorFlow"
import {useEventToAction} from "../hooks/UseEventToAction";
import {orient} from "../map/MapVisualizeHolderDiv";
import {mapProps} from "../core/DefaultProps";
import {flagDomData, initDomData, updateDomData, updateDomDataContentEditableFalse} from "../core/DomFlow";
import {api, useOpenWorkspaceQuery} from "../core/Api";

let whichDown = 0, fromX, fromY, elapsed = 0
let namedInterval
let isIntervalRunning = false
let isNodeClicked = false
let isTaskClicked = false
let mutationObserver
let mapAreaListener
let landingAreaListener
export let timeoutId

export const WindowListeners: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const mapStackData = useSelector((state: RootStateOrAny) => state.editor.mapStackData)
  const m = useSelector((state: RootStateOrAny) => state.editor.mapStackData[state.editor.mapStackDataIndex])
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const mExists = m && Object.keys(m).length
  const tmExists = tm && Object.keys(tm).length
  const { density, alignment } = m?.g || mapProps.saveOptional
  const { data } = useOpenWorkspaceQuery(undefined, { skip:  pageState === PageState.AUTH  })
  const { colorMode, mapId, dataFrameSelected, access } = data?.resp?.data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch()
  const mapDispatch = (action: string, payload: any) => useMapDispatch(dispatch, action, payload)
  const eventToAction = (event: any, eventType: 'string', eventData: object) => useEventToAction(event, eventType, eventData, dispatch, mapDispatch)

  // TIMEOUT
  const timeoutFun = () => {
    dispatch(api.endpoints.saveMap.initiate(getMapSaveProps()))
    console.log('saved by timeout')
  }

  // LANDING LISTENERS
  const wheel = (e) => {
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
  const contextmenu = (e) => {
    e.preventDefault()
  }

  const resize = (e) => {
    const m = getMap()
    orient(m, 'shouldResize', {})
  }

  const popstate = (e) => {
  }

  const mousedown = (e) => {
    e.preventDefault()
    const {path, which} = getNativeEvent(e)
    if (path.find(el => el.id === 'mapSvgOuter')) {
      if (whichDown === 0) {
        whichDown = which;
        (window.getSelection
            ? window.getSelection()
            : document.selection
        ).empty()
        elapsed = 0
        let lastOverPath = []
        const m = getMap()
        if (which === 1 || which === 3) {
          [fromX, fromY] = getCoords(e)
          isTaskClicked = path.find(el => el.id?.substring(17, 27) === 'taskCircle')
          lastOverPath = mapFindOverPoint.start(m, fromX, fromY)
          isNodeClicked = lastOverPath.length
        }
        if (which === 1) {
          if (isTaskClicked) {
            mapDispatch('setTaskStatus', {taskStatus: parseInt(path[0].id.charAt(27), 10), nodeId: path[0].id.substring(0, 12)})
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
                dispatch(api.endpoints.selectMap.initiate({mapId: ln.link}))
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

  const mousemove = (e) => {
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
          mapDispatch('selectTargetPreview', { highlightTargetPathList, selectionRect })
        }
      } else if (which === 2) {
        const { movementX, movementY } = e
        const m = getMap()
        orient(m, 'shouldScroll', { movementX, movementY })
      }
    }
  }

  const mouseup = (e) => {
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
            mapDispatch('selectTargetPreview', { highlightTargetPathList, selectionRect })
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

  const dblclick = (e) => {
    e.preventDefault()
    const {path} = getNativeEvent(e)
    if (path.find(el => el.id === 'mapSvgOuter')) {
      if (isNodeClicked) {
        mapDispatch('startEdit')
      } else {
        const m = getMap()
        orient(m, 'shouldCenter', {})
      }
    }
  }

  const keydown = (e) => {
    eventToAction(e, 'kd', getNativeEvent(e))
  }

  const paste = (e) => {
    e.preventDefault()
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.read().then(item => {
          const type = item[0].types[0]
          if (type === 'text/plain') {
            navigator.clipboard.readText().then(text => eventToAction(e, 'pt', { text }))
          } else if (type === 'image/png') {
            item[0].getType('image/png').then(image => {
              const formData = new FormData()
              formData.append('upl', image, 'image.png')
              let address = process.env.NODE_ENV === 'development'
                ? 'http://127.0.0.1:8082/feta'
                : 'https://mapboard-server.herokuapp.com/feta'
              fetch(address, { method: 'post', body: formData }).then(response =>
                response.json().then(response => eventToAction(e, 'pi', response))
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
    window.addEventListener('mousedown', mousedown, { signal })
    window.addEventListener('mousemove', mousemove, { signal })
    window.addEventListener('mouseup', mouseup, { signal })
    window.addEventListener("keydown", keydown, { signal })
    window.addEventListener("paste", paste, { signal })
  }

  const removeMapListeners = () => {
    if (mapAreaListener !== undefined) {
      mapAreaListener.abort()
    }
  }

  useEffect(() => {
    if (pageState === PageState.WS) {
      if (access === AccessTypes.EDIT) {
        addMapListeners()
      } else if (access === AccessTypes.VIEW) {
        // TODO figure out view listeners
      }
    } else if (pageState === PageState.DEMO) {
      addLandingListeners()
    }
    return () => {
      removeMapListeners()
      removeLandingListeners()
    }
  }, [pageState, access])

  useEffect(() => {
    const root = document.querySelector(':root')
    root.style.setProperty('--main-color', getColors(colorMode).MAIN_COLOR)
    root.style.setProperty('--page-background-color', getColors(colorMode).PAGE_BACKGROUND)
    root.style.setProperty('--map-background-color', getColors(colorMode).MAP_BACKGROUND)
    root.style.setProperty('--button-color', getColors(colorMode).BUTTON_COLOR)
  }, [colorMode])

  useEffect(() => {
    if (mapId !== '') {
      flagDomData()
      updateDomData()
    }
  }, [mapId])

  useEffect(() => {
    if (mExists) {
      if (mapStackData.length > 1) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(timeoutFun, 1000)
      }
    }
  }, [m])

  useEffect(() => {
    if (mExists) {
      reDraw(m, colorMode, editedNodeId)
    }
  }, [m, colorMode])

  useEffect(() => {
    if (tmExists) {
      reDraw(tm, colorMode, editedNodeId)
    }
  }, [tm])

  useEffect(() => {
    if (mExists) {
      if (editedNodeId.length) {
        const holderElement = document.getElementById(`${editedNodeId}_div`)
        holderElement.contentEditable = 'true'
        if (!Object.keys(tm).length) {
          holderElement.innerHTML = ''
        }
        setEndOfContentEditable(holderElement)
        mutationObserver = new MutationObserver(mutationsList => {
          for (let mutation of mutationsList) {
            if (mutation.type === 'characterData') {
              mapDispatch('typeText', holderElement.innerHTML)
            }
          }
        })
        mutationObserver.observe(holderElement, {
          attributes: false,
          childList: false,
          subtree: true,
          characterData: true
        })
      } else {
        if (mutationObserver !== undefined) {
          mutationObserver.disconnect()
          updateDomDataContentEditableFalse()
        }
      }
    }
  }, [editedNodeId])

  useEffect(() => {
    if (mapId !== '') {
      orient(m, 'shouldLoad', {})
    }
  }, [mapId, dataFrameSelected])

  useEffect(() => {
    if (mapId !== '') {
      orient(m, 'shouldCenter', {})
    }
  }, [density, alignment]) // TODO figure out how to react to the end of moveTarget

  return (
    <></>
  )
}
