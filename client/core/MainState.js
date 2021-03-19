export const MainState = {
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

    colorText: '',
    colorBorder: '',
    colorHighlight: '',
    colorLine: '',

    mapAction: ''
};

export const InitState = JSON.stringify(MainState);
