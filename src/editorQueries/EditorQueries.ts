import {RootState, store} from "../editorMutations/EditorReducer.ts"

export const getMap = () => store.getState().editor.commitList[store.getState().editor.commitIndex]?.data
export const getMapId = () => store.getState().editor.mapId
export const mSelector = (state: RootState) => state.editor.commitList[state.editor.commitIndex]?.data
export const pmSelector = (state: RootState) => state.editor.commitList[state.editor.commitIndex > 0 ? state.editor.commitIndex - 1 : 0]?.data
