import {FC} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {AccessType, MapMode} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {IconButton, Select} from "@radix-ui/themes"
import {NodeEdit} from "../dropdown/NodeEdit.tsx"
import {NodeInsert} from "../dropdown/NodeInsert.tsx"
import {NodeMove} from "../dropdown/NodeMove.tsx"
import {NodeSelect} from "../dropdown/NodeSelect.tsx"
import {UserSettings} from "../dropdown/UserSettings.tsx"
import {UserAccount} from "../dropdown/UserAccount.tsx"
import ArrowBackUp from "../../assets/arrow-back-up.svg?react"
import ArrowForwardUp from "../../assets/arrow-forward-up.svg?react"
import {MouseConfig} from "../dropdown/MouseConfig.tsx"
import {getCountXSO1, isXR} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"

export const EditorAppBarRight: FC = () => {
  const mapMode = useSelector((state: RootState) => state.editor.mapMode)
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const m = useSelector((state:RootState) => mSelector(state))
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
        <Select.Root
          value={mapMode}
          onValueChange={(value) => {
            if (value === MapMode.EDIT_ROOT) {
              md(MR.selectXR)
            } else if (value === MapMode.EDIT_STRUCT && getCountXSO1(m) > 0) {
              md(MR.selectXS)
            }
            dispatch(actions.setMapMode(value as MapMode))
          }}>
          <Select.Trigger color="gray" variant="soft"/>
          <Select.Content color="violet">
            <Select.Item key={0} value={MapMode.VIEW}>{MapMode.VIEW}</Select.Item>
            <Select.Item key={1} value={MapMode.EDIT_ROOT}>{MapMode.EDIT_ROOT}</Select.Item>
            <Select.Item key={2} value={MapMode.EDIT_STRUCT} disabled={isXR(m) && getCountXSO1(m) === 0}>{MapMode.EDIT_STRUCT}</Select.Item>
          </Select.Content>
        </Select.Root>
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
        <MouseConfig/>
        <UserSettings/>
        <UserAccount/>
      </div>
    </div>
  )
}
