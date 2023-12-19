import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MouseIcon} from "../assets/Icons"

export const EditorMapControls = () => {
  const scrollOverride = useSelector((state: RootState) => state.editor.scrollOverride)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray">
          <MouseIcon/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {!scrollOverride && <DropdownMenu.Item onClick={() => dispatch(actions.setScrollOverride())}>{'Mid Mouse - Set Zoom'}</DropdownMenu.Item>}
        {scrollOverride && <DropdownMenu.Item onClick={() => dispatch(actions.clearScrollOverride())}>{'Mid Mouse - Set Scroll'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
