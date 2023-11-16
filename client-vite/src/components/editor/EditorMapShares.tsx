import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import React from "react"
import {useDispatch} from "react-redux"
import {actions, AppDispatch} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"
import {ShareIcon} from "../assets/Icons"

export const EditorMapShares = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray">
          <ShareIcon/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Dialog.Trigger>
          {<DropdownMenu.Item onClick={() => dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}>{'Share'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        <Dialog.Trigger>
          {<DropdownMenu.Item onClick={() => dispatch(actions.setPageState(PageState.WS_SHARED_BY_ME))}>{'Shared By Me'}</DropdownMenu.Item>}
        </Dialog.Trigger>
        <Dialog.Trigger>
          {<DropdownMenu.Item onClick={() => dispatch(actions.setPageState(PageState.WS_SHARED_WITH_ME))}>{'Shared With Me'}</DropdownMenu.Item>}
        </Dialog.Trigger>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
