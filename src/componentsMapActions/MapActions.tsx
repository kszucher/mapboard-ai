import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch} from "react-redux"
import Dots from "../../assets/dots.svg?react"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {DialogState} from "../consts/Enums.ts"
import {actions} from "../editorMutations/EditorMutations.ts"
import {api, AppDispatch, useOpenWorkspaceQuery} from "../rootComponent/RootComponent.tsx"

export const MapActions = () => {
  const { data } = useOpenWorkspaceQuery()
  const { isShared } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <Dots/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        <Dialog.Trigger>
          <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.RENAME_MAP))}>
            {'Rename'}
          </DropdownMenu.Item>
        </Dialog.Trigger>
        <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTab.initiate())}>
          {'Create'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTabDuplicate.initiate())}>
          {'Duplicate'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveUpMapInTab.initiate())}>
          {'Move Up'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveDownMapInTab.initiate())}>
          {'Move Down'}
        </DropdownMenu.Item>
        {!isShared &&
          <DropdownMenu.Item onClick={() => dispatch(api.endpoints.deleteMap.initiate())}>
            {'Remove'}
          </DropdownMenu.Item>}
        <DropdownMenu.Separator/>
        <Dialog.Trigger>
          <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARE_THIS_MAP))}>
            {'Share'}
          </DropdownMenu.Item>
        </Dialog.Trigger>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
