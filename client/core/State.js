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
};

export const InitState = JSON.stringify(State);
