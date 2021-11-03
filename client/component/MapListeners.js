import React, {useContext, useEffect} from "react";
import {Context} from "../core/Store";
import {isEditing, nodeDispatch} from "../core/NodeFlow";
import {arraysSame, copy, isChrome} from "../core/Utils";
import {mapFindNearest} from "../map/MapFindNearest";
import {checkPop, mapDispatch, mapref, push, recalc, redraw} from "../core/MapFlow";
import {mapFindOverPoint} from "../map/MapFindOverPoint";
import {mapFindOverRectangle} from "../map/MapFindOverRectangle";
import {checkPopSelectionState, pushSelectionState, selectionState} from "../core/SelectionFlow";
import {pasteDispatch} from "../core/PasteFlow";
import {MAP_RIGHTS, PAGE_STATES} from "../core/EditorFlow";

let pageX, pageY, scrollLeft, scrollTop, fromX, fromY, isMouseDown, elapsed = 0;
let namedInterval;
let isIntervalRunning = false;
let isNodeClicked = false;
let isTaskClicked = false;

export function MapListeners() {
    const [state, dispatch] = useContext(Context);
    const {landingData, landingDataIndex, serverResponse, serverResponseCntr} = state;

    const loadLandingDataFrame = (landingData, landingDataIndex) => {
        mapDispatch('initMapState', {mapId: '', mapSource: '', mapStorage: landingData[landingDataIndex], frameSelected: 0});
        redraw();
    }

    const addLandingListeners = () => {
        window.addEventListener("mousewheel", mousewheel, {passive: false});
    }

    const removeLandingListeners = () => {
        window.removeEventListener("mousewheel", mousewheel);
    }

    const addMapListeners = () => {
        window.addEventListener("contextmenu", contextmenu);
        window.addEventListener('resize', resize);
        window.addEventListener('popstate', popstate);
        window.addEventListener('dblclick', dblclick);
        window.addEventListener('mousedown', mousedown);
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);
        window.addEventListener("keydown", keydown);
        window.addEventListener("paste", paste);
    }

    const removeMapListeners = () => {
        window.removeEventListener("contextmenu", contextmenu);
        window.removeEventListener('resize', resize);
        window.removeEventListener('popstate', popstate);
        window.removeEventListener('dblclick', dblclick);
        window.removeEventListener('mousedown', mousedown);
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
        window.removeEventListener("keydown", keydown);
        window.removeEventListener("paste", paste);
    }

    useEffect(() => {
        if (landingData.length) {
            loadLandingDataFrame(landingData, landingDataIndex);
        }
    }, [landingData, landingDataIndex]);


    useEffect(() => {
        if (serverResponse.payload) {
            const serverState = serverResponse.payload;
            if (serverState.hasOwnProperty('mapRight')) {
                const {mapRight} = serverState;
                if (mapRight === MAP_RIGHTS.VIEW) {
                    addLandingListeners();
                } else if (mapRight === MAP_RIGHTS.EDIT) {
                    addMapListeners();
                }
                return () => {
                    removeLandingListeners();
                    removeMapListeners();
                }
            }
        }
    }, [serverResponseCntr]);

    const mousewheel = (e) => {
        e.preventDefault();
        if (!isIntervalRunning) {
            namedInterval = setInterval(function () {
                clearInterval(namedInterval);
                isIntervalRunning = false;
                if (Math.sign(e.deltaY) === 1) {
                    dispatch({type: 'PLAY_LANDING_NEXT'})
                } else {
                    dispatch({type: 'PLAY_LANDING_PREV'})
                }
            }, 100);
        }
        isIntervalRunning = true;
    }

    const contextmenu = (e) => {
        e.preventDefault()
    };

    const resize = () => {
        nodeDispatch('setIsResizing');
        redraw();
    };

    const popstate = (e) => {
        dispatch({type: 'OPEN_MAP', payload: {source: 'HISTORY', event: e}})
    };

    const getCoords = (e) => {
        let winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        let mapHolderDiv = document.getElementById('mapHolderDiv');
        let x = e.pageX - winWidth + mapHolderDiv.scrollLeft;
        let y = e.pageY - winHeight + mapHolderDiv.scrollTop;
        return [x, y]
    };

    const mousedown = (e) => {
        let path = e.path || (e.composedPath && e.composedPath());
        e.preventDefault();
        if (!path.map(i => i.id === 'mapSvgOuter').reduce((acc, item) => {return acc || item})) {
            return;
        }
        elapsed = 0;
        isMouseDown = true;
        if (isEditing === 1) {
            nodeDispatch('finishEdit');
            redraw();
        }
        (window.getSelection ? window.getSelection() : document.selection).empty()
        if (e.which === 1 || e.which === 3) {
            isNodeClicked = false;
            let m = mapref(['m']);
            let cr = mapref(['r', 0]); // TODO use ['g']
            cr.selectionRect = [];
            [fromX, fromY] = getCoords(e);
            let lastOverPath = mapFindOverPoint.start(cr, fromX, fromY);
            if (lastOverPath.length) {
                isNodeClicked = true;
                m.deepestSelectablePath = copy(lastOverPath);
                if (m.deepestSelectablePath.length === 4) {
                    m.deepestSelectablePath = ['r', 0]; // TODO use ['g']
                }
                push();
                if (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey) {
                    if (e.which === 1) {
                        nodeDispatch('selectStruct');
                    } else {
                        nodeDispatch('selectStructFamily');
                    }
                } else {
                    nodeDispatch('selectStructToo');
                }
                redraw();
                checkPop();
                if (e.which === 1) {
                    let lm = mapref(selectionState.lastPath);
                    if (!e.shiftKey) {
                        if (lm.linkType !== '') {
                            nodeDispatch('select_root');
                        }
                        if (lm.linkType === 'internal') {
                            dispatch({type: 'OPEN_MAP_FROM_MAP', payload: {mapId: lm.link}})
                        } else if (lm.linkType === 'external') {
                            isMouseDown = false;
                            window.open(lm.link, '_blank');
                            window.focus();
                        }
                    }
                    if (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey) {
                        dispatch({type: 'SET_NODE_PROPS', payload: lm});
                    }
                }
            }
            isTaskClicked = false;
            if (path.map(i => i.id === 'mapSvgInner').reduce((acc, item) => {return acc || item})) {
                for (const pathItem of path) {
                    if (pathItem.id) {
                        if (pathItem.id.substring(0, 10) === 'taskCircle') {
                            isTaskClicked = true;
                            push();
                            nodeDispatch('setTaskStatus', {
                                taskStatus: parseInt(path[0].id.charAt(10), 10),
                                svgId: path[1].id
                            });
                            redraw();
                            checkPop();
                            break;
                        }
                    }
                }
            }
            if (e.which === 1 && !isNodeClicked && !isTaskClicked) {
                pushSelectionState();
                nodeDispatch('clearSelection');
            }
        } else if (e.which === 2) {
            let el = document.getElementById('mapHolderDiv');
            scrollLeft = el.scrollLeft;
            scrollTop = el.scrollTop;
            pageX = e.pageX;
            pageY = e.pageY;
        }
    };

    const mousemove = (e) => {
        e.preventDefault();
        if (isMouseDown) {
            elapsed++;
            if (e.which === 1) {
                if (isNodeClicked) {
                    let m = mapref(['m']);
                    let cr = mapref(['r', 0]); // TODO use ['g']
                    let [toX, toY] = getCoords(e);
                    m.moveTargetPath = [];
                    cr.moveData = [];
                    let lastSelectedPath = selectionState.structSelectedPathList[0];
                    let lastSelected = mapref(lastSelectedPath);
                    if (!(lastSelected.nodeStartX < toX &&
                        toX < lastSelected.nodeEndX &&
                        lastSelected.nodeY - lastSelected.selfH / 2 < toY &&
                        toY < lastSelected.nodeY + lastSelected.selfH / 2)) {
                        let lastNearestPath = mapFindNearest.start(cr, toX, toY);
                        if (lastNearestPath.length > 2) {
                            m.moveTargetPath = copy(lastNearestPath);
                            let lastFound = mapref(lastNearestPath);
                            fromX = lastFound.path[3] ? lastFound.nodeStartX : lastFound.nodeEndX;
                            fromY = lastFound.nodeY;
                            cr.moveData = [fromX, fromY, toX, toY];
                            if (lastFound.s.length === 0) {
                                m.moveTargetIndex = 0;
                            } else {
                                let insertIndex = 0;
                                for (let i = 0; i < lastFound.s.length - 1; i++) {
                                    if (toY > lastFound.s[i].nodeY && toY <= lastFound.s[i + 1].nodeY) {
                                        insertIndex = i + 1;
                                    }
                                }
                                if (toY > lastFound.s[lastFound.s.length - 1].nodeY) {
                                    insertIndex = lastFound.s.length;
                                }
                                let lastSelectedParentPath = lastSelected.parentPath;
                                if (arraysSame(lastFound.path, lastSelectedParentPath)) {
                                    if (lastSelected.index < insertIndex) {
                                        insertIndex -= 1;
                                    }
                                }
                                m.moveTargetIndex = insertIndex;
                            }
                        }
                    }
                    redraw();
                } else if (isTaskClicked) {

                } else {
                    let cr = mapref(['r', 0]); // TODO use ['g']
                    let [toX, toY] = getCoords(e);
                    let startX = fromX < toX ? fromX : toX;
                    let startY = fromY < toY ? fromY : toY;
                    let width = Math.abs(toX - fromX);
                    let height = Math.abs(toY - fromY);
                    cr.selectionRect = [startX, startY, width, height];
                    mapFindOverRectangle.start(cr, startX, startY, width, height);
                    redraw();
                }
            } else if (e.which === 2) {
                let el = document.getElementById('mapHolderDiv');
                el.scrollLeft = scrollLeft - e.pageX  + pageX;
                el.scrollTop = scrollTop -  e.pageY  + pageY;
            }
        }
    };

    const mouseup = (e) => {
        let path = e.path || (e.composedPath && e.composedPath());
        e.preventDefault();
        isMouseDown = false;
        if (e.which === 1) {
            let m = mapref(['m']);
            let cr = mapref(['r', 0]); // TODO use ['g']
            if (m.moveTargetPath.length) {
                cr.moveData = [];
                m.shouldCenter = true; // outside push - checkPop?
                push();
                nodeDispatch('moveSelection');
                redraw();
                checkPop();
            }
            cr.selectionRect = [];
            if (elapsed === 0) {
                if (!isNodeClicked &&
                    !isTaskClicked &&
                    ['mapSvgOuter', 'backgroundRect'].includes(path[0].id)) {
                    push();
                    nodeDispatch('select_root');
                    redraw();
                    checkPop();
                }
            } else {
                recalc();
                checkPopSelectionState();
                recalc();
                redraw();
            }
        } else if (e.which === 2) {

        }
    };

    const dblclick = (e) => {
        let path = e.path || (e.composedPath && e.composedPath());
        e.preventDefault();
        if (!path.map(i => i.id === 'mapSvgOuter').reduce((acc, item) => {return acc || item})) {
            return;
        }
        if (isNodeClicked) {
            nodeDispatch('startEdit');
        } else {
            let m = mapref(['m']);
            m.shouldCenter = true; // outside push - checkPop?
        }
        redraw();
    };

    const keydown = (e) => {
        let {scope, lastPath} = selectionState;
        let {key, code, which} = e;
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
            [ 0,  0,  0,  code === 'Escape',             ['s', 'c', 'm'],               0,  1,  1, ['select_root']                            ],
            [ 1,  0,  0,  code === 'KeyA',               ['s', 'c', 'm'],               0,  1,  0, ['select_all']                             ],
            [ 1,  0,  0,  code === 'KeyM',               ['s', 'c', 'm'],               0,  1,  0, ['CREATE_MAP_IN_MAP']                      ],
            [ 1,  0,  0,  code === 'KeyC',               ['s', 'c', 'm'],               0,  1,  1, ['copySelection']                          ],
            [ 1,  0,  0,  code === 'KeyX',               ['s', 'c', 'm'],               0,  1,  1, ['cutSelection']                           ],
            [ 1,  0,  0,  code === 'KeyS',               ['s', 'c', 'm'],               0,  1,  0, ['SAVE_MAP']                               ],
            [ 1,  0,  0,  code === 'KeyS',               ['s', 'c', 'm'],               1,  1,  0, ['finishEdit', 'SAVE_MAP']                 ],
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
            [ 1,  0,  1,  which >= 96 && which <= 105,   ['s', 'm'],                    0,  1,  1, ['applyTaskStatus']                        ],
            [ 0,  0,  0,  which >= 48,                   ['s', 'm'],                    0,  0,  0, ['eraseContent', 'startEdit']              ],
            [ 0,  1,  0,  which >= 48,                   ['s', 'm'],                    0,  0,  0, ['eraseContent', 'startEdit']              ],
        ];

        let keyStateMachine = {};
        for (let i = 0; i < keyStateMachineDb.length; i++) {
            for (let h = 0; h < keyStateMachineDb[0].length; h++) {
                keyStateMachine[keyStateMachineDb[0][h]] = keyStateMachineDb[i][h];
            }
            if (keyStateMachine.scope.includes(scope) &&
                keyStateMachine.e === isEditing &&
                keyStateMachine.c === +e.ctrlKey &&
                keyStateMachine.s === +e.shiftKey &&
                keyStateMachine.a === +e.altKey &&
                keyStateMachine.keyMatch === true) {
                if (keyStateMachine.p) {
                    e.preventDefault();
                }
                if (keyStateMachine.m) {
                    push();
                }
                for (let j = 0; j < keyStateMachine.executionList.length; j++) {
                    let currExecution = keyStateMachine.executionList[j];
                    if (['CREATE_MAP_IN_MAP', 'SAVE_MAP'].includes(currExecution)) {
                        dispatch({type: currExecution});
                    } else if (['undo', 'redo'].includes(currExecution)) {
                        mapDispatch(currExecution);
                    } else if (currExecution === 'applyColorFromKey') {
                        nodeDispatch(currExecution, {currColor: e.which - 96});
                    } else if (currExecution === 'applyTaskStatus') {
                        nodeDispatch(currExecution, {currTaskStatus: e.which - 96});
                    } else {
                        nodeDispatch(currExecution, {keyCode: e.code});
                        if (['insert_O_S', 'insert_U_S', 'insert_D_S'].includes(currExecution)) {
                            redraw();
                        }
                    }
                }
                redraw();
                if (keyStateMachine.m) {
                    checkPop();
                }
                break;
            }
        }
    };

    const paste = (e) => {
        e.preventDefault();
        pasteDispatch();
    };

    return (
        <></>
    )
}
