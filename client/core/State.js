export const State = {

    isLoggedIn: false,

    breadcrumbsHistory: [],

    // eventsEnabled: true, // we won't need this once we'll prevent screen to be active in case of loading server

    serverAction: ['ping'],
    serverResponse: {},

    mapIdList: [],
    mapNameList: [],
    mapSelected: undefined,

    mapId: '',
    // not ideal incremental variables to trigger server communication
    mapNameToSave: '',

};

export const InitState = JSON.stringify(State);
