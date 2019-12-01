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
        window.addEventListener("paste",                event =>    this.paste(event)               );



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
    //
    focusout() {
    //     navigator.clipboard.read().then(data => {
    //         for (let i=0; i<data.items.length; i++) {
    //             if (data.items[i].type != "text/plain") {
    //                 alert("Clipboard contains non-text data. Unable to access it.");
    //             } else {
    //                 textElem.innerText = data.items[i].getAs("text/plain");
    //             }
    //         }
    //     });
    }

    focus() {
        console.log('FOCUS');


        let data = new DataTransfer();

        data.items.add("text/plain", 'cica');
        navigator.clipboard.write(data).then(function() {
            /* success */
        }, function() {
            /* failure */
        });
        // kiolvasom, megnézem hogy változott-e...

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

    paste(event) {
        console.log('PASTE');
        lastEvent = {
            ref:                                        event,
            type:                                       'windowPaste'
        };
        eventRouter.processEvent();
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

    receiveFromPubNub() {
        // var pubnubDemo = new PubNub({
        //     publishKey: 'pub-c-90035b55-0e1c-4b24-b4fb-3027339550d2',
        //     subscribeKey: 'sub-c-ee4b80f6-beae-11e9-81e6-3e7b6b592954'
        // });
        //
        // pubnubDemo.publish({
        //     message: {
        //         "color": "blue"
        //     },
        //     channel: 'demo_tutorial'
        // });
    }
}

export let eventListener = new EventListener();
