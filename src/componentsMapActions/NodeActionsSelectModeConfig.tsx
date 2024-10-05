import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import Eye from "../../assets/eye.svg?react"
import LetterC from "../../assets/letter-c.svg?react"
import LetterR from "../../assets/letter-r.svg?react"
import LetterS from "../../assets/letter-s.svg?react"
import {AppDispatch, RootState} from "../appStore/appStore.ts"
import {NodeMode} from "../consts/Enums.ts"
import {actions} from "../editorMutations/EditorMutations.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {getNodeMode, mC, mS} from "../mapQueries/MapQueries.ts"

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
          {nodeMode === NodeMode.EDIT_STRUCT && <LetterS/>}
          {nodeMode === NodeMode.EDIT_CELL && <LetterC/>}
          {nodeMode === NodeMode.EDIT_CELL_ROW && <LetterC/>}
          {nodeMode === NodeMode.EDIT_CELL_COLUMN && <LetterC/>}
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        <DropdownMenu.Label>{'Map Mode'}</DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          value={nodeMode}
          onValueChange={(value) => {
            if (value === NodeMode.VIEW) dispatch(actions.unselect())
            if (value === NodeMode.EDIT_ROOT) dispatch(actions.selectFirstR())
            if (value === NodeMode.EDIT_STRUCT) dispatch(actions.selectFirstS())
            if (value === NodeMode.EDIT_CELL) dispatch(actions.selectFirstC())
            if (value === NodeMode.EDIT_CELL_ROW) dispatch(actions.selectFirstCR())
            if (value === NodeMode.EDIT_CELL_COLUMN) dispatch(actions.selectFirstCC())
          }}
        >
          <DropdownMenu.RadioItem value={NodeMode.VIEW}>{NodeMode.VIEW}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={NodeMode.EDIT_ROOT}>{NodeMode.EDIT_ROOT}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem disabled={mS(m).length === 0} value={NodeMode.EDIT_STRUCT}>{NodeMode.EDIT_STRUCT}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem disabled={mC(m).length === 0} value={NodeMode.EDIT_CELL}>{NodeMode.EDIT_CELL}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem disabled={mC(m).length === 0} value={NodeMode.EDIT_CELL_ROW}>{NodeMode.EDIT_CELL_ROW}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem disabled={mC(m).length === 0} value={NodeMode.EDIT_CELL_COLUMN}>{NodeMode.EDIT_CELL_COLUMN}</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
