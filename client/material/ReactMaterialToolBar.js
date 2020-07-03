import React                                                from 'react';
import { makeStyles }                                       from '@material-ui/core/styles';
import Toolbar                                              from '@material-ui/core/Toolbar';
import Typography                                           from '@material-ui/core/Typography';
import IconButton                                           from '@material-ui/core/IconButton';
import MenuIcon                                             from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(1),
    },
}));

function ReactMaterialToolBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Toolbar variant="dense">
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

            </Toolbar>
        </div>
    );
}

export default ReactMaterialToolBar;
