import {eventListener} from "./EventListener"

class MindBoardApi {
    init(){
        eventListener.addListeners();
    }

    request(requestData) {
        eventListener.receiveFromApi(requestData);
    }
}

export let mindBoardApi = new MindBoardApi();