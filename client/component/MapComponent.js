import React, {useContext, useEffect} from "react";
import {Context, remoteGetState} from "../core/Store";
import {getSelectionContext} from "../node/NodeSelect";
import {isEditing, nodeDispatch} from "../core/NodeReducer";
import {checkPop, push, redraw, mapref, getMapData, recalc} from "../map/Map";
import {arraysSame, copy, isUrl} from "../core/Utils";
import '../component-css/MapComponent.css'
import {mapFindNearest} from "../map/MapFindNearest";
import {mapDispatch} from "../core/MapReducer";
import {mapFindOver} from "../map/MapFindOver";
import {mapState} from "../core/MapState";

let pageX, pageY, scrollLeft, scrollTop, myX, myY;

export function MapComponent() {

    const [state, dispatch] = useContext(Context);
    const {density, alignment, fontSize, mouseMode, mapAction} = state;

    useEffect(() => {
        if (density !== '') {
            mapDispatch('setDensity', density);
            nodeDispatch('resetDim');
            redraw();
        }
    }, [density]);

    useEffect(() => {
        if (alignment !== '') {
            mapDispatch('setAlignment', alignment);
            redraw();
        }
    }, [alignment]);

    useEffect(() => {
        if (fontSize !== '') {
            push();
            nodeDispatch('applyFontSize', fontSize);
            redraw();
            checkPop();
        }
    }, [fontSize]);

    useEffect(() => {
        let lastAction = [...mapAction].pop();
        if (lastAction && lastAction !== '') {
            if (['undo', 'redo'].includes(lastAction)) {
                mapDispatch(lastAction);
                redraw();
            } else if (['save'].includes(lastAction)) {
                dispatch({type: 'SAVE_MAP'});
                redraw();
            } else if (['cut', 'copy', 'paste', 'task', 'formatColorReset', 'print'].includes(lastAction)) {
                push();
                switch (lastAction) {
                    case 'cut':
                        nodeDispatch('cutSelection');
                        break;
                    case 'copy':
                        nodeDispatch('copySelection');
                        break;
                    case 'paste':
                        paste({preventDefault: () => {}});
                        break;
                    case 'task':
                        nodeDispatch('taskCheckReset');
                        nodeDispatch('taskSwitch');
                        break;
                    case 'formatColorReset':
                        nodeDispatch('formatColorReset');
                        break;
                    case 'print':
                        /*  mapPrint.start(payload.lm); */
                        break;
                }
                redraw();
                checkPop();
            } else {
                console.log('unknown action: ' + lastAction);
            }
        }
    }, [mapAction]);

    useEffect(() => {
        window.addEventListener('resize',       resize);
        window.addEventListener('popstate',     popstate);
        window.addEventListener('dblclick',     dblclick);
        window.addEventListener('mousedown',    mousedown);
        window.addEventListener('mousemove',    mousemove);
        window.addEventListener('mouseup',      mouseup);
        window.addEventListener("keydown",      keydown);
        window.addEventListener("paste",        paste);
        return () => {
            window.removeEventListener('resize',       resize);
            window.removeEventListener('popstate',     popstate);
            window.removeEventListener('dblclick',     dblclick);
            window.removeEventListener('mousedown',    mousedown);
            window.removeEventListener('mousemove',    mousemove);
            window.removeEventListener('mouseup',      mouseup);
            window.removeEventListener("keydown",      keydown);
            window.removeEventListener("paste",        paste);
        };
    }, []);

    const resize = (e) => {
        mapState.isLoading = true;
        recalc();
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
        e.preventDefault();

        if (isEditing === 1) {
            nodeDispatch('finishEdit');
            redraw();
        }

        mapState.isMouseDown = true;

        mapState.isNodeClicked = false;
        let r = getMapData().r;
        r.selectionRect = [];
        let [fromX, fromY] = getCoords(e);
        let lastOverPath = mapFindOver.start(r, fromX, fromY);
        if (lastOverPath.length) {
            mapState.isNodeClicked = true;
            mapState.deepestSelectablePath = copy(lastOverPath);
            push();
            if (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey) {
                nodeDispatch('selectStruct');
            } else {
                nodeDispatch('selectStructToo');
            }
            redraw();
            checkPop();
            let sc = getSelectionContext();
            let {lm} = sc;
            if (!e.shiftKey) {
                if (lm.linkType === 'internal') {
                    dispatch({type: 'OPEN_MAP', payload: {source: 'MOUSE', lm}})
                } else if (lm.linkType === 'external') {
                    mapState.isMouseDown = false;
                    window.open(lm.link, '_blank');
                    window.focus();
                }
            }
            dispatch({type: 'SET_NODE_PROPS', payload: lm});
        }

        mapState.isTaskClicked = false;
        if (e.path.map(i => i.id === 'mapSvgInner').reduce((acc,item) => {return acc || item})) {
            for (const pathItem of e.path) {
                if (pathItem.id) {
                    if (pathItem.id.substring(0, 10) === 'taskCircle') {
                        mapState.isTaskClicked = true;
                        push();
                        nodeDispatch('setTaskStatus', {
                            taskStatus: parseInt(e.path[0].id.charAt(10), 10),
                            svgId: e.path[1].id
                        });
                        redraw();
                        checkPop();
                        break;
                    }
                }
            }
        }

        if (!mapState.isNodeClicked && !mapState.isTaskClicked) {
            // let mouseMode = remoteGetState().mouseMode;
            let mouseMode;
            if (e.which === 1) mouseMode = 'select';
            if (e.which === 2) mouseMode = 'drag';

            if (mouseMode === 'select') {
                myX = fromX;
                myY = fromY;
            } else if (mouseMode === 'drag') {
                let el = document.getElementById('mapHolderDiv');
                scrollLeft = el.scrollLeft;
                scrollTop = el.scrollTop;
                pageX = e.pageX;
                pageY = e.pageY;
            } else {
                console.log('unknown mouseMode');
            }
        }
    };

    const dblclick = (e) => {
        e.preventDefault();
        if (mapState.isNodeClicked) {
            nodeDispatch('startEdit');
        } else {
            mapState.shouldCenter = true;
            recalc();
        }
        redraw();
    };

    const mousemove = (e) => {
        e.preventDefault();
        if (mapState.isMouseDown) {
            let [toX, toY] = getCoords(e);
            if (mapState.isNodeClicked) {
                mapState.moveTarget.path = [];
                let r = getMapData().r;
                r.moveLine = [];
                r.moveRect = [];
                let lastSelectedPath = mapState.filter.structSelectedPathList[0];
                let lastSelected = mapref(lastSelectedPath);
                if (!(lastSelected.nodeStartX < toX &&
                    toX < lastSelected.nodeEndX &&
                    lastSelected.nodeY - lastSelected.selfH / 2 < toY &&
                    toY < lastSelected.nodeY + lastSelected.selfH / 2)
                ) {
                    let lastNearestPath = mapFindNearest.start(r, toX, toY);
                    if (lastNearestPath.length > 1) {
                        mapState.moveTarget.path = copy(lastNearestPath);
                        let lastFound = mapref(lastNearestPath);
                        let fromX = lastFound.path[2] === 0 ? lastFound.nodeEndX : lastFound.nodeStartX;
                        let fromY = lastFound.nodeY;
                        r.moveLine = [fromX, fromY, toX, toY];
                        r.moveRect = [toX, toY];
                        if (lastFound.s.length === 0) {
                            mapState.moveTarget.index = 0;
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
                            mapState.moveTarget.index = insertIndex;
                        }
                    }
                }
                redraw();
            }

            if (!mapState.isNodeClicked && !mapState.isTaskClicked) {
                // let mouseMode = remoteGetState().mouseMode;
                let mouseMode;
                if (e.which === 1) mouseMode = 'select';
                if (e.which === 2) mouseMode = 'drag';

                if (mouseMode === 'select') {
                    let r = getMapData().r;

                    let fromX = myX;
                    let fromY = myY;

                    let startX = fromX < toX ? fromX : toX;
                    let startY = fromY < toY ? fromY : toY;

                    r.selectionRect = [
                        startX,
                        startY,
                        Math.abs(toX - fromX),
                        Math.abs(toY - fromY),
                    ];
                    redraw();
                } else if (mouseMode === 'drag') {
                    let el = document.getElementById('mapHolderDiv');
                    el.scrollLeft = scrollLeft - e.pageX  + pageX;
                    el.scrollTop = scrollTop -  e.pageY  + pageY;
                } else {
                    console.log('unknown mouseMode');
                }
            }
        }
    };

    const mouseup = (e) => {
        e.preventDefault();
        mapState.isMouseDown = false;
        let r = getMapData().r;
        if (mapState.moveTarget.path.length) {
            r.moveLine = [];
            r.moveRect = [];
            // mapState.shouldCenter = true;
            push();
            nodeDispatch('moveSelection');
            redraw();
            checkPop();
        }

        // let mouseMode = remoteGetState().mouseMode;
        let mouseMode;
        if (e.which === 1) mouseMode = 'select';
        if (e.which === 2) mouseMode = 'drag';
        if (mouseMode === 'select') {
            r.selectionRect = [];
            redraw();
        } else if (mouseMode === 'drag') {

        } else {
            console.log('unknown mouseMode');
        }
    };

    const keydown = (e) => {
        let sc = getSelectionContext();

        let keyStateMachineDb = [
            ['c','s','a', 'keyMatch',                       'scope',                     'e','p','m',  'executionList',                       ],
            [ 0,  0,  0,  e.key === 'F1',                  ['s', 'c', 'm'],               0,  1,  0, [],                                      ],
            [ 0,  0,  0,  e.key === 'F2',                  ['s', 'm'],                    0,  1,  0, ['startEdit'],                           ],
            [ 0,  0,  0,  e.key === 'F3',                  ['s', 'c', 'm'],               0,  1,  0, [],                                      ],
            [ 0,  0,  0,  e.key === 'F5',                  ['s', 'c', 'm'],               0,  0,  0, [],                                      ],
            [ 0,  0,  0,  e.key === 'Enter',               ['s', 'm'],                    1,  1,  0, ['finishEdit'],                          ],
            [ 0,  0,  0,  e.key === 'Enter',               ['s'],                         0,  1,  1, ['newSiblingDown', 'startEdit'],         ],
            [ 0,  0,  0,  e.key === 'Enter',               ['m'],                         0,  1,  1, ['selectDownMixed'],                     ],
            [ 0,  1,  0,  e.key === 'Enter',               ['s', 'm'],                    0,  1,  1, ['newSiblingUp', 'startEdit'],           ],
            [ 0,  0,  1,  e.key === 'Enter',               ['s'],                         0,  1,  1, ['cellifyMulti', 'selectFirstMixed'],    ],
            [ 0,  0,  0,  e.key === 'Insert',              ['s'],                         1,  1,  1, ['finishEdit', 'newChild', 'startEdit'], ],
            [ 0,  0,  0,  e.key === 'Insert',              ['s'],                         0,  1,  1, ['newChild', 'startEdit'],               ],
            [ 0,  0,  0,  e.key === 'Insert',              ['m'],                         0,  1,  1, ['selectOutMixed'],                      ],
            [ 0,  0,  0,  e.key === 'Tab',                 ['s'],                         1,  1,  1, ['finishEdit', 'newChild', 'startEdit'], ],
            [ 0,  0,  0,  e.key === 'Tab',                 ['s'],                         0,  1,  1, ['newChild', 'startEdit'],               ],
            [ 0,  0,  0,  e.key === 'Tab',                 ['m'],                         0,  1,  1, ['selectOutMixed'],                      ],
            [ 0,  0,  0,  e.key === 'Delete',              ['s'],                         0,  1,  1, ['deleteNode'],                          ],
            [ 0,  0,  0,  e.key === 'Delete',              ['cr', 'cc'],                  0,  1,  1, ['deleteCellBlock'],                     ],
            [ 0,  0,  0,  e.code === 'Space',              ['s'],                         0,  1,  1, ['selectForwardMixed'],                  ],
            [ 0,  0,  0,  e.code === 'Space',              ['m'],                         0,  1,  1, ['selectForwardStruct'],                 ],
            [ 0,  0,  0,  e.code === 'Backspace',          ['s'],                         0,  1,  1, ['selectBackwardMixed'],                 ],
            [ 0,  0,  0,  e.code === 'Backspace',          ['c', 'cr', 'cc'],             0,  1,  1, ['selectBackwardStruct'],                ],
            [ 0,  0,  0,  e.code === 'Backspace',          ['m'],                         0,  1,  1, ['selectBackwardBackwardStruct'],        ],
            [ 0,  0,  0,  e.code === 'Escape',             ['s', 'c', 'm'],               0,  1,  1, ['selectRoot'],                          ],
            [ 1,  0,  0,  e.code === 'KeyA',               ['s', 'c', 'm'],               0,  1,  0, [],                                      ],
            [ 1,  0,  0,  e.code === 'KeyM',               ['s', 'c', 'm'],               0,  1,  0, ['CREATE_MAP_IN_MAP']                    ],
            [ 1,  0,  0,  e.code === 'KeyC',               ['s', 'c', 'm'],               0,  1,  1, ['copySelection'],                       ],
            [ 1,  0,  0,  e.code === 'KeyX',               ['s', 'c', 'm'],               0,  1,  1, ['cutSelection'],                        ],
            [ 1,  0,  0,  e.code === 'KeyS',               ['s', 'c', 'm'],               0,  1,  0, ['SAVE_MAP']                             ],
            [ 1,  0,  0,  e.code === 'KeyS',               ['s', 'c', 'm'],               1,  1,  0, ['finishEdit', 'SAVE_MAP']               ],
            [ 1,  0,  0,  e.code === 'KeyZ',               ['s', 'c', 'm', 'cr', 'cc'],   0,  1,  0, ['redo']                                 ],
            [ 1,  0,  0,  e.code === 'KeyY',               ['s', 'c', 'm', 'cr', 'cc'],   0,  1,  0, ['undo']                                 ],
            [ 1,  0,  0,  e.code === 'KeyE',               ['s'],                         0,  1,  1, ['transpose'],                           ],
            [ 0,  1,  0,  e.code === 'ArrowUp',            ['c', 'm'],                    0,  1,  1, ['selectCellCol'],                       ],
            [ 0,  1,  0,  e.code === 'ArrowDown',          ['c', 'm'],                    0,  1,  1, ['selectCellCol'],                       ],
            [ 0,  1,  0,  e.code === 'ArrowLeft',          ['c', 'm'],                    0,  1,  1, ['selectCellRow'],                       ],
            [ 0,  1,  0,  e.code === 'ArrowRight',         ['c', 'm'],                    0,  1,  1, ['selectCellRow'],                       ],
            [ 0,  1,  1,  e.code === 'ArrowLeft',          ['s'],                         0,  1,  1, ['selectDescendantsOut'],                ],
            [ 0,  1,  1,  e.code === 'ArrowRight',         ['s'],                         0,  1,  1, ['selectDescendantsOut'],                ],
            [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  ['s'],                         0,  1,  1, ['selectNeighborStruct'],                ],
            [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  ['m'],                         0,  1,  1, ['selectNeighborMixed'],                 ],
            [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  ['cr', 'cc'],                  0,  1,  1, ['selectCellBlock'],                     ],
            [ 1,  0,  0,  e.which >= 37 && e.which <= 40,  ['s'],                         0,  1,  1, ['moveNodeSelection'],                   ],
            [ 1,  0,  0,  e.which >= 37 && e.which <= 40,  ['cr', 'cc'],                  0,  1,  1, ['moveCellBlock'],                       ],
            [ 0,  1,  0,  e.which >= 37 && e.which <= 40,  ['s'],                         0,  1,  1, ['selectNeighborStructToo'],             ],
            [ 0,  0,  1,  e.which >= 37 && e.which <= 40,  ['m'],                         0,  1,  1, ['newCellBlock'],                        ],
            [ 0,  0,  1,  e.which >= 37 && e.which <= 40,  ['s', 'c', 'cr', 'cc'],        0,  1,  0, [],                                      ],
            [ 1,  0,  0,  e.which >= 96 && e.which <= 105, ['s', 'm'],                    0,  1,  1, ['applyColor'],                          ],
            [ 1,  0,  1,  e.which >= 96 && e.which <= 105, ['s', 'm'],                    0,  1,  1, ['applyTaskStatus'],                     ],
            [ 0,  0,  0,  e.which >= 48,                   ['s', 'm'],                    0,  0,  0, ['eraseContent', 'startEdit'],           ],
            [ 0,  1,  0,  e.which >= 48,                   ['s', 'm'],                    0,  0,  0, ['eraseContent', 'startEdit'],           ],
        ];

        let keyStateMachine = {};
        for (let i = 0; i < keyStateMachineDb.length; i++) {
            for (let h = 0; h < keyStateMachineDb[0].length; h++) {
                keyStateMachine[keyStateMachineDb[0][h]] = keyStateMachineDb[i][h];
            }
            if (keyStateMachine.scope.includes(sc.scope) &&
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
                    if (currExecution === 'applyColor') {
                        nodeDispatch(currExecution, {currColor: e.which - 96});
                    } else if (currExecution === 'applyTaskStatus') {
                        nodeDispatch(currExecution, {currTaskStatus: e.which - 96});
                    } else if (['undo', 'redo'].includes(currExecution)) {
                        mapDispatch(currExecution);
                    } else if (currExecution === 'CREATE_MAP_IN_MAP') {
                        dispatch({type: currExecution, payload: sc.lm.content});
                    } else if (currExecution === 'SAVE_MAP') {
                        dispatch({type: currExecution});
                    } else {
                        nodeDispatch(currExecution, {keyCode: e.code});
                        if (['newChild', 'newSiblingUp', 'newSiblingDown'].includes(currExecution)) {
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
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.read().then(item => {
                    let type = item[0].types[0];
                    if (type === 'text/plain') {
                        navigator.clipboard.readText().then(text => {
                            if (isEditing) {
                                nodeDispatch('insertTextFromClipboardAsText', text);
                            } else {
                                push();
                                if (text.substring(0, 1) === '[') {
                                    nodeDispatch('insertMapFromClipboard', text);
                                } else {
                                    nodeDispatch('newChild');
                                    redraw();
                                    if (text.substring(0, 2) === '\\[') { // double backslash counts as one character
                                        nodeDispatch('insertEquationFromClipboardAsNode', text);
                                    } else if (isUrl(text)) {
                                        nodeDispatch('insertElinkFromClipboardAsNode', text);
                                    } else {
                                        nodeDispatch('insertTextFromClipboardAsNode', text);
                                    }
                                }
                                redraw();
                                checkPop();
                            }
                        });
                    }
                    if (type === 'image/png') {
                        if (isEditing) {

                        } else {
                            item[0].getType('image/png').then(image => {
                                var formData = new FormData();
                                formData.append('upl', image, 'image.png');
                                let address = process.env.NODE_ENV === 'development' ?
                                    'http://127.0.0.1:8082/feta' :
                                    'https://mindboard.io/feta';
                                fetch(address, {method: 'post', body: formData}).then(response =>
                                    response.json().then(response => {
                                            push();
                                            nodeDispatch('newChild');
                                            nodeDispatch('insertImageFromLinkAsNode', response);
                                            redraw();
                                            checkPop();
                                        }
                                    )
                                );
                            })
                        }
                    }
                })
            }
        });
    };

    return (
        <div id = "mapHolderDiv">
            <div id = 'mapWrap'>
                <div id='mapDiv'/>
                <svg id="mapSvgOuter">
                    <svg id="mapSvgInner" x='calc(100vw)' y='calc(100vh)'/>
                </svg>
            </div>
        </div>
    )
}
