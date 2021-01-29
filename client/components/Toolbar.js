import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Context} from "../core/Store";

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

export default function MenuAppBar() {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {setAnchorEl(event.currentTarget)};
    const handleClose = () => {setAnchorEl(null)};

    const [state, dispatch] = useContext(Context);

    const handleSelect = param => e => {
        handleClose();
        switch(param) {
            case 'ADD_MAP':
                dispatch({type: 'CREATE_MAP_IN_TAB', payload: {mapName: 'New Map'}});
                break;
            case 'SIGN_OUT':
                dispatch({type: 'RESET_STATE'});
                break;
        }
    };

    return (
        <div id = 'toolbar' className={classes.root}>
            <Toolbar variant={"dense"}>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    aria-label="menu"
                    onClick={handleMenu}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleSelect('ADD_MAP')}>Add Map</MenuItem>
                    <MenuItem onClick={handleSelect('SIGN_OUT')}>Sign Out</MenuItem>
                </Menu>
                <Typography variant="h6" className={classes.title}>
                    MindBoard
                </Typography>
            </Toolbar>
        </div>
    );
}
