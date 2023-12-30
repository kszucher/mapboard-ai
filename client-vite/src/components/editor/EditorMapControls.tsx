import {Flex, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import ArrowsUpDown from "../../assets/arrows-up-down.svg?react"
import ZoomFilled from "../../assets/zoom-filled.svg?react"

export const EditorMapControls = () => {
  const scrollOverride = useSelector((state: RootState) => state.editor.scrollOverride)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Flex gap="5">

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
