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
    // node props
    colorText: '',
    colorBorder: '',
    colorHighlight: '',
    colorLine: '',
    nodeFontSize: 0,
    // node prop modifiers
    colorMode: 'highlight',
    fontSize: 'h1',
};

export const InitState = JSON.stringify(State);
