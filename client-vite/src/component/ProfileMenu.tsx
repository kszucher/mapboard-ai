import {FC} from "react";
import {useDispatch, useSelector} from 'react-redux'
import { Divider, Menu, MenuItem } from '@mui/material'
import {actions, AppDispatch, RootState} from '../core/EditorReducer'
import {PageState} from "../state/Enums"
import {api} from "../core/Api"
import {useAuth0} from "@auth0/auth0-react"

export const ProfileMenu: FC = () => {
  const moreMenu = useSelector((state: RootState) => state.editor.moreMenu)
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const { logout } = useAuth0()
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Menu
      anchorEl={document.getElementById('profile-button')}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={moreMenu}
      onClose={() => {
        dispatch(actions.closeMoreMenu())
      }}>
      {
        pageState === PageState.WS && [
          <MenuItem
            key={'p'}
            onClick={() => {
              dispatch(actions.closeMoreMenu())
              dispatch(actions.setPageState(PageState.WS_PROFILE))
            }}>
            {'Profile'}
          </MenuItem>,
          <MenuItem
            key={'se'}
            onClick={() => {
              dispatch(actions.closeMoreMenu())
              dispatch(actions.setPageState(PageState.WS_SETTINGS))
            }}>
            {'Settings'}
          </MenuItem>,
          <MenuItem
            key={'sh'}
            onClick={() => {
              dispatch(actions.closeMoreMenu())
              dispatch(actions.setPageState(PageState.WS_SHARES))
            }}>
            {'Shares'}
          </MenuItem>,
          <Divider key={'d1'} />,
          <MenuItem
            key={'so'}
            onClick={() => {
              dispatch(actions.resetState())
              dispatch(api.util.resetApiState())
              logout({ logoutParams: { returnTo: window.location.origin }})
            }}>
            {'Sign Out'}
          </MenuItem>,
          <MenuItem
            key={'soe'}
            onClick={() => {
              dispatch(api.endpoints.signOutEverywhere.initiate())
              dispatch(actions.resetState())
              dispatch(api.util.resetApiState())
              logout({ logoutParams: { returnTo: window.location.origin }})
            }}>
            {'Sign Out Everywhere'}
          </MenuItem>
        ]
      }
      {
        pageState === PageState.DEMO && [
          <MenuItem
            key={0}
            onClick={() => {
              dispatch(actions.closeMoreMenu())
              dispatch(actions.setPageState(PageState.AUTH))
            }}>
            Sign In / Sign Up
          </MenuItem>
        ]
      }
    </Menu>
  )
}
