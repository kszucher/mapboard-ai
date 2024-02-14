import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountXCO1, getX, isXR, isXS, isXC} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import {DialogState, MapMode} from "../../state/Enums.ts"
import CirclePlus from "../../assets/circle-plus.svg?react"

export const NodeInsert = () => {
  const mapMode = useSelector((state: RootState) => state.editor.mapMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="violet">
          <CirclePlus/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {mapMode === MapMode.EDIT_ROOT && <DropdownMenu.Item onClick={() => md(MR.insertR)}>{'Root'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXR(m) && <DropdownMenu.Item onClick={() => md(MR.insertSO)}>{'Node Out'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && <DropdownMenu.Item onClick={() => md(MR.insertSU)}>{'Node Above'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && <DropdownMenu.Item onClick={() => md(MR.insertSO)}>{'Node Out'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && <DropdownMenu.Item onClick={() => md(MR.insertSD)}>{'Node Below'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && !getX(m).path.includes('c') && <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE))}>{'Table Out'}</DropdownMenu.Item></Dialog.Trigger>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.insertSCRU)}>{'Table Row Above'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.insertSCRD)}>{'Table Row Below'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.insertSCCL)}>{'Table Column Left'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXS(m) && getX(m).selection === 's' && getCountXCO1(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.insertSCCR)}>{'Table Column Right'}</DropdownMenu.Item>}
        {mapMode === MapMode.EDIT_STRUCT && isXC(m) && <DropdownMenu.Item onClick={() => md(MR.insertSO)}>{'Node Out'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
