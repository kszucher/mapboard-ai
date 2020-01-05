import {getDim}                                 from "./Dim"
import {communication}                          from "./Communication"
import {execute}                                from "./Execute";
import {mapMem, redraw, rebuild}                from "./Map"
import {mapLocalize}                            from "./MapLocalize";
import {getSelectionContext}                    from "./NodeSelect";
import {taskCanvasLocalize}                     from "./TaskCanvasLocalize";
import {lastEvent}                              from "./EventListener";
import {isUrl}                                  from "./Utils"

class EventRouter {
    constructor() {
        this.isEditing = 0;
    }

    processEvent() {
        if (communication.eventsEnabled === 0) {
            console.log('unfinished server communication')
        }
        else {
            if (lastEvent.type === 'windowClick') {
                let e = lastEvent.ref;

                if (! (e.pageX > getDim().lw && e.pageX <= getDim().lw + getDim().mw && e.pageY > getDim().uh)) {
                    console.log('not within region')
                }
                else {

                    if (this.isEditing === 1) {
                        execute('finishEdit');
                        redraw();
                    }

                    mapLocalize.start();

                    if (mapMem.deepestSelectablePath.length === 0) {
                        console.log('not localizable')
                    }
                    else {
                       e.ctrlKey? execute('selectMeStructToo') : execute('selectMeStruct');

                       if (!e.shiftKey) execute('openAfterNodeSelect');

                        redraw();
                        // redraw here is unconditional, todo make key version conditional with the help of the table
                    }

                    if (taskCanvasLocalize()) {
                        rebuild();
                        redraw();
                    }

                }
            }
            else if (lastEvent.type === 'windowKeyDown') {
                let sc = getSelectionContext();
                let e = lastEvent.ref;

                // note: az async/await szintaxissal el lehet kerülni az execute rekurziót, és mindent ki lehet ide hozni

                let keyStateMachineDb = [
                    ['c','s','a', 'keyMatch',                      'scope',       'e','p',  'executionList',                        'd'],
                    [ 0,  0,  0,  e.key === 'F1',                 ['s', 'c', 'm'], 0,  1,  [                                      ], 0 ],
                    [ 0,  0,  0,  e.key === 'F2',                 ['s',      'm'], 0,  1,  ['startEdit'                           ], 1 ],
                    [ 0,  0,  0,  e.key === 'F3',                 ['s', 'c', 'm'], 0,  1,  [                                      ], 0 ],
                    [ 0,  0,  0,  e.key === 'F5',                 ['s', 'c', 'm'], 0,  0,  [                                      ], 0 ],
                    [ 0,  0,  0,  e.key === 'Enter',              ['s',      'm'], 1,  1,  ['finishEdit'                          ], 1 ],
                    [ 0,  0,  0,  e.key === 'Enter',              ['s'          ], 0,  1,  ['newSiblingDown', 'startEdit'         ], 1 ],
                    [ 0,  0,  0,  e.key === 'Enter',              [          'm'], 0,  1,  ['selectDownMixed'                     ], 1 ],
                    [ 0,  1,  0,  e.key === 'Enter',              ['s',      'm'], 0,  1,  ['newSiblingUp', 'startEdit'           ], 1 ],
                    [ 0,  0,  1,  e.key === 'Enter',              ['s',         ], 0,  1,  ['cellifyMulti', 'selectFirstMixed'    ], 1 ],
                    [ 0,  0,  0,  e.key === 'Insert',             ['s'          ], 1,  1,  ['finishEdit', 'newChild', 'startEdit' ], 1 ],
                    [ 0,  0,  0,  e.key === 'Insert',             ['s'          ], 0,  1,  ['newChild', 'startEdit'               ], 1 ],
                    [ 0,  0,  0,  e.key === 'Insert',             [          'm'], 0,  1,  ['selectRightMixed'                    ], 1 ],
                    [ 0,  0,  0,  e.key === 'Delete',             ['s'          ], 0,  1,  ['deleteNode'                          ], 1 ],
                    [ 0,  0,  0,  e.key === 'Delete',             [     'c'     ], 0,  1,  ['deleteCellBlock'                     ], 1 ],
                    [ 0,  0,  0,  e.code === 'Space',             ['s'          ], 0,  1,  ['selectForwardStruct'                 ], 1 ],
                    [ 0,  0,  0,  e.code === 'Space',             [          'm'], 0,  1,  ['selectForwardMixed'                  ], 1 ],
                    [ 0,  0,  0,  e.code === 'Backspace',         ['s'          ], 0,  1,  ['selectBackwardStruct',               ], 1 ],
                    [ 0,  0,  0,  e.code === 'Backspace',         [          'm'], 0,  1,  ['selectBackwardMixed'                 ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyE',              ['s', 'c', 'm'], 0,  1,  ['createMapInMap'                      ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyP',              ['s', 'c', 'm'], 0,  1,  ['polygonFill'                         ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyG',              ['s', 'c', 'm'], 0,  1,  ['makeGrid'                            ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyO',              ['s', 'c', 'm'], 0,  1,  ['normalize'                           ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyC',              ['s', 'c', 'm'], 0,  1,  ['copySelection'                       ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyX',              ['s', 'c', 'm'], 0,  1,  ['cutSelection', 'selectHighOrigin'    ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyS',              ['s', 'c', 'm'], 0,  1,  ['save'                                ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyS',              ['s', 'c', 'm'], 1,  1,  ['finishEdit', 'save'                  ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyR',              [          'm'], 0,  1,  ['selectCellRow'                       ], 1 ],
                    [ 1,  0,  0,  e.code === 'KeyT',              [          'm'], 0,  1,  ['selectCellCol'                       ], 1 ],
                    [ 0,  0,  0,  e.which >= 37 && e.which <= 40, ['s'          ], 0,  1,  ['selectNeighborNode'                  ], 1 ],
                    [ 0,  0,  0,  e.which >= 37 && e.which <= 40, [          'm'], 0,  1,  ['selectNeighborMixed'                 ], 1 ],
                    [ 0,  1,  0,  e.which >= 37 && e.which <= 40, ['s'          ], 0,  1,  ['selectNeighborNodeToo'               ], 1 ],
                    [ 1,  0,  0,  e.which >= 37 && e.which <= 40, ['s'          ], 0,  1,  ['moveNodeSelection'                   ], 1 ],
                    [ 0,  0,  1,  e.which >= 37 && e.which <= 40, [          'm'], 0,  1,  ['newCellBlock'                        ], 1 ],
                    [ 0,  0,  0,  e.which >= 48,                  ['s',      'm'], 0,  0,  ['eraseContent', 'startEdit'           ], 1 ],
                    [ 0,  1,  0,  e.which >= 48,                  ['s',      'm'], 0,  0,  ['eraseContent','startEdit'            ], 1 ],
                    [ 0,  1,  0,  e.which >= 48,                  ['s',      'm'], 1,  0,  ['typeText',                           ], 0 ],
                    [ 0,  0,  0,  true,                           ['s',      'm'], 1,  0,  ['typeText'                            ], 0 ],
                ];

                let keyStateMachine = {};
                for (let i = 0; i < keyStateMachineDb.length; i++) {
                    for (let h = 0; h < keyStateMachineDb[0].length; h++) {
                        keyStateMachine[keyStateMachineDb[0][h]] = keyStateMachineDb[i][h];
                    }

                    if (keyStateMachine.scope.includes(sc.scope) &&
                        keyStateMachine.e ===           this.isEditing &&
                        keyStateMachine.c ===           +e.ctrlKey &&
                        keyStateMachine.s ===           +e.shiftKey &&
                        keyStateMachine.a ===           +e.altKey &&
                        keyStateMachine.keyMatch ===    true) {

                        if (keyStateMachine.p) {
                            e.preventDefault();
                        }

                        for (let j = 0; j < keyStateMachine.executionList.length; j++) {
                            let currExecution = keyStateMachine.executionList[j];

                            execute(currExecution);

                            // build execution-wise
                            if (currExecution !== 'typeText') {
                                rebuild();
                            }

                            // draw group-wise
                            if (keyStateMachine.d === 1) {
                                redraw();
                            }
                        }
                        break;
                    }
                }
            }
            else if (lastEvent.type === 'windowPaste') {
                if (this.isEditing === 1) {
                    if (lastEvent.props.dataType === 'text') {
                        execute('insertTextFromClipboardAsText');
                    }
                }
                else {
                    if (lastEvent.props.dataType === 'text') {
                        let text = lastEvent.props.data;

                        if (text.substring(0, 1) === '[') {
                            execute('insertMapFromClipboard');
                            rebuild();
                            redraw();
                        }
                        else {
                            execute('newChild');
                            rebuild();
                            if (text.substring(0, 2) === '\\[') { // double backslash counts as one character
                                execute('insertEquationFromClipboardAsNode');
                                rebuild();
                                redraw();
                            }
                            else if (isUrl(text)) {
                                execute('insertElinkFromClipboardAsNode');
                                rebuild();
                                redraw();
                            }
                            else {
                                execute('insertTextFromClipboardAsNode');
                                rebuild();
                                redraw();
                            }
                        }
                    }
                    else if(lastEvent.props.dataType === 'image') {
                        execute('sendImage');
                    }
                }
            }
            else if (lastEvent.type === 'windowPopState') {
                execute('openAfterHistory');
                rebuild();
                redraw();
            }
            else if (lastEvent.type === 'reactEvent') {
                let r2c = lastEvent.ref;
                // TODO see it all here in a switch
                execute(r2c.cmd);
            }
            else if (lastEvent.type === 'serverEvent') {
                let s2c = lastEvent.ref;
                console.log('server: ' + s2c.cmd);
                switch(s2c.cmd) {
                    case 'signInSuccess': {
                        execute('updateReactTabs');
                        execute('openAfterInit');
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
                        execute('openMap');
                        rebuild();
                        redraw();
                        break;
                    }
                    case 'writeMapRequestSuccess': {
                        break;
                    }
                    case 'createMapInMapSuccess': {
                        execute('insertIlinkFromMongo');
                        rebuild();
                        execute('save');
                        rebuild();
                        redraw();
                        break;
                    }
                }
            }
            else if (lastEvent.type === 'serverFetchEvent') {
                let sf2c = lastEvent.ref;
                if (sf2c.cmd === 'imageSaveSuccess') {
                    execute('newChild');
                    rebuild();
                    execute('insertImageFromLinkAsNode');
                    rebuild();
                    redraw();
                }
            }
        }
    }
}

export let eventRouter = new EventRouter();
