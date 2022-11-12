// @ts-nocheck

import {FC, useEffect} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {getColors} from '../core/Colors'
import {getCoords, getNativeEvent, setEndOfContentEditable} from "../core/DomUtils"
import {getMap, getMapData, reDraw} from '../core/MapFlow'
import {MapRight, PageState} from "../core/Types"
import {isUrl} from '../core/Utils'
import {useMapDispatch} from "../hooks/UseMapDispatch";
import {mapFindNearest} from "../map/MapFindNearest"
import {mapFindOverPoint} from "../map/MapFindOverPoint"
import {mapFindOverRectangle} from "../map/MapFindOverRectangle"
import {actions, sagaActions} from "../core/EditorFlow"

let whichDown = 0, fromX, fromY, elapsed = 0
let namedInterval
let isIntervalRunning = false
let isNodeClicked = false
let isTaskClicked = false
let mutationObserver
let isEditing = 0
let mapAreaListener
let landingAreaListener

export const WindowListeners: FC = () => {

  const colorMode = useSelector((state: RootStateOrAny) => state.colorMode)
  const mapId = useSelector((state: RootStateOrAny) => state.mapId)
  const mapSource = useSelector((state: RootStateOrAny) => state.mapSource)
  const mapRight = useSelector((state: RootStateOrAny) => state.mapRight)
  const pageState = useSelector((state: RootStateOrAny) => state.pageState)
  const mapStackData = useSelector((state: RootStateOrAny) => state.mapStackData)
  const mapStackDataIndex = useSelector((state: RootStateOrAny) => state.mapStackDataIndex)
  const cmdList = useSelector((state: RootStateOrAny) => state.cmdList)

  const dispatch = useDispatch()
  const mapDispatch = (action: string, payload: any) => useMapDispatch(dispatch, colorMode, action, payload)

  // EDIT
  const mutationFun = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'characterData') {
        const m = getMap()
        const lm = getMapData(m, m.sc.lastPath)
        const holderElement = document.getElementById(`${lm.nodeId}_div`)
        mapDispatch('typeText', holderElement.innerHTML)
      }
    }
  }

  const startEdit = () => {
    const m = getMap()
    const lm = getMapData(m, m.sc.lastPath)
    if (!lm.hasCell) {
      mapDispatch('startEdit')
      isEditing = 1
      const holderElement = document.getElementById(`${lm.nodeId}_div`)
      holderElement.contentEditable = 'true'
      setEndOfContentEditable(holderElement)
      mutationObserver = new MutationObserver(mutationsList => mutationFun(mutationsList))
      mutationObserver.observe(holderElement, {
        attributes: false,
        childList: false,
        subtree: true,
        characterData: true
      })
    }
  }

  const finishEdit = () => {
    mutationObserver.disconnect()
    isEditing = 0
    const m = getMap()
    const lm = getMapData(m, m.sc.lastPath)
    const holderElement = document.getElementById(`${lm.nodeId}_div`)
    holderElement.contentEditable = 'false'
    mapDispatch('finishEdit', holderElement.innerHTML)
  }

  const eraseContent = () => {
    const m = getMap()
    const lm = getMapData(m, m.sc.lastPath)
    if (!lm.hasCell) {
      mapDispatch('eraseContent')
      // why doesn't the innerHTML reset from mapVisualizeSvg in this case?
      const holderElement = document.getElementById(`${lm.nodeId}_div`)
      holderElement.innerHTML = ''
    }
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
    mapDispatch('shouldResize')
  }

  const popstate = (e) => {
  }

  const mousedown = (e) => {
    e.preventDefault()
    const {path, which} = getNativeEvent(e)
    if (path.find(el => el.id === 'mapSvgOuter')) {
      if (whichDown === 0) {
        whichDown = which
        if (isEditing === 1) {
          finishEdit()
        }
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
          lastOverPath = mapFindOverPoint.start(getMapData(m, ['r', 0]), fromX, fromY)
          isNodeClicked = lastOverPath.length
        }
        if (which === 1) {
          if (isTaskClicked) {
            mapDispatch('setTaskStatus', {taskStatus: parseInt(path[0].id.charAt(27), 10), nodeId: path[0].id.substring(0, 12)})
          } else if (isNodeClicked) {
            let lm = getMapData(m, lastOverPath)
            if (lm.linkType === '') {
              if (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey) {
                mapDispatch('selectStruct', {lastOverPath})
              } else {
                mapDispatch('selectStructToo', {lastOverPath})
              }
            } else {
              whichDown = 0
              if (lm.linkType === 'internal') {
                dispatch(sagaActions.openMapFromMap(lastOverPath))
              } else if (lm.linkType === 'external') {
                window.open(lm.link, '_blank')
                window.focus()
              }
            }
          } else {
            // TODO investigate why this causes a false item in state
            console.log('now...')
            mapDispatch('clearSelection')
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
        mapDispatch('shouldScroll', { movementX, movementY })
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
            const { moveTargetPath, moveTargetIndex } = mapFindNearest.find(m, toX, toY)
            if (moveTargetPath.length) {
              mapDispatch('moveTarget', { moveTargetPath, moveTargetIndex })
            }
          } else {
            const [toX, toY] = getCoords(e)
            const { highlightTargetPathList } = mapFindOverRectangle.find(m, fromX, fromY, toX, toY)
            mapDispatch('selectTarget', { highlightTargetPathList })
            // if (m.sc.structSelectedPathList.length === 0 &&
            //   m.sc.cellSelectedPathList.length === 0) {
            //   mapDispatch('select_R')
            // }
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
        startEdit()
      } else {
        mapDispatch('shouldCenter')
      }
    }
  }

  const keydown = (e) => {
    const {key, code, which} = getNativeEvent(e)
    const m = getMap()
    // [37,38,39,40] = [left,up,right,down]
    const keyStateMachineDb = [
      [ 'c','s','a', 'keyMatch',                    'e','scope',                     'p','m','fe','ec', 'action',               'se'],
      [  0,  0,  0,  key === 'F1',                   0, ['s', 'c', 'm'],              1,  0,  0,   0, '',                        0  ],
      [  0,  0,  0,  key === 'F2',                   0, ['s', 'm'],                   1,  0,  0,   0, '',                        1  ],
      [  0,  0,  0,  key === 'F3',                   0, ['s', 'c', 'm'],              1,  0,  0,   0, '',                        0  ],
      [  0,  0,  0,  key === 'F5',                   0, ['s', 'c', 'm'],              0,  0,  0,   0, '',                        0  ],
      [  0,  0,  0,  key === 'Enter',                1, ['s', 'm'],                   1,  0,  1,   0, '',                        0  ],
      [  0,  0,  0,  key === 'Enter',                0, ['s'],                        1,  1,  0,   0, 'insert_D_S',              1  ],
      [  0,  0,  0,  key === 'Enter',                0, ['m'],                        1,  1,  0,   0, 'select_D_M',              0  ],
      [  0,  1,  0,  key === 'Enter',                0, ['s', 'm'],                   1,  1,  0,   0, 'insert_U_S',              1  ],
      [  0,  0,  1,  key === 'Enter',                0, ['s'],                        1,  1,  0,   0, 'cellifyMulti',            0  ],
      [  0,  0,  0,  key === 'Insert',               1, ['s'],                        1,  1,  1,   0, 'insert_O_S',              1  ],
      [  0,  0,  0,  key === 'Insert',               0, ['s'],                        1,  1,  0,   0, 'insert_O_S',              1  ],
      [  0,  0,  0,  key === 'Insert',               0, ['m'],                        1,  1,  0,   0, 'select_O_M',              0  ],
      [  0,  0,  0,  key === 'Tab',                  1, ['s'],                        1,  1,  1,   0, 'insert_O_S',              1  ],
      [  0,  0,  0,  key === 'Tab',                  0, ['s'],                        1,  1,  0,   0, 'insert_O_S',              1  ],
      [  0,  0,  0,  key === 'Tab',                  0, ['m'],                        1,  1,  0,   0, 'select_O_M',              0  ],
      [  0,  0,  0,  key === 'Delete',               0, ['s'],                        1,  1,  0,   0, 'delete_S',                0  ],
      [  0,  0,  0,  key === 'Delete',               0, ['cr', 'cc'],                 1,  1,  0,   0, 'delete_CRCC',             0  ],
      [  0,  0,  0,  code === 'Space',               0, ['s'],                        1,  1,  0,   0, 'select_S_F_M',            0  ],
      [  0,  0,  0,  code === 'Space',               0, ['m'],                        1,  1,  0,   0, 'select_M_F_S',            0  ],
      [  0,  0,  0,  code === 'Space',               0, ['c'],                        1,  1,  0,   0, '',                        0  ],
      [  0,  0,  0,  code === 'Space',               0, ['cr', 'cc'],                 1,  1,  0,   0, 'select_CRCC_F_M',         0  ],
      [  0,  0,  0,  code === 'Backspace',           0, ['s'],                        1,  1,  0,   0, 'select_S_B_M',            0  ],
      [  0,  0,  0,  code === 'Backspace',           0, ['c', 'cr', 'cc'],            1,  1,  0,   0, 'select_CCRCC_B_S',        0  ],
      [  0,  0,  0,  code === 'Backspace',           0, ['m'],                        1,  1,  0,   0, 'select_M_BB_S',           0  ],
      [  0,  0,  0,  code === 'Escape',              0, ['s', 'c', 'm'],              1,  1,  0,   0, 'select_R',                0  ],
      [  1,  0,  0,  code === 'KeyA',                0, ['s', 'c', 'm'],              1,  0,  0,   0, 'select_all',              0  ],
      [  1,  0,  0,  code === 'KeyM',                0, ['s', 'c', 'm'],              1,  0,  0,   0, 'createMapInMap',          0  ],
      [  1,  0,  0,  code === 'KeyC',                0, ['s', 'c', 'm'],              1,  1,  0,   0, 'copySelection',           0  ],
      [  1,  0,  0,  code === 'KeyX',                0, ['s', 'c', 'm'],              1,  1,  0,   0, 'cutSelection',            0  ],
      [  1,  0,  0,  code === 'KeyS',                0, ['s', 'c', 'm'],              1,  0,  0,   0, 'saveMap',                 0  ],
      [  1,  0,  0,  code === 'KeyS',                1, ['s', 'c', 'm'],              1,  0,  1,   0, 'saveMap',                 0  ],
      [  1,  0,  0,  code === 'KeyZ',                0, ['s', 'c', 'm', 'cr', 'cc'],  1,  0,  0,   0, 'redo',                    0  ],
      [  1,  0,  0,  code === 'KeyY',                0, ['s', 'c', 'm', 'cr', 'cc'],  1,  0,  0,   0, 'undo',                    0  ],
      [  1,  0,  0,  code === 'KeyE',                0, ['s'],                        1,  1,  0,   0, 'transpose',               0  ],
      [  0,  1,  0,  [37,39].includes(which),        0, ['c', 'm'],                   1,  1,  0,   0, 'select_CR',               0  ],
      [  0,  1,  0,  [38,40].includes(which),        0, ['c', 'm'],                   1,  1,  0,   0, 'select_CC',               0  ],
      [  0,  0,  0,  [37,38,39,40].includes(which),  0, ['s'],                        1,  1,  0,   0, 'selectNeighborStruct',    0  ],
      [  0,  1,  0,  [38,40].includes(which),        0, ['s'],                        1,  1,  0,   0, 'selectNeighborStructToo', 0  ],
      [  0,  1,  0,  [37,39].includes(which),        0, ['s'],                        1,  1,  0,   0, 'selectDescendantsOut',    0  ],
      [  0,  0,  0,  [37,38,39,40].includes(which),  0, ['m'],                        1,  1,  0,   0, 'selectNeighborMixed',     0  ],
      [  0,  0,  0,  [37,38,39,40].includes(which),  0, ['cr', 'cc'],                 1,  1,  0,   0, 'select_CRCC',             0  ],
      [  1,  0,  0,  [37,38,39,40].includes(which),  0, ['s'],                        1,  1,  0,   0, 'move_S',                  0  ],
      [  1,  0,  0,  [37,38,39,40].includes(which),  0, ['cr', 'cc'],                 1,  1,  0,   0, 'move_CRCC',               0  ],
      [  0,  0,  1,  [37,38,39,40].includes(which),  0, ['m'],                        1,  1,  0,   0, 'insert_M_CRCC',           0  ],
      [  0,  0,  1,  [37,38,39,40].includes(which),  0, ['c',],                       1,  1,  0,   0, 'insert_CX_CRCC',          0  ],
      [  0,  0,  1,  [37,39].includes(which),        0, ['cc',],                      1,  1,  0,   0, 'insert_CX_CRCC',          0  ],
      [  0,  0,  1,  [38,40].includes(which),        0, ['cr',],                      1,  1,  0,   0, 'insert_CX_CRCC',          0  ],
      [  0,  0,  1,  [37,38,39,40].includes(which),  0, ['s', 'c', 'cr', 'cc'],       1,  0,  0,   0, '',                        0  ],
      [  1,  0,  0,  which >= 96 && which <= 105,    0, ['s', 'm'],                   1,  1,  0,   0, 'applyColorFromKey',       0  ],
      [  0,  0,  0,  which >= 48,                    0, ['s', 'm'],                   0,  0,  0,   1, '',                        1  ],
      [  0,  1,  0,  which >= 48,                    0, ['s', 'm'],                   0,  0,  0,   1, '',                        1  ],
    ]
    let keyStateMachine = {}
    for (let i = 0; i < keyStateMachineDb.length; i++) {
      for (let h = 0; h < keyStateMachineDb[0].length; h++) {
        keyStateMachine[keyStateMachineDb[0][h]] = keyStateMachineDb[i][h]
      }
      if (
        keyStateMachine.c === +e.ctrlKey &&
        keyStateMachine.s === +e.shiftKey &&
        keyStateMachine.a === +e.altKey &&
        keyStateMachine.keyMatch === true &&
        keyStateMachine.scope.includes(m.sc.scope) &&
        keyStateMachine.e === isEditing
      ) {
        if (keyStateMachine.p) {
          e.preventDefault()
        }
        const { action } = keyStateMachine
        if (keyStateMachine.fe) {
          finishEdit()
        }
        if (keyStateMachine.ec) {
          eraseContent()
        }
        if ([
          'createMapInMap',
          'saveMap',
          'undo',
          'redo',
        ].includes(action)) {
          if (action === 'createMapInMap') dispatch(sagaActions.createMapInMap())
          if (action === 'saveMap') dispatch(sagaActions.saveMap())
          if (action === 'undo') dispatch(actions.undo())
          if (action === 'redo') dispatch(actions.redo())
        } else if (action === 'applyColorFromKey') {
          mapDispatch(action, {currColor: which - 96})
        } else {
          mapDispatch(action, {keyCode: e.code})
        }
        if (keyStateMachine.se) {
          startEdit()
        }
        break
      }
    }
  }

  const paste = (e) => {
    e.preventDefault()
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.read().then(item => {
          let type = item[0].types[0]
          if (type === 'text/plain') {
            navigator.clipboard.readText().then(text => {
              if (isEditing) {
                mapDispatch('insertTextFromClipboardAsText', text)
              } else {
                // set up parentNodeEndXYFrom for all the following to have nice anims
                if (text.substring(0, 1) === '[') {
                  mapDispatch('insertMapFromClipboard', text)
                } else {
                  mapDispatch('insert_O_S')
                  // include this in the below queries instead
                  if (text.substring(0, 2) === '\\[') { // double backslash counts as one character
                    mapDispatch('insertEquationFromClipboardAsNode', text)
                  } else if (isUrl(text)) {
                    mapDispatch('insertElinkFromClipboardAsNode', text)
                  } else {
                    mapDispatch('insertTextFromClipboardAsNode', text)
                  }
                }
              }
            })
          }
          if (type === 'image/png') {
            if (isEditing) {

            } else {
              item[0].getType('image/png').then(image => {
                var formData = new FormData()
                formData.append('upl', image, 'image.png')
                let address = process.env.NODE_ENV === 'development' ?
                  'http://127.0.0.1:8082/feta' :
                  'https://mapboard-server.herokuapp.com/feta'
                fetch(address, {method: 'post', body: formData}).then(response =>
                  response.json().then(response => {
                      mapDispatch('insert_O_S')
                      mapDispatch('insertImageFromLinkAsNode', response)
                    }
                  )
                )
              })
            }
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
    if (mapId !== '' && mapSource !== '') {
      const m = getMap()
      reDraw(m, colorMode) // mapDispatch is futile here, as this does not change state
    }
    const root = document.querySelector(':root')
    root.style.setProperty('--main-color', getColors(colorMode).MAIN_COLOR)
    root.style.setProperty('--page-background-color', getColors(colorMode).PAGE_BACKGROUND)
    root.style.setProperty('--map-background-color', getColors(colorMode).MAP_BACKGROUND)
    root.style.setProperty('--button-color', getColors(colorMode).BUTTON_COLOR)
  }, [colorMode])

  useEffect(() => {
    if (mapStackData.length) {
      const m = getMap()
      reDraw(m, colorMode)
    }
  }, [mapStackData, mapStackDataIndex])

  useEffect(() => {
    if (pageState === PageState.WS) {
      if (mapRight === MapRight.EDIT) {
        addMapListeners()
      } else if (mapRight === MapRight.VIEW) {
        // TODO figure out view listeners
      }
    } else if (pageState === PageState.DEMO) {
      addLandingListeners()
    }
    return () => {
      removeMapListeners()
      removeLandingListeners()
    }
  }, [pageState, mapRight])

  useEffect(() => {
    if (cmdList.length) {
      mapDispatch(cmdList.at(-1))
    }
  }, [cmdList])

  return (
    <></>
  )
}

// TODO next
// - complete useMapDispatch everywhere (only the toggle_task and insert_table left)
// - fix isDimAssigned and introduce mapDiff
// - fix save
// - fix paste - merge what needs merge
// - eventually do the tests for all reducers
