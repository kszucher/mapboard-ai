import {FC} from "react"
import {useDispatch, useSelector} from 'react-redux'
import { Menu, MenuItem } from '@mui/material'
import {actions, AppDispatch, RootState} from '../core/EditorReducer'
import {genHash} from "../core/Utils"
import {PageState} from "../state/Enums"
import {api} from "../core/Api"
import {useAuth0} from "@auth0/auth0-react"

export const MenuProfile: FC = () => {
  const moreMenu = useSelector((state: RootState) => state.editor.moreMenu)
  const { logout } = useAuth0()
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Menu
      anchorEl={document.getElementById('sidebar-top-profile')}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={moreMenu}
      onClose={() => {
        dispatch(actions.closeMoreMenu())
      }}>
      {
        [

          <MenuItem key={genHash(8)} onClick={() => {dispatch(actions.closeMoreMenu()); dispatch(actions.setPageState(PageState.WS_SHARES))}}>{'Shares'}</MenuItem>,

          <MenuItem key={genHash(8)} onClick={() => {dispatch(actions.closeMoreMenu()); dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}}>{'Share This Map'}</MenuItem>,

          <MenuItem key={genHash(8)} onClick={() => {
            logout({ logoutParams: { returnTo: window.location.origin }})
            dispatch(actions.resetState())
            dispatch(api.util.resetApiState())
          }}>{'Sign Out'}</MenuItem>,

          <MenuItem key={genHash(8)} onClick={() => {
            logout({ logoutParams: { returnTo: window.location.origin }})
            dispatch(api.endpoints.signOutEverywhere.initiate())
            dispatch(actions.resetState())
            dispatch(api.util.resetApiState())
          }}>{'Sign Out Everywhere'}</MenuItem>

        ]
      }
    </Menu>
  )
}
