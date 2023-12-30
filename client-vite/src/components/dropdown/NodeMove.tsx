import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MRT} from "../../reducers/MapReducerTypes.ts"
import {getCountXASD, getCountXASU, getCountXSO1, isXASVN, isXS} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import ArrowsMove from "../../assets/arrows-move.svg?react"

export const NodeMove = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="violet">
          <ArrowsMove/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.moveSU, payload: null}))}>{'Node Up'}</DropdownMenu.Item>}
        {isXS(m) && isXASVN(m) && getCountXASD(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.moveSD, payload: null}))}>{'Node Down'}</DropdownMenu.Item>}
        {isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.moveSO, payload: null}))}>{'Node Out'}</DropdownMenu.Item>}
        {isXS(m) && isXASVN(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.moveSI, payload: null}))}>{'Node In'}</DropdownMenu.Item>}
        {isXS(m) && getCountXSO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.moveS2TO, payload: null}))}>{'Sub Nodes To Table'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
