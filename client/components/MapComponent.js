import React, {useContext, useEffect} from "react";
import {Context} from "../core/Store";
import {getSelectionContext} from "../node/NodeSelect";
import {currColorToPaint, eventRouter} from "../core/EventRouter";
import {eventEmitter} from "../core/EventEmitter";
import {mapDivData, mapSvgData, mapMem, mapref, checkPop, push, recalc, redraw} from "../map/Map";
import {isUrl} from "../core/Utils";

export function MapComponent() {

    const [state, dispatch] = useContext(Context);

    useEffect(() => { // if everything will be handled by react, this could be enabled as onXXX events
        window.addEventListener('popstate',     popstate);
        window.addEventListener('click',        click);
        window.addEventListener('dblclick',     dblclick);
        window.addEventListener('mousedown',    mousedown);
        window.addEventListener("keydown",      keydown);
        window.addEventListener("paste",        paste);
        return () => {
            window.removeEventListener('popstate',     popstate);
            window.removeEventListener('click',        click);
            window.removeEventListener('dblclick',     dblclick);
            window.removeEventListener('mousedown',    mousedown);
            window.removeEventListener("keydown",      keydown);
            window.removeEventListener("paste",        paste);
        };
    }, []);

    const popstate = (e) => {
        dispatch({type: 'OPEN_MAP', payload: {source: 'HISTORY', val: ''}})
    };

    const click = (e) => {
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
                        let sc = getSelectionContext();
                        if(sc.lm.linkType === 'internal') {
                            dispatch({type: 'OPEN_MAP', payload: {source: 'MOUSE', lm: sc.lm}})
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
    };

    const dblclick = (e) => {
        if (e.path[0].id.substring(0, 3) === 'div') {
            eventEmitter('startEdit');
            recalc();
            redraw();
        }
    };

    const mousedown = (e) => {
        e.preventDefault();
    };

    const keydown = (e) => {
        let sc = getSelectionContext();

        // TODO: move this out to a new file

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
    };

    const paste = (e) => {
        e.preventDefault();
        console.log('PASTE');
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.read().then(item => {
                    let type = item[0].types[0];
                    if (type === 'text/plain') {
                        navigator.clipboard.readText().then(text => {
                            if (isEditing) {// /TODO get isEditing
                                eventEmitter('insertTextFromClipboardAsText'); // TODO: pass text
                            } else {
                                push();
                                if (text.substring(0, 1) === '[') {
                                    eventEmitter('insertMapFromClipboard'); recalc(); redraw();
                                } else {
                                    eventEmitter('newChild'); recalc();
                                    if (text.substring(0, 2) === '\\[') { // double backslash counts as one character
                                        eventEmitter('insertEquationFromClipboardAsNode'); recalc(); redraw();
                                    } else if (isUrl(text)) {
                                        eventEmitter('insertElinkFromClipboardAsNode'); recalc(); redraw();
                                    } else {
                                        eventEmitter('insertTextFromClipboardAsNode'); recalc(); redraw();
                                    }
                                }
                                checkPop();
                            }
                        });
                    }
                    if (type === 'image/png') {
                        if (isEditing) { // TODO get isEditing

                        } else {
                            item[0].getType('image/png').then(image => {
                                var formData = new FormData();
                                formData.append('upl', image, 'image.png');
                                let address = process.env.NODE_ENV === 'development' ?
                                    'http://127.0.0.1:8082/feta' :
                                    'https://mindboard.io/feta';
                                fetch(address, {method: 'post', body: formData}).then(response => {
                                    response.json().then(sf2c => {
                                        eventEmitter('insertImageFromLinkAsNode', sf2c); // TODO: pass this properly
                                    });
                                });
                            })
                        }
                    }
                })
            }
        });
    };

    return(
        <div
            id='mapDiv'
            // onClick={click}
            // onDoubleClick={dblclick}
            // onMouseDown={mousedown}
            // onKeyDown={keydown}
            // onPaste={paste}
        >
            <svg id="mapSvg"/>
        </div>
    )
}
