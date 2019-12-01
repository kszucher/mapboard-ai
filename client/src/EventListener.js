import {keyHelper}          from "./keyHelper";
import {eventRouter}        from "./EventRouter"
import {initDim}            from "./Dim";

export let lastEvent = {};

class EventListener {
    constructor() {
        this.controlStatus = false;
        lastEvent = {};
    }

    addListeners() {
        // https://www.tutorialspoint.com/es6/es6_events.htm
        window.addEventListener('click',                event =>    this.click(event)               );
        window.addEventListener("focusout",             event =>    this.focusout()                 );
        window.addEventListener("focus",                event =>    this.focus()                    );
        window.addEventListener("resize",               event =>    this.resize()                   );
        window.addEventListener("keydown",              event =>    this.keydown(event)             );
        window.addEventListener("keyup",                event =>    this.keyup(event)               );
        window.addEventListener("paste",                event =>    this.paste()                    );
    }

    click(event) {
        lastEvent = {
            ref:                                        event,
            type:                                       'windowClick',
            props: {
                pageX:                                  event.pageX,
                pageY:                                  event.pageY,
                controlStatus:                          this.controlStatus,
            }
        };
        eventRouter.processEvent();
    }

    focusout() {

    }

    focus() {
        console.log('FOCUS');
        keyHelper.init();
    }

    resize() {
        console.log('RESIZE');
        initDim();
    }

    keydown(event) {
        let keyCode = event.keyCode;
        let keyStr = keyHelper.getKey(keyCode);

        if (keyStr === 'VK_CONTROL') {
            this.controlStatus = true;
        }

        if(keyHelper.lut[keyStr] !== undefined) {
            keyHelper.lut[keyStr].status = true;
        }

        if(keyHelper.lut.VK_SHIFT.status === true) {
            let keyLutFields = Object.keys(keyHelper.lut);
            for (let i = 0; i < keyLutFields.length; i++) {
                let currKey = keyHelper.lut[keyLutFields[i]];
                if (keyLutFields[i] !== 'VK_SHIFT' && currKey.status === true) {
                    lastEvent = {
                        ref:                            event,
                        type:                           'windowKeyDown',
                        props: {
                            keyCode:                    keyCode,
                            keyStr:                     keyStr,
                            modifier:                   'shift',
                        }
                    };
                    eventRouter.processEvent();
                }
            }
        }
        else if(keyHelper.lut.VK_CONTROL.status === true) {
            let keyLutFields = Object.keys(keyHelper.lut);
            for (let i = 0; i < keyLutFields.length; i++) {
                let currKey = keyHelper.lut[keyLutFields[i]];
                if (keyLutFields[i] !== 'VK_CONTROL' && currKey.status === true) {
                    lastEvent = {
                        ref:                            event,
                        type:                           'windowKeyDown',
                        props: {
                            keyCode:                    keyCode,
                            keyStr:                     keyStr,
                            modifier:                   'control',
                        }
                    };
                    eventRouter.processEvent();
                }
            }
        }
        else if(keyHelper.lut.VK_ALT.status === true) {
            let keyLutFields = Object.keys(keyHelper.lut);
            for (let i = 0; i < keyLutFields.length; i++) {
                let currKey = keyHelper.lut[keyLutFields[i]];
                if (keyLutFields[i] !== 'VK_ALT' && currKey.status === true) {
                    lastEvent = {
                        ref:                            event,
                        type:                           'windowKeyDown',
                        props: {
                            keyCode:                    keyCode,
                            keyStr:                     keyStr,
                            modifier:                   'alt',
                        }
                    };
                    eventRouter.processEvent();
                }
            }
        }
        else {
            lastEvent = {
                ref:                                    event,
                type:                                   'windowKeyDown',
                props: {
                    keyCode:                            keyCode,
                    keyStr:                             keyStr,
                    modifier:                           '',
                }
            };
            eventRouter.processEvent();
        }
    };

    keyup(event) {
        let keyCode = event.keyCode;
        let keyStr = keyHelper.getKey(keyCode);

        if (keyStr === 'VK_CONTROL') {
            this.controlStatus = false;
        }

        if(keyHelper.lut[keyStr] !== undefined) {
            keyHelper.lut[keyStr].status = false;
        }
        else {
            // in case we want to do anything with the special characters in text
        }
    };

    paste() {
        console.log('PASTE');
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.read().then(item => {
                    let type = item[0].types[0];
                    if (type === 'text/plain') {
                        navigator.clipboard.readText().then(text => {
                            lastEvent = {
                                ref:                    '',
                                type:                   'windowPaste',
                                props: {
                                    dataType:           'text',
                                    data:               text
                                }
                            };
                            eventRouter.processEvent();
                        });
                    }
                    if (type === 'image/png') {
                        item[0].getType('image/png').then(image => {
                            lastEvent = {
                                ref:                    '',
                                type:                   'windowPaste',
                                props: {
                                    dataType:           'image',
                                    data:               image
                                }

                            };
                            eventRouter.processEvent();
                        })
                    }
                })
            }
        });
    }

    receiveFromReact(r2c) {
        lastEvent = {
            ref:                                        r2c,
            type:                                       'reactEvent',
        };
        eventRouter.processEvent();
    }

    receiveFromServer(s2c) {
        lastEvent = {
            ref:                                        s2c,
            type:                                       'serverEvent',
        };
        eventRouter.processEvent();
    }

    receiveFromServerFetch(sf2c) {
        lastEvent = {
            ref:                                        sf2c,
            type:                                       'serverFetchEvent',
        };
        eventRouter.processEvent();
    }
}

export let eventListener = new EventListener();
