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

    lastUserMap: '',
    mapStorage: {},

};

export const InitState = JSON.stringify(State);
