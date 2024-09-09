import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../editorMutations/EditorMutations.ts"
import {LeftMouseMode, MidMouseMode} from "../consts/Enums.ts"
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
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        <DropdownMenu.Label>{'Left Mouse'}</DropdownMenu.Label>
        <DropdownMenu.RadioGroup value={leftMouseMode} onValueChange={(value) => dispatch(actions.setLeftMouseMode(value as LeftMouseMode))}>
          <DropdownMenu.RadioItem value={LeftMouseMode.CLICK_SELECT}>{'Click Select'}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={LeftMouseMode.CLICK_SELECT_AND_MOVE}>{'Click Select And Move'}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={LeftMouseMode.RECTANGLE_SELECT}>{'Rectangle Select'}</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Separator/>
        <DropdownMenu.Label>{'Mid Mouse'}</DropdownMenu.Label>
        <DropdownMenu.RadioGroup value={midMouseMode} onValueChange={(value) => dispatch(actions.setMidMouseMode(value as MidMouseMode))}>
          <DropdownMenu.RadioItem value={MidMouseMode.SCROLL}>{'Scroll'}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={MidMouseMode.ZOOM}>{'Zoom'}</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
