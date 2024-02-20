import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getX, getMapMode} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import {DialogState, MapMode} from "../../state/Enums.ts"
import CirclePlus from "../../assets/circle-plus.svg?react"

export const NodeInsert = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const mapMode = getMapMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={mapMode === MapMode.VIEW}>
        <IconButton variant="solid" color="gray">
          <CirclePlus/>
        </IconButton>
      </DropdownMenu.Trigger>
      {mapMode === MapMode.EDIT_ROOT &&
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Root'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => md(MR.insertR)}>{'Out'}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Node'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => md(MR.insertSO)}>{'Out'}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      }
      {mapMode === MapMode.EDIT_STRUCT &&
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Node'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => md(MR.insertSU)}>{'Above'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => md(MR.insertSO)}>{'Out'}</DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => md(MR.insertSD)}>{'Below'}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          {!getX(m).path.includes('c') &&
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>{'Table'}</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_U))}>{'Above'}</DropdownMenu.Item></Dialog.Trigger>
                <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_D))}>{'Below'}</DropdownMenu.Item></Dialog.Trigger>
                <Dialog.Trigger><DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.CREATE_TABLE_O))}>{'Out'}</DropdownMenu.Item></Dialog.Trigger>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          }
          {getX(m).selection === 's' && getX(m).co1.length > 0 &&
            <>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>{'Table Row'}</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item onClick={() => md(MR.insertSCRU)}>{'Above'}</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => md(MR.insertSCRD)}>{'Below'}</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>{'Table Column'}</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item onClick={() => md(MR.insertSCCL)}>{'Left'}</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => md(MR.insertSCCR)}>{'Right'}</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            </>
          }
        </DropdownMenu.Content>
      }
      {mapMode === MapMode.EDIT_CELL &&
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{'Node'}</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => md(MR.insertSO)}>{'Out'}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      }
    </DropdownMenu.Root>
  )
}
