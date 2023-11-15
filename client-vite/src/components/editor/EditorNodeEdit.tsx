import {Button, DropdownMenu} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getCountXCO1, getX, getXAEO, isXR, isXS} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"
import {ControlTypes, PageState} from "../../state/Enums"

export const EditorNodeEdit = () => {
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="2" variant="solid" color="gray" radius="small">
          {'Edit'}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {!formatterVisible && <DropdownMenu.Item onClick={()=>{dispatch(actions.openFormatter())}}>{'Open Formatter'}</DropdownMenu.Item>}
        {formatterVisible && <DropdownMenu.Item onClick={()=>{dispatch(actions.closeFormatter())}}>{'Close Formatter'}</DropdownMenu.Item>}
        {isXS(m) && getCountXCO1(m) === 0 && getX(m).linkType === '' && <DropdownMenu.Item onClick={()=>{dispatch(actions.setPageState(PageState.WS_CREATE_MAP_IN_MAP))}}>{'Turn Into Submap'}</DropdownMenu.Item>}
        {isXS(m) && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'transpose', payload: null}))}}>{'Transpose'}</DropdownMenu.Item>}
        {getXAEO(m).map(ti => ti.taskStatus).includes(0) && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeOn', payload: null}))}}>{'Task Mode On'}</DropdownMenu.Item>}
        {getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeOff', payload: null}))}}>{'Task Mode Off'}</DropdownMenu.Item>}
        {getXAEO(m).map(ti => ti.taskStatus).some(el => el > 0) && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setTaskModeReset', payload: null}))}}>{'Task Mode Reset'}</DropdownMenu.Item>}
        {isXR(m) && getX(m).controlType !== ControlTypes.NONE && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeNone', payload: null}))}}>{'Control Type None'}</DropdownMenu.Item>}
        {isXR(m) && getX(m).controlType !== ControlTypes.INGESTION && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeIngestion', payload: null}))}}>{'Control Type Ingestion'}</DropdownMenu.Item>}
        {isXR(m) && getX(m).controlType !== ControlTypes.EXTRACTION && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setControlTypeExtraction', payload: null}))}}>{'Control Type Extraction'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
