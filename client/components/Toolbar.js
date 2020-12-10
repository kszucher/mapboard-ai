import React from 'react';
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
    const [anchorElA, setAnchorElA] = React.useState(null);
    const openA = Boolean(anchorElA);

    const [anchorElB, setAnchorElB] = React.useState(null);
    const openB = Boolean(anchorElB);

    const handleMenuA = (event) => {setAnchorElA(event.currentTarget)};
    const handleMenuB = (event) => {setAnchorElB(event.currentTarget)};
    const handleCloseA = () => {setAnchorElA(null)};
    const handleCloseB = () => {setAnchorElB(null)};

    const handleSignOut = () => {       handleCloseA(); eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'signOut'}})};
    const handleAddMap = () => {        handleCloseA(); eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'createMapInTab', 'task': 0}})};
    const handleAddTaskMap = () => {    handleCloseA(); eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'createMapInTab', 'task': 1}})};
    const handleDensitySmall = () => {  handleCloseA(); eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'mapAttributeDensitySmall'}})};
    const handleDensityLarge = () => {  handleCloseA(); eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'mapAttributeDensityLarge'}})};


    const handleMenu = param => e => {
        handleCloseA();
        switch(param) {
            case 'ADD_MAP': eventRouter.processEvent({type: 'componentEvent', ref: {'cmd': 'signOut'}}); break;
        }
    };


    return (
        <div className={classes.root}>
            {/*<FormGroup>*/}
            {/*    <FormControlLabel*/}
            {/*        control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}*/}
            {/*        label={auth ? 'Logout' : 'Login'}*/}
            {/*    />*/}
            {/*</FormGroup>*/}
            {/*<AppBar position="static">*/}
                <Toolbar variant={"dense"}>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        aria-label="menu"
                        onClick={handleMenuA}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElA}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={openA}
                        onClose={handleCloseA}
                    >
                        <MenuItem onClick={handleMenu('ADD_MAP')}>Add map</MenuItem>
                        <MenuItem onClick={handleMenu('ADD_TASK_MAP')}>Add task map</MenuItem>
                        <MenuItem onClick={handleMenu('DENSITY_SMALL')}>Density: small</MenuItem>
                        <MenuItem onClick={handleMenu('DENSITY_LARGE')}>Density: large</MenuItem>
                    </Menu>
                    <Typography variant="h6" className={classes.title}>
                        MindBoard
                    </Typography>
                    {/*<div>*/}
                    {/*    <IconButton*/}
                    {/*        aria-label="account of current user"*/}
                    {/*        aria-controls="menu-appbar"*/}
                    {/*        aria-haspopup="true"*/}
                    {/*        onClick={handleMenuB}*/}
                    {/*    >*/}
                    {/*        <AccountCircle />*/}
                    {/*    </IconButton>*/}
                    {/*    <Menu*/}
                    {/*        id="menu-appbar"*/}
                    {/*        anchorEl={anchorElB}*/}
                    {/*        anchorOrigin={{*/}
                    {/*            vertical: 'top',*/}
                    {/*            horizontal: 'right',*/}
                    {/*        }}*/}
                    {/*        keepMounted*/}
                    {/*        transformOrigin={{*/}
                    {/*            vertical: 'top',*/}
                    {/*            horizontal: 'right',*/}
                    {/*        }}*/}
                    {/*        open={openB}*/}
                    {/*        onClose={handleCloseB}*/}
                    {/*    >*/}
                    {/*        /!*<MenuItem onClick={handleClose}>Profile</MenuItem>*!/*/}
                    {/*        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>*/}
                    {/*    </Menu>*/}
                    {/*</div>*/}

                </Toolbar>
            {/*</AppBar>*/}
        </div>
    );
}
