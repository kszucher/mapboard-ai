import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {mrCond} from "../../reducers/MapReducerConditions.ts"
import {MRT} from "../../reducers/MapReducerTypes.ts"
import {isXS} from "../../selectors/MapQueries.ts"
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
        {<DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.insertR, payload: null}))}>{'Root'}</DropdownMenu.Item>}
        {isXS(m) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.insertSU, payload: null}))}>{'Node Above'}</DropdownMenu.Item>}
        {mrCond(m, MRT.insertSO) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.insertSO, payload: null}))}>{'Node Out'}</DropdownMenu.Item>}
        {mrCond(m, MRT.insertSD) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.insertSD, payload: null}))}>{'Node Below'}</DropdownMenu.Item>}
        {isXS(m) && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE))}>{'Table Out'}</DropdownMenu.Item></Dialog.Trigger>}
        {mrCond(m, MRT.insertSCRU) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.insertSCRU, payload: null}))}>{'Table Row Above'}</DropdownMenu.Item>}
        {mrCond(m, MRT.insertSCRD) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.insertSCRD, payload: null}))}>{'Table Row Below'}</DropdownMenu.Item>}
        {mrCond(m, MRT.insertSCCL) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.insertSCCL, payload: null}))}>{'Table Column Left'}</DropdownMenu.Item>}
        {mrCond(m, MRT.insertSCCR) && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: MRT.insertSCCR, payload: null}))}>{'Table Column Right'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
