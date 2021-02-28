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
            break;
        case 'setDensity':
            mapMem.density = payload;
            mapMem.sLineDeltaXDefault = payload === 'large'? 30:20;
            mapMem.padding = payload === 'large'? 8:3;
            mapMem.defaultH = payload === 'large'? 30:20; // 30 = 14 + 2*8, 20 = 14 + 2*3
            break;
        case 'setTaskConfigWidth':
            let {n, d, gap} = mapMem.taskConfig;
            mapMem.taskConfig.width = n*d + (n-1)*gap;
            break;
    }
}
