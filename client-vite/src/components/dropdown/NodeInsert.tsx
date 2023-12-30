import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {getCountXCO1, getX, isXS} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import {DialogState} from "../../state/Enums.ts"
import CirclePlus from "../../assets/circle-plus.svg?react"

export const NodeInsert = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="violet">
          <CirclePlus/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {<DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'insertR', payload: null}))}>{'Root'}</DropdownMenu.Item>}
        {isXS(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'insertSU', payload: null}))}>{'Node Above'}</DropdownMenu.Item>}
        {isXS(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'insertSO', payload: null}))}>{'Node Out'}</DropdownMenu.Item>}
        {isXS(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'insertSD', payload: null}))}>{'Node Below'}</DropdownMenu.Item>}
        <Dialog.Trigger>
          {isXS(m) && <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE))}>{'Table Out'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'insertSCRU', payload: null}))}>{'Table Row Above'}</DropdownMenu.Item>}
        {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'insertSCRD', payload: null}))}>{'Table Row Below'}</DropdownMenu.Item>}
        {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'insertSCCL', payload: null}))}>{'Table Column Left'}</DropdownMenu.Item>}
        {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'insertSCCR', payload: null}))}>{'Table Column Right'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
