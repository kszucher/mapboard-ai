import { Divider, Menu, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { PAGE_STATES } from '../core/EditorFlow'

export default function More () {
    const moreMenu = useSelector(state => state.moreMenu)
    const booleanMoreMenu = Boolean(moreMenu)
    const pageState = useSelector(state => state.pageState)
    const dispatch = useDispatch()
    const {DEMO, WS} = PAGE_STATES;

    const closeMoreMenu =  _ => dispatch({type: 'CLOSE_MORE_MENU'})
    const showShares = _ => dispatch({type: 'SHOW_WS_SHARES'})
    const signOut = _ => {
        localStorage.setItem('cred', JSON.stringify({email: '', password: ''}))
        dispatch({type: 'RESET_STATE'})
    }

    return (
        <>
            {pageState === WS && <Menu
                id="menu-appbar"
                anchorEl={moreMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={booleanMoreMenu}
                onClose={closeMoreMenu}>

                <MenuItem onClick={() => {closeMoreMenu(); showShares()}}>
                    {'Shares'}
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {closeMoreMenu(); signOut()}}>
                    {'Sign Out'}
                </MenuItem>
            </Menu>}
            {pageState === DEMO && <Menu
                id="menu-appbar"
                anchorEl={moreMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={booleanMoreMenu}
                onClose={closeMoreMenu}>
                <MenuItem onClick={_=>dispatch({type: 'SHOW_AUTH'})}>Sign In / Sign Up</MenuItem>
            </Menu>}
        </>
    )
}
