import {initDim}            from "./Dim";
import {eventRouter}        from "./EventRouter"

class EventListener {
    addListeners() {
        // https://www.tutorialspoint.com/es6/es6_events.htm
        window.addEventListener('click',                event =>    this.click(event)               );
        window.addEventListener('mousemove',            event =>    this.mousemove(event)           );
        window.addEventListener('mousedown',            event =>    this.mousedown(event)           );
        window.addEventListener("focusout",             event =>    this.focusout()                 );
        window.addEventListener("focus",                event =>    this.focus()                    );
        window.addEventListener("resize",               event =>    this.resize()                   );
        window.addEventListener("keydown",              event =>    this.keydown(event)             );
        window.addEventListener("keyup",                event =>    this.keyup(event)               );
        window.addEventListener("paste",                event =>    this.paste(event)               );
        window.addEventListener("popstate",             event =>    this.popstate(event)            );
    }

    click(event) {
        eventRouter.processEvent({
            type:                                       'windowClick',
            ref:                                        event,
        });
    }

    mousemove(event) {
        // event.preventDefault();
    }

    mousedown(event) {
        event.preventDefault();
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
        eventRouter.processEvent({
            type:                                       'windowKeyDown',
            ref:                                        event,
        });
    };

    keyup(event) {

    };

    paste(e) {
        e.preventDefault();

        console.log('PASTE');
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.read().then(item => {
                    let type = item[0].types[0];
                    if (type === 'text/plain') {
                        navigator.clipboard.readText().then(text => {
                            eventRouter.processEvent({
                                type:                   'windowPaste',
                                props: {
                                    dataType:           'text',
                                    data:               text
                                }
                            });
                        });
                    }
                    if (type === 'image/png') {
                        item[0].getType('image/png').then(image => {
                            eventRouter.processEvent({
                                type:                   'windowPaste',
                                props: {
                                    dataType:           'image',
                                    data:               image
                                }

                            });
                        })
                    }
                })
            }
        });
    }

    popstate(event) {
        eventRouter.processEvent({
            type:                                       'windowPopState',
            ref:                                        event,
        });
    }

    receiveFromReact(r2c) {
        eventRouter.processEvent({
            type:                                       'reactEvent',
            ref:                                        r2c,
        });
    }

    receiveFromServer(s2c) {
        eventRouter.processEvent({
            type:                                       'serverEvent',
            ref:                                        s2c,
        });
    }

    receiveFromServerFetch(sf2c) {
        eventRouter.processEvent({
            type:                                       'serverFetchEvent',
            ref:                                        sf2c,
        });
    }
}

export let eventListener = new EventListener();
