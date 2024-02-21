import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getMapMode, getXS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import SelectAll from "../../assets/select-all.svg?react"
import {MapMode} from "../../state/Enums.ts"

export const NodeSelect = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const mapMode = getMapMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={mapMode === MapMode.VIEW}>
        <IconButton variant="solid" color="gray">
          <SelectAll/>
        </IconButton>
      </DropdownMenu.Trigger>
      {mapMode === MapMode.EDIT_ROOT &&
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => md(MR.selectRA)}>{'All Root Node'}</DropdownMenu.Item>
        </DropdownMenu.Content>
      }
      {mapMode === MapMode.EDIT_STRUCT &&
        <DropdownMenu.Content>
          {getXS(m).so1.length > 0 && getXS(m).selection === 's' && <DropdownMenu.Item onClick={() => md(MR.selectFamilyX)}>{'Node Family'}</DropdownMenu.Item>}
          {getXS(m).so1.length > 0 && getXS(m).selection === 'f' && <DropdownMenu.Item onClick={() => md(MR.selectSelfX)}>{'Node'}</DropdownMenu.Item>}
          {getXS(m).co1.length > 0 && <DropdownMenu.Item onClick={() => md(MR.selectCFF, {path: getXS(m).path})}>{'First Cell'}</DropdownMenu.Item>}
          {<DropdownMenu.Item onClick={() => md(MR.selectSA)}>{'All Struct Node'}</DropdownMenu.Item>}
        </DropdownMenu.Content>
      }
    </DropdownMenu.Root>
  )
}
