import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {LeftMouseMode} from "../../state/Enums.ts"
import {MouseIcon} from "../assets/Icons"

export const EditorMapControls = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
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
        {leftMouseMode === LeftMouseMode.SELECT_BY_RECTANGLE &&
          <DropdownMenu.Item onClick={() => dispatch(actions.setLeftMouseMode(LeftMouseMode.SELECT_BY_CLICK_OR_MOVE))}>{'Left Mouse - Set Select By Click Or Move'}</DropdownMenu.Item>
        }
        {leftMouseMode === LeftMouseMode.SELECT_BY_CLICK_OR_MOVE &&
          <DropdownMenu.Item onClick={() => dispatch(actions.setLeftMouseMode(LeftMouseMode.SELECT_BY_RECTANGLE))}>{'Left Mouse - Set Select By Rectangle'}</DropdownMenu.Item>
        }
        {!scrollOverride &&
          <DropdownMenu.Item onClick={() => dispatch(actions.setScrollOverride())}>{'Mid Mouse - Set Zoom'}</DropdownMenu.Item>
        }
        {scrollOverride &&
          <DropdownMenu.Item onClick={() => dispatch(actions.clearScrollOverride())}>{'Mid Mouse - Set Scroll'}</DropdownMenu.Item>
        }
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
