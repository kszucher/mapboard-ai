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

    isMapLoaded: false,
    density: 'small', // should be loaded when map opens!!!
};

export const InitState = JSON.stringify(State);
