export const State = {

    isLoggedIn: false,

    breadcrumbsHistory: [],

    serverAction: ['ping'],
    serverResponse: {},

    mapIdList: [],
    mapNameList: [],
    mapSelected: undefined,

    mapId: '',
    mapNameToSave: '',

    mapStorageOut: [],

};

export const InitState = JSON.stringify(State);
