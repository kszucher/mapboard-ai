import {FC} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {AccessType, MapMode} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {IconButton} from "@radix-ui/themes"
import {NodeEdit} from "../dropdown/NodeEdit.tsx"
import {NodeInsert} from "../dropdown/NodeInsert.tsx"
import {NodeMove} from "../dropdown/NodeMove.tsx"
import {NodeSelect} from "../dropdown/NodeSelect.tsx"
import {UserSettings} from "../dropdown/UserSettings.tsx"
import {UserAccount} from "../dropdown/UserAccount.tsx"
import ArrowBackUp from "../../assets/arrow-back-up.svg?react"
import ArrowForwardUp from "../../assets/arrow-forward-up.svg?react"
import Eye from "../../assets/eye.svg?react"
import LetterR from "../../assets/letter-r.svg?react"
import LetterS from "../../assets/letter-s.svg?react"
import LetterC from "../../assets/letter-c.svg?react"
import {MouseConfig} from "../dropdown/MouseConfig.tsx"
import {getMapMode, mC, mS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"

export const EditorAppBarRight: FC = () => {
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const m = useSelector((state:RootState) => mSelector(state))
  const mapMode = getMapMode(m)
  const { data } = useOpenWorkspaceQuery()
  const { access } = data || defaultUseOpenWorkspaceQueryState
  const disabled = [AccessType.VIEW, AccessType.UNAUTHORIZED].includes(access)
  const undoDisabled = disabled || mapListIndex === 0
  const redoDisabled = disabled || mapListIndex === mapList.length - 1
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    <div className="fixed flex right-1 gap-6 h-[40px]">
      <div className="flex items-center gap-1">
        <MouseConfig/>
      </div>
      <div className="flex items-center gap-1">
        <IconButton
          variant="solid"
          color={mapMode === MapMode.VIEW ? 'violet' : 'gray'}
          onClick={() => md(MR.unselect)}>
          <Eye/>
        </IconButton>
        <IconButton
          variant="solid"
          color={mapMode === MapMode.EDIT_ROOT ? 'violet' : 'gray'}
          onClick={() => md(MR.selectFirstR)}>
          <LetterR/>
        </IconButton>
        <IconButton
          variant="solid"
          color={mapMode === MapMode.EDIT_STRUCT ? 'violet' : 'gray'}
          disabled={mS(m).length === 0}
          onClick={() => md(MR.selectFirstS)}>
          <LetterS/>
        </IconButton>
        <IconButton
          variant="solid"
          color={mapMode === MapMode.EDIT_CELL ? 'violet' : 'gray'}
          disabled={mC(m).length === 0}
          onClick={() => md(MR.selectFirstC)}>
          <LetterC/>
        </IconButton>
      </div>
      <div className="flex flex-row items-center gap-1">
        <NodeSelect/>
        <NodeInsert/>
        <NodeMove/>
        <NodeEdit/>
      </div>
      <div className="flex flex-row items-center gap-1">
        <IconButton
          variant="solid"
          color="gray"
          disabled={undoDisabled}
          onClick={() => md(MR.undo)}>
          <ArrowBackUp/>
        </IconButton>
        <IconButton
          variant="solid"
          color="gray"
          disabled={redoDisabled}
          onClick={() => md(MR.redo)}>
          <ArrowForwardUp/>
        </IconButton>
      </div>
      <div className="flex flex-row items-center gap-1">
        <UserSettings/>
        <UserAccount/>
      </div>
    </div>
  )
}
