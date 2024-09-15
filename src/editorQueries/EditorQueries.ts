import {RootState, store} from "../editorMutations/EditorMutations.ts"

export const getMap = () => store.getState().editor.commitList[store.getState().editor.commitIndex]
export const getMapId = () => store.getState().editor.mapId
export const mSelector = (state: RootState) => state.editor.commitList[state.editor.commitIndex]
export const pmSelector = (state: RootState) => state.editor.commitList[state.editor.commitIndex > 0 ? state.editor.commitIndex - 1 : 0]
