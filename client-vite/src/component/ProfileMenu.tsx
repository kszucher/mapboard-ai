import {FC} from "react";
import {useDispatch, useSelector} from 'react-redux'
import { Divider, Menu, MenuItem } from '@mui/material'
import {actions, RootState} from '../editor/EditorReducer'
import {PageState} from "../core/Enums";
import {api} from "../core/Api";
import {useAuth0} from "@auth0/auth0-react";

export const ProfileMenu: FC = () => {
  const moreMenu = useSelector((state: RootState) => state.editor.moreMenu)
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const { logout } = useAuth0()
  const dispatch = useDispatch()
  return (
    <Menu
      anchorEl={document.getElementById('profile-button')}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={moreMenu}
      onClose={_=>dispatch(actions.closeMoreMenu())}>
      {
        pageState === PageState.WS && [
          <MenuItem
            key={0}
            onClick={() => {
              dispatch(actions.closeMoreMenu())
              dispatch(actions.setPageState(PageState.WS_PROFILE))}
            }
          >
            {'Profile'}
          </MenuItem>,
          <MenuItem
            key={1}
            onClick={() => {
              dispatch(actions.closeMoreMenu())
              dispatch(actions.setPageState(PageState.WS_SETTINGS))}
            }
          >
            {'Settings'}
          </MenuItem>,
          // <Divider key={2}/>,
          <MenuItem
            key={3}
            onClick={() => {
              dispatch(actions.closeMoreMenu())
              dispatch(actions.setPageState(PageState.WS_SHARES))}
            }
          >
            {'Shares'}
          </MenuItem>,
          // <Divider key={4} />,
          <MenuItem
            key={5}
            onClick={() => {
              // TODO call auth0 signOut function
              dispatch(actions.resetState())
              dispatch(api.util.resetApiState())
              logout({ logoutParams: { returnTo: window.location.origin }})
            }}
          >
            {'Sign Out'}
          </MenuItem>
        ]
      }
      {
        pageState === PageState.DEMO && [
          <MenuItem
            key={0}
            onClick={() => {
              dispatch(actions.closeMoreMenu())
              dispatch(actions.setPageState(PageState.AUTH))}
            }
          >
            Sign In / Sign Up
          </MenuItem>
        ]
      }
    </Menu>
  )
}
