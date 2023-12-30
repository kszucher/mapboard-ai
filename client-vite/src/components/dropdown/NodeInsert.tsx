import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountXCO1, getX, isXR, isXS} from "../../selectors/MapQueries.ts"
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
        {<DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.insertR, payload: null}))}>{'Root'}</DropdownMenu.Item>}
        {isXS(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.insertSU, payload: null}))}>{'Node Above'}</DropdownMenu.Item>}
        {isXS(m) || isXR(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.insertSO, payload: null}))}>{'Node Out'}</DropdownMenu.Item>}
        {isXS(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.insertSD, payload: null}))}>{'Node Below'}</DropdownMenu.Item>}
        {isXS(m) && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE))}>{'Table Out'}</DropdownMenu.Item></Dialog.Trigger>}
        {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.insertSCRU, payload: null}))}>{'Table Row Above'}</DropdownMenu.Item>}
        {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.insertSCRD, payload: null}))}>{'Table Row Below'}</DropdownMenu.Item>}
        {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.insertSCCL, payload: null}))}>{'Table Column Left'}</DropdownMenu.Item>}
        {isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MR.insertSCCR, payload: null}))}>{'Table Column Right'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
