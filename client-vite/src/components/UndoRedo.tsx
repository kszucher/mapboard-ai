import React, {FC} from "react"
import {useDispatch, useSelector} from 'react-redux'
import {AccessTypes} from "../state/Enums"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {useOpenWorkspaceQuery} from "../apis/NodeApi"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {IconButton} from "./IconButton"
import {RedoIcon, UndoIcon} from "./IconButtonSvg"

export const UndoRedo: FC = () => {
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode, access } = data || defaultUseOpenWorkspaceQueryState
  const disabled = [AccessTypes.VIEW, AccessTypes.UNAUTHORIZED].includes(access)
  const undoDisabled = disabled || mapListIndex === 0
  const redoDisabled = disabled || mapListIndex === mapList.length - 1
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="dark:bg-zinc-800 bg-zinc-50 border-2 dark:border-neutral-700 fixed top-0 left-[272px] w-[96px] flex justify-around h-[40px] py-1 border-t-0 rounded-b-lg z-50">
      <IconButton colorMode={colorMode} disabled={undoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'undo', payload: null}))}}><UndoIcon/></IconButton>
      <IconButton colorMode={colorMode} disabled={redoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'redo', payload: null}))}}><RedoIcon/></IconButton>
    </div>
  )
}
