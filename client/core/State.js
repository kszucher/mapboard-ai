export const State = {
    isLoggedIn: false,
    serverAction: ['ping'],
    serverResponse: {},
    mapIdList: [],
    mapNameList: [],
    mapSelected: 0,
    mapId: '',
    mapName: '',
    mapStorage: [],
    density: '',
    mapStorageOut: [],
    breadcrumbsHistory: [],
};

export const InitState = JSON.stringify(State);
