import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {PAGE_STATES} from "../core/EditorFlow";
import { Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import MenuIcon from '@mui/icons-material/Menu'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Logo() {
    const pageState = useSelector(state => state.pageState)
    const dispatch = useDispatch()
    const {DEMO, WS} = PAGE_STATES;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {setAnchorEl(event.currentTarget)};
    const handleClose = () => {setAnchorEl(null)};

    const createMapInTab =      _ => dispatch({type: 'CREATE_MAP_IN_TAB'})
    const removeMapInTab =      _ => dispatch({type: 'REMOVE_MAP_IN_TAB'})
    const moveUpMapInTab =      _ => dispatch({type: 'MOVE_UP_MAP_IN_TAB'})
    const moveDownMapInTab =    _ => dispatch({type: 'MOVE_DOWN_MAP_IN_TAB'})
    const openPlaybackEditor =  _ => dispatch({type: 'OPEN_PLAYBACK_EDITOR'})
    const showSharing =         _ => dispatch({type: 'SHOW_WS_SHARING'})
    const showShares =          _ => dispatch({type: 'SHOW_WS_SHARES'})
    const changeColorMode =     _ => dispatch({type: 'CHANGE_COLOR_MODE'})
    const signOut = _ => {
        localStorage.setItem('cred', JSON.stringify({name: '', pass: ''}))
        dispatch({type: 'RESET_STATE'})
    }

    const col1 = '#a4508b'
    const col2 = '#5f0a87'
    return (
        <div style={{
            position: 'absolute',
            width: 216,
            height: 48,
            backgroundImage: `linear-gradient(330deg, ${col1} 0%, ${col2} 74%)`,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            color: '#fff',
            display: 'flex',
            justifyContent: 'center'}}>
            <Toolbar variant={"dense"}>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    aria-label="menu"
                    onClick={handleMenu}
                    color="inherit">
                    <MenuIcon/>
                </IconButton>
                {pageState === WS && <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    keepMounted
                    transformOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={open}
                    onClose={handleClose}>
                    <MenuItem onClick={() => {handleClose(); createMapInTab()}}>        {'Add Map'}           </MenuItem>
                    <MenuItem onClick={() => {handleClose(); removeMapInTab()}}>        {'Remove Map'}        </MenuItem>
                    <MenuItem onClick={() => {handleClose(); moveUpMapInTab()}}>        {'Move Up Map'}       </MenuItem>
                    <MenuItem onClick={() => {handleClose(); moveDownMapInTab()}}>      {'Move Down Map'}     </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => {handleClose(); openPlaybackEditor()}}>    {'Playback Editor'}   </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => {handleClose(); showSharing()}}>           {'Sharing'}           </MenuItem>
                    <MenuItem onClick={() => {handleClose(); showShares()}}>            {'Shares'}            </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => {handleClose(); changeColorMode()}}>       {'Change Color Mode'} </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => {handleClose(); signOut()}}>               {'Sign Out'}          </MenuItem>
                </Menu>}
                {pageState === DEMO && <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    keepMounted
                    transformOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={open}
                    onClose={handleClose}>
                    <MenuItem onClick={_=>dispatch({type: 'SHOW_AUTH'})}>Sign In / Sign Up</MenuItem>
                </Menu>}
                <Typography
                    variant="h6"
                    className={classes.title}>
                    {'mapboard'}
                </Typography>
            </Toolbar>
        </div>
    );
}
