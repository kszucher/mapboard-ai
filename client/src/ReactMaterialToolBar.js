import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ReactMaterialTab from "./ReactMaterialTab";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));


function ReactMaterialToolBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Toolbar variant="dense">
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center">

                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center">


                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu">
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" color="inherit">
                            MindBoard
                        </Typography>


                        <Button color="inherit">Login</Button>

                    </Grid>



                </Grid>

            </Toolbar>

        </div>

    );
}

export default ReactMaterialToolBar;