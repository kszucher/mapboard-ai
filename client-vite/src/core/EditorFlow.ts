import createSagaMiddleware from 'redux-saga'
import rootSaga from "./EditorSagas";
import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum FormatMode {
    text,
    border,
    fill,
    line
}

export enum AuthPageState {
    SIGN_IN,
    SIGN_UP_STEP_1,
    SIGN_UP_STEP_2
}

export enum PageState {
    EMPTY,
    DEMO,
    AUTH,
    WS,
    WS_PROFILE,
    WS_SETTINGS,
    WS_SHARES,
    WS_CREATE_TABLE,
    WS_CREATE_TASK,
    WS_CREATE_MAP_IN_MAP,
    WS_SHARE_THIS_MAP,
}

export const MAP_RIGHTS = {
    UNAUTHORIZED: 'unauthorized',
    VIEW: 'view',
    EDIT: 'edit',
}

const editorState = {
    authPageState: AuthPageState.SIGN_IN,

    name: '',
    email: '',
    password: '',
    passwordAgain: '',
    confirmationCode: '',
    authFeedbackMessage: '',

    pageState: PageState.AUTH,

    landingData: [],
    landingDataIndex: 0,

    colorMode: 'dark',

    formatMode: FormatMode.text,

    undoDisabled: true,
    redoDisabled: true,

    tabMapIdList: [],
    tabMapNameList: [],
    breadcrumbMapIdList: [],
    breadcrumbMapNameList: [''],

    tabShrink: false,

    mapId: '',
    mapSource: '',
    mapData: {},
    frameLen: 0,
    frameSelected: 0,
    mapRight: MAP_RIGHTS.UNAUTHORIZED,

    node: {
        density: undefined,
        alignment: undefined,
        selection: undefined,
        lineWidth: undefined,
        lineType: undefined,
        lineColor: undefined,
        borderWidth: undefined,
        borderColor: undefined,
        fillColor: undefined,
        textFontSize: undefined,
        textColor: undefined,
        taskStatus: undefined,
    },
    nodeTriggersMap: false,

    formatterVisible: false,
    frameEditorVisible: false,

    shareEmail: '',
    shareAccess: 'view',
    shareFeedbackMessage: '',
    shareDataExport: [],
    shareDataImport: [],

    moreMenu: null,

    interactionDisabled: false
}

const editorStateDefault = JSON.stringify(editorState)

const allSlice = createSlice({
    name: 'whatever',
    initialState: editorState,
    reducers: {
        resetState(state) {
            state = JSON.parse(editorStateDefault)
        },

        signInPanel(state) {
            state.authPageState = AuthPageState.SIGN_IN
            state.authFeedbackMessage = ''
        },
        signUpPanel(state) {
            state.authPageState = AuthPageState.SIGN_UP_STEP_1
            state.name =''
            state.email = ''
            state.password = ''
            state.passwordAgain = ''
            state.authFeedbackMessage = ''
        },
        signUpStep1Panel(state) { state.authPageState = AuthPageState.SIGN_UP_STEP_1 },
        signUpStep2Panel(state) { state.authPageState = AuthPageState.SIGN_UP_STEP_2 },
        setName(state, action: PayloadAction<string>) { state.name = action.payload },
        setEmail(state, action: PayloadAction<string>) { state.email = action.payload},
        setPassword(state, action: PayloadAction<string>) { state.password = action.payload },
        setPasswordAgain(state, action: PayloadAction<string>) { state.passwordAgain = action.payload },
        setConfirmationCode(state, action: PayloadAction<string>) { state.confirmationCode = action.payload },
        setAuthFeedbackMessage(state, action: PayloadAction<string>) { state.authFeedbackMessage = action.payload },

        setPageState(state, action: PayloadAction<PageState>) { state.pageState = action.payload },

        playLandingNext(state) {
            state.landingDataIndex =  state.landingDataIndex < state.landingData.length - 1 ? state.landingDataIndex + 1 : 0
        },
        playLandingPrev(state) {
            state.landingDataIndex = state.landingDataIndex > 1 ? state.landingDataIndex - 1 : state.landingData.length - 1
        },

        // setColorMode(state, action: PayloadAction<string>) { state.colorMode = action.payload },

        setFormatMode(state, action: PayloadAction<FormatMode>) { state.formatMode = action.payload },
        toggleFormatterVisible(state) { state.formatterVisible = !state.formatterVisible },

        setUndoDisabled(state, action: PayloadAction<boolean>) { state.undoDisabled = action.payload },
        setRedoDisabled(state, action: PayloadAction<boolean>) { state.redoDisabled = action.payload },

        toggleTabShrink(state) { state.tabShrink = !state.tabShrink },

        setNodeParams(state, action: PayloadAction<any>) {
            return {...state, ...{ node: {...state.node, ...action.payload.node }, nodeTriggersMap: action.payload.nodeTriggersMap }
        }},

        setFrameEditorVisible(state, action: PayloadAction<boolean>) { state.frameEditorVisible = action.payload },

        setShareEmail(state, action: PayloadAction<string>) { state.shareEmail = action.payload },
        setShareAccess(state, action: PayloadAction<string>) { state.shareAccess = action.payload },
        setShareFeedbackMessage(state, action: PayloadAction<string>) { state.shareFeedbackMessage = action.payload },

        openMoreMenu(state, action: PayloadAction<any>) { state.moreMenu = action.payload },
        closeMoreMenu(state) { state.moreMenu = null },

        parseRespPayload(state, action: PayloadAction<any>) {
            return { ...state, ...action.payload }
        },

        interactionEnabled(state) { state.interactionDisabled =  false },
        interactionDisabled(state) { state.interactionDisabled = true },
    }
})

export const { actions, reducer } = allSlice

export const sagaActions = {
    // *** SERVER RELATED ***
    liveDemo: () => ({type: 'LIVE_DEMO'}),
    signIn: (email: string, password: string) => ({type: 'SIGN_IN', payload: { cred: { email, password } }}),
    signUpStep1: (name: string, email: string, password: string) => ({type: 'SIGN_UP_STEP_1', payload: { cred: { name, email, password } } }),
    signUpStep2: (email: string, confirmationCode: string) => ({type: 'SIGN_UP_STEP_2', payload: { cred: { email, confirmationCode: parseInt(confirmationCode) } } }),
    checkSetConfirmationCode: (value: string) => ({type: 'CHECK_SET_CONFIRMATION_CODE', payload: value}),
    saveMap: () => ({type: 'SAVE_MAP'}),
    openMapFromTab: (value: number) => ({type: 'OPEN_MAP_FROM_TAB', payload: {tabMapSelected: value}}),
    openMapFromBreadcrumbs: (index: number) => ({type: 'OPEN_MAP_FROM_BREADCRUMBS', payload: {breadcrumbMapSelected: index}}),
    openMapFromMap: () => ({type: 'OPEN_MAP_FROM_MAP'}),
    createMapInMap: () => ({type: 'CREATE_MAP_IN_MAP'}),
    createMapInTab: () => ({type: 'CREATE_MAP_IN_TAB'}),
    removeMapInTab: () => ({type: 'REMOVE_MAP_IN_TAB'}),
    moveUpMapInTab: () => ({type: 'MOVE_UP_MAP_IN_TAB'}),
    moveDownMapInTab: () => ({type: 'MOVE_DOWN_MAP_IN_TAB'}),
    openFrame: () => ({type: 'OPEN_FRAME'}),
    openPrevFrame: () => ({type: 'OPEN_PREV_FRAME'}),
    openNextFrame: () => ({type: 'OPEN_NEXT_FRAME'}),
    importFrame: () => ({type: 'IMPORT_FRAME'}),
    duplicateFrame: () => ({type: 'DUPLICATE_FRAME'}),
    deleteFrame: () => ({type: 'DELETE_FRAME'}),
    getShares: () => ({type: 'GET_SHARES'}),
    createShare: (shareEmail: string, shareAccess: any) => ({type: 'CREATE_SHARE', payload: {shareEmail, shareAccess}}),
    acceptShare: (_id: number) => ({type: 'ACCEPT_SHARE', payload: {shareId: _id}}),
    deleteShare: (_id: number) => ({type: 'DELETE_SHARE', payload: {shareId: _id}}),
    toggleColorMode: () => ({type: 'TOGGLE_COLOR_MODE'}), // TODO try apollo on this one to update local AND global state at the same time
    changeTabWidth: () => ({type: 'CHANGE_TAB_WIDTH'}),
    deleteAccount: () => ({type: 'DELETE_ACCOUNT'}),
    signOut: () => ({type: 'SIGN_OUT'}), // TODO make it server related

    // *** NON-SERVER-RELATED ***
    undo: () => ({type: 'UNDO'}),
    redo: () => ({type: 'REDO'}),
    setUndoDisabled: () => ({type: 'SET_UNDO_DISABLED'}),
    setRedoDisabled: () => ({type: 'SET_REDO_DISABLED'}),
    toggleTask: () => ({type: 'TOGGLE_TASK'}),
    openFrameEditor : () => ({type: 'OPEN_FRAME_EDITOR'}),
    closeFrameEditor: () => ({type: 'CLOSE_FRAME_EDITOR'}),
    mapStackChanged: () => ({type: 'MAP_STACK_CHANGED'}),
    insertTable: (row: number, col: number) => ({type: 'INSERT_TABLE', payload: {rowLen: row, colLen: col}}),
}

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([sagaMiddleware])
})

sagaMiddleware.run(rootSaga)
