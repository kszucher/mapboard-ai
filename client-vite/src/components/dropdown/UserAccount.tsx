import {useAuth0} from "@auth0/auth0-react"
import {AlertDialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch} from "react-redux"
import {nodeApi} from "../../apis/NodeApi.ts"
import {actions, AppDispatch} from "../../reducers/EditorReducer.ts"
import {AlertDialogState} from "../../state/Enums.ts"
import User from "../../assets/user.svg?react"

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
      <DropdownMenu.Content className="bg-red-300">
        <DropdownMenu.Item onClick={()=>{
          logout({ logoutParams: { returnTo: window.location.origin }})
          dispatch(actions.resetState())
          dispatch(nodeApi.util.resetApiState())
        }}>{'Sign Out'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={()=>{
          logout({ logoutParams: { returnTo: window.location.origin }})
          dispatch(nodeApi.endpoints.signOutEverywhere.initiate())
          dispatch(actions.resetState())
          dispatch(nodeApi.util.resetApiState())
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
