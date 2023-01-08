import {FC} from "react";
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
import { Divider, Menu, MenuItem } from '@mui/material'
import {actions, sagaActions} from '../core/EditorFlow'
import {PageState} from "../core/Types";

export const ProfileMenu: FC = () => {
  const moreMenu = useSelector((state: RootStateOrAny) => state.editor.moreMenu)
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
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
            onClick={_=>dispatch(sagaActions.signOut())}
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
