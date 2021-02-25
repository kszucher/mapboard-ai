import {mapMem, recalc} from "../map/Map";
import {getSelectionContext} from "../node/NodeSelect"

export function mapDispatch(action, payload) {
    console.log('MAPDISPATCH: ' + action);
    mapReducer(action, payload);
}

function mapReducer(action, payload) {
    switch (action) {
        case 'undo':
            if (mapMem.dataIndex > 0) {
                mapMem.dataIndex--;
            }
            break;
        case 'redo':
            if (mapMem.dataIndex < mapMem.data.length - 1) {
                mapMem.dataIndex++;
            }
        // A -----------------------------------------------------------------------------------------------------------
        // B -----------------------------------------------------------------------------------------------------------
    }
}
