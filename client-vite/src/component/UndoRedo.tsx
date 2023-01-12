import {FC} from "react";
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
import {IconButton} from '@mui/material'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import {MapRight} from "../core/Types";
import {actions} from "../core/EditorFlow";
import {useOpenMapQuery} from "../core/Api";

export const UndoRedo: FC = () => {
  const mapRight = useSelector((state: RootStateOrAny) => state.editor.mapRight)
  const mapStackData = useSelector((state: RootStateOrAny) => state.editor.mapStackData)
  const mapStackDataIndex = useSelector((state: RootStateOrAny) => state.editor.mapStackDataIndex)
  const undoDisabled = mapStackDataIndex === 0
  const redoDisabled = mapStackDataIndex === mapStackData.length - 1
  const dispatch = useDispatch()

  useOpenMapQuery(null, {skip: false})

  return (
    <div className="_bg fixed left-[272px] w-[80px] flex flex-center h-[40px] py-1 px-3 border-t-0 rounded-b-2xl">
      <div style={{ display: 'flex',  }}>
        <IconButton
          color='secondary' disabled={[MapRight.VIEW, MapRight.UNAUTHORIZED].includes(mapRight) || undoDisabled}
          onClick={_=>dispatch(actions.undo())}
        >
          <UndoIcon/>
        </IconButton>
        <IconButton
          color='secondary'  disabled={[MapRight.VIEW, MapRight.UNAUTHORIZED].includes(mapRight) || redoDisabled}
          onClick={_=>dispatch(actions.redo())}
        >
          <RedoIcon/>
        </IconButton>
      </div>
    </div>
  )
}
