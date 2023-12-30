import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountXCO1, getX, getXAEO, isXR, isXS} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import {ControlType, DialogState} from "../../state/Enums.ts"
import Edit from "../../assets/edit.svg?react"

export const NodeEdit = () => {
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="violet">
          <Edit/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {!formatterVisible && <DropdownMenu.Item onClick={() => dispatch(actions.openFormatter())}>{'Open Formatter'}</DropdownMenu.Item>}
        {formatterVisible && <DropdownMenu.Item onClick={() => dispatch(actions.closeFormatter())}>{'Close Formatter'}</DropdownMenu.Item>}
        <Dialog.Trigger>
          {isXS(m) && getCountXCO1(m) === 0 && getX(m).linkType === '' && <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_MAP_IN_MAP))}>{'Create Sub Map'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        {isXS(m) && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.transpose, payload: null}))}>{'Transpose'}</DropdownMenu.Item>}
        {getXAEO(m).map(ti => ti.taskStatus).includes(0) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.setTaskModeOn, payload: null}))}>{'Task Mode On'}</DropdownMenu.Item>}
        {getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.setTaskModeOff, payload: null}))}>{'Task Mode Off'}</DropdownMenu.Item>}
        {getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.setTaskModeReset, payload: null}))}>{'Task Mode Reset'}</DropdownMenu.Item>}
        {isXR(m) && getX(m).controlType !== ControlType.NONE && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.setControlTypeNone, payload: null}))}>{'Control Type None'}</DropdownMenu.Item>}
        {isXR(m) && getX(m).controlType !== ControlType.INGESTION && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.setControlTypeIngestion, payload: null}))}>{'Control Type Ingestion'}</DropdownMenu.Item>}
        {isXR(m) && getX(m).controlType !== ControlType.EXTRACTION && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.setControlTypeExtraction, payload: null}))}>{'Control Type Extraction'}</DropdownMenu.Item>}
        <Dialog.Trigger>
          {isXS(m) && getX(m).contentType === 'equation' && getCountXCO1(m) === 0 && <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.EDIT_CONTENT_EQUATION))}>{'Edit Equation'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        <Dialog.Trigger>
          {isXS(m) && getX(m).contentType === 'mermaid' && getCountXCO1(m) === 0 && <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.EDIT_CONTENT_MERMAID))}>{'Edit Mermaid'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        {isXR(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.setLlmData, payload: null}))}>{'set llm data'}</DropdownMenu.Item>}
        {isXR(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.clearLlmData, payload: null}))}>{'clear llm data'}</DropdownMenu.Item>}
        {isXS(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.setBlur, payload: null}))}>{'set blur'}</DropdownMenu.Item>}
        {isXS(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.clearBlur, payload: null}))}>{'clear blur'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
