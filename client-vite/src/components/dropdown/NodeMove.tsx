import {Button, DropdownMenu} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {getCountXASD, getCountXASU, getCountXSO1, isXASVN, isXS} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"

export const NodeMove = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="2" variant="solid" color="gray">
          {'Move'}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'moveSU', payload: null}))}>{'Node Up'}</DropdownMenu.Item>}
        {isXS(m) && isXASVN(m) && getCountXASD(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'moveSD', payload: null}))}>{'Node Down'}</DropdownMenu.Item>}
        {isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'moveSO', payload: null}))}>{'Node Out'}</DropdownMenu.Item>}
        {isXS(m) && isXASVN(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'moveSI', payload: null}))}>{'Node In'}</DropdownMenu.Item>}
        {isXS(m) && getCountXSO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'moveS2TO', payload: null}))}>{'Sub Nodes To Table'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
