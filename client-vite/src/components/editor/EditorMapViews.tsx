import {DropdownMenu, IconButton} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getG} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"
import {EyeIcon} from "../assets/Icons"

export const EditorMapViews = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray">
          <EyeIcon/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {getG(m).density === 'small' && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setDensityLarge', payload: null}))}}>{'Set Cozy'}</DropdownMenu.Item>}
        {getG(m).density === 'large' && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setDensitySmall', payload: null}))}}>{'Set Compact'}</DropdownMenu.Item>}
        {getG(m).alignment === 'adaptive' && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setAlignmentCentered', payload: null}))}}>{'Set Centered'}</DropdownMenu.Item>}
        {getG(m).alignment === 'centered' && <DropdownMenu.Item onClick={()=>{dispatch(actions.mapAction({type: 'setAlignmentAdaptive', payload: null}))}}>{'Set Adaptive'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
