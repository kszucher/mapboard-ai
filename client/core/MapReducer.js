import {recalc} from "../map/Map";
import {mapAssembly} from "../map/MapAssembly";

export let mapState = {
    isLoading: true,

    dataIndex: 0,
    data: [],

    density: '', // inherit
    sLineDeltaXDefault: 0,
    padding: 0,
    defaultH: 0,

    alignment: '', // inherit

    taskLeft: 0,
    taskRight: 0,

    mapWidth: 0,
    mapHeight: 0,

    deepestSelectablePath: [],

    isNodeClicked: false,
    isTaskClicked: false,
    isMouseDown: false,
    shouldCenter: false,

    moveTarget: {
        path: [],
        index: 0,
    },

    margin: 32,
    taskConfig: {
        n: 4,
        d: 24,
        gap: 4,
        width: 0,
    },
};

const initMapState = JSON.stringify(mapState);

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
            mapState = JSON.parse(initMapState);
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
