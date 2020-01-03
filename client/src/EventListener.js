import {eventRouter}        from "./EventRouter"
import {initDim}            from "./Dim";

export let lastEvent = {};

class EventListener {
    constructor() {
        lastEvent = {};
    }

    // WINDOW, ROUTE, EXECUTE

    addListeners() {
        // https://www.tutorialspoint.com/es6/es6_events.htm
        window.addEventListener('click',                event =>    this.click(event)               );
        window.addEventListener("focusout",             event =>    this.focusout()                 );
        window.addEventListener("focus",                event =>    this.focus()                    );
        window.addEventListener("resize",               event =>    this.resize()                   );
        window.addEventListener("keydown",              event =>    this.keydown(event)             );
        window.addEventListener("keyup",                event =>    this.keyup(event)               );
        window.addEventListener("paste",                event =>    this.paste()                    );
        window.addEventListener("popstate",             event =>    this.popstate(event)            );
    }

    click(event) {

        // sscce for katex
        // let str = katex.renderToString('\A', {throwOnError: false});
        // let hsl = document.getElementById('header-sidebar-left');
        // hsl.innerHTML = str;

        lastEvent = {
            type:                                       'windowClick',
            ref:                                        event,
        };
        eventRouter.processEvent();
    }

    focusout() {

    }

    focus() {
        console.log('FOCUS');
    }

    resize() {
        console.log('RESIZE');
        initDim();
    }

    keydown(event) {
        lastEvent = {
            type:                                       'windowKeyDown',
            ref:                                        event,
        };
        eventRouter.processEvent();
    };

    keyup(event) {

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

    popstate(event) {
        lastEvent = {
            type:                                       'windowPopState',
            ref:                                        event,
        };
        eventRouter.processEvent();
    }

    receiveFromReact(r2c) {
        lastEvent = {
            type:                                       'reactEvent',
            ref:                                        r2c,
        };
        eventRouter.processEvent();
    }

    receiveFromServer(s2c) {
        lastEvent = {
            type:                                       'serverEvent',
            ref:                                        s2c,
        };
        eventRouter.processEvent();
    }

    receiveFromServerFetch(sf2c) {
        lastEvent = {
            type:                                       'serverFetchEvent',
            ref:                                        sf2c,
        };
        eventRouter.processEvent();
    }
}

export let eventListener = new EventListener();
