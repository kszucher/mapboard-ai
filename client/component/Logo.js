import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Context} from "../core/Store";
import {PAGE_STATES} from "../core/EditorFlow";

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
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {setAnchorEl(event.currentTarget)};
    const handleClose = () => {setAnchorEl(null)};

    const [state, dispatch] = useContext(Context);
    const {pageState} = state;

    const handleSelect = param => e => {
        handleClose();
        switch(param) {
            case 'ADD_MAP':dispatch({type: 'CREATE_MAP_IN_TAB'}); break;
            case 'REMOVE_MAP':dispatch({type: 'REMOVE_MAP_IN_TAB'});break;
            case 'MOVE_UP_MAP':dispatch({type: 'MOVE_UP_MAP_IN_TAB'});break;
            case 'MOVE_DOWN_MAP':dispatch({type: 'MOVE_DOWN_MAP_IN_TAB'});break;
            case 'SIGN_OUT':
                localStorage.setItem('cred', JSON.stringify({name: '', pass: ''}));
                dispatch({type: 'RESET_STATE'});
                break;
        }
    };

    const col1 = window.location.search === '?d=iq' ? '#08212e' : '#a4508b'
    const col2 = window.location.search === '?d=iq' ? '#08212e' : '#5f0a87'

    return (
        <div className={classes.root} style={{
            position: 'absolute',
            width: 216,
            height: 48,
            backgroundImage: `linear-gradient(330deg, ${col1} 0%, ${col2} 74%)`,
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
        }}>

            <Toolbar variant={"dense"}>
                <IconButton edge="start" className={classes.menuButton} aria-label="menu" onClick={handleMenu}
                            color="inherit">
                    <MenuIcon/>
                </IconButton>

                {pageState === PAGE_STATES.WORKSPACE && <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    keepMounted
                    transformOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={open}
                    onClose={handleClose}>
                    <MenuItem onClick={handleSelect('ADD_MAP')}>Add Map</MenuItem>
                    <MenuItem onClick={handleSelect('REMOVE_MAP')}>Remove Map</MenuItem>
                    <MenuItem onClick={handleSelect('MOVE_UP_MAP')}>Move Up Map</MenuItem>
                    <MenuItem onClick={handleSelect('MOVE_DOWN_MAP')}>Move Down Map</MenuItem>
                    <MenuItem onClick={handleSelect('SIGN_OUT')}>Sign Out</MenuItem>
                </Menu>}
                {pageState === PAGE_STATES.DEMO && <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    keepMounted
                    transformOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={open}
                    onClose={handleClose}>
                    <MenuItem onClick={_=>dispatch({type: 'SHOW_AUTH'})}>Sign In / Sign Up</MenuItem>
                </Menu>}
                <Typography variant="h6" className={classes.title}>
                    {window.location.search === '?d=iq' ? 'iq demo' : 'mapboard'}
                </Typography>
            </Toolbar>

        </div>
    );
}
