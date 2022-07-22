import { Divider, Menu, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { PAGE_STATES } from '../../core/EditorFlow'

export default function ProfileMenu () {
    const moreMenu = useSelector(state => state.moreMenu)
    const booleanMoreMenu = Boolean(moreMenu)
    const pageState = useSelector(state => state.pageState)
    const dispatch = useDispatch()
    const {DEMO, WS} = PAGE_STATES;

    const closeMoreMenu =  _ => dispatch({type: 'CLOSE_MORE_MENU'})
    const showProfile = _ => dispatch({type: 'SHOW_WS_PROFILE'})
    const showSettings = _ => dispatch({type: 'SHOW_WS_SETTINGS'})
    const showShares = _ => dispatch({type: 'SHOW_WS_SHARES'})
    const showAuth = _ => dispatch({type: 'SHOW_AUTH'})
    const signOut = _ => {
        localStorage.setItem('cred', JSON.stringify({email: '', password: ''}))
        dispatch({type: 'RESET_STATE'})
    }

    return (
        <Menu
            id="profile-menu"
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
                    <MenuItem key={5} onClick={() => {closeMoreMenu(); signOut()}}>
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
