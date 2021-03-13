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

    filter: [],
    deepestSelectablePath: [],

    isNodeClicked: false,
    isTaskClicked: false,
    isMouseDown: false,

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

const InitMapState = JSON.stringify(mapState);
export const loadInitMapState = _ => {mapState = JSON.parse(InitMapState)};
