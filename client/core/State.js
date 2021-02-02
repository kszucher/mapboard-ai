export const State = {
    isLoggedIn: false,

    serverAction: ['ping'],
    serverResponse: {},

    mapIdList: [],
    mapNameList: [],
    mapSelected: 0,
    mapId: '',
    mapName: '',
    mapStorageOut: [],

    breadcrumbsHistory: [],

    // map preferences
    isMapLoaded: false,
    density: '', // should be loaded when map opens!!!

    // view preferences
    isLocked: true,
};

export const InitState = JSON.stringify(State);
