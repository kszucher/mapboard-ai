import {getDim}                                 from "./Dim"
import {communication}                          from "./Communication"
import {execute}                                from "./Execute";
import {mapMem, redraw, rebuild}                from "./Map"
import {mapLocalize}                            from "./MapLocalize";
import {getSelectionContext}                    from "./NodeSelect";
import {taskCanvasLocalize}                     from "./TaskCanvasLocalize";
import {lastEvent}                              from "./EventListener";

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
                let pageX =             lastEvent.props.pageX;
                let pageY =             lastEvent.props.pageY;
                let controlStatus =     lastEvent.props.controlStatus;

                if (! (pageX > getDim().lw && pageX <= getDim().lw + getDim().mw && pageY > getDim().uh)) {
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
                        if (controlStatus) {
                            execute('selectMeStructToo');
                        } else {
                            execute('selectMeStruct');
                        }

                        execute('openAfterMapSelect');

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

                let ref = lastEvent.ref;
                let keyCode = lastEvent.props.keyCode;
                let keyStr = lastEvent.props.keyStr;
                let modifier = lastEvent.props.modifier;

                let keyboardStateMachineDb = [
                    ['modifier', 'keyMatch',                        'scope',         'e', 'p', 'executionList',                         'd'],
                    ['',         keyStr === 'VK_F1',                ['s', 'c', 'm'], 0,   1,   [                                      ], 0 ],
                    ['',         keyStr === 'VK_F2',                ['s',      'm'], 0,   1,   ['startEdit'                           ], 1 ],
                    ['',         keyStr === 'VK_F3',                ['s', 'c', 'm'], 0,   1,   [                                      ], 0 ],
                    ['',         keyStr === 'VK_F5',                ['s', 'c', 'm'], 0,   0,   [                                      ], 0 ],
                    ['',         keyStr === 'VK_RETURN',            ['s',      'm'], 1,   1,   ['finishEdit', 'renderEquation'        ], 1 ],
                    ['',         keyStr === 'VK_RETURN',            ['s'          ], 0,   1,   ['newSiblingDown', 'startEdit'         ], 1 ],
                    [ '',        keyStr === 'VK_RETURN',            [          'm'], 0,   1,   ['selectDownMixed'                     ], 1 ],
                    ['shift',    keyStr === 'VK_RETURN',            ['s',      'm'], 0,   1,   ['newSiblingUp', 'startEdit'           ], 1 ],
                    ['alt',      keyStr === 'VK_RETURN',            ['s',         ], 0,   1,   ['cellifyMulti', 'selectFirstMixed'    ], 1 ],
                    ['',         keyStr === 'VK_INSERT',            ['s'          ], 1,   1,   ['finishEdit', 'newChild', 'startEdit' ], 1 ],
                    ['',         keyStr === 'VK_INSERT',            ['s'          ], 0,   1,   ['newChild', 'startEdit'               ], 1 ],
                    [ '',        keyStr === 'VK_INSERT',            [          'm'], 0,   1,   ['selectRightMixed'                    ], 1 ],
                    ['',         keyStr === 'VK_SPACE',             ['s'          ], 0,   1,   ['selectForwardStruct'                 ], 1 ],
                    ['',         keyStr === 'VK_SPACE',             [          'm'], 0,   1,   ['selectForwardMixed'                  ], 1 ],
                    ['',         keyStr === 'VK_BACK_SPACE',        ['s'          ], 0,   1,   ['selectBackwardStruct',               ], 1 ],
                    ['',         keyStr === 'VK_BACK_SPACE',        [          'm'], 0,   1,   ['selectBackwardMixed'                 ], 1 ],
                    ['',         keyStr === 'VK_DELETE',            ['s'          ], 0,   1,   ['deleteNode'                          ], 1 ],
                    ['',         keyStr === 'VK_DELETE',            [     'c'     ], 0,   1,   ['deleteCellBlock'                     ], 1 ],
                    ['control',  keyStr === 'VK_E',                 ['s', 'c', 'm'], 0,   1,   ['createMapInMap'                      ], 1 ],
                    ['control',  keyStr === 'VK_G',                 ['s', 'c', 'm'], 0,   1,   ['makeGrid'                            ], 1 ],
                    ['control',  keyStr === 'VK_O',                 ['s', 'c', 'm'], 0,   1,   ['normalize'                           ], 1 ],
                    ['control',  keyStr === 'VK_C',                 ['s', 'c', 'm'], 0,   1,   ['copySelection'                       ], 1 ],
                    ['control',  keyStr === 'VK_X',                 ['s', 'c', 'm'], 0,   1,   ['cutSelection', 'selectHighOrigin'    ], 1 ],
                    ['control',  keyStr === 'VK_V',                 ['s', 'c', 'm'], 1,   0,   ['pasteInText'                         ], 1 ],
                    ['control',  keyStr === 'VK_V',                 ['s', 'c', 'm'], 0,   0,   ['pasteInNode'                         ], 1 ],
                    ['control',  keyStr === 'VK_S',                 ['s', 'c', 'm'], 0,   1,   ['save'                                ], 1 ],
                    ['control',  keyStr === 'VK_S',                 ['s', 'c', 'm'], 1,   1,   ['finishEdit', 'save'                  ], 1 ],
                    ['control',  keyStr === 'VK_R',                 [          'm'], 0,   1,   ['selectCellRow'                       ], 1 ],
                    ['control',  keyStr === 'VK_T',                 [          'm'], 0,   1,   ['selectCellCol'                       ], 1 ],
                    ['',         (keyCode >= 37 && keyCode <= 40),  ['s'          ], 0,   1,   ['selectNeighborNode'                  ], 1 ],
                    ['',         (keyCode >= 37 && keyCode <= 40),  [          'm'], 0,   1,   ['selectNeighborMixed'                 ], 1 ],
                    ['shift',    (keyCode >= 37 && keyCode <= 40),  ['s'          ], 0,   1,   ['selectNeighborNodeToo'               ], 1 ],
                    ['control',  (keyCode >= 37 && keyCode <= 40),  ['s'          ], 0,   1,   ['moveNodeSelection'                   ], 1 ],
                    ['alt',      (keyCode >= 37 && keyCode <= 40),  [          'm'], 0,   1,   ['newCellBlock'                        ], 1 ],
                    ['',         keyCode >= 48,                     ['s',      'm'], 0,   0,   ['eraseContent', 'startEdit'           ], 1 ],
                    ['shift',    keyCode >= 48,                     ['s',      'm'], 0,   0,   ['eraseContent','startEdit'            ], 1 ],
                    ['shift',    keyCode >= 48,                     ['s',      'm'], 1,   0,   ['typeText',                           ], 0 ],
                    ['',         true,                              ['s',      'm'], 1,   0,   ['typeText'                            ], 0 ],
                ];

                let keyboardStateMachine = {};
                for (let i = 0; i < keyboardStateMachineDb.length; i++) {
                    for (let h = 0; h < keyboardStateMachineDb[0].length; h++) {
                        keyboardStateMachine[keyboardStateMachineDb[0][h]] = keyboardStateMachineDb[i][h];
                    }

                    if (keyboardStateMachine.scope.includes(sc.scope) &&
                        keyboardStateMachine.e ===           this.isEditing &&
                        keyboardStateMachine.modifier ===    modifier &&
                        keyboardStateMachine.keyMatch ===    true) {

                        if (keyboardStateMachine.p) {
                            ref.preventDefault();
                        }

                        for (let j = 0; j < keyboardStateMachine.executionList.length; j++) {
                            let currExecution = keyboardStateMachine.executionList[j];

                            execute(currExecution);

                            // build execution-wise
                            if (currExecution !== 'typeText' && currExecution !== 'pasteInText') {
                                rebuild();
                            }

                            // draw group-wise
                            if (keyboardStateMachine.d === 1) {
                                redraw();
                            }
                        }
                        break;
                    }
                }
            }
            else if (lastEvent.type === 'reactEvent') {
                let a2c = lastEvent.ref;
                execute(a2c.cmd);
            }
            else if (lastEvent.type === 'serverEvent') {
                let s2c = lastEvent.ref;
                execute(s2c.cmd);
            }
        }
    }
}

export let eventRouter = new EventRouter();
