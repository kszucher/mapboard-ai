export const State = {

    credentialsChanged: 0,

    isLoggedIn: false,

    historyLastState: {},

    eventsEnabled: true,

    serverResponse: {},

    tabListIds: [],
    tabListNames: [],
    tabListSelected: undefined,

    mapId: '',
    mapStorage: {},
    mapStorageOut: {},

    isSaved: 0,

};

export const InitState = JSON.stringify(State);
