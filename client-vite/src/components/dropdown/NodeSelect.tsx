import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountXCO1, getCountXSO1, getX, isXS} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import SelectAll from "../../assets/select-all.svg?react"
import {LeftMouseMode} from "../../state/Enums.ts"

export const NodeSelect = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="violet">
          <SelectAll/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.selectFamilyX}))}>{'Node Family'}</DropdownMenu.Item>}
        {isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.selectSelfX}))}>{'Node'}</DropdownMenu.Item>}
        {isXS(m) && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.selectCFF, payload: {path: getX(m).path}}))}>{'First Cell'}</DropdownMenu.Item>}
        {<DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.selectRA}))}>{'All Root'}</DropdownMenu.Item>}
        <DropdownMenu.Separator/>
        {leftMouseMode === LeftMouseMode.SELECT_BY_CLICK_OR_MOVE && <DropdownMenu.Item onClick={() => dispatch(actions.setLeftMouseMode(LeftMouseMode.SELECT_BY_RECTANGLE))}>{'Select By Rectangle'}</DropdownMenu.Item>}
        {leftMouseMode === LeftMouseMode.SELECT_BY_RECTANGLE && <DropdownMenu.Item onClick={() => dispatch(actions.setLeftMouseMode(LeftMouseMode.SELECT_BY_CLICK_OR_MOVE))}>{'Select By Click Or Move'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
