import {FC} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {AccessType} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/ApiState.ts"
import {IconButton} from "@radix-ui/themes"
import {UserSettings} from "../dropdown/UserSettings.tsx"
import {UserAccount} from "../dropdown/UserAccount.tsx"
import ArrowBackUp from "../../assets/arrow-back-up.svg?react"
import ArrowForwardUp from "../../assets/arrow-forward-up.svg?react"
import {MouseConfig} from "../dropdown/MouseConfig.tsx"
import {NodeModeConfig} from "../dropdown/NodeModeConfig.tsx"
import {NodeActions} from "../dropdown/NodeActions.tsx";

export const EditorAppBarRight: FC = () => {
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
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
        <NodeModeConfig/>
        <NodeActions/>
      </div>
      <div className="flex items-center gap-1">
        <MouseConfig/>
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
