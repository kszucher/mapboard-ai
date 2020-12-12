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
import {eventRouter} from "../core/EventRouter";
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

    const handleAddMap = () => {        handleClose(); eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'createMapInTab', 'task': 0}})};
    const handleAddTaskMap = () => {    handleClose(); eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'createMapInTab', 'task': 1}})};
    const handleDensitySmall = () => {  handleClose(); eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'mapAttributeDensitySmall'}})};
    const handleDensityLarge = () => {  handleClose(); eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'mapAttributeDensityLarge'}})};

    const [state, dispatch] = useContext(Context);

    const handleSelect = param => e => {
        handleClose();
        switch(param) {
            case 'SIGN_OUT':
                dispatch({type: 'RESET_STATE'});
                break;
        }
    };

    return (
        <div className={classes.root}>
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
                    <MenuItem onClick={handleSelect('ADD_MAP')}>Add map</MenuItem>
                    <MenuItem onClick={handleSelect('ADD_TASK_MAP')}>Add task map</MenuItem>
                    <MenuItem onClick={handleSelect('DENSITY_SMALL')}>Density: small</MenuItem>
                    <MenuItem onClick={handleSelect('DENSITY_LARGE')}>Density: large</MenuItem>
                    <MenuItem onClick={handleSelect('SIGN_OUT')}>Sign out</MenuItem>
                </Menu>
                <Typography variant="h6" className={classes.title}>
                    MindBoard
                </Typography>
            </Toolbar>
        </div>
    );
}
