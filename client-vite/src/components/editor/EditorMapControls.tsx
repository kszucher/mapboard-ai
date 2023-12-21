import {Flex, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {LeftMouseMode} from "../../state/Enums.ts"
import {ClickIcon, UpDownIcon, SelectIcon, ZoomIcon} from "../assets/Icons"

export const EditorMapControls = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const scrollOverride = useSelector((state: RootState) => state.editor.scrollOverride)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Flex gap="5">
      <Flex gap="1">
        <IconButton
          variant="solid"
          color={leftMouseMode === LeftMouseMode.SELECT_BY_CLICK_OR_MOVE ? "violet" : "gray"}
          onClick={() => dispatch(actions.setLeftMouseMode(LeftMouseMode.SELECT_BY_CLICK_OR_MOVE))}
        >
          <ClickIcon/>
        </IconButton>
        <IconButton
          variant="solid"
          color={leftMouseMode === LeftMouseMode.SELECT_BY_RECTANGLE ? "violet" : "gray"}
          onClick={() => dispatch(actions.setLeftMouseMode(LeftMouseMode.SELECT_BY_RECTANGLE))}
        >
          <SelectIcon/>
        </IconButton>
      </Flex>
      <Flex gap="1">
        <IconButton
          variant="solid"
          color={!scrollOverride ? "violet" : "gray"}
          onClick={() => dispatch(actions.clearScrollOverride())}
        >
          <UpDownIcon/>
        </IconButton>
        <IconButton
          variant="solid"
          color={scrollOverride ? "violet" : "gray"}
          onClick={() => dispatch(actions.setScrollOverride())}
        >
          <ZoomIcon/>
        </IconButton>
      </Flex>
    </Flex>
  )
}
