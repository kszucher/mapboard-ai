import {appStore, RootState} from "../appStore/appStore.ts"

export const getMap = () => appStore.getState().editor.commitList[appStore.getState().editor.commitIndex]
export const getMapId = () => appStore.getState().editor.mapId
export const getROffsetCoords = () => appStore.getState().editor.rOffsetCoords
export const mSelector = (state: RootState) => state.editor.commitList[state.editor.commitIndex]
