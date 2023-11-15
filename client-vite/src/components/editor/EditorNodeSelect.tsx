import {Button, DropdownMenu} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getCountXCO1, getCountXRD0SO1, getCountXRD1SO1, getCountXSO1, getX, getXRD0, getXRD1, isXD, isXR, isXS} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"

export const EditorNodeSelect = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="2" variant="solid" color="gray" radius="small">
          {'Select'}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyX', payload: null}))}}>{'Node Family'}</DropdownMenu.Item>}
        {isXR(m) && getCountXRD0SO1(m) > 0 && !getXRD0(m).selected && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyXRD0', payload: null}))}}>{'Node Family Right'}</DropdownMenu.Item>}
        {isXR(m) && getCountXRD1SO1(m) > 0 && !getXRD1(m).selected && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectFamilyXRD1', payload: null}))}}>{'Node Family Left'}</DropdownMenu.Item>}
        {isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectSelfX', payload: null}))}}>{'Node'}</DropdownMenu.Item>}
        {isXD(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectXR', payload: null}))}}>{'Node'}</DropdownMenu.Item>}
        {isXS(m) && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectCFF', payload: {path: getX(m).path}}))}}>{'First Cell'}</DropdownMenu.Item>}
        {<DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'selectRA', payload: null}))}}>{'All Root'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
