import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Context} from "../core/Store";
import '../component-css/Logo.css'

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

    const handleSelect = param => e => {
        handleClose();
        switch(param) {
            case 'ADD_MAP':
                dispatch({type: 'CREATE_MAP_IN_TAB'});
                break;
            case 'REMOVE_MAP':
                dispatch({type: 'REMOVE_MAP_IN_TAB'});
                break;
            case 'SIGN_OUT':
                dispatch({type: 'RESET_STATE'});
                break;
        }
    };

    return (
        <div id = 'logo' className={classes.root}>
            <Toolbar variant={"dense"}>
                <IconButton edge="start" className={classes.menuButton} aria-label="menu" onClick={handleMenu} color = "inherit">
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
                    onClose={handleClose}>
                    <MenuItem onClick={handleSelect('ADD_MAP')}>Add Map</MenuItem>
                    <MenuItem onClick={handleSelect('REMOVE_MAP')}>Remove Map</MenuItem>
                    <MenuItem onClick={handleSelect('SIGN_OUT')}>Sign Out</MenuItem>
                </Menu>
                <Typography variant="h6" className={classes.title}>
                    MindBoard
                </Typography>
            </Toolbar>
        </div>
    );
}
