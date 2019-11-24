import {eventListener} from "./EventListener"

class MindBoardApi {
    init(){
        eventListener.addListeners();
    }

    request(requestData) {
        eventListener.receiveFromReact(requestData);
    }
}

export let mindBoardApi = new MindBoardApi();