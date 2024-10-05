import {appStore, RootState} from "../appStore/appStore.ts"

export const getMap = () => appStore.getState().editor.commitList[appStore.getState().editor.commitIndex]
export const getMapId = () => appStore.getState().editor.mapId
export const getIntersectingNodes = () => appStore.getState().editor.intersectingNodes
export const getROffsetCoords = () => appStore.getState().editor.rOffsetCoords
export const getInsertLocation = () => appStore.getState().editor.insertLocation
export const mSelector = (state: RootState) => state.editor.commitList[state.editor.commitIndex]
export const pmSelector = (state: RootState) => state.editor.commitList[state.editor.commitIndex > 0 ? state.editor.commitIndex - 1 : 0]
