export const State = {

    email: '',
    password: '',

    isLoggedIn: false,

    historyLastState: {},

    eventsEnabled: true,

    serverResponse: {},

    tabListIds: [],
    tabListNames: [],
    tabListSelected: undefined,

    mapSelected: '',

    lastUserMap: '',
    mapStorage: {},

};

export const InitState = JSON.stringify(State);
