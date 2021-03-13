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
    mapStorageOut: [],
    breadcrumbsHistory: [],
    // preferences
    density: '',
    alignment: '',
    fontSize: '',
    colorMode: 'highlight',
    mouseMode: 'select',

    colorText: '',
    colorBorder: '',
    colorHighlight: '',
    colorLine: '',

    mapAction: ''
};

export const InitState = JSON.stringify(State);
