import {eventEmitter} from "./EventEmitter";
import {mapMem, redraw, recalc, mapref, push, checkPop, mapDivData, mapSvgData, initDomData, loadMap} from "../map/Map"
import {getSelectionContext} from "../node/NodeSelect";
import {isUrl} from "./Utils"
import {windowHandler} from "./WindowHandler";
import {remoteDispatch} from "./Store";

export let currColorToPaint = 0;
export let lastEvent = {};

export const eventRouter = {

    isEditing: 0,

    processEvent: (action, payload) => {


        let e = lastEvent.ref;


        switch (action) {
            case 'windowClick': {
                let sc = getSelectionContext();

                if (eventRouter.isEditing === 1) {
                    eventEmitter('finishEdit');
                    recalc();
                    redraw();
                }

                for (const pathItem of e.path) {
                    if (pathItem.id) {
                        if (pathItem.id.substring(0, 3) === 'div') {
                            push();
                            mapMem.deepestSelectablePath = mapDivData[pathItem.id].path;
                            if (!e.ctrlKey) eventEmitter('selectMeStruct'); else eventEmitter('selectMeStructToo');
                            if (!e.shiftKey) {
                                if(sc.lm.linkType === 'internal') {
                                    remoteDispatch({
                                        type: 'OPEN_MAP',
                                        payload: {
                                            mapId: sc.lm.link,
                                            mapName: sc.lm.content,
                                            pushHistory: true,
                                            breadcrumbsOp: 'push'
                                        }
                                    })
                                } else if (sc.lm.linkType === 'external') {
                                    window.open(sc.lm.link, '_blank');
                                    window.focus();
                                }
                            }
                            redraw();
                            checkPop();
                            break;
                        } else if (pathItem.id.substring(0, 10) === 'taskCircle') {
                            push();
                            let x = parseInt(e.path[0].id.charAt(10), 10);
                            let cm = mapref(mapSvgData[e.path[1].id].path);
                            cm.taskStatus = x;
                            cm.taskStatusInherited = -1;
                            recalc();
                            redraw();
                            checkPop();
                            break;
                        }
                    }
                }
                break;
            }
            case 'windowDoubleClick': {
                if (e.path[0].id.substring(0, 3) === 'div') {
                    eventEmitter('startEdit');
                    recalc();
                    redraw();
                }
                break;
            }
            case 'windowPopState': {

                // ON HISTORY, vagy valami...
                // ez majd azon a programrészen lesz, ahol a HISTORY van...
                //     remoteDispatch({type: 'OPEN_MAP', payload: {
                //             mapId: lastEvent.ref.state.mapId,
                //             mapName: mapMem.getData().r[0].content,
                //             pushHistory: false,
                //             breadcrumbsOp: 'x'}});
                //     break;

                // FONTOS: majd az OPEN MAP SUCCESS feladata lesz a recalc/redraw, nem itt


                // eventEmitter('openFromHistory');
                // recalc();
                // redraw();
                break;
            }
            case 'windowKeyDown': {
                let sc = getSelectionContext();

                // TODO: move this out to a new file
                let keyStateMachineDb = [
                    ['c','s','a', 'keyMatch',                       'scope',       'e','p','m',  'executionList', 'reduceList'         ],
                    [ 0,  0,  0,  e.key === 'F1',                  ['s', 'c', 'm'], 0,  1,  0, [                                      ], []],
                    [ 0,  0,  0,  e.key === 'F2',                  ['s',      'm'], 0,  1,  0, ['startEdit'                           ], []],
                    [ 0,  0,  0,  e.key === 'F3',                  ['s', 'c', 'm'], 0,  1,  0, [                                      ], []],
                    [ 0,  0,  0,  e.key === 'F5',                  ['s', 'c', 'm'], 0,  0,  0, [                                      ], []],
                    [ 0,  0,  0,  e.key === 'Enter',               ['s',      'm'], 1,  1,  0, ['finishEdit'                          ], []],
                    [ 0,  0,  0,  e.key === 'Enter',               ['s'          ], 0,  1,  1, ['newSiblingDown', 'startEdit'         ], []],
                    [ 0,  0,  0,  e.key === 'Enter',               [          'm'], 0,  1,  1, ['selectDownMixed'                     ], []],
                    [ 0,  1,  0,  e.key === 'Enter',               ['s',      'm'], 0,  1,  1, ['newSiblingUp', 'startEdit'           ], []],
                    [ 0,  0,  1,  e.key === 'Enter',               ['s',         ], 0,  1,  1, ['cellifyMulti', 'selectFirstMixed'    ], []],
                    [ 0,  0,  0,  e.key === 'Insert',              ['s'          ], 1,  1,  1, ['finishEdit', 'newChild', 'startEdit' ], []],
                    [ 0,  0,  0,  e.key === 'Insert',              ['s'          ], 0,  1,  1, ['newChild', 'startEdit'               ], []],
                    [ 0,  0,  0,  e.key === 'Insert',              [          'm'], 0,  1,  1, ['selectRightMixed'                    ], []],
                    [ 0,  0,  0,  e.key === 'Tab',                 ['s'          ], 1,  1,  1, ['finishEdit', 'newChild', 'startEdit' ], []],
                    [ 0,  0,  0,  e.key === 'Tab',                 ['s'          ], 0,  1,  1, ['newChild', 'startEdit'               ], []],
                    [ 0,  0,  0,  e.key === 'Tab',                 [          'm'], 0,  1,  1, ['selectRightMixed'                    ], []],
                    [ 0,  0,  0,  e.key === 'Delete',              ['s'          ], 0,  1,  1, ['deleteNode'                          ], []],
                    [ 0,  0,  0,  e.key === 'Delete',              [     'c'     ], 0,  1,  1, ['deleteCellBlock'                     ], []],
                    [ 0,  0,  0,  e.code === 'Space',              ['s'          ], 0,  1,  1, ['selectForwardStruct'                 ], []],
                    [ 0,  0,  0,  e.code === 'Space',              [          'm'], 0,  1,  1, ['selectForwardMixed'                  ], []],
                    [ 0,  0,  0,  e.code === 'Backspace',          ['s'          ], 0,  1,  1, ['selectBackwardStruct',               ], []],
                    [ 0,  0,  0,  e.code === 'Backspace',          [          'm'], 0,  1,  1, ['selectBackwardMixed'                 ], []],
                    [ 0,  0,  0,  e.code === 'Escape',             ['s', 'c', 'm'], 0,  1,  1, ['selectRoot'                          ], []],
                    [ 1,  0,  0,  e.code === 'KeyA',               ['s', 'c', 'm'], 0,  1,  0, [                                      ], []],
                    [ 1,  0,  0,  e.code === 'KeyM',               ['s', 'c', 'm'], 0,  1,  0, [                                      ], ['CREATE_MAP_IN_MAP']],
                    [ 1,  0,  0,  e.code === 'KeyC',               ['s', 'c', 'm'], 0,  1,  1, ['copySelection'                       ], []],
                    [ 1,  0,  0,  e.code === 'KeyX',               ['s', 'c', 'm'], 0,  1,  1, ['cutSelection'                        ], []],
                    [ 1,  0,  0,  e.code === 'KeyS',               ['s', 'c', 'm'], 0,  1,  0, [                                      ], ['SAVE_MAP']],
                    [ 1,  0,  0,  e.code === 'KeyS',               ['s', 'c', 'm'], 1,  1,  0, ['finishEdit',                         ], ['SAVE_MAP']],
                    [ 1,  0,  0,  e.code === 'KeyZ',               ['s', 'c', 'm'], 0,  1,  0, [                                      ], ['REDO']],
                    [ 1,  0,  0,  e.code === 'KeyY',               ['s', 'c', 'm'], 0,  1,  0, [                                      ], ['UNDO']],
                    [ 0,  1,  0,  e.code === 'ArrowUp',            [     'c', 'm'], 0,  1,  1, ['selectCellCol'                       ], []],
                    [ 0,  1,  0,  e.code === 'ArrowDown',          [     'c', 'm'], 0,  1,  1, ['selectCellCol'                       ], []],
                    [ 0,  1,  0,  e.code === 'ArrowLeft',          [     'c', 'm'], 0,  1,  1, ['selectCellRow'                       ], []],
                    [ 0,  1,  0,  e.code === 'ArrowRight',         [     'c', 'm'], 0,  1,  1, ['selectCellRow'                       ], []],
                    [ 1,  0,  0,  e.code === 'KeyL',               ['s', 'c', 'm'], 0,  1,  0, ['prettyPrint'                         ], []],
                    [ 1,  0,  0,  e.which >= 96 && e.which <= 105, ['s',      'm'], 0,  1,  1, ['applyColor'                          ], []],
                    [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  ['s'          ], 0,  1,  1, ['selectNeighborNode'                  ], []],
                    [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  [          'm'], 0,  1,  1, ['selectNeighborMixed'                 ], []],
                    [ 0,  1,  0,  e.which >= 37 && e.which <= 40,  ['s'          ], 0,  1,  1, ['selectNeighborNodeToo'               ], []],
                    [ 1,  0,  0,  e.which >= 37 && e.which <= 40,  ['s'          ], 0,  1,  1, ['moveNodeSelection'                   ], []],
                    [ 0,  0,  1,  e.which >= 37 && e.which <= 40,  [          'm'], 0,  1,  1, ['newCellBlock'                        ], []],
                    [ 0,  0,  0,  e.which >= 48,                   ['s',      'm'], 0,  0,  0, ['eraseContent', 'startEdit'           ], []],
                    [ 0,  1,  0,  e.which >= 48,                   ['s',      'm'], 0,  0,  0, ['eraseContent', 'startEdit'           ], []],
                ];

                let keyStateMachine = {};
                for (let i = 0; i < keyStateMachineDb.length; i++) {
                    for (let h = 0; h < keyStateMachineDb[0].length; h++) {
                        keyStateMachine[keyStateMachineDb[0][h]] = keyStateMachineDb[i][h];
                    }
                    if (keyStateMachine.scope.includes(sc.scope) &&
                        keyStateMachine.e === eventRouter.isEditing &&
                        keyStateMachine.c === +e.ctrlKey &&
                        keyStateMachine.s === +e.shiftKey &&
                        keyStateMachine.a === +e.altKey &&
                        keyStateMachine.keyMatch === true) {

                        if (keyStateMachine.p) {
                            e.preventDefault();
                        }

                        if (keyStateMachine.m === 1) {
                            push();
                        }

                        for (let j = 0; j < keyStateMachine.executionList.length; j++) {
                            let currExecution = keyStateMachine.executionList[j];
                            if (currExecution === 'applyColor') {
                                currColorToPaint = e.which - 96;
                            }
                            eventEmitter(currExecution);
                            recalc();
                            redraw();
                        }

                        if (keyStateMachine.m === 1) {
                            checkPop();
                        }

                        break;
                    }
                }
                break;
            }
            case 'typeTextEvent': {
                eventEmitter('typeText');
                recalc();
                redraw();
                break;
            }
            case 'windowPaste': {
                if (eventRouter.isEditing === 1) {
                    if (lastEvent.props.dataType === 'text') {
                        eventEmitter('insertTextFromClipboardAsText');
                    }
                } else {
                    if (lastEvent.props.dataType === 'text') {
                        let text = lastEvent.props.data;
                        push();
                        if (text.substring(0, 1) === '[') {
                            eventEmitter('insertMapFromClipboard');
                            recalc();
                            redraw();
                        } else {
                            eventEmitter('newChild');
                            recalc();
                            if (text.substring(0, 2) === '\\[') { // double backslash counts as one character
                                eventEmitter('insertEquationFromClipboardAsNode');
                                recalc();
                                redraw();
                            } else if (isUrl(text)) {
                                eventEmitter('insertElinkFromClipboardAsNode');
                                recalc();
                                redraw();
                            } else {
                                eventEmitter('insertTextFromClipboardAsNode');
                                recalc();
                                redraw();
                            }
                        }
                        checkPop();
                    } else if (lastEvent.props.dataType === 'image') {
                        var formData = new FormData();
                        formData.append('upl', lastEvent.props.data, 'image.png');
                        let address = process.env.NODE_ENV === 'development'?
                            'http://127.0.0.1:8082/feta' :
                            'https://mindboard.io/feta';
                        fetch(address, {
                            method:     'post',
                            body:       formData
                        }).then(function(response) {
                            response.json().then(function(sf2c) {
                                eventEmitter('insertImageFromLinkAsNode', sf2c); // TODO: pass this properly
                            });
                        });
                    }
                }
                break;
            }



        }
    }
};
