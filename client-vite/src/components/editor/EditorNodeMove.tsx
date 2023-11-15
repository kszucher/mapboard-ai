import {Button, DropdownMenu} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getCountXASD, getCountXASU, getCountXSO1, getCountXSO2, isDirL, isDirR, isXASVN, isXDS, isXR, isXS} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"

export const EditorNodeMove = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="2" variant="solid" color="gray" radius="small">
          {'Move'}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSU', payload: null}))}}>{'Node Up'}</DropdownMenu.Item>}
        {isXS(m) && isXASVN(m) && getCountXASD(m) > 0 && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSD', payload: null}))}}>{'Node Down'}</DropdownMenu.Item>}
        {isXS(m) && isDirR(m) && isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}}>{'Node Out'}</DropdownMenu.Item>}
        {isXS(m) && isDirL(m) && isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSO', payload: null}))}}>{'Node Out'}</DropdownMenu.Item>}
        {isXS(m) && isDirL(m) && isXASVN(m) && !isXDS(m) && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}}>{'Node In'}</DropdownMenu.Item>}
        {isXS(m) && isDirR(m) && isXASVN(m) && !isXDS(m) && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveSI', payload: null}))}}>{'Node In'}</DropdownMenu.Item>}
        {(isXR(m) && getCountXSO2(m) > 0) && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TOR', payload: null}))}}>{'Sub Nodes To Table'}</DropdownMenu.Item>}
        {(isXS(m) && getCountXSO1(m) > 0) && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'moveS2TO', payload: null}))}}>{'Sub Nodes To Table'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
