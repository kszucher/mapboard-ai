// @ts-nocheck

import {FC, useEffect} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {mapReducer, recalc, redraw} from '../core/MapFlow'
import {copy, isUrl, setEndOfContenteditable, subsref} from '../core/Utils'
import {mapFindOverPoint} from "../map/MapFindOverPoint"
import {selectionState} from "../core/SelectionFlow"
import {actions, sagaActions} from "../core/EditorFlow"
import {getColors} from '../core/Colors'
import {MapRight, PageState} from "../core/Types";
import {mapAssembly} from '../map/MapAssembly'
import {mapDisassembly} from '../map/MapDisassembly'
import {mapDeinit} from '../map/MapDeinit'

let fromX, fromY, whichDown = 0, elapsed = 0
let namedInterval
let isIntervalRunning = false
let isNodeClicked = false
let isTaskClicked = false
let mutationObserver
let isEditing = 0
let mapAreaListener
let landingAreaListener

const getCoords = (e) => {
  let winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  let winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  let mapHolderDiv = document.getElementById('mapHolderDiv')
  let x = e.pageX - winWidth + mapHolderDiv.scrollLeft
  let y = e.pageY - winHeight + mapHolderDiv.scrollTop
  return [x, y]
}

const getNativeEvent = ({path, composedPath, key, code, which}) =>
  ({ path: path || (composedPath && composedPath()), key, code, which })

// TODO
// step 1 kill mapStackDispatch by
// - moving dataIndex under store
// - move push, checkPop from outside to inside WL FC
// - dissolve mapStackReducer into normal reducers
// - have mapref use store.getState() to get current index (push and checkpop can use it with useSelector
// step 2 kill mapStackSaga
// - introduce loadData after changing dataIndex in the state
// - have undo/redo buttons react to it directly

// remove redraw - 20 lines
// add paste + 60 lines
// sum 560 lines

export let mapStack = {
  data: [],
  dataIndex: 0,
}

export function mapStackDispatch(action, payload, colorMode) {
  console.log('MAP_STACK_DISPATCH: ' + action)
  switch (action) {
    case 'initMapState': {
      mapStack.data = [mapAssembly(payload.mapData)]
      mapStack.dataIndex = 0 // this can be easily done by requesting the backend to send a 0 value
      break
    }
    case 'undo': {
      if (mapStack.dataIndex > 0) {
        mapStack.dataIndex--
      }
      break
    }
    case 'redo': {
      if (mapStack.dataIndex < mapStack.data.length - 1) {
        mapStack.dataIndex++
      }
      break
    }
  }
  recalc()
  redraw(colorMode)
}

export const mapref = (path) => {
  return subsref(mapStack.data[mapStack.dataIndex], path)
}

// this is a getter, same as when we loadNode, so should be placed accordingly
export const saveMap = () => {
  let cm = copy(mapStack.data[mapStack.dataIndex])
  mapDeinit.start(cm)
  return mapDisassembly.start(cm)
}

export const WindowListeners: FC = () => {

  const mapId = useSelector((state: RootStateOrAny) => state.mapId)
  const mapSource = useSelector((state: RootStateOrAny) => state.mapSource)
  const mapData = useSelector((state: RootStateOrAny) => state.mapData)
  const frameLen = useSelector((state: RootStateOrAny) => state.frameLen)
  const frameSelected = useSelector((state: RootStateOrAny) => state.frameSelected)
  const mapRight = useSelector((state: RootStateOrAny) => state.mapRight)
  const pageState = useSelector((state: RootStateOrAny) => state.pageState)
  const landingData = useSelector((state: RootStateOrAny) => state.landingData)
  const landingDataIndex = useSelector((state: RootStateOrAny) => state.landingDataIndex)
  const node = useSelector((state: RootStateOrAny) => state.node)
  const nodeTriggersMap = useSelector((state: RootStateOrAny) => state.nodeTriggersMap)
  const colorMode = useSelector((state: RootStateOrAny) => state.colorMode)

  const dispatch = useDispatch()

  const mapDispatch = (action, payload) => {
    console.log('MAP_DISPATCH: ' + action)
    // PUSH
    if (mapStack.data.length > mapStack.dataIndex + 1) {
      mapStack.data.length = mapStack.dataIndex + 1
    }
    mapStack.data.push(JSON.parse(JSON.stringify(mapStack.data[mapStack.dataIndex])))
    mapStack.dataIndex++

    // APPLY
    mapReducer(action, payload)
    recalc()

    // CHECK
    if (JSON.stringify(mapStack.data[mapStack.dataIndex]) !==
      JSON.stringify(mapStack.data[mapStack.dataIndex - 1])
    ) {
      redraw(colorMode)
      dispatch(sagaActions.mapStackChanged())
    } else {
      // POP
      // console.log(JSON.stringify(mapStack.data[mapStack.dataIndex]))
      // console.log(JSON.stringify(mapStack.data[mapStack.dataIndex - 1]))
      mapStack.data.length--
      mapStack.dataIndex--
    }

    document.getElementById("mapHolderDiv").focus() // move to mapVisualizeDiv..
  }

  const mutationFun = (lm, mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'characterData') {
        let holderElement = document.getElementById(`${lm.nodeId}_div`)
        lm.content = holderElement.innerHTML
        lm.isDimAssigned = 0
        recalc()
      }
    }
  }

  const startEdit = () => {
    let lm = mapref(selectionState.lastPath)
    if (!lm.hasCell) {
      if (lm.contentType === 'equation') {
        lm.contentType = 'text'
        lm.isDimAssigned = 0
      }
      let holderElement = document.getElementById(`${lm.nodeId}_div`)
      holderElement.contentEditable = 'true'
      setEndOfContenteditable(holderElement)
      isEditing = 1
      lm.isEditing = 1
      mutationObserver = new MutationObserver(mutationsList => mutationFun(lm, mutationsList))
      mutationObserver.observe(holderElement, {
        attributes: false,
        childList: false,
        subtree: true,
        characterData: true
      })
    }
  }

  const finishEdit = () => {
    let lm = mapref(selectionState.lastPath)
    mutationObserver.disconnect()
    let holderElement = document.getElementById(`${lm.nodeId}_div`)
    holderElement.contentEditable = 'false'
    lm.isEditing = 0
    isEditing = 0
    if (lm.content.substring(0, 2) === '\\[') {
      lm.contentType = 'equation'
      lm.isDimAssigned = 0
    } else if (lm.content.substring(0, 1) === '=') {
      lm.contentCalc = lm.content
      lm.isDimAssigned = 0
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
          dispatch(actions.playLandingNext())
        } else {
          dispatch(actions.playLandingPrev())
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
    mapDispatch('setShouldResize')
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
        // push()
        let lastOverPath = []
        if (which === 1 || which === 3) {
          [fromX, fromY] = getCoords(e)
          isTaskClicked = path.find(el => el.id?.substring(17, 27) === 'taskCircle')
          lastOverPath = mapFindOverPoint.start(mapref(['r', 0]), fromX, fromY)
          isNodeClicked = lastOverPath.length
        }
        if (which === 1) {
          if (isTaskClicked) {
            mapDispatch(
              'setTaskStatus', {
                taskStatus: parseInt(path[0].id.charAt(27), 10),
                nodeId: path[0].id.substring(0, 12)
              })
          } else if (isNodeClicked) {
            let lm = mapref(lastOverPath)
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
                // TODO make it as a saga action as this is a side effect
                window.open(lm.link, '_blank')
                window.focus()
              }
            }
          } else {
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
    if (whichDown === which) {
      elapsed++
      if (which === 1) {
        if (isTaskClicked) {
        } else if (isNodeClicked) {
          const [toX, toY] = getCoords(e)
          mapDispatch('moveSelectionPreview', {toX, toY})
        } else {
          const [toX, toY] = getCoords(e)
          mapDispatch('highlightSelection', {fromX, fromY, toX, toY})
        }
      } else if (which === 2) {
        mapDispatch('setShouldScroll', {x: e.movementX, y: e.movementY})
      }
    }
  }

  const mouseup = (e) => {
    e.preventDefault()
    const {which} = getNativeEvent(e)
    if (whichDown === which) {
      whichDown = 0
      if (elapsed) {
        if (which === 1) {
          if (isTaskClicked) {
          } else if (isNodeClicked) {
            let m = mapref(['m'])
            if (m.moveTargetPath.length) {
              mapDispatch('moveSelection')
            }
          } else {
            // TODO remove this as this is not necessary BUT can be kept for prudence
            if (selectionState.structSelectedPathList.length === 0 &&
              selectionState.cellSelectedPathList.length === 0) {
              mapDispatch('select_R')
            }
            let m = mapref(['m'])
            m.selectionRect = []
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
        mapDispatch('setShouldCenter')
      }
    }
  }

  const keydown = (e) => {
    let {scope} = selectionState
    let {key, code, which} = getNativeEvent(e)
    // [37,38,39,40] = [left,up,right,down]
    let keyStateMachineDb = [
      ['c','s','a', 'keyMatch',                     'scope',                     'e','p','m', 'executionList',                          ],
      [ 0,  0,  0,  key === 'F1',                  ['s', 'c', 'm'],               0,  1,  0, []                                         ],
      [ 0,  0,  0,  key === 'F2',                  ['s', 'm'],                    0,  1,  0, ['startEdit']                              ],
      [ 0,  0,  0,  key === 'F3',                  ['s', 'c', 'm'],               0,  1,  0, []                                         ],
      [ 0,  0,  0,  key === 'F5',                  ['s', 'c', 'm'],               0,  0,  0, []                                         ],
      [ 0,  0,  0,  key === 'Enter',               ['s', 'm'],                    1,  1,  0, ['finishEdit']                             ],
      [ 0,  0,  0,  key === 'Enter',               ['s'],                         0,  1,  1, ['insert_D_S', 'startEdit']                ],
      [ 0,  0,  0,  key === 'Enter',               ['m'],                         0,  1,  1, ['select_D_M']                             ],
      [ 0,  1,  0,  key === 'Enter',               ['s', 'm'],                    0,  1,  1, ['insert_U_S', 'startEdit']                ],
      [ 0,  0,  1,  key === 'Enter',               ['s'],                         0,  1,  1, ['cellifyMulti', 'select_first_M']         ],
      [ 0,  0,  0,  key === 'Insert',              ['s'],                         1,  1,  1, ['finishEdit', 'insert_O_S', 'startEdit']  ],
      [ 0,  0,  0,  key === 'Insert',              ['s'],                         0,  1,  1, ['insert_O_S', 'startEdit']                ],
      [ 0,  0,  0,  key === 'Insert',              ['m'],                         0,  1,  1, ['select_O_M']                             ],
      [ 0,  0,  0,  key === 'Tab',                 ['s'],                         1,  1,  1, ['finishEdit', 'insert_O_S', 'startEdit']  ],
      [ 0,  0,  0,  key === 'Tab',                 ['s'],                         0,  1,  1, ['insert_O_S', 'startEdit']                ],
      [ 0,  0,  0,  key === 'Tab',                 ['m'],                         0,  1,  1, ['select_O_M']                             ],
      [ 0,  0,  0,  key === 'Delete',              ['s'],                         0,  1,  1, ['delete_S']                               ],
      [ 0,  0,  0,  key === 'Delete',              ['cr', 'cc'],                  0,  1,  1, ['delete_CRCC']                            ],
      [ 0,  0,  0,  code === 'Space',              ['s'],                         0,  1,  1, ['select_S_F_M']                           ],
      [ 0,  0,  0,  code === 'Space',              ['m'],                         0,  1,  1, ['select_M_F_S']                           ],
      [ 0,  0,  0,  code === 'Space',              ['c'],                         0,  1,  1, []                                         ],
      [ 0,  0,  0,  code === 'Space',              ['cr', 'cc'],                  0,  1,  1, ['select_CRCC_F_M']                        ],
      [ 0,  0,  0,  code === 'Backspace',          ['s'],                         0,  1,  1, ['select_S_B_M']                           ],
      [ 0,  0,  0,  code === 'Backspace',          ['c', 'cr', 'cc'],             0,  1,  1, ['select_CCRCC_B_S']                       ],
      [ 0,  0,  0,  code === 'Backspace',          ['m'],                         0,  1,  1, ['select_M_BB_S']                          ],
      [ 0,  0,  0,  code === 'Escape',             ['s', 'c', 'm'],               0,  1,  1, ['select_R']                               ],
      [ 1,  0,  0,  code === 'KeyA',               ['s', 'c', 'm'],               0,  1,  0, ['select_all']                             ],
      [ 1,  0,  0,  code === 'KeyM',               ['s', 'c', 'm'],               0,  1,  0, ['createMapInMap']                         ],
      [ 1,  0,  0,  code === 'KeyC',               ['s', 'c', 'm'],               0,  1,  1, ['copySelection']                          ],
      [ 1,  0,  0,  code === 'KeyX',               ['s', 'c', 'm'],               0,  1,  1, ['cutSelection']                           ],
      [ 1,  0,  0,  code === 'KeyS',               ['s', 'c', 'm'],               0,  1,  0, ['saveMap']                                ],
      [ 1,  0,  0,  code === 'KeyS',               ['s', 'c', 'm'],               1,  1,  0, ['finishEdit', 'saveMap']                  ],
      [ 1,  0,  0,  code === 'KeyZ',               ['s', 'c', 'm', 'cr', 'cc'],   0,  1,  0, ['redo']                                   ],
      [ 1,  0,  0,  code === 'KeyY',               ['s', 'c', 'm', 'cr', 'cc'],   0,  1,  0, ['undo']                                   ],
      [ 1,  0,  0,  code === 'KeyE',               ['s'],                         0,  1,  1, ['transpose']                              ],
      [ 0,  1,  0,  [37,39].includes(which),       ['c', 'm'],                    0,  1,  1, ['select_CR']                              ],
      [ 0,  1,  0,  [38,40].includes(which),       ['c', 'm'],                    0,  1,  1, ['select_CC']                              ],
      [ 0,  0,  0,  [37,38,39,40].includes(which), ['s'],                         0,  1,  1, ['selectNeighborStruct']                   ],
      [ 0,  1,  0,  [38,40].includes(which),       ['s'],                         0,  1,  1, ['selectNeighborStructToo']                ],
      [ 0,  1,  0,  [37,39].includes(which),       ['s'],                         0,  1,  1, ['selectDescendantsOut']                   ],
      [ 0,  0,  0,  [37,38,39,40].includes(which), ['m'],                         0,  1,  1, ['selectNeighborMixed']                    ],
      [ 0,  0,  0,  [37,38,39,40].includes(which), ['cr', 'cc'],                  0,  1,  1, ['select_CRCC']                            ],
      [ 1,  0,  0,  [37,38,39,40].includes(which), ['s'],                         0,  1,  1, ['move_S']                                 ],
      [ 1,  0,  0,  [37,38,39,40].includes(which), ['cr', 'cc'],                  0,  1,  1, ['move_CRCC']                              ],
      [ 0,  0,  1,  [37,38,39,40].includes(which), ['m'],                         0,  1,  1, ['insert_M_CRCC']                          ],
      [ 0,  0,  1,  [37,38,39,40].includes(which), ['c',],                        0,  1,  1, ['insert_CX_CRCC']                         ],
      [ 0,  0,  1,  [37,39].includes(which),       ['cc',],                       0,  1,  1, ['insert_CX_CRCC']                         ],
      [ 0,  0,  1,  [38,40].includes(which),       ['cr',],                       0,  1,  1, ['insert_CX_CRCC']                         ],
      [ 0,  0,  1,  [37,38,39,40].includes(which), ['s', 'c', 'cr', 'cc'],        0,  1,  0, []                                         ],
      [ 1,  0,  0,  which >= 96 && which <= 105,   ['s', 'm'],                    0,  1,  1, ['applyColorFromKey']                      ],
      [ 0,  0,  0,  which >= 48,                   ['s', 'm'],                    0,  0,  0, ['eraseContent', 'startEdit']              ],
      [ 0,  1,  0,  which >= 48,                   ['s', 'm'],                    0,  0,  0, ['eraseContent', 'startEdit']              ],
    ]

    let keyStateMachine = {}
    for (let i = 0; i < keyStateMachineDb.length; i++) {
      for (let h = 0; h < keyStateMachineDb[0].length; h++) {
        keyStateMachine[keyStateMachineDb[0][h]] = keyStateMachineDb[i][h]
      }
      if (keyStateMachine.scope.includes(scope) &&
        keyStateMachine.e === isEditing &&
        keyStateMachine.c === +e.ctrlKey &&
        keyStateMachine.s === +e.shiftKey &&
        keyStateMachine.a === +e.altKey &&
        keyStateMachine.keyMatch === true) {
        if (keyStateMachine.p) {
          e.preventDefault()
        }
        for (let j = 0; j < keyStateMachine.executionList.length; j++) {
          let currExecution = keyStateMachine.executionList[j]
          if ([
            'createMapInMap',
            'saveMap',
            'undo',
            'redo',
          ].includes(currExecution)) {
            if (currExecution === 'createMapInMap') dispatch(sagaActions.createMapInMap())
            if (currExecution === 'saveMap') dispatch(sagaActions.saveMap())
            if (currExecution === 'undo') dispatch(sagaActions.undo())
            if (currExecution === 'redo') dispatch(sagaActions.redo())
          } else if (currExecution === 'startEdit') {
            startEdit()
          } else if (currExecution === 'finishEdit') {
            finishEdit()
          } else if (currExecution === 'applyColorFromKey') {
            mapDispatch(currExecution, {currColor: which - 96})
          } else {
            mapDispatch(currExecution, {keyCode: e.code})
          }
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
                if (text.substring(0, 1) === '[') {
                  mapDispatch('insertMapFromClipboard', text)
                } else {
                  mapDispatch('insert_O_S')
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
    if (landingData.length) {
      const mapData = landingData[landingDataIndex]
      mapStackDispatch('initMapState', { mapData }, colorMode)
    }
  }, [landingData, landingDataIndex])

  useEffect(() => {
    if (mapId !== '' && mapSource !== '') {
      mapStackDispatch('initMapState', { mapData }, colorMode)
      dispatch(sagaActions.mapStackChanged())
    }
  }, [mapId, mapSource, frameLen, frameSelected])

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
    if (mapId !== '' && mapSource !== '' && nodeTriggersMap) {
      mapDispatch('applyMapParams', node)
    }
  }, [node])

  // useEffect that reacts to button-like commands

  useEffect(() => {
    if (mapId !== '' && mapSource !== '') {
      redraw(colorMode) // mapDispatch is futile here, as this does not change state
      removeMapListeners()
      if (mapRight === MapRight.EDIT) {
        addMapListeners()
      } else if (mapRight === MapRight.VIEW) {
        // TODO figure out view listeners
      }
    }
    const root = document.querySelector(':root')
    root.style.setProperty('--main-color', getColors(colorMode).MAIN_COLOR)
    root.style.setProperty('--page-background-color', getColors(colorMode).PAGE_BACKGROUND)
    root.style.setProperty('--map-background-color', getColors(colorMode).MAP_BACKGROUND)
    root.style.setProperty('--button-color', getColors(colorMode).BUTTON_COLOR)
  }, [colorMode])

  return (
    <></>
  )
}
