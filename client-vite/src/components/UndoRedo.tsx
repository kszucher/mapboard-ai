import React, {FC} from "react"
import {useDispatch, useSelector} from 'react-redux'
import {mSelector} from "../state/EditorState"
import {AccessTypes} from "../state/Enums"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {useOpenWorkspaceQuery} from "../apis/NodeApi"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"

const classNameButton = "text-white focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2 text-center inline-flex items-center dark:hover:bg-gray-700 "

export const UndoRedo: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const { data } = useOpenWorkspaceQuery()
  const { access } = data || defaultUseOpenWorkspaceQueryState
  const disabled = [AccessTypes.VIEW, AccessTypes.UNAUTHORIZED].includes(access)
  const undoDisabled = disabled || mapListIndex === 0
  const redoDisabled = disabled || mapListIndex === mapList.length - 1
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="dark:bg-zinc-800 bg-zinc-50 border-2 dark:border-neutral-700 fixed top-0 left-[272px] w-[96px] flex justify-around h-[40px] py-1 border-t-0 rounded-b-lg z-50">
      <button type="button" className={classNameButton} disabled={undoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'undo', payload: null}))}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ffffff" opacity={undoDisabled ? '25%' : '100%'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path stroke="none" d="M0 0h24v24H0z"></path>
          <path d="M9 14l-4-4 4-4"></path>
          <path d="M5 10h11a4 4 0 110 8h-1"></path>
        </svg>
        <span className="sr-only">Icon description</span>
      </button>
      <button type="button" className={classNameButton} disabled={redoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'redo', payload: null}))}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ffffff" opacity={redoDisabled ? '25%' : '100%'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path stroke="none" d="M0 0h24v24H0z"></path>
          <path d="M15 14l4-4-4-4"></path>
          <path d="M19 10H8a4 4 0 100 8h1"></path>
        </svg>
        <span className="sr-only">Icon description</span>
      </button>
    </div>
  )
}
