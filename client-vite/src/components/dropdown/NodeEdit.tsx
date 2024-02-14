import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountXCO1, getX, getXAEO, isXR, isXS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import {ControlType, DialogState, MapMode} from "../../state/Enums.ts"
import Edit from "../../assets/edit.svg?react"

export const NodeEdit = () => {
  const mapMode = useSelector((state: RootState) => state.editor.mapMode)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={mapMode === MapMode.VIEW}>
        <IconButton variant="solid" color="violet">
          <Edit/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {!formatterVisible && <DropdownMenu.Item onClick={() => dispatch(actions.openFormatter())}>{'Open Formatter'}</DropdownMenu.Item>}
        {formatterVisible && <DropdownMenu.Item onClick={() => dispatch(actions.closeFormatter())}>{'Close Formatter'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_ROOT && isXR(m) && getX(m).controlType !== ControlType.NONE && <DropdownMenu.Item onClick={() => md(MR.setControlTypeNone)}>{'Control Type None'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_ROOT && isXR(m) && getX(m).controlType !== ControlType.INGESTION && <DropdownMenu.Item onClick={() => md(MR.setControlTypeIngestion)}>{'Control Type Ingestion'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_ROOT && isXR(m) && getX(m).controlType !== ControlType.EXTRACTION && <DropdownMenu.Item onClick={() => md(MR.setControlTypeExtraction)}>{'Control Type Extraction'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_ROOT && isXR(m) && <DropdownMenu.Item onClick={() => md(MR.setLlmData)}>{'set llm data'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_ROOT && isXR(m) && <DropdownMenu.Item onClick={() => md(MR.clearLlmData)}>{'clear llm data'}</DropdownMenu.Item>}
        <Dialog.Trigger>
          {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getCountXCO1(m) === 0 && getX(m).linkType === '' && <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_MAP_IN_MAP))}>{'Create Sub Map'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.transpose)}>{'Transpose'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && getXAEO(m).map(ti => ti.taskStatus).includes(0) && <DropdownMenu.Item onClick={() => md(MR.setTaskModeOn)}>{'Task Mode On'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={() => md(MR.setTaskModeOff)}>{'Task Mode Off'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={() => md(MR.setTaskModeReset)}>{'Task Mode Reset'}</DropdownMenu.Item>}
        <Dialog.Trigger>
          {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getX(m).contentType === 'equation' && getCountXCO1(m) === 0 && <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.EDIT_CONTENT_EQUATION))}>{'Edit Equation'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        <Dialog.Trigger>
          {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getX(m).contentType === 'mermaid' && getCountXCO1(m) === 0 && <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.EDIT_CONTENT_MERMAID))}>{'Edit Mermaid'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && <DropdownMenu.Item onClick={() => md(MR.setBlur)}>{'set blur'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && <DropdownMenu.Item onClick={() => md(MR.clearBlur)}>{'clear blur'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
