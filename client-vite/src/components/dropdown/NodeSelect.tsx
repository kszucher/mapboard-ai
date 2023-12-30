import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {getCountXCO1, getCountXSO1, getX, isXS} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import SelectAll from "../../assets/select-all.svg?react"

export const NodeSelect = () => {
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
        {isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 's' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'selectFamilyX', payload: null}))}>{'Node Family'}</DropdownMenu.Item>}
        {isXS(m) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'selectSelfX', payload: null}))}>{'Node'}</DropdownMenu.Item>}
        {isXS(m) && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'selectCFF', payload: {path: getX(m).path}}))}>{'First Cell'}</DropdownMenu.Item>}
        {<DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'selectRA', payload: null}))}>{'All Root'}</DropdownMenu.Item>}
        <DropdownMenu.Separator/>

      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
