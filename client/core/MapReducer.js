import {recalc} from "../map/Map";
import {mapState} from "./MapState";

export function mapDispatch(action, payload) {
    console.log('MAPDISPATCH: ' + action);
    mapReducer(action, payload);
    recalc();
}

function mapReducer(action, payload) {
    switch (action) {
        case 'setDensity':
            mapState.density = payload;
            mapState.sLineDeltaXDefault = payload === 'large'? 30:20;
            mapState.padding = payload === 'large'? 8:3;
            mapState.defaultH = payload === 'large'? 30:20; // 30 = 14 + 2*8, 20 = 14 + 2*3
            mapState.taskConfig.d = payload === 'large'? 24 : 20;
            break;
        case 'setAlignment':
            mapState.alignment = payload;
            break;
        case 'setTaskConfigWidth':
            let {n, d, gap} = mapState.taskConfig;
            mapState.taskConfig.width = n*d + (n-1)*gap;
            break;
        case 'setMouseMode':
            mapState.mouseMode = payload;
            break;
        case 'undo':
            if (mapState.dataIndex > 0) {
                mapState.dataIndex--;
            }
            break;
        case 'redo':
            if (mapState.dataIndex < mapState.data.length - 1) {
                mapState.dataIndex++;
            }
            break;
    }
}
