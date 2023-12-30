import {Flex, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {LeftMouseMode} from "../../state/Enums.ts"
import Click from "../../assets/click.svg?react"
import SelectAll from "../../assets/select-all.svg?react"
import ArrowsUpDown from "../../assets/arrows-up-down.svg?react"
import ZoomFilled from "../../assets/zoom-filled.svg?react"

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
          <Click/>
        </IconButton>
        <IconButton
          variant="solid"
          color={leftMouseMode === LeftMouseMode.SELECT_BY_RECTANGLE ? "violet" : "gray"}
          onClick={() => dispatch(actions.setLeftMouseMode(LeftMouseMode.SELECT_BY_RECTANGLE))}
        >
          <SelectAll/>
        </IconButton>
      </Flex>
      <Flex gap="1">
        <IconButton
          variant="solid"
          color={!scrollOverride ? "violet" : "gray"}
          onClick={() => dispatch(actions.clearScrollOverride())}
        >
          <ArrowsUpDown/>
        </IconButton>
        <IconButton
          variant="solid"
          color={scrollOverride ? "violet" : "gray"}
          onClick={() => dispatch(actions.setScrollOverride())}
        >
          <ZoomFilled/>
        </IconButton>
      </Flex>
    </Flex>
  )
}
