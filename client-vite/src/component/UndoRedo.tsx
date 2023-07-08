import {FC} from "react"
import {useDispatch, useSelector} from 'react-redux'
import {IconButton} from '@mui/material'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import {mapActionResolver} from "../core/MapActionResolver"
import {mSelector} from "../state/EditorState"
import {AccessTypes} from "../state/Enums"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"

export const UndoRedo: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const undoDisabled = mapListIndex === 0
  const redoDisabled = mapListIndex === mapList.length - 1
  const { data } = useOpenWorkspaceQuery()
  const { access } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="_bg fixed top-0 left-[272px] w-[96px] flex flex-center h-[40px] py-1 px-2 border-t-0 rounded-b-lg z-50">
      <div style={{ display: 'flex',  }}>
        <IconButton
          color='secondary'
          disabled={[AccessTypes.VIEW, AccessTypes.UNAUTHORIZED].includes(access) || undoDisabled}
          onClick={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'undo', null)))
          }}>
          <UndoIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          disabled={[AccessTypes.VIEW, AccessTypes.UNAUTHORIZED].includes(access) || redoDisabled}
          onClick={() => {
            dispatch(actions.mapAction(mapActionResolver(m, null, 'c', 'redo', null)))
          }}>
          <RedoIcon/>
        </IconButton>
      </div>
    </div>
  )
}
