import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../editorMutations/EditorMutations.ts"
import {NodeMode} from "../consts/Enums.ts"
import Eye from "../../assets/eye.svg?react"
import LetterR from "../../assets/letter-r.svg?react"
import LetterS from "../../assets/letter-s.svg?react"
import LetterC from "../../assets/letter-c.svg?react"
import {getNodeMode, mC, mS} from "../mapQueries/MapQueries.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"

import {mSelector} from "../editorQueries/EditorQueries.ts";

export const NodeActionsSelectModeConfig = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const nodeMode = getNodeMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MM, payload? : any) => dispatch(actions.mapReducer({type, payload}))
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
            value === NodeMode.VIEW && dm(MM.unselect)
            value === NodeMode.EDIT_ROOT && dm(MM.selectFirstR)
            value === NodeMode.EDIT_STRUCT && dm(MM.selectFirstS)
            value === NodeMode.EDIT_CELL && dm(MM.selectFirstC)
            value === NodeMode.EDIT_CELL_ROW && dm(MM.selectFirstCR)
            value === NodeMode.EDIT_CELL_COLUMN && dm(MM.selectFirstCC)
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
