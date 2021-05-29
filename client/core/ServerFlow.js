import {remoteDispatch} from "./Store";

export const serverDispatch = (action) => {
    // temporary solution to split refactor into multiple steps
    switch (action) {
        case 'saveMap': {
            remoteDispatch({type: 'SAVE_MAP'});
        }
    }
}
