import {recalc} from "../map/Map";
import {loadInitMapState, mapState} from "./MapState";
import {mapAssembly} from "../map/MapAssembly";

export function mapDispatch(action, payload) {
    console.log('MAPDISPATCH: ' + action);
    mapReducer(action, payload);
    if (['setDensity', 'setAlignment', 'setTaskConfigWidth', 'undo', 'redo'].includes(action)) {
        recalc();
    }
}

function mapReducer(action, payload) {
    switch (action) {
        case 'setData':
            loadInitMapState();
            mapState.data = [mapAssembly(payload)];
            break;
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
