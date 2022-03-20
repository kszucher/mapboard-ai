import React, {useEffect} from "react"
import {useSelector, useDispatch} from "react-redux"
import { mapDispatch, recalc, redraw } from '../core/MapFlow'
import { arraysSame, copy, setEndOfContenteditable } from '../core/Utils'
import {mapFindNearest} from "../map/MapFindNearest"
import {checkPop, mapStackDispatch, mapref, push} from "../core/MapStackFlow"
import {mapFindOverPoint} from "../map/MapFindOverPoint"
import {mapFindOverRectangle} from "../map/MapFindOverRectangle"
import {selectionState} from "../core/SelectionFlow"
import {pasteDispatch} from "../core/PasteFlow"
import {MAP_RIGHTS, PAGE_STATES} from "../core/EditorFlow"

let pageX, pageY, scrollLeft, scrollTop, fromX, fromY, isMouseDown, elapsed = 0
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

export function WindowListeners() {
    const {EDIT, VIEW} = MAP_RIGHTS
    const {DEMO, WS} = PAGE_STATES

    const mapId = useSelector(state => state.mapId)
    const mapSource = useSelector(state => state.mapSource)
    const mapStorage = useSelector(state => state.mapStorage)
    const frameLen = useSelector(state => state.frameLen)
    const frameSelected = useSelector(state => state.frameSelected)
    const mapRight = useSelector(state => state.mapRight)
    const pageState = useSelector(state => state.pageState)
    const landingData = useSelector(state => state.landingData)
    const landingDataIndex = useSelector(state => state.landingDataIndex)
    const node = useSelector(state => state.node)
    const colorMode = useSelector(state => state.colorMode)
    const dispatch = useDispatch()

    const mutationFun = (lm, mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'characterData') {
                let holderElement = document.getElementById(`${lm.nodeId}_div`)
                lm.content = holderElement.innerHTML
                lm.isDimAssigned = 0
                recalc()
                redraw(colorMode)
            }
        }
    }

    const startEdit = () => {
        let lm = mapref(selectionState.lastPath)
        if (!lm.hasCell) {
            if (lm.contentType === 'equation') {
                lm.contentType = 'text'
                lm.isDimAssigned = 0
                redraw(colorMode)
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

    const checkNodeClicked = (e) => {
        let isNodeClicked = false
        let m = mapref(['m'])
        m.selectionRect = [];
        [fromX, fromY] = getCoords(e)
        let lastOverPath = mapFindOverPoint.start(mapref(['r', 0]), fromX, fromY) // TODO multi r rethink
        if (lastOverPath.length) {
            isNodeClicked = true
            let m = mapref(['m'])
            m.deepestSelectablePath = copy(lastOverPath)
            if (m.deepestSelectablePath.length === 4) {
                m.deepestSelectablePath = ['r', 0] // TODO multi r rethink
            }
        }
        return isNodeClicked
    }

    const checkTaskClicked = (path) => {
        let isTaskClicked = false
        if (path.map(i => i.id === 'mapSvgInner').reduce((acc, item) => {return acc || item})) {
            for (const pathItem of path) {
                if (pathItem.id) {
                    if (pathItem.id.substring(17, 27) === 'taskCircle') {
                        isTaskClicked = true
                        break
                    }
                }
            }
        }
        return isTaskClicked
    }

    // LANDING LISTENERS
    const mousewheel = (e) => {
        e.preventDefault()
        if (!isIntervalRunning) {
            namedInterval = setInterval(function () {
                clearInterval(namedInterval)
                isIntervalRunning = false
                if (Math.sign(e.deltaY) === 1) {
                    dispatch({type: 'PLAY_LANDING_NEXT'})
                } else {
                    dispatch({type: 'PLAY_LANDING_PREV'})
                }
            }, 100)
        }
        isIntervalRunning = true
    }

    // MAP LISTENERS
    const contextmenu = colorMode => e => {
        e.preventDefault()
    }

    const resize = colorMode => e => {
        mapDispatch('setIsResizing')
        redraw(colorMode)
    }

    const popstate = colorMode => e => {
        dispatch({type: 'OPEN_MAP', payload: {source: 'HISTORY', event: e}})
    }

    const mousedown = colorMode => e => {
        e.preventDefault()
        const {path, which} = getNativeEvent(e)
        if (!path.map(i => i.id === 'mapSvgOuter').reduce((acc, item) => {return acc || item})) {
            return
        }
        if (!isMouseDown) {
            isMouseDown = true
            if (isEditing === 1) {
                finishEdit()
                redraw(colorMode)
            }
            (window.getSelection
                    ? window.getSelection()
                    : document.selection
            ).empty()
            elapsed = 0
            push()
            if (which === 1) {
                isNodeClicked = checkNodeClicked(e)
                isTaskClicked = checkTaskClicked(path)
                if (isNodeClicked) {
                    if (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey) {
                        mapDispatch('selectStruct')
                    } else {
                        mapDispatch('selectStructToo')
                    }
                    redraw(colorMode)
                    let lm = mapref(selectionState.lastPath)
                    if (!e.shiftKey) {
                        if (lm.linkType !== '') {
                            mapDispatch('select_R')
                        }
                        if (lm.linkType === 'internal') {
                            dispatch({ type: 'OPEN_MAP_FROM_MAP', payload: { mapId: lm.link } })
                        } else if (lm.linkType === 'external') {
                            isMouseDown = false
                            window.open(lm.link, '_blank')
                            window.focus()
                        }
                    }
                } else if (isTaskClicked) {
                    mapDispatch('setTaskStatus', {
                        taskStatus: parseInt(path[0].id.charAt(27), 10),
                        nodeId: path[0].id.substring(0, 12)
                    })
                    redraw(colorMode)
                } else {
                    mapDispatch('clearSelection')
                }
            } else if (which === 2) {
                let el = document.getElementById('mapHolderDiv')
                scrollLeft = el.scrollLeft
                scrollTop = el.scrollTop
                pageX = e.pageX
                pageY = e.pageY
            } else if (which === 3) {
                const isNodeClicked = checkNodeClicked(e)
                if (isNodeClicked) {
                    if (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey) {
                        mapDispatch('selectStructFamily')
                    } else {
                        mapDispatch('selectStructToo')
                    }
                    redraw(colorMode)
                }
            }
        }
    }

    const mousemove = colorMode => e => {
        e.preventDefault()
        const {which} = getNativeEvent(e)
        if (isMouseDown) {
            elapsed++
            if (which === 1) {
                let m = mapref(['m'])
                if (isNodeClicked) {
                    let m = mapref(['m'])
                    let [toX, toY] = getCoords(e)
                    m.moveTargetPath = []
                    m.moveData = []
                    let lastSelectedPath = selectionState.structSelectedPathList[0]
                    let lastSelected = mapref(lastSelectedPath)
                    if (!(lastSelected.nodeStartX < toX &&
                        toX < lastSelected.nodeEndX &&
                        lastSelected.nodeY - lastSelected.selfH / 2 < toY &&
                        toY < lastSelected.nodeY + lastSelected.selfH / 2)) {
                        let lastNearestPath = mapFindNearest.start(mapref(['r', 0]), toX, toY) // TODO multi r rethink
                        if (lastNearestPath.length > 2) {
                            m.moveTargetPath = copy(lastNearestPath)
                            let lastFound = mapref(lastNearestPath)
                            fromX = lastFound.path[3] ? lastFound.nodeStartX : lastFound.nodeEndX
                            fromY = lastFound.nodeY
                            m.moveData = [fromX, fromY, toX, toY]
                            if (lastFound.s.length === 0) {
                                m.moveTargetIndex = 0
                            } else {
                                let insertIndex = 0
                                for (let i = 0; i < lastFound.s.length - 1; i++) {
                                    if (toY > lastFound.s[i].nodeY && toY <= lastFound.s[i + 1].nodeY) {
                                        insertIndex = i + 1
                                    }
                                }
                                if (toY > lastFound.s[lastFound.s.length - 1].nodeY) {
                                    insertIndex = lastFound.s.length
                                }
                                let lastSelectedParentPath = lastSelected.parentPath
                                if (arraysSame(lastFound.path, lastSelectedParentPath)) {
                                    if (lastSelected.index < insertIndex) {
                                        insertIndex -= 1
                                    }
                                }
                                m.moveTargetIndex = insertIndex
                            }
                        }
                    }
                    redraw(colorMode)
                } else if (isTaskClicked) {
                } else {
                    let m = mapref(['m'])
                    let [toX, toY] = getCoords(e)
                    let startX = fromX < toX ? fromX : toX
                    let startY = fromY < toY ? fromY : toY
                    let width = Math.abs(toX - fromX)
                    let height = Math.abs(toY - fromY)
                    m.selectionRect = [startX, startY, width, height]
                    mapFindOverRectangle.start(mapref(['r', 0]), startX, startY, width, height) // TODO multi r rethink
                    recalc()
                    redraw(colorMode)
                }
            } else if (which === 2) {
                let el = document.getElementById('mapHolderDiv')
                el.scrollLeft = scrollLeft - e.pageX  + pageX
                el.scrollTop = scrollTop -  e.pageY  + pageY
            } else if (which === 3) {
            }
        }
    }

    const mouseup = colorMode => e => {
        e.preventDefault()
        const {path, which} = getNativeEvent(e)
        if (!path.map(i => i.id === 'mapSvgOuter').reduce((acc, item) => {return acc || item})) {
            return
        }
        isMouseDown = false
        if (elapsed) {
            if (which === 1) {
                if (isNodeClicked) {
                    let m = mapref(['m'])
                    if (m.moveTargetPath.length) {
                        m.moveData = []
                        m.shouldCenter = true // outside push - checkPop?
                        mapDispatch('moveSelection')
                        redraw(colorMode)
                    }
                } else if (isTaskClicked) {
                } else {
                    let m = mapref(['m'])
                    m.selectionRect = []
                    if (selectionState.structSelectedPathList.length === 0 &&
                        selectionState.cellSelectedPathList.length === 0) {
                        mapDispatch('select_R')
                    }
                    redraw(colorMode)
                }
            } else if (which === 2) {
            } else if (which === 3) {
            }
        } else {
            if (which === 1) {
                if (isNodeClicked) {
                } else if (isTaskClicked) {
                } else {
                    mapDispatch('select_R')
                    redraw(colorMode)
                }
            } else if (which === 2) {
            } else if (which === 3) {
            }
        }
        checkPop(dispatch)
    }

    const dblclick = colorMode => e => {
        const {path} = getNativeEvent(e)
        e.preventDefault()
        if (!path.map(i => i.id === 'mapSvgOuter').reduce((acc, item) => {return acc || item})) {
            return
        }
        if (isNodeClicked) {
            startEdit()
        } else {
            let m = mapref(['m'])
            m.shouldCenter = true // outside push - checkPop?
        }
        redraw(colorMode)
    }

    const keydown = colorMode => e => {
        let {scope, lastPath} = selectionState
        let lm = mapref(selectionState.lastPath)
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
            [ 1,  0,  0,  code === 'KeyM',               ['s', 'c', 'm'],               0,  1,  0, ['CREATE_MAP_IN_MAP']                      ],
            [ 1,  0,  0,  code === 'KeyC',               ['s', 'c', 'm'],               0,  1,  1, ['copySelection']                          ],
            [ 1,  0,  0,  code === 'KeyX',               ['s', 'c', 'm'],               0,  1,  1, ['cutSelection']                           ],
            [ 1,  0,  0,  code === 'KeyS',               ['s', 'c', 'm'],               0,  1,  0, ['SAVE_MAP']                               ],
            [ 1,  0,  0,  code === 'KeyS',               ['s', 'c', 'm'],               1,  1,  0, ['finishEdit', 'SAVE_MAP']                 ],
            [ 1,  0,  0,  code === 'KeyZ',               ['s', 'c', 'm', 'cr', 'cc'],   0,  1,  0, ['REDO']                                   ],
            [ 1,  0,  0,  code === 'KeyY',               ['s', 'c', 'm', 'cr', 'cc'],   0,  1,  0, ['UNDO']                                   ],
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
                if (keyStateMachine.m) {
                    push()
                }
                for (let j = 0; j < keyStateMachine.executionList.length; j++) {
                    let currExecution = keyStateMachine.executionList[j]
                    if ([
                        'CREATE_MAP_IN_MAP',
                        'SAVE_MAP',
                        'UNDO',
                        'REDO',
                    ].includes(currExecution)) {
                        dispatch({type: currExecution})
                    } else if (currExecution === 'startEdit') {
                        startEdit()
                    } else if (currExecution === 'finishEdit') {
                        finishEdit()
                    } else if (currExecution === 'applyColorFromKey') {
                        mapDispatch(currExecution, {currColor: which - 96})
                    } else {
                        mapDispatch(currExecution, {keyCode: e.code})
                        if (['insert_O_S',
                            'insert_U_S',
                            'insert_D_S'
                        ].includes(currExecution)) {
                            redraw(colorMode)
                            recalc()
                        }
                    }
                }
                redraw(colorMode)
                if (keyStateMachine.m) {
                    checkPop(dispatch)
                }
                break
            }
        }
    }

    const paste = colorMode => e => {
        e.preventDefault()
        pasteDispatch(isEditing, colorMode, dispatch)
    }

    const addLandingListeners = () => {
        landingAreaListener = new AbortController()
        window.addEventListener("mousewheel", mousewheel, /*{passive: false}*/ { signal: mapAreaListener.signal })
    }

    const removeLandingListeners = () => {
        mapAreaListener.abort()
    }

    const addMapListeners = (colorMode) => {
        mapAreaListener = new AbortController()
        window.addEventListener("contextmenu", contextmenu(colorMode), { signal: mapAreaListener.signal })
        window.addEventListener('resize', resize(colorMode), { signal: mapAreaListener.signal })
        window.addEventListener('popstate', popstate(colorMode), { signal: mapAreaListener.signal })
        window.addEventListener('dblclick', dblclick(colorMode), { signal: mapAreaListener.signal })
        window.addEventListener('mousedown', mousedown(colorMode), { signal: mapAreaListener.signal })
        window.addEventListener('mousemove', mousemove(colorMode), { signal: mapAreaListener.signal })
        window.addEventListener('mouseup', mouseup(colorMode), { signal: mapAreaListener.signal })
        window.addEventListener("keydown", keydown(colorMode), { signal: mapAreaListener.signal })
        window.addEventListener("paste", paste(colorMode), { signal: mapAreaListener.signal })
    }

    const removeMapListeners = () => {
        mapAreaListener.abort()
    }

    useEffect(() => {
        if (landingData.length) {
            const mapStorage = landingData[landingDataIndex]
            mapStackDispatch('initMapState', { mapStorage })
            redraw(colorMode)
        }
    }, [landingData, landingDataIndex])

    useEffect(() => {
        if (mapId !== '' && mapSource !== '') {
            mapStackDispatch('initMapState', { mapStorage })
            redraw(colorMode)
            dispatch({ type: 'MAP_STACK_CHANGED' })
        }
    }, [mapId, mapSource, frameLen, frameSelected])

    useEffect(() => {
        if (pageState === WS) {
            if (mapRight === EDIT) {
                addMapListeners(colorMode)
            } else if (mapRight === VIEW) {
                // TODO figure out view listeners
            }
        } else if (pageState === DEMO) {
            addLandingListeners()
        }
        return () => {
            removeMapListeners()
            removeLandingListeners()
        }
    }, [pageState, mapRight])

    useEffect(() => {
        if (mapId !== '' && mapSource !== '') {
            push()
            mapDispatch('applyMapParams', node)
            redraw(colorMode)
            checkPop(dispatch)
        }
    }, [node])

    useEffect(() => {
        if (mapId !== '' && mapSource !== '') {
            console.log('REDRAW BECAUSE OF COLOR')
            redraw(colorMode)
            removeMapListeners()
            addMapListeners(colorMode)
        }
    }, [colorMode])

    return (
        <></>
    )
}
