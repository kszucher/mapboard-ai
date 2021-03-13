export let mapMem = {
    isLoading: true,

    dataIndex: 0,
    data: [],

    density: '',
    alignment: '',

    taskLeft: 0,
    taskRight: 0,

    mapWidth: 0,
    mapHeight: 0,

    filter: [],
    deepestSelectablePath: [],

    isNodeClicked: false,
    isTaskClicked: false,
    isMouseDown: false,

    mouseMode: '',

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

const InitMapState = JSON.stringify(mapMem);
export const loadInitMapState = _ => {mapMem = JSON.parse(InitMapState)};
