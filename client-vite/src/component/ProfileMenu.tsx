import { Divider, Menu, MenuItem } from '@mui/material'
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
import {actions, PageState, sagaActions} from '../core/EditorFlow'

export default function ProfileMenu () {
    const moreMenu = useSelector((state: RootStateOrAny) => state.moreMenu)
    const booleanMoreMenu = Boolean(moreMenu)
    const pageState = useSelector((state: RootStateOrAny) => state.pageState)
    const dispatch = useDispatch()
    return (
        <Menu
            anchorEl={moreMenu}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={booleanMoreMenu}
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
                        onClick={() => {dispatch(sagaActions.signOut)}}
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
