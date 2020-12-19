import React, {useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Context} from "../core/Store";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function WorkspaceBreadcrumbs() {
    const classes = useStyles();

    const [state, dispatch] = useContext(Context);

    const {breadcrumbsHistory} = state;

    const handleClick = param => event => {
        event.preventDefault();
        dispatch({type: 'OPEN_MAP', payload: {
                mapId: param.mapId,
                mapName: param.mapName,
                pushHistory: true,
                breadcrumbsOp: 'splice'}});
    };

    return (
        <div className={classes.root}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbsHistory.map(item => (
                    <Link
                        color="inherit"
                        href="/"
                        onClick={handleClick(item)}
                        key={item.mapName}
                    >
                        {item.mapName}
                    </Link>
                ))}>
            </Breadcrumbs>
        </div>
    );
}
