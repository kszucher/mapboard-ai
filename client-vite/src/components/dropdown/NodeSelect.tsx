import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountXCO1, getCountXSO1, getX, isXS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import SelectAll from "../../assets/select-all.svg?react"
import {MapMode} from "../../state/Enums.ts"

export const NodeSelect = () => {
  const mapMode = useSelector((state: RootState) => state.editor.mapMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={mapMode === MapMode.VIEW}>
        <IconButton variant="solid" color="gray">
          <SelectAll/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {mapMode === MapMode.EDIT_ROOT && <DropdownMenu.Item onClick={() => md(MR.selectRA)}>{'All Root Node'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && <DropdownMenu.Item onClick={() => md(MR.selectFamilyX)}>{'Node Family'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <DropdownMenu.Item onClick={() => md(MR.selectSelfX)}>{'Node'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.selectCFF, {path: getX(m).path})}>{'First Cell'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && <DropdownMenu.Item onClick={() => md(MR.selectSA)}>{'All Struct Node'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
