import { Divider, Menu, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { PAGE_STATES } from '../core/EditorFlow'

export default function More () {
    const moreMenu = useSelector(state => state.moreMenu)
    const booleanMoreMenu = Boolean(moreMenu)
    const pageState = useSelector(state => state.pageState)
    const dispatch = useDispatch()
    const {DEMO, WS} = PAGE_STATES;

    const closeMoreMenu =       _ => dispatch({type: 'CLOSE_MORE_MENU'})
    const createMapInTab =      _ => dispatch({type: 'CREATE_MAP_IN_TAB'})
    const removeMapInTab =      _ => dispatch({type: 'REMOVE_MAP_IN_TAB'})
    const moveUpMapInTab =      _ => dispatch({type: 'MOVE_UP_MAP_IN_TAB'})
    const moveDownMapInTab =    _ => dispatch({type: 'MOVE_DOWN_MAP_IN_TAB'})
    const openPlaybackEditor =  _ => dispatch({type: 'OPEN_PLAYBACK_EDITOR'})
    const showSharing =         _ => dispatch({type: 'SHOW_WS_SHARING'})
    const showShares =          _ => dispatch({type: 'SHOW_WS_SHARES'})
    const signOut = _ => {
        localStorage.setItem('cred', JSON.stringify({name: '', pass: ''}))
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
                <MenuItem onClick={() => {closeMoreMenu(); createMapInTab()}}>        {'Add Map'}           </MenuItem>
                <MenuItem onClick={() => {closeMoreMenu(); removeMapInTab()}}>        {'Remove Map'}        </MenuItem>
                <MenuItem onClick={() => {closeMoreMenu(); moveUpMapInTab()}}>        {'Move Up Map'}       </MenuItem>
                <MenuItem onClick={() => {closeMoreMenu(); moveDownMapInTab()}}>      {'Move Down Map'}     </MenuItem>
                <Divider />
                <MenuItem onClick={() => {closeMoreMenu(); openPlaybackEditor()}}>    {'Playback Editor'}   </MenuItem>
                <Divider />
                <MenuItem onClick={() => {closeMoreMenu(); showSharing()}}>           {'Sharing'}           </MenuItem>
                <MenuItem onClick={() => {closeMoreMenu(); showShares()}}>            {'Shares'}            </MenuItem>
                <Divider />
                <MenuItem onClick={() => {closeMoreMenu(); signOut()}}>               {'Sign Out'}          </MenuItem>
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
