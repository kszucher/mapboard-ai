import {FC} from "react"
import {useDispatch, useSelector} from 'react-redux'
import { Divider, Menu, MenuItem } from '@mui/material'
import {actions, AppDispatch, RootState} from '../core/EditorReducer'
import {genHash} from "../core/Utils"
import {getMapId} from "../state/ApiState"
import {PageState} from "../state/Enums"
import {api} from "../core/Api"
import {useAuth0} from "@auth0/auth0-react"

export const MenuProfile: FC = () => {
  const moreMenu = useSelector((state: RootState) => state.editor.moreMenu)
  const connectionRectsVisible = useSelector((state: RootState) => state.editor.connectionRectsVisible)
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
          <MenuItem key={genHash(8)} onClick={() => {
            dispatch(actions.closeMoreMenu())
            dispatch(actions.setPageState(PageState.WS_PROFILE))
          }}>{'Profile'}</MenuItem>,
          <MenuItem key={genHash(8)} onClick={() => {
            dispatch(actions.closeMoreMenu())
            dispatch(actions.setPageState(PageState.WS_SETTINGS))
          }}>{'Settings'}</MenuItem>,
          <MenuItem key={genHash(8)} onClick={() => {
            dispatch(actions.closeMoreMenu())
            dispatch(actions.setPageState(PageState.WS_SHARES))
          }}>{'Shares'}</MenuItem>,
          <Divider key={genHash(8)}/>,
          <MenuItem key={genHash(8)} disabled={false} onClick={() => {
            dispatch(actions.closeMoreMenu())
            dispatch(actions.setPageState(PageState.WS_CREATE_TEMPLATE))
          }}>{'Add Template'}</MenuItem>,
          <MenuItem key={genHash(8)} onClick={() => {
            dispatch(actions.closeMoreMenu())
            dispatch(actions.toggleConnectionRectsVisible())
          }}>{connectionRectsVisible ? 'Hide Connection Anchors' : 'Show Connection Anchors'}</MenuItem>,
          <Divider key={genHash(8)}/>,
          <MenuItem key={genHash(8)} onClick={() => {
            dispatch(actions.closeMoreMenu())
            dispatch(api.endpoints.createMapInTab.initiate())
          }}>{'Add Tab Map'}</MenuItem>,
          <MenuItem key={genHash(8)} onClick={() => {
            dispatch(actions.closeMoreMenu())
            dispatch(api.endpoints.moveUpMapInTab.initiate({mapId: getMapId()}))
          }}>{'Move Tab Map Up'}</MenuItem>,
          <MenuItem key={genHash(8)} onClick={() => {
            dispatch(actions.closeMoreMenu())
            dispatch(api.endpoints.moveDownMapInTab.initiate({mapId: getMapId()}))
          }}>{'Move Tab Map Down'}</MenuItem>,
          <MenuItem key={genHash(8)} onClick={() => {
            dispatch(actions.closeMoreMenu())
            dispatch(api.endpoints.deleteMap.initiate({mapId: getMapId()}))
          }}>{'Remove Tab Map'}</MenuItem>,
          <Divider key={genHash(8)}/>,
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
