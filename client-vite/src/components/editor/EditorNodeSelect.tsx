import {Button, DropdownMenu} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getCountXCO1, getCountXSO1, getX, isXR, isXS} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"

export const EditorNodeSelect = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="2" variant="solid" color="gray">
          {'Select'}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {(isXR(m) || isXS(m)) && getCountXSO1(m) > 0 && getX(m).selection === 's' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'selectFamilyX', payload: null}))}>{'Node Family'}</DropdownMenu.Item>}
        {(isXR(m) || isXS(m)) && getCountXSO1(m) > 0 && getX(m).selection === 'f' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'selectSelfX', payload: null}))}>{'Node'}</DropdownMenu.Item>}
        {isXS(m) && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'selectCFF', payload: {path: getX(m).path}}))}>{'First Cell'}</DropdownMenu.Item>}
        {<DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'selectRA', payload: null}))}>{'All Root'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
