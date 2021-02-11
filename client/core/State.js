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
    // preferences
    colorText: '',
    colorBorder: '',
    colorHighlight: '',
    colorLine: '',
    colorMode: 'highlight',
    fontSize: '',

    mapAction: ''
};

export const InitState = JSON.stringify(State);
