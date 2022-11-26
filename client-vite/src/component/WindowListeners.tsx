// @ts-nocheck

import {FC, useEffect} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {getColors} from '../core/Colors'
import {getCoords, getNativeEvent, setEndOfContentEditable} from "../core/DomUtils"
import {getMapData, reDraw} from '../core/MapFlow'
import {MapRight, PageState} from "../core/Types"
import {isUrl, toPathString} from '../core/Utils'
import {useMapDispatch} from "../hooks/UseMapDispatch";
import {mapFindNearest} from "../map/MapFindNearest"
import {mapFindOverPoint} from "../map/MapFindOverPoint"
import {mapFindOverRectangle} from "../map/MapFindOverRectangle"
import {actions, getEditedPathString, getMap, getTempMap, sagaActions} from "../core/EditorFlow"

let whichDown = 0, fromX, fromY, elapsed = 0
let namedInterval
let isIntervalRunning = false
let isNodeClicked = false
let isTaskClicked = false
let mutationObserver
let mapAreaListener
let landingAreaListener

export const WindowListeners: FC = () => {

  const colorMode = useSelector((state: RootStateOrAny) => state.colorMode)
  const mapId = useSelector((state: RootStateOrAny) => state.mapId)
  const mapSource = useSelector((state: RootStateOrAny) => state.mapSource)
  const frameSelected = useSelector((state: RootStateOrAny) => state.frameSelected)
  const mapRight = useSelector((state: RootStateOrAny) => state.mapRight)
  const pageState = useSelector((state: RootStateOrAny) => state.pageState)
  const tempMap = useSelector((state: RootStateOrAny) => state.tempMap)
  const mapStackData = useSelector((state: RootStateOrAny) => state.mapStackData)
  const mapStackDataIndex = useSelector((state: RootStateOrAny) => state.mapStackDataIndex)
  const editedPathString = useSelector((state: RootStateOrAny) => state.editedPathString)

  const dispatch = useDispatch()
  const mapDispatch = (action: string, payload: any) => useMapDispatch(dispatch, action, payload)

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
          mapDispatch('moveTargetPreview', { moveData }) // moveDimensions
        } else {
          const [toX, toY] = getCoords(e)
          const { highlightTargetPathList, selectionRect } = mapFindOverRectangle.find(m, fromX, fromY, toX, toY)
          mapDispatch('selectTargetPreview', { highlightTargetPathList, selectionRect }) // selectionDimensions
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
        mapDispatch('startEdit')
      } else {
        mapDispatch('shouldCenter')
      }
    }
  }

  const keydown = (e) => {
    const {key, code, which} = getNativeEvent(e)
    const m = getMap()
    const editedPathString = getEditedPathString()
    if (editedPathString.length) {
      if (key === 'Enter' && !+e.ctrlKey && !+e.shiftKey && !+e.altKey) {
        e.preventDefault()
        mapDispatch('finishEdit')
      } else if (['Insert', 'Tab'].includes(key) && !+e.ctrlKey && !+e.shiftKey && !+e.altKey) {
        e.preventDefault()
        mapDispatch('insert_O_S')
      }
    } else {
      // [L,U,R,D] = [left,up,right,down]
      const L = 37
      const U = 38
      const R = 39
      const D = 40
      // move e to the first column, and merge the lines above
      // remove m
      // add at = action type, d = dispatch, md = mapDispatch, sd = sagaDispatch
      // add payload! the REASON why I could not do this before, as I had event stacks which I don't have now --> also grants type safety (payload always)
      // possibly include conditions such as hasCell, or contentType
      // create a MONAD for csa
      // -> c === 't' if SHOULD BE true
      // -> c === 'f' if SHOULD BE false,
      // -> c === 'a' if ANY
      // make monad from csa
      // 'fff'
      // 'ftf'
      // 'faf'
      // avoid duplication of insert_CX_CRCC, instead introduce the following:
      // insert_UD_CR, which is triggered either by a c OR a cr selection
      // insert_LR_CC, which is triggered either by a c or a cc selection
      // rename keyStateMachindDb to e2a, as this is an 1:1 event to action mapper
      // ONCE DONE, EVENT - ACTION SEPARATION (so NOT just mouseDown events will be checked - very important)
      // key event passes all its data to mapReducer, and the event resolution happens there
      // but this way this becomes an "eventAction" instead of a "realAction"
      // also we could string event to state and let state react, but that is an avoidable step
      // and we can just "dispatch(keydown) --> and the action resolution happens INSIDE"
      // advantage: we can have scope (and other) checks in ONE place
      // so this is a NEW join-type middle layer for ALL map action, which actually makes a lot of sense...
      // so what we need? eventType and eventData... that is all I guess
      // event --> eventToMapActionWithChecks(eventType, eventData) --> mapDispatch(action, payload)
      // THIS IS THE WAY
      const keyStateMachineDb = [
        [ 'c','s','a', 'keyMatch',                    'e','scope',                     'p','m','action',                  ],
        [  0,  0,  0,  key === 'F1',                   0, ['s', 'c', 'm'],              1,  0, '',                        ],
        [  0,  0,  0,  key === 'F2',                   0, ['s', 'm'],                   1,  0, 'startEdit',               ],
        [  0,  0,  0,  key === 'F3',                   0, ['s', 'c', 'm'],              1,  0, '',                        ],
        [  0,  0,  0,  key === 'F5',                   0, ['s', 'c', 'm'],              0,  0, '',                        ],
        [  0,  0,  0,  key === 'Enter',                0, ['s'],                        1,  1, 'insert_D_S',              ],
        [  0,  0,  0,  key === 'Enter',                0, ['m'],                        1,  1, 'select_D_M',              ],
        [  0,  1,  0,  key === 'Enter',                0, ['s', 'm'],                   1,  1, 'insert_U_S',              ],
        [  0,  0,  1,  key === 'Enter',                0, ['s'],                        1,  1, 'cellifyMulti',            ],
        [  0,  0,  0,  ['Insert','Tab'].includes(key), 0, ['s'],                        1,  1, 'insert_O_S',              ],
        [  0,  0,  0,  ['Insert','Tab'].includes(key), 0, ['m'],                        1,  1, 'select_O_M',              ],
        [  0,  0,  0,  key === 'Delete',               0, ['s'],                        1,  1, 'delete_S',                ],
        [  0,  0,  0,  key === 'Delete',               0, ['cr', 'cc'],                 1,  1, 'delete_CRCC',             ],
        [  0,  0,  0,  code === 'Space',               0, ['s'],                        1,  1, 'select_S_F_M',            ],
        [  0,  0,  0,  code === 'Space',               0, ['m'],                        1,  1, 'select_M_F_S',            ],
        [  0,  0,  0,  code === 'Space',               0, ['c'],                        1,  1, '',                        ],
        [  0,  0,  0,  code === 'Space',               0, ['cr', 'cc'],                 1,  1, 'select_CRCC_F_M',         ],
        [  0,  0,  0,  code === 'Backspace',           0, ['s'],                        1,  1, 'select_S_B_M',            ],
        [  0,  0,  0,  code === 'Backspace',           0, ['c', 'cr', 'cc'],            1,  1, 'select_CCRCC_B_S',        ],
        [  0,  0,  0,  code === 'Backspace',           0, ['m'],                        1,  1, 'select_M_BB_S',           ],
        [  0,  0,  0,  code === 'Escape',              0, ['s', 'c', 'm'],              1,  1, 'select_R',                ],
        [  1,  0,  0,  code === 'KeyA',                0, ['s', 'c', 'm'],              1,  0, 'select_all',              ],
        [  1,  0,  0,  code === 'KeyM',                0, ['s', 'c', 'm'],              1,  0, 'createMapInMap',          ],
        [  1,  0,  0,  code === 'KeyC',                0, ['s', 'c', 'm'],              1,  1, 'copySelection',           ],
        [  1,  0,  0,  code === 'KeyX',                0, ['s', 'c', 'm'],              1,  1, 'cutSelection',            ],
        [  1,  0,  0,  code === 'KeyS',                0, ['s', 'c', 'm'],              1,  0, 'saveMap',                 ],
        [  1,  0,  0,  code === 'KeyZ',                0, ['s', 'c', 'm', 'cr', 'cc'],  1,  0, 'redo',                    ],
        [  1,  0,  0,  code === 'KeyY',                0, ['s', 'c', 'm', 'cr', 'cc'],  1,  0, 'undo',                    ],
        [  1,  0,  0,  code === 'KeyE',                0, ['s'],                        1,  1, 'transpose',               ],
        [  0,  1,  0,  [L,R].includes(which),          0, ['c', 'm'],                   1,  1, 'select_CR',               ],
        [  0,  1,  0,  [U,D].includes(which),          0, ['c', 'm'],                   1,  1, 'select_CC',               ],
        [  0,  0,  0,  [L,U,R,D].includes(which),      0, ['s'],                        1,  1, 'selectNeighborStruct',    ], // K
        [  0,  1,  0,  [U,D].includes(which),          0, ['s'],                        1,  1, 'selectNeighborStructToo', ], // K
        [  0,  1,  0,  [L,R].includes(which),          0, ['s'],                        1,  1, 'selectDescendantsOut',    ], // K
        [  0,  0,  0,  [L,U,R,D].includes(which),      0, ['m'],                        1,  1, 'selectNeighborMixed',     ], // K
        [  0,  0,  0,  [L,U,R,D].includes(which),      0, ['cr', 'cc'],                 1,  1, 'select_CRCC',             ], // K
        [  1,  0,  0,  [L,U,R,D].includes(which),      0, ['s'],                        1,  1, 'move_S',                  ], // K
        [  1,  0,  0,  [L,U,R,D].includes(which),      0, ['cr', 'cc'],                 1,  1, 'move_CRCC',               ], // K
        [  0,  0,  1,  [L,U,R,D].includes(which),      0, ['m'],                        1,  1, 'insert_M_CRCC',           ], // K
        [  0,  0,  1,  [L,U,R,D].includes(which),      0, ['c',],                       1,  1, 'insert_CX_CRCC',          ], // K
        [  0,  0,  1,  [L,R].includes(which),          0, ['cc',],                      1,  1, 'insert_CX_CRCC',          ], // K
        [  0,  0,  1,  [U,D].includes(which),          0, ['cr',],                      1,  1, 'insert_CX_CRCC',          ], // K
        [  0,  0,  1,  [L,U,R,D].includes(which),      0, ['s', 'c', 'cr', 'cc'],       1,  0, '',                        ],
        [  1,  0,  0,  which >= 96 && which <= 105,    0, ['s', 'm'],                   1,  1, 'applyColorFromKey',       ],
        [  0,  0,  0,  which >= 48,                    0, ['s', 'm'],                   0,  0, 'deleteContent',           ],
        [  0,  1,  0,  which >= 48,                    0, ['s', 'm'],                   0,  0, 'deleteContent',           ],
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
          keyStateMachine.scope.includes(m.sc.scope)
          // &&
          // isEditing === false
        ) {
          if (keyStateMachine.p) {
            e.preventDefault()
          }
          const { action } = keyStateMachine
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
          } else if (action === 'deleteContent') {
            dispatch(actions.setEditedPathString(toPathString(m.sc.lastPath)))
          } else {
            mapDispatch(action, {keyCode: e.code})
          }
          break
        }
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
                let formData = new FormData()
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
    const root = document.querySelector(':root')
    root.style.setProperty('--main-color', getColors(colorMode).MAIN_COLOR)
    root.style.setProperty('--page-background-color', getColors(colorMode).PAGE_BACKGROUND)
    root.style.setProperty('--map-background-color', getColors(colorMode).MAP_BACKGROUND)
    root.style.setProperty('--button-color', getColors(colorMode).BUTTON_COLOR)
  }, [colorMode])

  useEffect(() => {
    if (mapStackData.length) {
      const m = getMap()
      // console.log('RENDER MAP')
      reDraw(m, colorMode, editedPathString)
    }
  }, [mapStackData, mapStackDataIndex, colorMode])

  useEffect(() => {
    if (Object.keys(tempMap).length) {
      const m = getTempMap()
      // console.log('RENDER TEMP MAP')
      reDraw(m, colorMode, editedPathString)
    }
  }, [tempMap])

  useEffect(() => {
    if (editedPathString.length) {
      if (mapStackData.length) {
        // console.log('EDITING HAS STARTED')
        const m = getMap()
        const lm = getMapData(m, m.sc.lastPath)
        if (!lm.hasCell) {
          const holderElement = document.getElementById(`${lm.nodeId}_div`)
          holderElement.contentEditable = 'true'
          if (!Object.keys(tempMap).length) {
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
        }
      }
    } else {
      if (mapStackData.length) {
        // console.log('EDITING HAS FINISHED')
        mutationObserver?.disconnect()
        const m = getMap()
        const lm = getMapData(m, m.sc.lastPath)
        if (!lm.hasCell) {
          const holderElement = document.getElementById(`${lm.nodeId}_div`)
          holderElement.contentEditable = 'false'
        }
      }
    }
  }, [editedPathString])

  useEffect(() => {
    if (mapId !== '') {
      mapDispatch('shouldLoad')
    }
  }, [mapId, mapSource, frameSelected])

  return (
    <></>
  )
}

// TODO next
// - fix isDimAssigned, once done loading density will work again (done ONCE save is OK again)
// - make mapDiff for all remaining prop in saveNeverInitOnce
// - fix save
// - fix paste - merge what needs merge
// - eventually do the tests for all reducers

// CHARACTERISTICS of the successful adoption of the FLUX pattern (which did not exist before)
// - no DOM operations in reducers (killing things related to edit, exception: reading dom in meas) OK
// - no bidirectional data flow (killing node in EditorState) OK
// - no sagas used where we ONLY have local operations and no server calls OK
// - everything is in the global state: ALL local variables in WL (including mapData and mapStackData and isEditing, except observers and listeners) IN PROGRESS
// - reactive global state with no caching dependencies = no saveNeverInitOnce properties IN PROGRESS
// - reDraw and orient can only exist in a useEffect, never action-based IN PROGRESS
// - no stacking of dispatches IN PROGRESS
