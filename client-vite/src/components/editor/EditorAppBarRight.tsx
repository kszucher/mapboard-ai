import {FC} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {MRT} from "../../reducers/MapReducerEnum.ts"
import {AccessType} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {IconButton} from "@radix-ui/themes"
import {NodeEdit} from "../dropdown/NodeEdit.tsx"
import {NodeInsert} from "../dropdown/NodeInsert.tsx"
import {NodeMove} from "../dropdown/NodeMove.tsx"
import {NodeSelect} from "../dropdown/NodeSelect.tsx"
import {UserAccountDelete} from "../dialog/UserAccountDelete.tsx"
import {UserSettings} from "../dropdown/UserSettings.tsx"
import {UserAccount} from "../dropdown/UserAccount.tsx"
import ArrowBackUp from "../../assets/arrow-back-up.svg?react"
import ArrowForwardUp from "../../assets/arrow-forward-up.svg?react"
import ZoomCheck from "../../assets/zoom-check.svg?react"
import ZoomCancel from "../../assets/zoom-cancel.svg?react"

export const EditorAppBarRight: FC = () => {
  const scrollOverride = useSelector((state: RootState) => state.editor.scrollOverride)
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const { data } = useOpenWorkspaceQuery()
  const { access } = data || defaultUseOpenWorkspaceQueryState
  const disabled = [AccessType.VIEW, AccessType.UNAUTHORIZED].includes(access)
  const undoDisabled = disabled || mapListIndex === 0
  const redoDisabled = disabled || mapListIndex === mapList.length - 1
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="fixed flex right-1 gap-6 h-[40px]">
      <div className="flex items-center gap-1">
        <IconButton
          variant="solid"
          color="gray"
          onClick={() => scrollOverride ? dispatch(actions.clearScrollOverride()) : dispatch(actions.setScrollOverride())}>
          {scrollOverride ? <ZoomCheck/> : <ZoomCancel/>}
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
          onClick={() => dispatch(actions.mapAction({type: MRT.undo, payload: null}))}>
          <ArrowBackUp/>
        </IconButton>
        <IconButton
          variant="solid"
          color="gray"
          disabled={redoDisabled}
          onClick={() => dispatch(actions.mapAction({type: MRT.redo, payload: null}))}>
          <ArrowForwardUp/>
        </IconButton>
      </div>
      <div className="flex flex-row items-center gap-1">
        <UserSettings/>
        <UserAccount/>
        <UserAccountDelete/>
      </div>
    </div>
  )
}
