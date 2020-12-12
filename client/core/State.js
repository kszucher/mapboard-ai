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

};

export const InitState = JSON.stringify(State);
