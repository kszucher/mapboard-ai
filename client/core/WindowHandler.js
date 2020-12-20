import {remoteDispatch} from "./Store";

export let windowHandler = {
    addListeners: () => {
        window.addEventListener("popstate",     windowHandler.popstate);

    },
    removeListeners: () => {
        window.removeEventListener("popstate",  windowHandler.popstate);
    },


    popstate: (e) => {
        //     remoteDispatch({type: 'OPEN_MAP', payload: {source: 'HISTORY', val: ?}})
    }
};
