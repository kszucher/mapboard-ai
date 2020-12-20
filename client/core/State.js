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

};

export const InitState = JSON.stringify(State);
