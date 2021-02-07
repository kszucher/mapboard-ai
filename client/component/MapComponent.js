import React, {useContext, useEffect} from "react";
import {Context} from "../core/Store";
import {getSelectionContext} from "../node/NodeSelect";
import {isEditing, nodeDispatch} from "../core/NodeReducer";
import {mapDivData, mapMem, checkPop, push, redraw, setMapAlignment, setMapDensity} from "../map/Map";
import {isUrl} from "../core/Utils";
import '../component-css/MapComponent.css'

export function MapComponent() {

    const [state, dispatch] = useContext(Context);
    const {density} = state;

    useEffect(() => {
        window.addEventListener("resize",       resize);
        window.addEventListener('popstate',     popstate);
        window.addEventListener('click',        click);
        window.addEventListener('dblclick',     dblclick);
        window.addEventListener('mousedown',    mousedown);
        window.addEventListener("keydown",      keydown);
        window.addEventListener("paste",        paste);
        return () => {
            window.removeEventListener("resize",       resize);
            window.removeEventListener('popstate',     popstate);
            window.removeEventListener('click',        click);
            window.removeEventListener('dblclick',     dblclick);
            window.removeEventListener('mousedown',    mousedown);
            window.removeEventListener("keydown",      keydown);
            window.removeEventListener("paste",        paste);
        };
    }, []);

    useEffect(() => {
        if (density !== '') {
            setMapDensity(density);
            nodeDispatch('resetDim');
            redraw();
        }
    }, [density]);

    const resize = (e) => {
        // setMapAlignment();
    };

    const popstate = (e) => {
        dispatch({type: 'OPEN_MAP', payload: {source: 'HISTORY', event: e}})
    };

    const click = (e) => {
        if (isEditing === 1) {
            nodeDispatch('finishEdit');
            redraw();
        }
        for (const pathItem of e.path) {
            if (pathItem.id) {
                if (pathItem.id.substring(0, 3) === 'div') {
                    mapMem.deepestSelectablePath = mapDivData[pathItem.id].path;
                    push();
                    if (e.ctrlKey && e.shiftKey || !e.ctrlKey && !e.shiftKey) {
                        nodeDispatch('selectStruct');
                    } else {
                        nodeDispatch('selectStructToo');
                    }
                    redraw();
                    checkPop();
                    if (!e.shiftKey) {
                        let sc = getSelectionContext();
                        if(sc.lm.linkType === 'internal') {
                            dispatch({type: 'OPEN_MAP', payload: {source: 'MOUSE', lm: sc.lm}})
                        } else if (sc.lm.linkType === 'external') {
                            window.open(sc.lm.link, '_blank');
                            window.focus();
                        }
                    }
                } else if (pathItem.id.substring(0, 10) === 'taskCircle') {
                    push();
                    nodeDispatch('setTaskStatus', {taskStatus: parseInt(e.path[0].id.charAt(10), 10), svgId: e.path[1].id});
                    redraw();
                    checkPop();
                    break;
                }
            }
        }
    };

    const dblclick = (e) => {
        nodeDispatch('startEdit');
        redraw();
    };

    const mousedown = (e) => {
        e.preventDefault();
    };

    const keydown = (e) => {
        let sc = getSelectionContext();

        let keyStateMachineDb = [
            ['c','s','a', 'keyMatch',                       'scope',                     'e','p','m',  'executionList',                       'reducerList'        ],
            [ 0,  0,  0,  e.key === 'F1',                  ['s', 'c', 'm'],               0,  1,  0, [],                                      []                   ],
            [ 0,  0,  0,  e.key === 'F2',                  ['s', 'm'],                    0,  1,  0, ['startEdit'],                           []                   ],
            [ 0,  0,  0,  e.key === 'F3',                  ['s', 'c', 'm'],               0,  1,  0, [],                                      []                   ],
            [ 0,  0,  0,  e.key === 'F5',                  ['s', 'c', 'm'],               0,  0,  0, [],                                      []                   ],
            [ 0,  0,  0,  e.key === 'Enter',               ['s', 'm'],                    1,  1,  0, ['finishEdit'],                          []                   ],
            [ 0,  0,  0,  e.key === 'Enter',               ['s'],                         0,  1,  1, ['newSiblingDown', 'startEdit'],         []                   ],
            [ 0,  0,  0,  e.key === 'Enter',               ['m'],                         0,  1,  1, ['selectDownMixed'],                     []                   ],
            [ 0,  1,  0,  e.key === 'Enter',               ['s', 'm'],                    0,  1,  1, ['newSiblingUp', 'startEdit'],           []                   ],
            [ 0,  0,  1,  e.key === 'Enter',               ['s'],                         0,  1,  1, ['cellifyMulti', 'selectFirstMixed'],    []                   ],
            [ 0,  0,  0,  e.key === 'Insert',              ['s'],                         1,  1,  1, ['finishEdit', 'newChild', 'startEdit'], []                   ],
            [ 0,  0,  0,  e.key === 'Insert',              ['s'],                         0,  1,  1, ['newChild', 'startEdit'],               []                   ],
            [ 0,  0,  0,  e.key === 'Insert',              ['m'],                         0,  1,  1, ['selectOutMixed'],                      []                   ],
            [ 0,  0,  0,  e.key === 'Tab',                 ['s'],                         1,  1,  1, ['finishEdit', 'newChild', 'startEdit'], []                   ],
            [ 0,  0,  0,  e.key === 'Tab',                 ['s'],                         0,  1,  1, ['newChild', 'startEdit'],               []                   ],
            [ 0,  0,  0,  e.key === 'Tab',                 ['m'],                         0,  1,  1, ['selectOutMixed'],                      []                   ],
            [ 0,  0,  0,  e.key === 'Delete',              ['s'],                         0,  1,  1, ['deleteNode'],                          []                   ],
            [ 0,  0,  0,  e.key === 'Delete',              ['cr', 'cc'],                  0,  1,  1, ['deleteCellBlock'],                     []                   ],
            [ 0,  0,  0,  e.code === 'Space',              ['s'],                         0,  1,  1, ['selectForwardMixed'],                  []                   ],
            [ 0,  0,  0,  e.code === 'Space',              ['m'],                         0,  1,  1, ['selectForwardStruct'],                 []                   ],
            [ 0,  0,  0,  e.code === 'Backspace',          ['s'],                         0,  1,  1, ['selectBackwardMixed'],                 []                   ],
            [ 0,  0,  0,  e.code === 'Backspace',          ['c', 'cr', 'cc'],             0,  1,  1, ['selectBackwardStruct'],                []                   ],
            [ 0,  0,  0,  e.code === 'Backspace',          ['m'],                         0,  1,  1, ['selectBackwardBackwardStruct'],        []                   ],
            [ 0,  0,  0,  e.code === 'Escape',             ['s', 'c', 'm'],               0,  1,  1, ['selectRoot'],                          []                   ],
            [ 1,  0,  0,  e.code === 'KeyA',               ['s', 'c', 'm'],               0,  1,  0, [],                                      []                   ],
            [ 1,  0,  0,  e.code === 'KeyM',               ['s', 'c', 'm'],               0,  1,  0, [],                                      ['CREATE_MAP_IN_MAP']],
            [ 1,  0,  0,  e.code === 'KeyC',               ['s', 'c', 'm'],               0,  1,  1, ['copySelection'],                       []                   ],
            [ 1,  0,  0,  e.code === 'KeyX',               ['s', 'c', 'm'],               0,  1,  1, ['cutSelection'],                        []                   ],
            [ 1,  0,  0,  e.code === 'KeyS',               ['s', 'c', 'm'],               0,  1,  0, [],                                      ['SAVE_MAP']         ],
            [ 1,  0,  0,  e.code === 'KeyS',               ['s', 'c', 'm'],               1,  1,  0, ['finishEdit'],                          ['SAVE_MAP']         ],
            [ 1,  0,  0,  e.code === 'KeyZ',               ['s', 'c', 'm', 'cr', 'cc'],   0,  1,  0, [],                                      ['REDO']             ],
            [ 1,  0,  0,  e.code === 'KeyY',               ['s', 'c', 'm', 'cr', 'cc'],   0,  1,  0, [],                                      ['UNDO']             ],
            [ 1,  0,  1,  e.code === 'KeyT',               ['s', 'c', 'm'],               0,  1,  1, ['taskCheckReset', 'taskSwitch'],        []                   ],
            [ 1,  0,  0,  e.code === 'KeyE',               ['s'],                         0,  1,  1, ['transpose'],                           []                   ],
            [ 0,  1,  0,  e.code === 'ArrowUp',            ['c', 'm'],                    0,  1,  1, ['selectCellCol'],                       []                   ],
            [ 0,  1,  0,  e.code === 'ArrowDown',          ['c', 'm'],                    0,  1,  1, ['selectCellCol'],                       []                   ],
            [ 0,  1,  0,  e.code === 'ArrowLeft',          ['c', 'm'],                    0,  1,  1, ['selectCellRow'],                       []                   ],
            [ 0,  1,  0,  e.code === 'ArrowRight',         ['c', 'm'],                    0,  1,  1, ['selectCellRow'],                       []                   ],
            [ 0,  1,  1,  e.code === 'ArrowLeft',          ['s'],                         0,  1,  1, ['selectDescendantsOut'],                []                   ],
            [ 0,  1,  1,  e.code === 'ArrowRight',         ['s'],                         0,  1,  1, ['selectDescendantsOut'],                []                   ],
            [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  ['s'],                         0,  1,  1, ['selectNeighborStruct'],                []                   ],
            [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  ['m'],                         0,  1,  1, ['selectNeighborMixed'],                 []                   ],
            [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  ['cr', 'cc'],                  0,  1,  1, ['selectCellBlock'],                     []                   ],
            [ 1,  0,  0,  e.which >= 37 && e.which <= 40,  ['s'],                         0,  1,  1, ['moveNodeSelection'],                   []                   ],
            [ 1,  0,  0,  e.which >= 37 && e.which <= 40,  ['cr', 'cc'],                  0,  1,  1, ['moveCellBlock'],                       []                   ],
            [ 0,  1,  0,  e.which >= 37 && e.which <= 40,  ['s'],                         0,  1,  1, ['selectNeighborStructToo'],             []                   ],
            [ 0,  0,  1,  e.which >= 37 && e.which <= 40,  ['m'],                         0,  1,  1, ['newCellBlock'],                        []                   ],
            [ 0,  0,  1,  e.which >= 37 && e.which <= 40,  ['s', 'c', 'cr', 'cc'],        0,  1,  0, [],                                      []                   ],
            [ 1,  0,  0,  e.which >= 96 && e.which <= 105, ['s', 'm'],                    0,  1,  1, ['applyColor'],                          []                   ],
            [ 1,  0,  1,  e.which >= 96 && e.which <= 105, ['s', 'm'],                    0,  1,  1, ['applyTaskStatus'],                     []                   ],
            [ 0,  0,  0,  e.which >= 48,                   ['s', 'm'],                    0,  0,  0, ['eraseContent', 'startEdit'],           []                   ],
            [ 0,  1,  0,  e.which >= 48,                   ['s', 'm'],                    0,  0,  0, ['eraseContent', 'startEdit'],           []                   ],
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
                    } else {
                        nodeDispatch(currExecution, {keyCode: e.code});
                        if (['newChild', 'newSiblingUp', 'newSiblingDown'].includes(currExecution)) {
                            redraw();
                        }
                    }
                }
                for (let j = 0; j < keyStateMachine.reducerList.length; j++) {
                    let currReducer = keyStateMachine.reducerList[j];
                    if (currReducer === 'CREATE_MAP_IN_MAP') {
                        dispatch({type: currReducer, payload: sc.lm.content});
                    } else {
                        // only move these under nodeReducer once they will really change state
                        if (currReducer === 'UNDO') {
                            if (mapMem.dataIndex > 0) {
                                mapMem.dataIndex--;
                            }
                        } else if (currReducer === 'REDO') {
                            if (mapMem.dataIndex < mapMem.data.length - 1) {
                                mapMem.dataIndex++;
                            }
                        } else {
                            dispatch({type: currReducer});
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

    return(
        <div id = 'mapSpaceColumns' >
            <div id = 'mapSpaceLeft'/>
            <div>
                <div id = 'mapSpaceTop'/>
                <div id = 'mapWrap'>
                    <div id='mapDivBackground'/>
                    <div id='mapDiv'>
                        <svg id="mapSvg"/>
                    </div>
                </div>
                <div id = 'mapSpaceBottom'/>
            </div>
            <div id = 'mapSpaceRight'/>
        </div>
    )
}
