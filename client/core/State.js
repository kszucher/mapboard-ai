export const State = {
    isLoggedIn: false,

    serverAction: ['ping'],
    serverResponse: {},

    mapIdList: [],
    mapNameList: [],
    mapSelected: undefined,

    mapId: '',
    mapStorageOut: [],

    breadcrumbsHistory: [],
};

export const InitState = JSON.stringify(State);
