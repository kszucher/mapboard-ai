import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch} from "react-redux"
import {actions, AppDispatch} from "../../reducers/EditorReducer.ts"
import {DialogState} from "../../state/Enums.ts"
import Share from "../../assets/share.svg?react"

export const MapShares = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray">
          <Share/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Dialog.Trigger>
          {<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARE_THIS_MAP))}>{'Share'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        <Dialog.Trigger>
          {<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARED_BY_ME))}>{'Shared By Me'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        <Dialog.Trigger>
          {<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARED_WITH_ME))}>{'Shared With Me'}</DropdownMenu.Item>}
        </Dialog.Trigger>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
