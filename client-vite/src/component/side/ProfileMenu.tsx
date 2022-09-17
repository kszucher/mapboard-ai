import { Divider, Menu, MenuItem } from '@mui/material'
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
import { PAGE_STATES } from '../../core/EditorFlow'

export default function ProfileMenu () {
    const moreMenu = useSelector((state: RootStateOrAny) => state.moreMenu)
    const booleanMoreMenu = Boolean(moreMenu)
    const pageState = useSelector((state: RootStateOrAny) => state.pageState)
    const dispatch = useDispatch()
    const {DEMO, WS} = PAGE_STATES;

    const closeMoreMenu = () => dispatch({type: 'CLOSE_MORE_MENU'})
    const showProfile = () => dispatch({type: 'SHOW_WS_PROFILE'})
    const showSettings = () => dispatch({type: 'SHOW_WS_SETTINGS'})
    const showShares = () => dispatch({type: 'SHOW_WS_SHARES'})
    const showAuth = () => dispatch({type: 'SHOW_AUTH'})
    const signOut = () => dispatch({type: 'SIGN_OUT'})

    return (
        <Menu
            anchorEl={moreMenu}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={booleanMoreMenu}
            onClose={closeMoreMenu}
        >
            {
                pageState === WS && [
                    <MenuItem key={0} onClick={() => {closeMoreMenu(); showProfile()}}>
                        {'Profile'}
                    </MenuItem>,
                    <MenuItem key={1} onClick={() => {closeMoreMenu(); showSettings()}}>
                        {'Settings'}
                    </MenuItem>,
                    // <Divider key={2}/>,
                    <MenuItem key={3} onClick={() => {closeMoreMenu(); showShares()}}>
                        {'Shares'}
                    </MenuItem>,
                    // <Divider key={4} />,
                    <MenuItem key={5} onClick={signOut}>
                        {'Sign Out'}
                    </MenuItem>
                ]
            }
            {
                pageState === DEMO && [
                    <MenuItem key={0} onClick={() => {closeMoreMenu(); showAuth()}}>
                        Sign In / Sign Up
                    </MenuItem>
                ]
            }
        </Menu>
    )
}
