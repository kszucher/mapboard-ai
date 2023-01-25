import {FC} from "react";
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
import {IconButton} from '@mui/material'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import {AccessTypes, PageState} from "../core/Types";
import {actions, defaultUseOpenWorkspaceQueryState} from "../core/EditorFlow";
import {useOpenWorkspaceQuery} from "../core/Api";

export const UndoRedo: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const mapStackData = useSelector((state: RootStateOrAny) => state.editor.mapStackData)
  const mapStackDataIndex = useSelector((state: RootStateOrAny) => state.editor.mapStackDataIndex)
  const undoDisabled = mapStackDataIndex === 0
  const redoDisabled = mapStackDataIndex === mapStackData.length - 1
  const { data } = useOpenWorkspaceQuery(undefined, { skip:  pageState === PageState.AUTH  })
  const { access } = data?.resp?.data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch()
  return (
    <div className="_bg fixed left-[272px] w-[80px] flex flex-center h-[40px] py-1 px-3 border-t-0 rounded-b-2xl">
      <div style={{ display: 'flex',  }}>
        <IconButton
          color='secondary'
          disabled={[AccessTypes.VIEW, AccessTypes.UNAUTHORIZED].includes(access) || undoDisabled}
          onClick={_=>dispatch(actions.undo())}
        >
          <UndoIcon/>
        </IconButton>
        <IconButton
          color='secondary'
          disabled={[AccessTypes.VIEW, AccessTypes.UNAUTHORIZED].includes(access) || redoDisabled}
          onClick={_=>dispatch(actions.redo())}
        >
          <RedoIcon/>
        </IconButton>
      </div>
    </div>
  )
}
