import {eventRouter} from "./EventRouter"

export let windowHandler = {
    addListeners: () => {
        // https://www.tutorialspoint.com/es6/es6_events.htm
        window.addEventListener('click',        windowHandler.click);
        window.addEventListener('dblclick',     windowHandler.dblclick);
        window.addEventListener('mousedown',    windowHandler.mousedown);
        window.addEventListener("focusout",     windowHandler.focusout);
        window.addEventListener("focus",        windowHandler.focus);
        window.addEventListener("popstate",     windowHandler.popstate);
        window.addEventListener("resize",       windowHandler.resize);
        window.addEventListener("keydown",      windowHandler.keydown);
        window.addEventListener("keyup",        windowHandler.keyup);
        window.addEventListener("paste",        windowHandler.paste);
    },

    removeListeners: () => {
        window.removeEventListener('click',     windowHandler.click);
        window.removeEventListener('dblclick',  windowHandler.dblclick);
        window.removeEventListener('mousedown', windowHandler.mousedown);
        window.removeEventListener("focusout",  windowHandler.focusout);
        window.removeEventListener("focus",     windowHandler.focus);
        window.removeEventListener("popstate",  windowHandler.popstate);
        window.removeEventListener("resize",    windowHandler.resize);
        window.removeEventListener("keydown",   windowHandler.keydown);
        window.removeEventListener("keyup",     windowHandler.keyup);
        window.removeEventListener("paste",     windowHandler.paste);
    },

    click: (e) => {
        eventRouter.processEvent({
            type: 'windowClick',
            ref: e,
        });
    },

    dblclick: (e) => {
        eventRouter.processEvent({
            type: 'windowDoubleClick',
            ref: e,
        });
    },

    mousedown(e) {
        e.preventDefault();
    },

    focusout: () => {

    },

    focus: () => {
        console.log('FOCUS');
    },

    popstate: (e) => {
        eventRouter.processEvent({
            type: 'windowPopState',
            ref: e,
        });
    },

    resize: () => {
        let bottomRightDiv = document.getElementById('bottom-right');
        let mapDiv = document.getElementById('mapDiv');

        if (bottomRightDiv.clientWidth < mapDiv.clientWidth) {
            // egészen addig, amíg az extra távolság el nem éri a nullát, közelítünk
            // illetve, ha egészen sok helyünk van is megtartjuk az 1366-ot

            // recalc();
            // redraw();
        }
    },

    keydown: (e) => {
        eventRouter.processEvent({
            type: 'windowKeyDown',
            ref: e,
        });
    },

    keyup: (e) => {

    },

    paste: (e) => {
        e.preventDefault();

        console.log('PASTE');
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.read().then(item => {
                    let type = item[0].types[0];
                    if (type === 'text/plain') {
                        navigator.clipboard.readText().then(text => {
                            eventRouter.processEvent({
                                type: 'windowPaste',
                                props: {
                                    dataType: 'text',
                                    data: text
                                }
                            });
                        });
                    }
                    if (type === 'image/png') {
                        item[0].getType('image/png').then(image => {
                            eventRouter.processEvent({
                                type: 'windowPaste',
                                props: {
                                    dataType: 'image',
                                    data: image
                                }

                            });
                        })
                    }
                })
            }
        });
    },
};
