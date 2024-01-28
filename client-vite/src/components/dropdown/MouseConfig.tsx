import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {LeftMouseMode, MidMouseMode} from "../../state/Enums.ts"
import Mouse from "../../assets/mouse.svg?react"

export const MouseConfig = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const midMouseMode = useSelector((state: RootState) => state.editor.midMouseMode)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <Mouse/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {leftMouseMode === LeftMouseMode.SELECT_BY_CLICK_OR_MOVE && <DropdownMenu.Item onClick={() => dispatch(actions.setLeftMouseMode(LeftMouseMode.SELECT_BY_RECTANGLE))}>{'Left Mouse: Select By Rectangle'}</DropdownMenu.Item>}
        {leftMouseMode === LeftMouseMode.SELECT_BY_RECTANGLE && <DropdownMenu.Item onClick={() => dispatch(actions.setLeftMouseMode(LeftMouseMode.SELECT_BY_CLICK_OR_MOVE))}>{'Left Mouse: Select By Click Or Move'}</DropdownMenu.Item>}
        <DropdownMenu.Separator/>
        <DropdownMenu.Label>
          {'Mid Mouse'}
        </DropdownMenu.Label>
        <DropdownMenu.RadioGroup value={midMouseMode} onValueChange={(value) => dispatch(actions.setMidMouseMode(value as MidMouseMode))}>
          <DropdownMenu.RadioItem value={MidMouseMode.SCROLL}>{'Scroll'}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={MidMouseMode.ZOOM}>{'Zoom'}</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
