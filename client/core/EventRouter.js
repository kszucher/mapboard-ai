import {communication} from "./Communication"
import {eventEmitter} from "./EventEmitter";
import {mapMem, redraw, recalc, mapref} from "../map/Map"
import {getSelectionContext} from "../node/NodeSelect";
import {isUrl} from "./Utils"

export let currColorToPaint = 0;
export let lastEvent = {};

export const eventRouter = {

    isEditing: 0,

    processEvent: (lastEventArg) => {
        lastEvent = (lastEventArg); // should not copy because it can contain a reference
        if (communication.eventsEnabled === 0) {
            console.log('unfinished server communication')
        } else {
            eventRouter.processEventReal();
        }
    },

    processEventReal: () => {
        let e = lastEvent.ref;
        switch (lastEvent.type) {
            case 'windowClick': {
                if (eventRouter.isEditing === 1) {
                    eventEmitter('finishEdit');
                    redraw();
                }
                if (e.path[0].id.substring(0, 3) === 'div') {
                    mapMem.deepestSelectablePath = mapMem.divData[e.path[0].id].path;
                    e.ctrlKey === true ? eventEmitter('selectMeStructToo') : eventEmitter('selectMeStruct');
                    if (!e.shiftKey) eventEmitter('openAfterNodeSelect');
                    redraw();
                } else if (e.path[0].id.substring(0, 10) === 'taskCircle') {
                    let x = parseInt(e.path[0].id.charAt(10), 10);
                    let cm =  mapref(mapMem.svgData[e.path[1].id].path);
                    cm.taskStatus = x ;
                    cm.taskStatusInherited = -1;
                    recalc();
                    redraw();
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
                eventEmitter('openAfterHistory');
                recalc();
                redraw();
                break;
            }
            case 'windowKeyDown': {
                let sc = getSelectionContext();

                let keyStateMachineDb = [
                    ['c','s','a', 'keyMatch',                       'scope',       'e','p',  'executionList',                        'd'],
                    [ 0,  0,  0,  e.key === 'F1',                  ['s', 'c', 'm'], 0,  1,  [                                      ], 0 ],
                    [ 0,  0,  0,  e.key === 'F2',                  ['s',      'm'], 0,  1,  ['startEdit'                           ], 1 ],
                    [ 0,  0,  0,  e.key === 'F3',                  ['s', 'c', 'm'], 0,  1,  [                                      ], 0 ],
                    [ 0,  0,  0,  e.key === 'F5',                  ['s', 'c', 'm'], 0,  0,  [                                      ], 0 ],
                    [ 0,  0,  0,  e.key === 'Enter',               ['s',      'm'], 1,  1,  ['finishEdit'                          ], 1 ],
                    [ 0,  0,  0,  e.key === 'Enter',               ['s'          ], 0,  1,  ['newSiblingDown', 'startEdit'         ], 1 ],
                    [ 0,  0,  0,  e.key === 'Enter',               [          'm'], 0,  1,  ['selectDownMixed'                     ], 1 ],
                    [ 0,  1,  0,  e.key === 'Enter',               ['s',      'm'], 0,  1,  ['newSiblingUp', 'startEdit'           ], 1 ],
                    [ 0,  0,  1,  e.key === 'Enter',               ['s',         ], 0,  1,  ['cellifyMulti', 'selectFirstMixed'    ], 1 ],
                    [ 0,  0,  0,  e.key === 'Insert',              ['s'          ], 1,  1,  ['finishEdit', 'newChild', 'startEdit' ], 1 ],
                    [ 0,  0,  0,  e.key === 'Insert',              ['s'          ], 0,  1,  ['newChild', 'startEdit'               ], 1 ],
                    [ 0,  0,  0,  e.key === 'Insert',              [          'm'], 0,  1,  ['selectRightMixed'                    ], 1 ],
                    [ 0,  0,  0,  e.key === 'Delete',              ['s'          ], 0,  1,  ['deleteNode'                          ], 1 ],
                    [ 0,  0,  0,  e.key === 'Delete',              [     'c'     ], 0,  1,  ['deleteCellBlock'                     ], 1 ],
                    [ 0,  0,  0,  e.code === 'Space',              ['s'          ], 0,  1,  ['selectForwardStruct'                 ], 1 ],
                    [ 0,  0,  0,  e.code === 'Space',              [          'm'], 0,  1,  ['selectForwardMixed'                  ], 1 ],
                    [ 0,  0,  0,  e.code === 'Backspace',          ['s'          ], 0,  1,  ['selectBackwardStruct',               ], 1 ],
                    [ 0,  0,  0,  e.code === 'Backspace',          [          'm'], 0,  1,  ['selectBackwardMixed'                 ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyE',               ['s', 'c', 'm'], 0,  1,  ['createMapInMap'                      ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyP',               ['s', 'c', 'm'], 0,  1,  ['applyParameter'                      ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyG',               ['s', 'c', 'm'], 0,  1,  ['makeGrid'                            ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyO',               ['s', 'c', 'm'], 0,  1,  ['normalize'                           ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyC',               ['s', 'c', 'm'], 0,  1,  ['copySelection'                       ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyX',               ['s', 'c', 'm'], 0,  1,  ['cutSelection', 'selectHighOrigin'    ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyS',               ['s', 'c', 'm'], 0,  1,  ['save'                                ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyS',               ['s', 'c', 'm'], 1,  1,  ['finishEdit', 'save'                  ], 1 ],
                    [ 0,  1,  0,  e.code === 'ArrowUp',            [          'm'], 0,  1,  ['selectCellColMixed'                  ], 1 ],
                    [ 0,  1,  0,  e.code === 'ArrowDown',          [          'm'], 0,  1,  ['selectCellColMixed'                  ], 1 ],
                    [ 0,  1,  0,  e.code === 'ArrowLeft',          [          'm'], 0,  1,  ['selectCellRowMixed'                  ], 1 ],
                    [ 0,  1,  0,  e.code === 'ArrowRight',         [          'm'], 0,  1,  ['selectCellRowMixed'                  ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyL',               ['s', 'c', 'm'], 0,  1,  ['prettyPrint'                         ], 1 ],
                    [ 1,  0,  0,  e.which >= 96 && e.which <= 105, ['s',      'm'], 0,  1,  ['applyColor'                          ], 1 ],
                    [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  ['s'          ], 0,  1,  ['selectNeighborNode'                  ], 1 ],
                    [ 0,  0,  0,  e.which >= 37 && e.which <= 40,  [          'm'], 0,  1,  ['selectNeighborMixed'                 ], 1 ],
                    [ 0,  1,  0,  e.which >= 37 && e.which <= 40,  ['s'          ], 0,  1,  ['selectNeighborNodeToo'               ], 1 ],
                    [ 1,  0,  0,  e.which >= 37 && e.which <= 40,  ['s'          ], 0,  1,  ['moveNodeSelection'                   ], 1 ],
                    [ 0,  0,  1,  e.which >= 37 && e.which <= 40,  [          'm'], 0,  1,  ['newCellBlock'                        ], 1 ],
                    [ 0,  0,  0,  e.which >= 48,                   ['s',      'm'], 0,  0,  ['eraseContent', 'startEdit'           ], 1 ],
                    [ 0,  1,  0,  e.which >= 48,                   ['s',      'm'], 0,  0,  ['eraseContent','startEdit'            ], 1 ],
                    [ 0,  1,  0,  e.which >= 48,                   ['s',      'm'], 1,  0,  ['typeText',                           ], 0 ],
                    [ 0,  0,  0,  true,                            ['s',      'm'], 1,  0,  ['typeText'                            ], 0 ],
                ];

                let keyStateMachine = {};
                for (let i = 0; i < keyStateMachineDb.length; i++) {
                    for (let h = 0; h < keyStateMachineDb[0].length; h++) {
                        keyStateMachine[keyStateMachineDb[0][h]] = keyStateMachineDb[i][h];
                    }

                    if (keyStateMachine.scope.includes(sc.scope) &&
                        keyStateMachine.e === eventRouter.isEditing &&
                        keyStateMachine.c === e.ctrlKey &&
                        keyStateMachine.s === e.shiftKey &&
                        keyStateMachine.a === e.altKey &&
                        keyStateMachine.keyMatch === true) {

                        if (keyStateMachine.p) {
                            e.preventDefault();
                        }

                        for (let j = 0; j < keyStateMachine.executionList.length; j++) {
                            let currExecution = keyStateMachine.executionList[j];

                            if (currExecution === 'applyColor') {
                                currColorToPaint = e.which - 96;
                            }

                            eventEmitter(currExecution);

                            // build execution-wise
                            if (currExecution !== 'typeText') {
                                recalc();
                            }

                            // draw group-wise
                            if (keyStateMachine.d === 1) {
                                redraw();
                            }
                        }
                        break;
                    }
                }
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
                    } else if (lastEvent.props.dataType === 'image') {
                        eventEmitter('sendImage');
                    }
                }
                break;
            }
            case 'materialEvent': {
                let r2c = lastEvent.ref;
                // TODO see it all here in a switch
                eventEmitter(r2c.cmd);
                break;
            }
            case 'serverEvent': {
                let s2c = lastEvent.ref;
                console.log('server: ' + s2c.cmd);
                switch (s2c.cmd) {
                    case 'signInSuccess': {
                        eventEmitter('updateReactTabs');
                        eventEmitter('openAfterInit');
                        break;
                    }
                    case 'signInFail': {
                        console.log(localStorage);
                        break;
                    }
                    case 'signOutSuccess': {
                        localStorage.clear();
                        break;
                    }
                    case 'openMapSuccess': {
                        eventEmitter('openMap');
                        recalc();
                        redraw();
                        break;
                    }
                    case 'writeMapRequestSuccess': {
                        break;
                    }
                    case 'createMapInMapSuccess': {
                        eventEmitter('insertIlinkFromMongo');
                        recalc();
                        eventEmitter('save');
                        recalc();
                        redraw();
                        break;
                    }
                }
                break;
            }
            case 'serverFetchEvent': {
                let sf2c = lastEvent.ref;
                if (sf2c.cmd === 'imageSaveSuccess') {
                    eventEmitter('newChild');
                    recalc();
                    eventEmitter('insertImageFromLinkAsNode');
                    recalc();
                    redraw();
                }
                break;
            }
        }
    }
};
