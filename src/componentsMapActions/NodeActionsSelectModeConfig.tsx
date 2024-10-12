import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import Eye from "../../assets/eye.svg?react"
import LetterR from "../../assets/letter-r.svg?react"
import {AppDispatch, RootState} from "../appStore/appStore.ts"
import {NodeMode} from "../consts/Enums.ts"
import {actions} from "../editorMutations/EditorMutations.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {getNodeMode} from "../mapQueries/MapQueries.ts"

export const NodeActionsSelectModeConfig = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const nodeMode = getNodeMode(m)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          {nodeMode === NodeMode.VIEW && <Eye/>}
          {nodeMode === NodeMode.EDIT_ROOT && <LetterR/>}
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        <DropdownMenu.Label>{'Map Mode'}</DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          value={nodeMode}
          onValueChange={(value) => {
            if (value === NodeMode.VIEW) dispatch(actions.unselect())
            if (value === NodeMode.EDIT_ROOT) dispatch(actions.selectR0())
          }}
        >
          <DropdownMenu.RadioItem value={NodeMode.VIEW}>{NodeMode.VIEW}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={NodeMode.EDIT_ROOT}>{NodeMode.EDIT_ROOT}</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
