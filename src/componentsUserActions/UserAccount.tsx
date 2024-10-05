import {useAuth0} from "@auth0/auth0-react"
import {AlertDialog, Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch} from "react-redux"
import User from "../../assets/user.svg?react"
import {api} from "../api/Api.ts"
import {AppDispatch} from "../appStore/appStore.ts"
import {AlertDialogState, DialogState} from "../consts/Enums.ts"
import {actions} from "../editorMutations/EditorMutations.ts"

export const UserAccount = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { logout } = useAuth0()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <User/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-red-300" onCloseAutoFocus={e => e.preventDefault()}>
        <Dialog.Trigger>
          <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARED_BY_ME))}>
            {'Maps Shared By Me'}
          </DropdownMenu.Item>
        </Dialog.Trigger>
        <Dialog.Trigger>
          <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARED_WITH_ME))}>
            {'Maps Shared With Me'}
          </DropdownMenu.Item>
        </Dialog.Trigger>
        <DropdownMenu.Separator/>
        <DropdownMenu.Item onClick={()=>{
          logout({ logoutParams: { returnTo: window.location.origin }})
          dispatch(actions.resetState())
          dispatch(api.util.resetApiState())
        }}>{'Sign Out'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={()=>{
          logout({ logoutParams: { returnTo: window.location.origin }})
          dispatch(api.endpoints.signOutEverywhere.initiate())
          dispatch(actions.resetState())
          dispatch(api.util.resetApiState())
        }}>{'Sign Out All Devices'}
        </DropdownMenu.Item>
        <DropdownMenu.Separator/>
        <AlertDialog.Trigger>
          <DropdownMenu.Item color="red" onClick={() => dispatch(actions.setAlertDialogState(AlertDialogState.DELETE_ACCOUNT))}>Delete Account</DropdownMenu.Item>
        </AlertDialog.Trigger>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
