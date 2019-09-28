import {eventListener} from "./EventListener"

class Communication {
    constructor() {
        // this.myUrl = "http://127.0.0.1:8082/beta";
        this.myUrl = "http://mindboard.io/beta";
        this.eventsEnabled = 1;
    }

    post(message, callback) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                callback(JSON.parse(xmlHttp.responseText));
        };
        xmlHttp.open("POST", this.myUrl, true); // true for asynchronous
        xmlHttp.send(JSON.stringify(message));
    }

    sender(c2s) {
        this.eventsEnabled = 0;
        this.post(c2s, this.receiver.bind(this));
    }

    receiver(s2c) {
        this.eventsEnabled = 1;
        eventListener.receiveFromServer(s2c);
    }
}

export let communication = new Communication();
